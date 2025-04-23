"use client";
import { Coins, Wallet, Store, Rocket } from "lucide-react";
import { X, Menu, Moon, Sun } from "lucide-react";
import dynamic from 'next/dynamic';
import { Route, Link, Routes } from 'react-router-dom';
import { ConnectButton } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import HeroSection from "../pages/้home/page";
import Liquidity from "../pages/liquidity/page";
import IDO from "../pages/ido/page";
import Swap from "../pages/swap/page";
import Footer from "./Footer";

// Dynamically import BrowserRouter to ensure it only runs on the client side
const BrowserRouter = dynamic(
  () => import('react-router-dom').then(mod => mod.HashRouter || mod.BrowserRouter), 
  { ssr: false }
);

export default function NavHost() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Set dark mode as default
        if (typeof window !== 'undefined') {
            const savedMode = localStorage.getItem('darkMode');
            return savedMode !== null ? savedMode === 'true' : true; // Default to true
        }
        return true; // Default to dark mode
    });
    const [sakuraPetals, setSakuraPetals] = useState<Array<{id: number, left: number, delay: number, duration: number}>>([]);

    // Force dark mode on initial load
    useEffect(() => {
        document.body.classList.add('dark');
    }, []);

    // Update localStorage when theme changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', isDarkMode.toString());
            // Apply theme to body
            document.body.classList.toggle('dark', isDarkMode);
        }
    }, [isDarkMode]);
    
    // Create sakura petals for animation
    useEffect(() => {
        const petals = [];
        for (let i = 0; i < 20; i++) {
            petals.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 10,
                duration: 5 + Math.random() * 10
            });
        }
        setSakuraPetals(petals);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <BrowserRouter>
        <div className={`px-4 pt-4 min-h-screen transition-colors duration-300 ${
          isDarkMode 
            ? "bg-[var(--cyber-background)] ai-data-grid" 
            : "bg-gradient-to-b from-[#f7f9fc] via-[#f0f2f5] to-[#e8e9f0]"
        }`}>
            {/* Sakura petals animation */}
            <div className="sakura-container">
                {sakuraPetals.map((petal) => (
                <div 
                    key={petal.id}
                    className="sakura"
                    style={{
                    left: `${petal.left}%`,
                    animationDelay: `${petal.delay}s`,
                    animationDuration: `${petal.duration}s`,
                    }}
                />
                ))}
            </div>
            
            <div className="flex justify-center">
                <nav className={`w-full max-w-7xl backdrop-blur-lg shadow-xl sticky top-4 z-50 border-2 rounded-[var(--kawaii-border-radius)] transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-[var(--cyber-card-bg)] border-[var(--cyber-border)]"
                    : "bg-gradient-to-r from-[var(--cyber-card-bg)]/90 to-[var(--cyber-card-bg)]/90 border-[var(--cyber-border)]"
                }`}>
                    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center justify-between w-full">
                                {/* Logo */}
                                <Link 
                                    to="/" 
                                    className="flex-shrink-0 transform hover:scale-110 transition-all duration-300 hover:rotate-3 mr-8"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--cyber-primary)]/30 to-[var(--cyber-secondary)]/30 rounded-full blur-md"></div>
                                        <img 
                                            className="h-12 w-12 rounded-full shadow-md border-2 border-[var(--cyber-border)] relative z-10" 
                                            src="/Kari.svg" 
                                            alt="Kanari Logo" 
                                        />
                                    </div>
                                </Link>
                            
                                {/* Desktop Navigation */}
                                <div className="hidden md:flex items-center space-x-6 flex-grow justify-center">
                                    {[
                                        { to: "/", icon: <Wallet />, text: "Mint NFT" },
                                        { to: "/swap", icon: <Coins />, text: "Swap" },
                                        { to: "/liquidity", icon: <Store />, text: "Liquidity" },
                                        { to: "/ido", icon: <Rocket />, text: "IDO" }
                                    ].map((item) => (
                                        <Link 
                                            key={item.to}
                                            to={item.to} 
                                            className={`group relative flex flex-col items-center px-4 py-2 font-medium 
                                                rounded-2xl transition-all duration-300 hover:scale-105
                                                border-2 border-transparent
                                                hover:shadow-lg
                                                text-[var(--cyber-foreground)] hover:bg-[var(--cyber-card-bg)]/80 hover:border-[var(--cyber-border)] hover:shadow-[var(--cyber-glow-secondary)]`}
                                        >
                                            <span className="w-5 h-5 transition-transform group-hover:rotate-12 text-[var(--cyber-primary)]">
                                                {item.icon}
                                            </span>
                                            <span className="relative whitespace-nowrap mt-1 font-bold">
                                                {item.text}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="hidden md:flex items-center space-x-3">
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-300 border-2 shadow-lg transform hover:scale-105
                                            text-[var(--cyber-foreground)] bg-[var(--cyber-card-bg)]/80 border-[var(--cyber-border)]
                                            hover:shadow-[var(--cyber-glow-primary)] kawaii-tooltip"
                                        data-tooltip={isDarkMode ? "Light Mode" : "Dark Mode"}
                                        aria-label="Toggle dark mode"
                                    >
                                        {isDarkMode ? (
                                            <Sun className="h-5 w-5 text-[var(--cyber-secondary)]" />
                                        ) : (
                                            <Moon className="h-5 w-5 text-[var(--cyber-primary)]" />
                                        )}
                                    </button>
                                    <ConnectButton className="bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] text-white hover:from-[var(--cyber-primary)]/90 hover:to-[var(--cyber-secondary)]/90 transition-all duration-300 rounded-full text-sm font-bold shadow-lg hover:shadow-[var(--cyber-glow-primary)] transform hover:scale-105 border-0" />
                                </div>
                                <div className="md:hidden">
                                    <button
                                        onClick={toggleMenu}
                                        className="inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 border-2 border-[var(--cyber-border)]
                                            text-[var(--cyber-foreground)] hover:bg-[var(--cyber-primary)]/20"
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
                            <div className="px-4 py-3 space-y-2">
                                {[
                                    { to: "/", icon: <Wallet className="w-5 h-5" />, text: "Mint NFT" },
                                    { to: "/swap", icon: <Coins className="w-5 h-5" />, text: "Swap" },
                                    { to: "/liquidity", icon: <Store className="w-5 h-5" />, text: "Liquidity" },
                                    { to: "/ido", icon: <Rocket className="w-5 h-5" />, text: "IDO" },
                                ].map((item) => (
                                    <Link 
                                        key={item.to}
                                        to={item.to} 
                                        className="group flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium 
                                            transition-all duration-300
                                            border-2 border-transparent
                                            hover:shadow-lg
                                            text-[var(--cyber-foreground)] hover:bg-[var(--cyber-card-bg)]/80 hover:border-[var(--cyber-border)] hover:shadow-[var(--cyber-glow-secondary)]"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className="transition-transform group-hover:scale-110 text-[var(--cyber-primary)]">
                                            {item.icon}
                                        </span>
                                        <span className="font-bold">{item.text}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="pt-2 pb-3 border-t border-[var(--cyber-border)]">
                                <div className="px-3 flex flex-col sm:flex-row items-center gap-3">
                                    <ConnectButton className="w-full sm:w-auto flex-1 bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] text-white hover:from-[var(--cyber-primary)]/90 hover:to-[var(--cyber-secondary)]/90 transition-all duration-300 rounded-full text-sm font-bold shadow-lg hover:shadow-[var(--cyber-glow-primary)]" />
                                </div>
                            </div>

                            <div className="pt-2 pb-3 border-t border-[var(--cyber-border)]">
                                <div className="px-3 flex flex-col sm:flex-row items-star gap-3 w-40">
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className="h-10 px-4 transition-all duration-300 rounded-full text-sm font-bold shadow-lg flex items-center gap-2
                                            bg-gradient-to-r from-[var(--cyber-card-bg)] to-[var(--cyber-card-bg)]/80 text-[var(--cyber-foreground)]
                                            border-2 border-[var(--cyber-border)] hover:shadow-[var(--cyber-glow-primary)]"
                                        aria-label="Toggle dark mode"
                                    >
                                        {isDarkMode ? (
                                            <>
                                                <Sun className="h-5 w-5 text-[var(--cyber-secondary)]" />
                                                <span>Light Mode</span>
                                            </>
                                        ) : (
                                            <>
                                                <Moon className="h-5 w-5 text-[var(--cyber-primary)]" />
                                                <span>Dark Mode</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            <Routes>
                <Route path="/" element={<HeroSection />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/liquidity" element={<Liquidity />} />
                <Route path="/ido" element={<IDO />} />
            </Routes>
            <Footer darkMode={isDarkMode} setDarkMode={setIsDarkMode} />
        </div>
      </BrowserRouter>
    );
}