'use client';

import { useEffect, useState } from 'react';
import { ArrowDownUp, Loader, Settings, Star } from 'lucide-react';
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
  const [sakuraPetals, setSakuraPetals] = useState<Array<{id: number, left: number, delay: number, duration: number}>>([]);

  const wallet = useWallet();

  useEffect(() => {
    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 60000); // Update prices every minute
    
    // Create sakura petals
    const petals = [];
    for (let i = 0; i < 15; i++) {
      petals.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 5 + Math.random() * 10
      });
    }
    setSakuraPetals(petals);
    
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
      alert('Swap successful!');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* Sakura petals animation */}
      <div className="sakura-container">
        {sakuraPetals.map((petal) => (
          <div 
            key={petal.id}
            className="sakura"
            style={{
              left: `${petal.left}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`,
            }}
          />
        ))}
      </div>
      
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto py-6 sm:py-12 px-4 sm:px-0">
          <h1 className="cyber-heading text-3xl md:text-5xl font-bold mb-8 text-center relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] relative">
              Kanari Swap
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--cyber-primary)]/20 to-[var(--cyber-secondary)]/20 blur-sm -z-10"></div>
          </h1>

          <div className="w-full">
            <div className="cyber-container backdrop-blur-sm border-2 border-[var(--cyber-border)] bg-[var(--cyber-card-bg)]/90 p-4 sm:p-6 rounded-[var(--kawaii-border-radius)] shadow-lg">
              <div className="space-y-6">
                {/* Fee Configuration Toggle */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowFeeConfig(!showFeeConfig)}
                    className="cyber-btn-sm p-2 sm:p-2.5 bg-[var(--cyber-card-bg)] border-2 border-[var(--cyber-border)] rounded-full 
                      shadow-md transition-all duration-300 hover:shadow-[var(--cyber-glow-primary)] kawaii-tooltip"
                    data-tooltip="Fee Settings"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--cyber-primary)]" />
                  </button>
                </div>

                {/* Fee Configuration */}
                {showFeeConfig && (
                  <div className="w-full bg-[var(--cyber-card-bg)]/70 p-4 rounded-2xl border-2 border-[var(--cyber-border)]/40">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-[var(--cyber-primary)]">Fee Settings</span>
                      <span className="kawaii-badge">{feePercentage}%</span>
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
                          className={`flex-1 py-1.5 px-2 text-xs rounded-full font-bold ${
                            feePercentage === fee 
                              ? 'bg-[var(--cyber-primary)] text-white shadow-[0_0_8px_var(--cyber-primary)]' 
                              : 'bg-[var(--cyber-card-bg)] text-[var(--cyber-muted)] hover:bg-[var(--cyber-primary)]/20'
                          } transition-all duration-200 border border-[var(--cyber-border)]/40`}
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
                        className="flex-1 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)]/40 rounded-full px-3 py-1.5 text-xs text-right kawaii-input"
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
                    className="p-3 sm:p-3.5 bg-[var(--cyber-card-bg)] border-2 border-[var(--cyber-border)] rounded-full 
                      shadow-md transition-all duration-300 hover:shadow-[var(--cyber-glow-primary)] 
                      transform hover:scale-110 hover:rotate-180 active:scale-95"
                    onClick={() => {
                      setTokenFrom(tokenTo);
                      setTokenTo(tokenFrom);
                      setAmountFrom(amountTo);
                      setAmountTo(amountFrom);
                    }}
                  >
                    <ArrowDownUp className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--cyber-primary)]" />
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
                  <div className="text-xs text-center font-medium bg-[var(--cyber-card-bg)]/60 p-3 rounded-full border border-[var(--cyber-border)]/40 flex items-center justify-center space-x-2">
                    <Star className="h-3 w-3 text-[var(--cyber-accent)] fill-[var(--cyber-accent)]" />
                    <span>Rate: 1 {tokenFrom} = {(tokenPrices[tokenFrom] / tokenPrices[tokenTo]).toFixed(6)} {tokenTo}</span>
                    <Star className="h-3 w-3 text-[var(--cyber-accent)] fill-[var(--cyber-accent)]" />
                  </div>
                )}

                {/* Action Button */}
                <div className="w-full pt-4">
                  {wallet.connected ? (
                    <button
                      className={`cyber-btn px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold flex items-center justify-center w-full
                        transition-all duration-300 ${isSwapping ? "opacity-50 cursor-not-allowed" : "hover:shadow-[0_0_10px_var(--cyber-primary)]"}`}
                      onClick={swap}
                      disabled={isSwapping}
                    >
                      {isSwapping ? (
                        <>
                          <div className="anime-loader mr-3">
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        "Swap Now"
                      )}
                    </button>
                  ) : (
                    <ConnectButton
                      className="cyber-btn px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold w-full
                        hover:shadow-[0_0_10px_var(--cyber-primary)] transition-all duration-300"
                    />
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="w-full bg-[var(--cyber-primary)]/10 border-2 border-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] p-3 rounded-full mt-2 text-center text-sm">
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



