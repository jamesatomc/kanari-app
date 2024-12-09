"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-950 via-gray-900 to-black">
      <WalletProvider>
      
          <HeroSection />
   
      </WalletProvider>
    </main>
  );
}