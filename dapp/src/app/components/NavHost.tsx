"use client";

import { X, Menu, Moon, Sun } from "lucide-react";
import dynamic from 'next/dynamic';
import { Route, Link, Routes } from 'react-router-dom';
import { ConnectButton } from "@suiet/wallet-kit";
import { useState } from "react";
import HeroSection from "../pages/้home/page";
import Liquidity from "../pages/liquidity/page";
import IDO from "../pages/ido/page";
import Swap from "../pages/swap/page";

// Dynamically import BrowserRouter to ensure it only runs on the client side
const BrowserRouter = dynamic(() => import('react-router-dom').then(mod => mod.BrowserRouter), { ssr: false });

export default function NavHost() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


  return (
      <BrowserRouter>
        <div className="px-4 pt-4 min-h-screen bg-gradient-to-b from-orange-950 via-gray-900 to-black">
            <nav className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-orange-500/20 rounded-2xl">
                <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="flex-shrink-0 transform hover:scale-110 transition-all duration-300 hover:rotate-3">
                                <img 
                                    className="h-10 w-10 rounded-xl shadow-[0_0_15px_rgba(255,87,34,0.3)] ring-2 ring-orange-500/30" 
                                    src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png" 
                                    alt="Kanari Sell Logo" 
                                />
                            </Link>
                            <Link to="/" className="text-gray-700 hover:text-gray-900">
                                Mint NFT
                            </Link>
                            <Link to="/swap" className="text-gray-700 hover:text-gray-900">
                                Swap
                            </Link>
                            <Link to="/liquidity" className="text-gray-700 hover:text-gray-900">
                                Products
                            </Link>
                            <Link to="/ido" className="text-gray-700 hover:text-gray-900">
                                IDO
                            </Link>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-3">
                                <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="inline-flex items-center justify-center p-2.5 rounded-xl text-orange-50 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 border border-orange-500/20 hover:border-orange-500/40 shadow-lg shadow-orange-900/5 hover:shadow-orange-500/20 transform hover:scale-105"
                                aria-label="Toggle dark mode"
                                >
                                {isDarkMode ? (
                                    <Sun className="h-5 w-5 text-orange-400" />
                                ) : (
                                    <Moon className="h-5 w-5 text-orange-400" />
                                )}
                                </button>
                                <ConnectButton className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 rounded-xl text-sm font-medium shadow-lg hover:shadow-orange-500/30 transform hover:scale-105" />
                            </div>
                            <div className="md:hidden">
                                <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-lg text-orange-50 hover:bg-orange-500/20 focus:outline-none transition-all duration-300 border border-transparent hover:border-orange-500/30"
                                >
                                {isMenuOpen ? (
                                    <X className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-5 w-5" aria-hidden="true" />
                                )}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-3 pt-2 pb-3 space-y-2">
                        <Link 
                            to="/" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Mint NFT
                        </Link>
                        <Link 
                            to="/swap"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Swap
                        </Link>
                        <Link 
                            to="/liquidity"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            Liquidity
                        </Link>
                        <Link 
                            to="/ido"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                            IDO
                        </Link>
                    </div>

                    <div className="pt-2 pb-3 border-t border-orange-500/20">
                        <div className="px-3 flex flex-col sm:flex-row items-center gap-3">

                            <ConnectButton className="w-full sm:w-auto flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 rounded-full text-sm font-medium shadow-lg hover:shadow-orange-500/30" />
                        </div>
                    </div>


                    <div className="pt-2 pb-3 border-t border-orange-500/20">
                        <div className="px-3 flex flex-col sm:flex-row items-star gap-3 w-40 ">
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="h-10 px-4 bg-gradient-to-r from-orange-900/40 to-orange-800/40 text-orange-50 hover:from-orange-500/20 hover:to-orange-600/20 transition-all duration-300 rounded-full text-sm font-medium shadow-lg hover:shadow-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 flex items-center gap-2"
                                aria-label="Toggle dark mode"
                            >
                                {isDarkMode ? (
                                    <>
                                        <Sun className="h-5 w-5 text-orange-400" />
                                        <span>Light Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-5 w-5 text-orange-400" />
                                        <span>Dark Mode</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            )}
            </nav>


            <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/liquidity" element={<Liquidity />} />
                <Route path="/ido" element={<IDO />} />
            </Routes>
        </div>
        

      </BrowserRouter>
  );
}