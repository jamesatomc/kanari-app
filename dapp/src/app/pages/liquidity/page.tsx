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
    <div>
      <main className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            Liquidity <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Pool</span>
          </h1>
        </h1>

        <div className="flex justify-center mb-8">
          <div className="bg-white/10 rounded-full p-1">
            <div className="flex space-x-1">
              <button
                className={`px-6 py-2 rounded-full transition-all ${activeTab === 'add'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
                onClick={() => setActiveTab('add')}
              >
                Add Liquidity
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${activeTab === 'remove'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
                onClick={() => setActiveTab('remove')}
              >
                Remove Liquidity
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-orange-200/20 dark:border-white/10">
            <div className="space-y-8 flex flex-col items-center">
              <TokenInput
                label="Token A"
                selectedToken={tokenA}
                onSelectToken={setTokenA}
                amount={amountA}
                onAmountChange={setAmountA}
                tokenPrice={tokenPrices[tokenA.symbol]} // Change from tokenA to tokenA.symbol
                error={error}
                setError={setError}
              />

              <div className="flex justify-center -my-4 relative z-10">
                <button
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-3 transition duration-300 shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
                  onClick={() => {
                    setTokenA(tokenB);
                    setTokenB(tokenA);
                    setAmountA(amountB);
                    setAmountB(amountA);
                  }}
                >
                  <ArrowDownUp className="h-6 w-6" />
                </button>
              </div>

              <TokenInput
                label="Token B"
                selectedToken={tokenB}
                onSelectToken={setTokenB}
                amount={amountB}
                onAmountChange={setAmountB}
                tokenPrice={tokenPrices[tokenB.symbol]} // Change from tokenB to tokenB.symbol
                error={error}
                setError={setError}
              />

              {activeTab === 'add' && (
                <div className="w-full bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Pool Share:</span>
                    <span>0.00%</span>
                  </div>
                </div>
              )}

              {activeTab === 'remove' && (
                <div className="w-full bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Your Pool Tokens:</span>
                    <span>0.00</span>
                  </div>
                </div>
              )}

              <div className="w-full flex justify-center pt-4">
                {wallet.connected ? (
                  <button
                    onClick={handleButtonClick}
                    disabled={isProcessing || !amountA || !amountB}
                    className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 
        transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center 
        justify-center w-full md:w-auto ${(isProcessing || !amountA || !amountB) ? "opacity-50 cursor-not-allowed" : ""
                      } hover:shadow-orange-500/30`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Processing...
                      </>
                    ) : (
                      activeTab === 'add' ? "Add Liquidity" : "Remove Liquidity"
                    )}
                  </button>
                ) : (
                  <ConnectButton className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 
      hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full 
      md:w-auto hover:shadow-orange-500/30" />
                )}
              </div>

              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mt-4 text-center">
                  {error}
                </div>
              )}
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

// TokenInput.tsx
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-200">{label}</label>
        {balance && (
          <span className="text-xs text-gray-400">
            Balance: {parseFloat(balance).toFixed(6)} {selectedToken.symbol}
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="relative sm:w-1/3">
          <button
            className="w-full flex justify-between items-center px-4 py-2.5 
                bg-white/10 border border-orange-500/20 rounded-xl text-white
                hover:bg-white/20 transition-all duration-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedToken ? (
              <div className="flex items-center">
                <img src={selectedToken.image} alt={selectedToken.name} className="h-6 w-6 mr-2" />
                <span>{selectedToken.symbol}</span>
              </div>
            ) : (
              <span>Select Token</span>
            )}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg rounded-xl border border-orange-500/20 shadow-lg max-h-60 overflow-y-auto">
              <ul className="py-1">
                {availableTokens.map((token) => (
                  <li
                    key={token.contract}
                    className="px-4 py-2.5 hover:bg-orange-500/10 cursor-pointer text-white flex items-center"
                    onClick={() => {
                      onSelectToken(token);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img src={token.image} alt={token.name} className="h-6 w-6 mr-2" />
                    {token.symbol} - {token.name}
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
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 rounded-l-xl text-white 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                  border border-orange-500/20
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
            />
            {showBalanceButtons && balance && (
              <div className="flex border-l border-orange-500/20">
                <button
                  onClick={handleSetHalf}
                  className="px-3 py-2.5 bg-white/10 hover:bg-orange-500/20 
                      text-orange-400 text-sm font-medium transition-colors duration-200"
                >
                  50%
                </button>
                <button
                  onClick={handleSetMax}
                  className="px-3 py-2.5 bg-white/10 hover:bg-orange-500/20 
                      text-orange-400 text-sm font-medium rounded-r-xl border-l 
                      border-orange-500/20 transition-colors duration-200"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {tokenPrice && (
        <div className="text-sm text-gray-400">
          1 {selectedToken.symbol} = ${tokenPrice.toFixed(2)} USD
        </div>
      )}
    </div>
  );
};

