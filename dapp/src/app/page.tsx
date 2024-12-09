"use client";

import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css"; // don't forget to import default stylesheet
import NavHost from "./components/NavHost";


export default function Home() {

  return (
    <WalletProvider>
        <NavHost />
    </WalletProvider>
  );
}