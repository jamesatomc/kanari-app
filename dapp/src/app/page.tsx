"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import HeroSection from "./components/HeroSection";
import "@suiet/wallet-kit/style.css"; // don't forget to import default stylesheet


export default function Home() {

  return (
    <WalletProvider>
        <HeroSection />
    </WalletProvider>
  );
}