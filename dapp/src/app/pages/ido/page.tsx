'use client';

import { useEffect, useState } from 'react';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Clock, Loader } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";

export default function IDO() {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const wallet = useWallet();

  // Mock IDO data - replace with actual data
  const idoInfo = {
    tokenName: "KARI TOKEN",
    tokenSymbol: "KARI",
    tokenImage: "/Kari.svg",
    price: 0.1, // Price in SUI
    totalSupply: 31000000,
    soldAmount: 25000000,
    startTime: new Date('2024-04-01').getTime(),
    endTime: new Date('2024-04-07').getTime(),
    minBuy: 100,
    maxBuy: 10000
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (now < idoInfo.startTime) {
        setTimeLeft(idoInfo.startTime - now);
      } else if (now < idoInfo.endTime) {
        setTimeLeft(idoInfo.endTime - now);
      } else {
        setTimeLeft(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const progress = (idoInfo.soldAmount / idoInfo.totalSupply) * 100;

  const handleBuy = async () => {
    if (!wallet.connected || !amount) return;

    setIsProcessing(true);
    setError(null);

    try {
      const tx = new Transaction();
      const packageId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a"; // Updated package ID

      tx.moveCall({
        target: `${packageId}::ido::buy_tokens`,
        arguments: [tx.pure.string(amount)],
      });

      const response = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log('Purchase successful:', response);
      setAmount('');
    } catch (e) {
      console.error('Failed to purchase tokens:', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto py-6 sm:py-12 px-4 sm:px-0">
          
          <div className="w-full">
            <div className="cyber-container backdrop-blur-sm border border-[var(--cyber-border)] bg-[var(--cyber-card-bg)]/80 p-4 sm:p-6 rounded-md shadow-lg ai-scan-lines">
              <div className="space-y-5 sm:space-y-7">
                {/* Token Info */}
                <div className="flex items-center justify-center space-x-4 p-2">
                  <div className="relative">
                    <img 
                      src={idoInfo.tokenImage} 
                      alt={idoInfo.tokenName} 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--cyber-primary)]/20 to-[var(--cyber-secondary)]/20 blur-sm -z-10"></div>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--cyber-foreground)]">{idoInfo.tokenName}</h2>
                    <div className="flex items-center space-x-2">
                      <p className="text-[var(--cyber-muted)]">{idoInfo.tokenSymbol}</p>
                      <span className="px-2 py-0.5 bg-[var(--cyber-primary)]/10 text-[var(--cyber-primary)] text-xs rounded-sm">
                        1 {idoInfo.tokenSymbol} = {idoInfo.price} SUI
                      </span>
                    </div>
                  </div>
                </div>
        
                {/* Timer */}
                <div className="bg-[var(--cyber-card-bg)]/60 rounded-md p-3 sm:p-4 mx-auto max-w-[280px] border border-[var(--cyber-border)]/60 shadow-inner backdrop-blur-sm">
                  <div className="text-center text-xs mb-1 text-[var(--cyber-muted)]">
                    {Date.now() < idoInfo.startTime ? 'STARTS IN' : Date.now() < idoInfo.endTime ? 'ENDS IN' : 'ENDED'}
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-[var(--cyber-secondary)] font-mono">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--cyber-primary)]" />
                    <span className="text-base sm:text-lg font-bold tracking-wide">{formatTime(timeLeft)}</span>
                  </div>
                </div>
        
                {/* Progress */}
                <div className="space-y-2 mx-auto">
                  <div className="flex justify-between text-sm text-[var(--cyber-foreground)]">
                    <span className="font-medium">Sale Progress</span>
                    <span className="font-bold text-[var(--cyber-primary)]">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-[var(--cyber-card-bg)]/80 rounded-sm h-3 border border-[var(--cyber-border)]/60 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] h-3"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-[var(--cyber-muted)]">
                    <span>{idoInfo.soldAmount.toLocaleString()} {idoInfo.tokenSymbol}</span>
                    <span>{idoInfo.totalSupply.toLocaleString()} {idoInfo.tokenSymbol}</span>
                  </div>
                </div>
        
                {/* Purchase Form */}
                <div className="space-y-3 mx-auto pt-2">
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-[var(--cyber-foreground)] mb-1">Amount to Purchase</label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder={`${idoInfo.minBuy} - ${idoInfo.maxBuy} ${idoInfo.tokenSymbol}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-sm 
                          text-base text-[var(--cyber-foreground)] placeholder-[var(--cyber-muted)] focus:outline-none 
                          focus:ring-1 focus:ring-[var(--cyber-primary)] focus:border-[var(--cyber-primary)]
                          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                          [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <div className="absolute right-0 top-0 bottom-0 flex items-center px-3 text-[var(--cyber-muted)]">
                        {idoInfo.tokenSymbol}
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <span className="text-[var(--cyber-muted)]">Min: {idoInfo.minBuy} {idoInfo.tokenSymbol}</span>
                      <span className="text-[var(--cyber-muted)]">Max: {idoInfo.maxBuy} {idoInfo.tokenSymbol}</span>
                    </div>
                  </div>

                  {amount && (
                    <div className="text-sm text-center p-2 bg-[var(--cyber-primary)]/5 border border-[var(--cyber-primary)]/10 rounded-sm">
                      <span className="text-[var(--cyber-muted)]">Total Cost: </span>
                      <span className="font-bold text-[var(--cyber-foreground)]">
                        {(parseFloat(amount) * idoInfo.price).toFixed(3)} SUI
                      </span>
                    </div>
                  )}
                  
                  <div className="w-full pt-3">
                    {wallet.connected ? (
                      <button
                        className={`cyber-btn ai-glow px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium flex items-center 
                          justify-center w-full transition-all duration-300 ${
                          (isProcessing || !amount || Date.now() > idoInfo.endTime) 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:shadow-[0_0_10px_var(--cyber-primary)]"
                        }`}
                        onClick={handleBuy}
                        disabled={isProcessing || !amount || Date.now() > idoInfo.endTime}
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            <span>PROCESSING...</span>
                          </>
                        ) : Date.now() > idoInfo.endTime ? (
                          'SALE ENDED'
                        ) : (
                          'BUY TOKENS'
                        )}
                      </button>
                    ) : (
                      <ConnectButton
                        className="cyber-btn ai-glow px-4 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-medium w-full
                          hover:shadow-[0_0_10px_var(--cyber-primary)] transition-all duration-300"
                      />
                    )}
                  </div>
                </div>
        
                {error && (
                  <div className="w-full bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] p-3 rounded-sm text-center text-sm animate-pulse">
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