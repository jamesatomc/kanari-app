'use client'; 

import { ConnectButton } from "@suiet/wallet-kit";
import { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Loader } from "lucide-react";
import { Transaction } from "@mysten/sui/transactions";

export default function HeroSection() {
    const wallet = useWallet();
    const [isMinting, setIsMinting] = useState(false);

    async function handleSignAndExecuteTx() {
        if (!wallet.connected) return;
    
        setIsMinting(true);
    
        const tx = new Transaction();
        const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";
        tx.moveCall({
          target: `${packageObjectId}::nft::mint`,
          arguments: [tx.pure.string("Example NFT"), tx.pure.string("daad"), tx.pure.string("https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png")],
        });
    
        try {
          const resData = await wallet.signAndExecuteTransaction({
            transaction: tx,
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
        <div className="py-8">
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="cyber-container p-8">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
                    <div className="md:w-1/2">
                    <img
                        src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png"
                        alt="Kanari Sell Exclusive NFT"
                        className="cyber-image shadow-2xl transform transition duration-500 hover:scale-105"
                    />
                    </div>
        
                    <div className="md:w-1/2 text-center md:text-left">
                    <h1 className="cyber-heading glitch-effect text-4xl md:text-6xl font-bold mb-6 leading-tight" data-text="Mint Your Exclusive NFT">
                        Mint Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)]">Exclusive</span> NFT
                    </h1>
                    <p className="cyber-text text-xl mb-8 leading-relaxed">
                        Join the <span>Kanari Sell</span> community by minting your unique NFT. Connect your wallet and become part of something extraordinary.
                    </p>
        
                    {wallet.status === "connected" ? (
                        <button
                        onClick={handleSignAndExecuteTx}
                        disabled={isMinting}
                        className={`cyber-btn px-8 py-4 rounded-none text-lg font-semibold flex items-center justify-center w-full md:w-auto ${isMinting ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                        {isMinting ? (
                            <>
                            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Minting...
                            </>
                        ) : (
                            "MINT NOW"
                        )}
                        </button>
                    ) : (
                        <ConnectButton
                        className="cyber-btn px-8 py-4 rounded-none text-lg font-semibold w-full md:w-auto"
                        />
                    )}
                    </div>
                </div>
                </div>
            </main>
        </div>
    )
}