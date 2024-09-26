import React, { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Menu, X, Home, Info, Mail, Loader } from "lucide-react";
import Navbar from "~/navbar";
import { Transaction } from "@mysten/sui/transactions";

export const meta: MetaFunction = () => {
  return [
    { title: "Kanari Sell - Exclusive NFT Minting" },
    { name: "description", content: "Mint your exclusive NFT and join the Kanari Sell community" },
  ];
};

function createMintNftTxnBlock() {
  const txb = new Transaction();
  const contractAddress = "0xb5ee8b1322685c136e331e1f2cabf48689f82dddb35d5edce3e85a9c3ece1ab3";
  const contractModule = "nft";
  const contractMethod = "mint";

  const nftName = new TextEncoder().encode("Kanari Sell NFT");
  const nftDescription = new TextEncoder().encode("Exclusive Kanari Sell Community NFT");
  const nftImgUrl = new TextEncoder().encode("https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4");

  txb.moveCall({
    target: `${contractAddress}::${contractModule}::${contractMethod}`,
    arguments: [txb.pure(nftName), txb.pure(nftDescription), txb.pure(nftImgUrl)],
  });

  return txb;
}

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const wallet = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  async function mintNft() {
    if (!wallet.connected) return;

    const txb = createMintNftTxnBlock();
  try {
    setIsMinting(true);
    const res = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: txb,
    });
    console.log('Transaction successful:', res);
  } catch (error) {
    console.error('Transaction failed:', error);
  } finally {
    setIsMinting(false);
  }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
          <div className="md:w-1/2">
            <img
              src="https://xc6fbqjny4wfkgukliockypoutzhcqwjmlw2gigombpp2ynufaxa.arweave.net/uLxQwS3HLFUailocJWHupPJxQsli7aMgzmBe_WG0KC4"
              alt="Kanari Sell Exclusive NFT"
              className="rounded-lg shadow-2xl transform transition duration-500 hover:scale-105"
            />
          </div>

          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Mint Your <span className="text-yellow-300">Exclusive</span> NFT
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Join the Kanari Sell community by minting your unique NFT. Connect your wallet and become part of something extraordinary.
            </p>

            {wallet.status === "connected" ? (
              <button
                onClick={mintNft}
                disabled={isMinting}
                className={`bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center w-full md:w-auto ${isMinting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isMinting ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" />
                    Minting...
                  </>
                ) : (
                  "Mint Now"
                )}
              </button>
            ) : (
              <ConnectButton
                className="bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full md:w-auto"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
