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
      const packageId = "0x..."; // Your IDO contract address

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
      setError('Failed to purchase tokens: ' + e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="cyber-heading text-4xl md:text-6xl font-bold mb-12 text-center glitch-effect" data-text="Token Sale">
          Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)]">Sale</span>
        </h1>
        
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md cyber-container p-6 md:p-8">
            <div className="space-y-6 sm:space-y-8">
              {/* Token Info */}
              <div className="flex items-center justify-center space-x-4">
                <img src={idoInfo.tokenImage} alt={idoInfo.tokenName} className="w-12 h-12 rounded-none cyber-image" />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-[var(--cyber-foreground)]">{idoInfo.tokenName}</h2>
                  <p className="text-[var(--cyber-muted)]">{idoInfo.tokenSymbol}</p>
                </div>
              </div>
      
              {/* Timer */}
              <div className="bg-[var(--cyber-card-bg)]/50 rounded-none p-4 mx-auto max-w-[240px] border border-[var(--cyber-border)]">
                <div className="flex items-center justify-center space-x-2 text-[var(--cyber-secondary)]">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>
      
              {/* Progress */}
              <div className="space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between text-sm text-[var(--cyber-muted)]">
                  <span>Progress</span>
                  <span>{progress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-[var(--cyber-card-bg)]/50 rounded-none h-2 border border-[var(--cyber-border)]">
                  <div
                    className="bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] h-2 rounded-none"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[var(--cyber-muted)]">
                  <span>{idoInfo.soldAmount.toLocaleString()} {idoInfo.tokenSymbol}</span>
                  <span>{idoInfo.totalSupply.toLocaleString()} {idoInfo.tokenSymbol}</span>
                </div>
              </div>
      
              {/* Purchase Form */}
              <div className="space-y-4 max-w-sm mx-auto">
                <input
                  type="number"
                  placeholder={`Amount (${idoInfo.minBuy}-${idoInfo.maxBuy})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-none text-base text-[var(--cyber-foreground)] placeholder-[var(--cyber-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--cyber-primary)]"
                />
                
                <div className="w-full flex justify-center pt-4">
                  {wallet.connected ? (
                    <button
                      className={`cyber-btn px-8 py-4 rounded-none text-lg font-semibold flex items-center justify-center w-full md:w-auto ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={handleBuy}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          PROCESSING...
                        </>
                      ) : (
                        `BUY TOKENS`
                      )}
                    </button>
                  ) : (
                    <ConnectButton
                      className="cyber-btn px-8 py-4 rounded-none text-lg font-semibold w-full md:w-auto"
                    />
                  )}
                </div>
              </div>
      
              {error && (
                <div className="w-full bg-[var(--cyber-primary)]/10 border border-[var(--cyber-primary)]/20 text-[var(--cyber-primary)] p-4 rounded-none mt-4 text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}