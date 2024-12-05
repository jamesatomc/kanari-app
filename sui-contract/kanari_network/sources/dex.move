module kanari_network::dex {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    // Error codes
    const E_INSUFFICIENT_LIQUIDITY: u64 = 1;
    const E_INVALID_FEE: u64 = 2;
    const E_ZERO_AMOUNT: u64 = 3;
    const E_INSUFFICIENT_LP_TOKENS: u64 = 4;
    const E_DEADLINE_PASSED: u64 = 5;
    const E_INVALID_AMOUNTS: u64 = 6;

    // Fee constants (basis points)
    const FEE_LOW: u64 = 10;    // 0.1%
    const FEE_MED: u64 = 50;    // 0.5%
    const FEE_HIGH: u64 = 100;  // 1.0%
    const BASIS_POINTS: u64 = 10000;

    /// Represents a pool of two assets
    public struct Pool<phantom A: key, phantom B: key> has key {
        id: UID,
        coin_A: Balance<A>,
        coin_B: Balance<B>,
        total_liquidity: u64,
    }

    /// Represents liquidity addition parameters and state
    public struct AddLiquidity<phantom A: key, phantom B: key> has key, store{
        id: UID,
        coin_A: Balance<A>,
        coin_B: Balance<B>,
        amount_A: u64,
        amount_B: u64,
        // deadline: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        // whitelist: vector<address>, // Example type for whitelist
    }

    /// Updates the pool with the new liquidity
    entry public fun update_pool<A: key, B: key>(
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


    public fun add_liquidity<A: key, B: key>(
        mut coin_A: Balance<A>, // Declare as mutable
        mut coin_B: Balance<B>, // Declare as mutable
        amount_A: u64,
        amount_B: u64,
        // deadline: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        // whitelist: vector<address>,
        clock: &Clock,
        tx: &mut TxContext,
        pool: &mut Pool<A, B> // Pool state
    ) : AddLiquidity<A, B> {
        // Validate inputs
        assert!(amount_A > 0 && amount_B > 0, E_ZERO_AMOUNT);
        assert!(balance::value(&coin_A) >= amount_A, E_INSUFFICIENT_LIQUIDITY);
        assert!(balance::value(&coin_B) >= amount_B, E_INSUFFICIENT_LIQUIDITY);
        // assert!(deadline > clock::timestamp_ms(clock), E_DEADLINE_PASSED);
        assert!(fee_basis_points >= FEE_LOW && fee_basis_points <= FEE_HIGH, E_INVALID_FEE);

        // Check if the transaction sender is in the whitelist
        let sender = tx_context::sender(tx);
        // let is_whitelisted = vector::contains(&whitelist, &sender);
        // assert!(is_whitelisted, E_INVALID_AMOUNTS);

        // Calculate liquidity and check against min_liquidity
        let liquidity = amount_A + amount_B;
        assert!(liquidity >= min_liquidity, E_INSUFFICIENT_LIQUIDITY);

        // Calculate and transfer fee
        let fee = (amount_A + amount_B) * fee_basis_points / BASIS_POINTS;
        let fee_coin = coin::from_balance(balance::split(&mut coin_A, fee), tx);
        transfer::public_transfer(fee_coin, fee_receiver);

        // Update the pool with the new liquidity
        update_pool(pool, amount_A - fee, amount_B, tx);

        // Create and return AddLiquidity struct
        AddLiquidity {
            id: object::new(tx),
            coin_A,
            coin_B,
            amount_A,
            amount_B,
            // deadline,
            min_liquidity,
            fee_basis_points,
            fee_receiver,
            nonce,
            fee_tier,
            // whitelist
        }
    }

    /// Adds liquidity to the pool
    entry public fun add_liquidity_entry<A: key, B: key>(
        coin_a: Coin<A>,
        coin_b: Coin<B>,
        amount_a: u64,
        amount_b: u64,
        // deadline: u64,
        min_liquidity: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        // whitelist: vector<address>,
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
            // deadline,
            min_liquidity,
            fee_basis_points,
            fee_receiver,
            nonce,
            fee_tier,
            // whitelist,
            clock,
            ctx,
            pool
        );

        // Transfer liquidity token to sender
        let sender = tx_context::sender(ctx);
        transfer::public_transfer(liquidity, sender);
    }

    /// Removes liquidity from the pool
    entry public fun remove_liquidity<A: key, B: key>(
        pool: &mut Pool<A, B>,
        liquidity: u64,
        min_A: u64,
        min_B: u64,
        // deadline: u64,
        fee_basis_points: u64,
        fee_receiver: address,
        nonce: u64,
        fee_tier: u8,
        // whitelist: vector<address>,
        clock: &Clock,
        tx: &mut TxContext
    ) {
        // Validate inputs
        assert!(liquidity > 0, E_ZERO_AMOUNT);
        assert!(pool.total_liquidity >= liquidity, E_INSUFFICIENT_LP_TOKENS);
        // assert!(deadline > clock::timestamp_ms(clock), E_DEADLINE_PASSED);
        assert!(fee_basis_points >= FEE_LOW && fee_basis_points <= FEE_HIGH, E_INVALID_FEE);

        // Check if the transaction sender is in the whitelist
        let sender = tx_context::sender(tx);
        // let is_whitelisted = vector::contains(&whitelist, &sender);
        // assert!(is_whitelisted, E_INVALID_AMOUNTS);

        // Calculate amounts to withdraw
        let amount_A = liquidity * balance::value(&pool.coin_A) / pool.total_liquidity;
        let amount_B = liquidity * balance::value(&pool.coin_B) / pool.total_liquidity;
        assert!(amount_A >= min_A && amount_B >= min_B, E_INVALID_AMOUNTS);

        // Calculate and transfer fee
        let fee = (amount_A + amount_B) * fee_basis_points / BASIS_POINTS;
        let fee_coin = coin::from_balance(balance::split(&mut pool.coin_A, fee), tx);
        transfer::public_transfer(fee_coin, fee_receiver);

        // Calculate negative amounts
        let neg_amount_A = 0 - amount_A;
        let neg_amount_B = 0 - amount_B;

        // Update the pool with the new liquidity
        update_pool(pool, neg_amount_A, neg_amount_B, tx);
    }


}

