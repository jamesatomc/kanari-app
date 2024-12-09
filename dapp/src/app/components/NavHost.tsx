'use client';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WalletProvider } from "@suiet/wallet-kit";

import Swap from '../pages/swap/page';
import Liquidity from '../pages/liquidity/page';
import IDO from '../pages/ido/page';
import HeroSection from '../pages/้home/page';

export default function NavHost() {
    
  return (
    <WalletProvider>
      <Router>
        <div className="px-4 pt-4">
            <nav className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-orange-500/20 rounded-2xl">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <a href="#" className="flex-shrink-0 transform hover:scale-110 transition-all duration-300 hover:rotate-3">
                                <img className="h-10 w-10 rounded-xl shadow-[0_0_15px_rgba(255,87,34,0.3)] ring-2 ring-orange-500/30" src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png" alt="Kanari Sell Logo" />
                            </a>
                            <div className="hidden md:flex ml-8 items-baseline space-x-3">
                                <Link to="/" className="text-white hover:text-orange-400">Home</Link>
                                <Link to="/swap" className="text-white hover:text-orange-400">Swap</Link>
                                <Link to="/liquidity" className="text-white hover:text-orange-400">Liquidity</Link>
                                <Link to="/ido" className="text-white hover:text-orange-400">IDO</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
        
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/ido" element={<IDO />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}