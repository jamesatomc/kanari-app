module kanari_network::dex {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::object::{UID};
    use sui::transfer;
    use sui::event;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Clock};
    use sui::math;

    // Error codes
    const E_INSUFFICIENT_LIQUIDITY: u64 = 1;
    const E_INVALID_FEE: u64 = 2;
    const E_ZERO_AMOUNT: u64 = 3;
    const E_INSUFFICIENT_LP_TOKENS: u64 = 4;
    const E_DEADLINE_PASSED: u64 = 5;
    const E_INVALID_AMOUNTS: u64 = 6;
    const E_ALREADY_INITIALIZED: u64 = 7;
    const E_REENTRANCY: u64 = 8;

    // Fee constants (basis points)
    const FEE_LOW: u64 = 10;
    // 0.1%
    const FEE_MED: u64 = 50;
    // 0.5%
    const FEE_HIGH: u64 = 100;
    // 1.0%
    const BASIS_POINTS: u64 = 10000;

    //address of the developer
    const DEVELOPER_ADDRESS: address = @kanari_network;

    /// Represents a pool of two assets
    public struct Pool<phantom A: key, phantom B: key> has key {
        id: UID,
        coin_A: Balance<A>,
        coin_B: Balance<B>,
        total_liquidity: u64,
    }

    /// Represents liquidity addition parameters and state
    public struct AddLiquidity<phantom A: key, phantom B: key> has key, store {
        id: UID,
        coin_A: Balance<A>,
        coin_B: Balance<B>,
        amount_A: u64,
        amount_B: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
    }

    /// Adds liquidity to the pool
    entry public fun add_liquidity_to_pool<A: key, B: key>(
        pool: &mut Pool<A, B>,
        amount_A: u64,
        amount_B: u64,
        tx: &mut TxContext
    ) {
        let balance_A = balance::split(&mut pool.coin_A, amount_A);
        let balance_B = balance::split(&mut pool.coin_B, amount_B);
        balance::join(&mut pool.coin_A, balance_A);
        balance::join(&mut pool.coin_B, balance_B);
        pool.total_liquidity = pool.total_liquidity + amount_A + amount_B;
    }

    /// Removes liquidity from the pool
    entry public fun remove_liquidity_from_pool<A: key, B: key>(
        pool: &mut Pool<A, B>,
        amount_A: u64,
        amount_B: u64,
        tx: &mut TxContext
    ) {
        let balance_A = balance::split(&mut pool.coin_A, amount_A);
        let balance_B = balance::split(&mut pool.coin_B, amount_B);
        balance::join(&mut pool.coin_A, balance_A);
        balance::join(&mut pool.coin_B, balance_B);
        pool.total_liquidity = pool.total_liquidity - amount_A - amount_B;
    }

    /// Adds liquidity to the pool
    public fun add_liquidity<A: key, B: key> (
        mut coin_A: Balance<A>, // Declare as mutable
        mut coin_B: Balance<B>, // Declare as mutable
        amount_A: u64,
        amount_B: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        clock: &Clock,
        tx: &mut TxContext,
        pool: &mut Pool<A, B> // Pool state
    ): AddLiquidity<A, B> {
        // Validate inputs
        assert!(amount_A > 0 && amount_B > 0, E_ZERO_AMOUNT);
        assert!(balance::value(&coin_A) >= amount_A, E_INSUFFICIENT_LIQUIDITY);
        assert!(balance::value(&coin_B) >= amount_B, E_INSUFFICIENT_LIQUIDITY);
        assert!(fee_basis_points >= FEE_LOW && fee_basis_points <= FEE_HIGH, E_INVALID_FEE);

        // Get the current time from the clock
        let current_time = sui::clock::timestamp_ms(clock);

        // Ensure the transaction is within a valid time frame (example: within 1 hour)
        let deadline = current_time + 3600 * 1000; // 3600 seconds = 1 hour, converted to milliseconds
        assert!(current_time <= deadline, E_DEADLINE_PASSED);

        // Calculate liquidity and check against min_liquidity
        let liquidity = amount_A + amount_B;
        assert!(liquidity >= min_liquidity, E_INSUFFICIENT_LIQUIDITY);

        // Calculate and transfer fee
        let fee = (amount_A + amount_B) * fee_basis_points / BASIS_POINTS;
        let fee_coin = coin::from_balance(balance::split(&mut coin_A, fee), tx);
        transfer::public_transfer(fee_coin, fee_receiver);

        // Update the pool with the new liquidity
        add_liquidity_to_pool(pool, amount_A - fee, amount_B, tx);

        // Create and return AddLiquidity struct
        AddLiquidity {
            id: object::new(tx),
            coin_A,
            coin_B,
            amount_A,
            amount_B,
            min_liquidity,
            fee_basis_points,
            fee_receiver: DEVELOPER_ADDRESS,
            nonce,
            fee_tier,
        }
    }

    /// Adds liquidity to the pool
    entry public fun add_liquidity_entry<A: key, B: key>(
        coin_a: Coin<A>,
        coin_b: Coin<B>,
        amount_a: u64,
        amount_b: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        clock: &Clock,
        pool: &mut Pool<A, B>,
        ctx: &mut TxContext
    ) {
        // Convert coins to balances
        let balance_a = coin::into_balance(coin_a);
        let balance_b = coin::into_balance(coin_b);

        // Call main add_liquidity function
        let liquidity = add_liquidity(
            balance_a,
            balance_b,
            amount_a,
            amount_b,
            min_liquidity,
            fee_basis_points,
            fee_receiver,
            nonce,
            fee_tier,
            clock,
            ctx,
            pool
        );

        // Transfer liquidity token to sender
        let sender = tx_context::sender(ctx);

        // Transfer liquidity token to sender
        transfer::public_transfer(liquidity, sender);
    }

    /// Removes liquidity from the pool
    entry public fun remove_liquidity<A: key, B: key>(
        pool: &mut Pool<A, B>,
        liquidity: u64,
        min_A: u64,
        min_B: u64,
        fee_basis_points: u64,
        clock: &Clock,
        tx: &mut TxContext
    ) {
        // Validate inputs
        assert!(liquidity > 0, E_ZERO_AMOUNT);
        assert!(pool.total_liquidity >= liquidity, E_INSUFFICIENT_LP_TOKENS);
        assert!(fee_basis_points >= FEE_LOW && fee_basis_points <= FEE_HIGH, E_INVALID_FEE);

        // Get the current time from the clock
        let current_time = sui::clock::timestamp_ms(clock);

        // Ensure the transaction is within a valid time frame (example: within 1 hour)
        let deadline = current_time + 3600; // 3600 seconds = 1 hour
        assert!(current_time <= deadline, E_DEADLINE_PASSED);

        // Calculate amounts to withdraw
        let amount_A = liquidity * balance::value(&pool.coin_A) / pool.total_liquidity;
        let amount_B = liquidity * balance::value(&pool.coin_B) / pool.total_liquidity;

        // Ensure amounts are not negative
        assert!(amount_A >= 0, E_INVALID_AMOUNTS);
        assert!(amount_B >= 0, E_INVALID_AMOUNTS);

        // Ensure amounts are above minimums
        assert!(amount_A >= min_A && amount_B >= min_B, E_INVALID_AMOUNTS);

        // Calculate and transfer fee
        let fee = (amount_A + amount_B) * fee_basis_points / BASIS_POINTS;
        let fee_coin = coin::from_balance(balance::split(&mut pool.coin_A, fee), tx);

        // Transfer fee to developer
        transfer::public_transfer(fee_coin, DEVELOPER_ADDRESS);

        // Update the pool with the new liquidity
        remove_liquidity_from_pool(pool, amount_A - fee, amount_B, tx);
    }



    public fun swap_A_for_B<A: key, B: key>(
        pool: &mut Pool<A, B>,
        amount_A: u64,
        min_B: u64,
        fee_basis_points: u64,
        clock: &Clock,
        tx: &mut TxContext
    ) {
        // Validate inputs
        assert!(amount_A > 0, E_ZERO_AMOUNT);
        assert!(fee_basis_points >= FEE_LOW && fee_basis_points <= FEE_HIGH, E_INVALID_FEE);

        // Get the current time from the clock
        let current_time = sui::clock::timestamp_ms(clock);

        // Ensure the transaction is within a valid time frame (example: within 1 hour)
        let deadline = current_time + 3600; // 3600 seconds = 1 hour
        assert!(current_time <= deadline, E_DEADLINE_PASSED);

        // Calculate amount of B to receive
        let amount_B = amount_A * balance::value(&pool.coin_B) / balance::value(&pool.coin_A);

        // Calculate and transfer fee
        let fee = amount_B * fee_basis_points / BASIS_POINTS;
        let fee_coin = coin::from_balance(balance::split(&mut pool.coin_B, fee), tx);

        // Transfer fee to developer
        transfer::public_transfer(fee_coin, DEVELOPER_ADDRESS);

        // Update the pool with the new balances
        let balance_A = balance::split(&mut pool.coin_A, amount_A);
        let balance_B = balance::split(&mut pool.coin_B, amount_B);
        balance::join(&mut pool.coin_A, balance_A);
        balance::join(&mut pool.coin_B, balance_B);

        // Ensure minimum amount of B is received
        assert!(amount_B >= min_B, E_INSUFFICIENT_LIQUIDITY);

    }

}