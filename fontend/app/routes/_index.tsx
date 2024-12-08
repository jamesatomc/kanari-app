import React, { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { useWallet } from "@suiet/wallet-kit";
import { Loader } from "lucide-react";
import Navbar from "~/navbar";
import { ConnectButton } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";


export const meta: MetaFunction = () => {
  return [
    { title: "Kanari Sell - Exclusive NFT Minting" },
    { name: "description", content: "Mint your exclusive NFT and join the Kanari Sell community" },
  ];
};

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const wallet = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);``

  async function handleSignAndExecuteTx() {
    if (!wallet.connected) return;

    setIsMinting(true);

    const tx = new TransactionBlock();
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";
    tx.moveCall({
      target: `${packageObjectId}::nft::mint`,
      arguments: [tx.pure("Example NFT"), tx.pure("daad"), tx.pure("https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png")],
    });

    try {
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('nft minted successfully!', resData);
      alert('Congrats! your nft is minted!');
    } catch (e) {
      console.error('nft mint failed', e);
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-900 dark:to-orange-950">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
  
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-orange-200/30 dark:border-white/20">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
            <div className="md:w-1/2">
              <img
                src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png"
                alt="Kanari Sell Exclusive NFT"
                className="rounded-lg shadow-2xl transform transition duration-500 hover:scale-105 ring-2 ring-orange-400/30 dark:ring-orange-500/20"
              />
            </div>
  
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-orange-950 dark:text-white">
                Mint Your <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Exclusive</span> NFT
              </h1>
              <p className="text-xl text-orange-950/90 dark:text-white/80 mb-8 leading-relaxed">
                Join the Kanari Sell community by minting your unique NFT. Connect your wallet and become part of something extraordinary.
              </p>
  
              {wallet.status === "connected" ? (
                <button
                  onClick={handleSignAndExecuteTx}
                  disabled={isMinting}
                  className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center w-full md:w-auto ${isMinting ? "opacity-50 cursor-not-allowed" : ""} hover:shadow-orange-500/30`}
                >
                  {isMinting ? (
                    <>
                      <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Minting...
                    </>
                  ) : (
                    "Mint Now"
                  )}
                </button>
              ) : (
                <ConnectButton
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full md:w-auto hover:shadow-orange-500/30"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
