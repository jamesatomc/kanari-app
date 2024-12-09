"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import HeroSection from "./components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-950 via-gray-900 to-black">
      <WalletProvider>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
        </div>
      </WalletProvider>
    </main>
  );
}