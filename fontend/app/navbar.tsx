import React from "react";
import { Link } from 'react-router-dom';
import { Gem, BadgeDollarSign, CircleDot, Menu, X } from "lucide-react";
import { ConnectButton } from "@suiet/wallet-kit";

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <div className="px-4 pt-4">
      <nav className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 backdrop-blur-lg shadow-xl sticky top-0 z-50 border-b border-orange-500/20 rounded-2xl">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a href="#" className="flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
                <img className="h-9 w-9 rounded-lg shadow-md" src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png" alt="Kanari Sell Logo" />
              </a>
              <div className="hidden md:flex ml-8 items-baseline space-x-3">
                {["Mint NFT", "IDO", "Swap"].map((item) => (
                  <Link
                    key={item}
                    to={item === "Mint NFT" ? "/" : item === "IDO" ? "/ido" : "/swap"}
                    className="text-orange-50 hover:bg-orange-500/20 hover:scale-105 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center backdrop-blur-sm border border-transparent hover:border-orange-500/30 shadow-sm hover:shadow-orange-500/20"
                  >
                    <span className="transform group-hover:scale-110 transition-transform">
                      {item === "Mint NFT" && <Gem className="w-4 h-4 mr-2" />}
                      {item === "IDO" && <BadgeDollarSign className="w-4 h-4 mr-2" />}
                      {item === "Swap" && <CircleDot className="w-4 h-4 mr-2" />}
                    </span>
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <ConnectButton className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 px-6 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-orange-500/30 transform hover:scale-105" />
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
              {["Mint NFT", "IDO", "Swap"].map((item) => (
                <Link
                  key={item}
                  to={item === "Mint NFT" ? "/" : item === "IDO" ? "/ido" : "/swap"}
                  className="text-orange-50 hover:bg-orange-500/20 block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-orange-500/30"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="pt-2 pb-3 border-t border-orange-500/20">
              <div className="px-3">
                <ConnectButton className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-orange-500/30" />
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;