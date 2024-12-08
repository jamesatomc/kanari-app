"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import HeroSection from "./components/HeroSection";

export default function Home() {

  return (
    <WalletProvider>
        <HeroSection />
    </WalletProvider>

  );
}