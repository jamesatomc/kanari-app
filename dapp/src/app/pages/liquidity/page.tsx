'use client';

import { ChevronDown } from 'lucide-react';
import { Transaction } from "@mysten/sui/transactions";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { ArrowDownUp, Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Liquidity() {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [tokenA, setTokenA] = useState<Token>(availableTokens[0]);
  const [tokenB, setTokenB] = useState<Token>(availableTokens[1]);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const wallet = useWallet();
  const [isAdd_Liquidity, setIsAdd_Liquidity] = useState(false);
  const [isRemove_Liquidity, setIsRemove_Liquidity] = useState(false);

  async function Add_Liquidity() {
    if (!wallet.connected) return;
    if (!amountA || !amountB) {
      setError('Please enter amounts for both tokens');
      return;
    }

    setIsAdd_Liquidity(true);
    setError(null);
    const tx = new Transaction();
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";

    try {
      tx.moveCall({
        target: `${packageObjectId}::dex::add_liquidity_entry`,
        arguments: [
          tx.pure.string(tokenA.contract),
          tx.pure.string(amountA),
          tx.pure.string(tokenB.contract),
          tx.pure.string(amountB),
        ],
      });

      const resData = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log('successfully!', resData);
      alert('Add Liquidity successful');
      // Reset form
      setAmountA('');
      setAmountB('');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsAdd_Liquidity(false);
    }
  }

  async function Remove_Liquidity() {
    if (!wallet.connected) return;
    if (!amountA || !amountB) {
      setError('Please enter amounts for both tokens');
      return;
    }

    setIsRemove_Liquidity(true);
    setError(null);
    const tx = new Transaction();
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";

    try {
      tx.moveCall({
        target: `${packageObjectId}::dex::remove_liquidity_entry`,
        arguments: [
          tx.pure.string(tokenA.contract),
          tx.pure.string(amountA),
          tx.pure.string(tokenB.contract),
          tx.pure.string(amountB),
        ],
      });

      const resData = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log('successfully!', resData);
      alert('Remove Liquidity successful');
      // Reset form
      setAmountA('');
      setAmountB('');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsRemove_Liquidity(false);
    }
  }

  // Update button click handler
  const handleButtonClick = async () => {
    setIsProcessing(true);
    try {
      if (activeTab === 'add') {
        await Add_Liquidity();
      } else {
        await Remove_Liquidity();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto py-6 sm:py-12 px-4 sm:px-0">
          <h1 className="cyber-heading text-3xl md:text-5xl font-bold mb-8 text-center relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)]">
              Liquidity Pool
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--cyber-primary)]/20 to-[var(--cyber-secondary)]/20 blur-sm -z-10"></div>
          </h1>

          {/* Tab Selector */}
          <div className="flex justify-center mb-6">
            <div className="bg-[var(--cyber-card-bg)]/60 backdrop-blur-sm border border-[var(--cyber-border)]/70 rounded-md p-1 shadow-md w-full max-w-xs">
              <div className="flex">
                <button
                  className={`flex-1 px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'add'
                      ? 'bg-[var(--cyber-primary)] text-white shadow-[0_0_8px_var(--cyber-primary)]'
                      : 'text-[var(--cyber-muted)] hover:text-[var(--cyber-foreground)] hover:bg-[var(--cyber-card-bg)]'
                  }`}
                  onClick={() => setActiveTab('add')}
                >
                  Add Liquidity
                </button>
                <button
                  className={`flex-1 px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'remove'
                      ? 'bg-[var(--cyber-primary)] text-white shadow-[0_0_8px_var(--cyber-primary)]'
                      : 'text-[var(--cyber-muted)] hover:text-[var(--cyber-foreground)] hover:bg-[var(--cyber-card-bg)]'
                  }`}
                  onClick={() => setActiveTab('remove')}
                >
                  Remove Liquidity
                </button>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="cyber-container backdrop-blur-sm border border-[var(--cyber-border)] bg-[var(--cyber-card-bg)]/80 p-4 sm:p-6 rounded-md shadow-lg">
              <div className="space-y-6">
                {/* Token A Input */}
                <TokenInput
                  label="Token A"
                  selectedToken={tokenA}
                  onSelectToken={setTokenA}
                  amount={amountA}
                  onAmountChange={setAmountA}
                  tokenPrice={tokenPrices[tokenA.symbol]}
                  error={error}
                  setError={setError}
                />

                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2 relative z-10">
                  <button
                    className="cyber-btn-sm p-2 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-full 
                      shadow-md transition-all duration-300 hover:shadow-[0_0_10px_var(--cyber-primary)] 
                      transform hover:scale-110 active:scale-95"
                    onClick={() => {
                      setTokenA(tokenB);
                      setTokenB(tokenA);
                      setAmountA(amountB);
                      setAmountB(amountA);
                    }}
                  >
                    <ArrowDownUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform hover:rotate-180 text-[var(--cyber-primary)]" />
                  </button>
                </div>

                {/* Token B Input */}
                <TokenInput
                  label="Token B"
                  selectedToken={tokenB}
                  onSelectToken={setTokenB}
                  amount={amountB}
                  onAmountChange={setAmountB}
                  tokenPrice={tokenPrices[tokenB.symbol]}
                  error={error}
                  setError={setError}
                />

                {/* Pool Information */}
                {activeTab === 'add' && (
                  <div className="w-full bg-[var(--cyber-card-bg)]/60 backdrop-blur-sm border border-[var(--cyber-border)]/40 rounded-md p-4 space-y-2">
                    <div className="flex justify-between text-sm text-[var(--cyber-muted)]">
                      <span>Pool Share:</span>
                      <span className="font-medium text-[var(--cyber-foreground)]">0.00%</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--cyber-muted)]">
                      <span>Exchange Rate:</span>
                      <span className="font-medium text-[var(--cyber-foreground)]">
                        {amountA && amountB && parseFloat(amountA) > 0 
                          ? `1 ${tokenA.symbol} = ${(parseFloat(amountB) / parseFloat(amountA)).toFixed(6)} ${tokenB.symbol}`
                          : '—'}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'remove' && (
                  <div className="w-full bg-[var(--cyber-card-bg)]/60 backdrop-blur-sm border border-[var(--cyber-border)]/40 rounded-md p-4 space-y-2">
                    <div className="flex justify-between text-sm text-[var(--cyber-muted)]">
                      <span>Your Pool Tokens:</span>
                      <span className="font-medium text-[var(--cyber-foreground)]">0.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--cyber-muted)]">
                      <span>Pool Share:</span>
                      <span className="font-medium text-[var(--cyber-foreground)]">0.00%</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="w-full pt-4">
                  {wallet.connected ? (
                    <button
                      onClick={handleButtonClick}
                      disabled={isProcessing || !amountA || !amountB}
                      className={`cyber-btn px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium flex items-center 
                        justify-center w-full transition-all duration-300 ${
                        (isProcessing || !amountA || !amountB) 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:shadow-[0_0_10px_var(--cyber-primary)]"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        activeTab === 'add' ? "ADD LIQUIDITY" : "REMOVE LIQUIDITY"
                      )}
                    </button>
                  ) : (
                    <ConnectButton 
                      className="cyber-btn px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium w-full
                        hover:shadow-[0_0_10px_var(--cyber-primary)] transition-all duration-300" 
                    />
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="w-full bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] p-3 rounded-sm mt-2 text-center text-sm animate-pulse">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Path: dapp/src/app/components/TokenInput.tsx
export interface Token {
  symbol: string;
  name: string;
  image: string;
  contract: string;
}

export const availableTokens: Token[] = [
  {
    name: 'Sui',
    symbol: 'SUI',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png',
    contract: '0x2::sui::SUI'
  },
  {
    name: 'USDCoin',
    symbol: 'USDC',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    contract: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC'
  },
];

export interface TokenInputProps {
  label: string;
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  tokenPrice?: number;
  error?: string | null;
  setError: (error: string | null) => void;
  balance?: string;
  showBalanceButtons?: boolean;
}

// TokenInput component - updated for better mobile experience
export const TokenInput: React.FC<TokenInputProps> = ({
  label,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  tokenPrice,
  setError,
  balance,
  showBalanceButtons = false,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle amount change and validate input
  const handleAmountChange = (value: string) => {
    if (value === '' || parseFloat(value) >= 0) {
      setError(null);
      onAmountChange(value);
    } else {
      setError('Amount must be a positive number');
    }
  };

  const handleSetHalf = () => {
    if (balance) {
      const halfAmount = (parseFloat(balance) / 2).toString();
      onAmountChange(halfAmount);
    }
  };

  const handleSetMax = () => {
    if (balance) {
      onAmountChange(balance);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-[var(--cyber-foreground)]">{label}</label>
        {balance && (
          <span className="text-xs text-[var(--cyber-muted)] flex items-center">
            <span className="mr-1">Balance:</span> 
            <span className="font-medium">{parseFloat(balance).toFixed(6)} {selectedToken.symbol}</span>
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
        {/* Token Selector */}
        <div className="relative sm:w-1/3">
          <button
            className="w-full flex justify-between items-center px-3 py-2.5 
              bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-sm text-[var(--cyber-foreground)]
              hover:bg-[var(--cyber-card-bg)]/80 transition-all duration-200 text-sm sm:text-base"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedToken ? (
              <div className="flex items-center">
                <img src={selectedToken.image} alt={selectedToken.name} className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span>{selectedToken.symbol}</span>
              </div>
            ) : (
              <span>Select Token</span>
            )}
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-[var(--cyber-primary)]" />
          </button>
          
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute z-20 w-full sm:w-56 mt-1 bg-[var(--cyber-card-bg)] backdrop-blur-lg rounded-sm border border-[var(--cyber-border)] shadow-xl max-h-52 overflow-y-auto">
              <ul className="py-1">
                {availableTokens.map((token) => (
                  <li
                    key={token.contract}
                    className="px-3 py-2.5 hover:bg-[var(--cyber-primary)]/10 active:bg-[var(--cyber-primary)]/20 
                      cursor-pointer text-[var(--cyber-foreground)] flex items-center text-sm sm:text-base"
                    onClick={() => {
                      onSelectToken(token);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img src={token.image} alt={token.name} className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                    <div className="flex flex-col">
                      <span className="font-medium">{token.symbol}</span>
                      <span className="text-xs text-[var(--cyber-muted)]">{token.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Input Group */}
        <div className="sm:flex-1">
          <div className="flex">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--cyber-card-bg)] rounded-sm text-[var(--cyber-foreground)] 
                placeholder-[var(--cyber-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--cyber-primary)] 
                border border-[var(--cyber-border)] text-base
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none"
            />
            {showBalanceButtons && balance && (
              <div className="flex border-l border-[var(--cyber-border)]">
                <button
                  onClick={handleSetHalf}
                  className="px-2 sm:px-3 py-2.5 bg-[var(--cyber-card-bg)] hover:bg-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  50%
                </button>
                <button
                  onClick={handleSetMax}
                  className="px-2 sm:px-3 py-2.5 bg-[var(--cyber-card-bg)] hover:bg-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] text-xs sm:text-sm font-medium rounded-sm border-l 
                    border-[var(--cyber-border)] transition-colors duration-200"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {tokenPrice && (
        <div className="text-xs text-[var(--cyber-muted)]">
          1 {selectedToken.symbol} = ${tokenPrice.toFixed(2)} USD
        </div>
      )}
    </div>
  );
};

