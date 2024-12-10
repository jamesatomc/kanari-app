'use client';

import TokenInput from "@/app/components/TokenInput";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { ArrowDownUp, Loader } from "lucide-react";
import { useState } from "react";

 
export default function Liquidity() {
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [tokenA, setTokenA] = useState('SUI');
  const [tokenB, setTokenB] = useState('USDC');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{[key: string]: number}>({});
  const wallet = useWallet();


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
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'add'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('add')}
              >
                Add Liquidity
              </button>
              <button
                className={`px-6 py-2 rounded-full transition-all ${
                  activeTab === 'remove'
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
                tokenPrice={tokenPrices[tokenA]}
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
                tokenPrice={tokenPrices[tokenB]}
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
                    className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center w-full md:w-auto ${
                      isProcessing ? "opacity-50 cursor-not-allowed" : ""
                    } hover:shadow-orange-500/30`}
                    disabled={isProcessing}
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
                  <ConnectButton className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full md:w-auto hover:shadow-orange-500/30" />
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


