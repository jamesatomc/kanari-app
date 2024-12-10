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
    totalSupply: 1000000,
    soldAmount: 250000,
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
        <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
          Token <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Sale</span>
        </h1>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-orange-200/20">
            <div className="space-y-6">
              {/* Token Info */}
              <div className="flex items-center space-x-4">
                <img src={idoInfo.tokenImage} alt={idoInfo.tokenName} className="w-12 h-12 rounded-full" />
                <div>
                  <h2 className="text-xl font-semibold text-white">{idoInfo.tokenName}</h2>
                  <p className="text-gray-300">{idoInfo.tokenSymbol}</p>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-orange-500">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Progress</span>
                  <span>{progress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{idoInfo.soldAmount.toLocaleString()} {idoInfo.tokenSymbol}</span>
                  <span>{idoInfo.totalSupply.toLocaleString()} {idoInfo.tokenSymbol}</span>
                </div>
              </div>

              {/* Purchase Form */}
              <div className="space-y-4 w-full max-w-sm mx-auto px-4 sm:px-0">
                <input
                  type="number"
                  placeholder={`Amount (${idoInfo.minBuy}-${idoInfo.maxBuy})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                {wallet.connected ? (
                  <button
                    className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center w-full md:w-auto ${isProcessing ? "opacity-50 cursor-not-allowed" : ""} hover:shadow-orange-500/30`}
                    onClick={handleBuy}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white inline" />
                        <span className="align-middle">Processing...</span>
                      </>
                    ) : (
                      `Buy Tokens`
                    )}
                  </button>
                ) : (
                  <ConnectButton
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full md:w-auto hover:shadow-orange-500/30"
                  />
                )}
              </div>

              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-3 sm:p-4 rounded-lg sm:rounded-xl text-sm sm:text-base text-center">
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