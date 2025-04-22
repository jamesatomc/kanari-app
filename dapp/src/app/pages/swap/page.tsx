'use client';

import { useEffect, useState } from 'react';
import { ArrowDownUp, Loader, Settings } from 'lucide-react';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import axios from 'axios';
import TokenInput from './TokenInput';

export default function Swap() {
  const [tokenFrom, setTokenFrom] = useState('SUI');
  const [tokenTo, setTokenTo] = useState('USDC');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [feePercentage, setFeePercentage] = useState(0.3); // Default fee of 0.3%
  const [showFeeConfig, setShowFeeConfig] = useState(false); // Track fee config visibility
  const [balances, setBalances] = useState<{ [key: string]: string }>({
    SUI: '1000.00',  // Mock balance
    USDC: '500.00'   // Mock balance
  });

  const wallet = useWallet();

  useEffect(() => {
    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 60000); // Update prices every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tokenFrom && tokenTo && amountFrom && tokenPrices[tokenFrom] && tokenPrices[tokenTo]) {
      calculateAmountTo(tokenFrom, tokenTo, amountFrom);
    }
  }, [tokenFrom, tokenTo, amountFrom, tokenPrices]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchTokenPrices = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=sui,usd-coin&vs_currencies=usd`);
      setTokenPrices({
        SUI: response.data.sui.usd,
        USDC: response.data['usd-coin'].usd
      });
    } catch (error) {
      console.error('Error fetching token prices:', error);
    }
  };

  const calculateAmountTo = (from: string, to: string, amount: string) => {
    const fromPrice = tokenPrices[from];
    const toPrice = tokenPrices[to];
    if (fromPrice && toPrice) {
      // Calculate raw amount
      const rawAmount = (parseFloat(amount) * fromPrice) / toPrice;
      // Apply fee deduction
      const feeAmount = rawAmount * (feePercentage / 100);
      const calculatedAmountTo = rawAmount - feeAmount;
      setAmountTo(calculatedAmountTo.toFixed(6));
    }
  };

  const handleAmountFromChange = (value: string) => {
    setAmountFrom(value);
    if (tokenFrom && tokenTo && tokenPrices[tokenFrom] && tokenPrices[tokenTo]) {
      calculateAmountTo(tokenFrom, tokenTo, value);
    }
  };

  async function swap() {
    if (!wallet.connected) return;

    setIsSwapping(true);
    // Create a new transaction block
    const tx = new Transaction();
    // Set the sender of the transaction
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";
    // Call the swap_tokens function on the swap package
    tx.moveCall({
      target: `${packageObjectId}::swap::swap_tokens`,
      arguments: [
        tx.pure.string(tokenFrom),
        tx.pure.string(tokenTo),
        tx.pure.string(amountFrom),
        tx.pure.string(amountTo),
        tx.pure.string(feePercentage.toString()), // Pass fee to smart contract
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log('successfully!', resData);
      alert('Swap successful');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto py-6 sm:py-12 px-4 sm:px-0">
          <h1 className="cyber-heading text-3xl md:text-5xl font-bold mb-8 text-center relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)]">
              Kanari Swap
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--cyber-primary)]/20 to-[var(--cyber-secondary)]/20 blur-sm -z-10"></div>
          </h1>

          <div className="w-full">
            <div className="cyber-container backdrop-blur-sm border border-[var(--cyber-border)] bg-[var(--cyber-card-bg)]/80 p-4 sm:p-6 rounded-md shadow-lg">
              <div className="space-y-6">
                {/* Fee Configuration Toggle */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowFeeConfig(!showFeeConfig)}
                    className="cyber-btn-sm p-2 sm:p-2.5 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-full 
                      shadow-md transition-all duration-300 hover:shadow-[0_0_10px_var(--cyber-primary)] 
                      transform hover:scale-110 active:scale-95"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--cyber-primary)]" />
                  </button>
                </div>

                {/* Fee Configuration */}
                {showFeeConfig && (
                  <div className="w-full bg-[var(--cyber-card-bg)]/50 p-3 rounded-md border border-[var(--cyber-border)]/40">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[var(--cyber-muted)]">Fee Percentage</span>
                      <span className="text-sm font-mono">{feePercentage}%</span>
                    </div>
                    <div className="flex space-x-2">
                      {[0.3, 0.5, 1.0].map((fee) => (
                        <button
                          key={fee}
                          onClick={() => {
                            setFeePercentage(fee);
                            if (amountFrom) {
                              calculateAmountTo(tokenFrom, tokenTo, amountFrom);
                            }
                          }}
                          className={`flex-1 py-1 px-2 text-xs rounded-sm ${
                            feePercentage === fee 
                              ? 'bg-[var(--cyber-primary)] text-white' 
                              : 'bg-[var(--cyber-card-bg)] text-[var(--cyber-muted)] hover:bg-[var(--cyber-primary)]/20'
                          } transition-colors duration-200`}
                        >
                          {fee}%
                        </button>
                      ))}
                      <input
                        type="number"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={feePercentage}
                        onChange={(e) => {
                          const newFee = parseFloat(e.target.value);
                          if (!isNaN(newFee) && newFee >= 0.1 && newFee <= 5) {
                            setFeePercentage(newFee);
                            if (amountFrom) {
                              calculateAmountTo(tokenFrom, tokenTo, amountFrom);
                            }
                          }
                        }}
                        className="flex-1 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)]/40 rounded-sm px-2 py-1 text-xs text-right"
                        placeholder="Custom"
                      />
                    </div>
                  </div>
                )}

                {/* Token From Input */}
                <TokenInput
                  label="From"
                  selectedToken={tokenFrom}
                  onSelectToken={setTokenFrom}
                  amount={amountFrom}
                  onAmountChange={handleAmountFromChange}
                  tokenPrice={tokenPrices[tokenFrom]}
                  error={error}
                  setError={setError}
                  balance={balances[tokenFrom]}
                  showBalanceButtons={true}
                />
              
                {/* Swap Direction Button */}
                <div className="flex justify-center -my-2 sm:-my-3 relative z-10">
                  <button
                    className="cyber-btn-sm p-2 sm:p-2.5 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-full 
                      shadow-md transition-all duration-300 hover:shadow-[0_0_10px_var(--cyber-primary)] 
                      transform hover:scale-110 active:scale-95"
                    onClick={() => {
                      setTokenFrom(tokenTo);
                      setTokenTo(tokenFrom);
                      setAmountFrom(amountTo);
                      setAmountTo(amountFrom);
                    }}
                  >
                    <ArrowDownUp className="h-4 w-4 sm:h-5 sm:w-5 transition-transform hover:rotate-180 text-[var(--cyber-primary)]" />
                  </button>
                </div>
              
                {/* Token To Input */}
                <TokenInput
                  label="To"
                  selectedToken={tokenTo}
                  onSelectToken={setTokenTo}
                  amount={amountTo}
                  onAmountChange={setAmountTo}
                  tokenPrice={tokenPrices[tokenTo]}
                  error={error}
                  setError={setError}
                  balance={balances[tokenTo]}
                  showBalanceButtons={false}
                />

                {/* Rate Display */}
                {tokenPrices[tokenFrom] && tokenPrices[tokenTo] && (
                  <div className="text-xs text-center text-[var(--cyber-muted)] bg-[var(--cyber-card-bg)]/50 p-2 rounded-sm border border-[var(--cyber-border)]/40">
                    Rate: 1 {tokenFrom} = {(tokenPrices[tokenFrom] / tokenPrices[tokenTo]).toFixed(6)} {tokenTo}
                  </div>
                )}

                {/* Action Button */}
                <div className="w-full pt-4">
                  {wallet.connected ? (
                    <button
                      className={`cyber-btn px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium flex items-center justify-center w-full
                        transition-all duration-300 ${isSwapping ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_10px_var(--cyber-primary)]"}`}
                      onClick={swap}
                      disabled={isSwapping}
                    >
                      {isSwapping ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        "SWAP NOW"
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
                    text-[var(--cyber-primary)] p-3 rounded-sm mt-2 text-center text-sm">
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



