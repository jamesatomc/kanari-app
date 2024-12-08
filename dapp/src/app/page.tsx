"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css"; // don't forget to import default stylesheet
import HeroSection from "./components/HeroSection";

export default function Home() {

  return (
    <WalletProvider>
        <HeroSection />
    </WalletProvider>

  );
}