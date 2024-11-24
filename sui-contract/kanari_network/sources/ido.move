module kanari_network::ido {
    // use sui::object::{Self, UID};
    // use sui::transfer;
    // use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use kanari_network::coin::COIN;  // Add KARI token import

    // Constants
    // const KARI_DECIMALS: u64 = 9;
    // const SUI_DECIMALS: u64 = 9;
    const PRICE_PER_KARI: u64 = 30_000_000; // $0.03 with 9 decimals

    // Error codes
    const E_NOT_ADMIN: u64 = 0;
    const E_SALE_NOT_LIVE: u64 = 1;
    const E_INSUFFICIENT_PAYMENT: u64 = 2;

    public struct IDOConfig has key, store {
        id: UID,
        admin: address,
        kari_reserve: Balance<COIN>,
        sui_proceeds: Balance<SUI>,
        is_live: bool
    }

    // Initialize IDO
    public fun initialize(
        admin: address,
        initial_kari: Balance<COIN>,
        ctx: &mut TxContext
    ) {
        let config = IDOConfig {
            id: object::new(ctx),
            admin,
            kari_reserve: initial_kari,
            sui_proceeds: balance::zero<SUI>(),
            is_live: false
        };
        transfer::share_object(config);
    }

    // Buy KARI tokens with SUI
    public entry fun buy(
        config: &mut IDOConfig,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(config.is_live, E_SALE_NOT_LIVE);
        
        let sui_amount = coin::value(&payment);
        let kari_amount = (sui_amount * PRICE_PER_KARI) / (1_000_000_000);
        
        assert!(balance::value(&config.kari_reserve) >= kari_amount, E_INSUFFICIENT_PAYMENT);

        let kari_to_transfer = balance::split(&mut config.kari_reserve, kari_amount);
        balance::join(&mut config.sui_proceeds, coin::into_balance(payment));
        
        transfer::public_transfer(
            coin::from_balance(kari_to_transfer, ctx),
            tx_context::sender(ctx)
        );
    }

    // Admin functions
    public entry fun toggle_sale(config: &mut IDOConfig, ctx: &TxContext) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_ADMIN);
        config.is_live = !config.is_live;
    }

    public entry fun withdraw_proceeds(
        config: &mut IDOConfig,
        ctx: &mut TxContext  // Changed to &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_ADMIN);
        let amount = balance::value(&config.sui_proceeds);
        let sui = coin::from_balance(
            balance::split(&mut config.sui_proceeds, amount),
            ctx
        );
        transfer::public_transfer(sui, config.admin);
    }
}