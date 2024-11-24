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

    /// Represents liquidity addition parameters and state
    public struct AddLiquidity<phantom A: key, phantom B: key> has key {
        id: UID,
        balance_a: Balance<A>,
        balance_b: Balance<B>,
        amount_a: Balance<A>,
        amount_b: Balance<B>,
        min_liquidity: Balance<A>,
        deadline: u64,
        sender: address,
    }

    /// Internal function to process liquidity addition
    public fun add_liquidity_internal<A: key, B: key>(
        token_a: Coin<A>,
        token_b: Coin<B>,
        amount_a: Balance<A>,
        amount_b: Balance<B>,
        min_liquidity: Balance<A>,
        deadline: u64,
        sender: address,
        clock: &Clock,
        ctx: &mut TxContext
    ): (Coin<A>, Coin<B>, Balance<A>, Balance<B>, Balance<A>) {
        // Validate inputs
        assert!(balance::value(&amount_a) > 0 && balance::value(&amount_b) > 0, E_ZERO_AMOUNT);
        assert!(clock::timestamp_ms(clock) <= deadline, E_DEADLINE_PASSED);
        
        let sender = tx_context::sender(ctx);
        let balance_a = coin::into_balance(token_a);
        let balance_b = coin::into_balance(token_b);

        // Validate liquidity amounts
        assert!(balance::value(&balance_a) >= balance::value(&amount_a), E_INSUFFICIENT_LIQUIDITY);
        assert!(balance::value(&balance_b) >= balance::value(&amount_b), E_INSUFFICIENT_LIQUIDITY);

        let liquidity = AddLiquidity {
            id: object::new(ctx),
            balance_a,
            balance_b,
            amount_a,
            amount_b,
            min_liquidity,
            deadline,
            sender,
        };

        let AddLiquidity { 
            id,
            balance_a,
            balance_b,
            amount_a,
            amount_b,
            min_liquidity,
            deadline: _deadline,
            sender: _sender
        } = liquidity;

        object::delete(id);

        let token_a = coin::from_balance(balance_a, ctx);
        let token_b = coin::from_balance(balance_b, ctx);

        (token_a, token_b, amount_a, amount_b, min_liquidity)
    }

    /// Entry function for users to add liquidity
    entry public fun add_liquidity<A: key, B: key>(
        mut token_a: Coin<A>,
        mut token_b: Coin<B>,
        amount_a: u64,
        amount_b: u64,
        min_liquidity: u64,
        deadline: u64,
        clock: &Clock,
        sender: address,
        ctx: &mut TxContext
    ) {
        // Validate inputs
        assert!(amount_a > 0 && amount_b > 0, E_ZERO_AMOUNT);
        assert!(clock::timestamp_ms(clock) <= deadline, E_DEADLINE_PASSED);

        let balance_a = coin::into_balance(coin::split(&mut token_a, amount_a, ctx));
        let balance_b = coin::into_balance(coin::split(&mut token_b, amount_b, ctx));
        let min_liq_balance = coin::into_balance(coin::split(&mut token_a, min_liquidity, ctx));

        let (token_a_out, token_b_out, amount_a_out, amount_b_out, min_liq_out) = 
            add_liquidity_internal(
                token_a,
                token_b,
                balance_a,
                balance_b,
                min_liq_balance,
                deadline,
                sender,
                clock,
                ctx
            );

        transfer::public_transfer(token_a_out, sender);
        transfer::public_transfer(token_b_out, sender);

        let remaining_a = coin::from_balance(amount_a_out, ctx);
        let remaining_b = coin::from_balance(amount_b_out, ctx);
        let lp_tokens = coin::from_balance(min_liq_out, ctx);

        transfer::public_transfer(remaining_a, sender);
        transfer::public_transfer(remaining_b, sender);
        transfer::public_transfer(lp_tokens, sender);
    }
}