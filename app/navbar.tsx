import React from "react";
import { Link } from 'react-router-dom';
import { Home, Info, Mail, Menu, X } from "lucide-react";
import { ConnectButton } from "@suiet/wallet-kit";

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0">
              <img className="h-10 w-10" src="https://magenta-able-pheasant-388.mypinata.cloud/ipfs/QmQhKs9WeVy5MxbChEQJrX37Unb6dktZXrYZuy6uVofQwC/Logo.png" alt="Kanari Sell Logo" />
            </a>
            <div className="hidden md:flex ml-10 items-baseline space-x-4">
              {["Mint NFT", "Bun IDO", "Swap"].map((item) => (
                <Link
                  key={item}
                  to={
                    item === "Mint NFT"
                      ? "/"
                      : item === "Bun IDO"
                        ? "/bun-ido"
                        : "/swap"
                  }
                  className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center"
                >
                  {item === "Mint NFT" && <Home className="w-4 h-4 mr-2" />}
                  {item === "Bun IDO" && <Info className="w-4 h-4 mr-2" />}
                  {item === "Swap" && <Mail className="w-4 h-4 mr-2" />}
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <ConnectButton className="bg-white text-purple-600 hover:bg-purple-100 transition duration-300 py-2 rounded-full text-sm font-medium shadow-md" />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none transition duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["Mint NFT", "Bun IDO", "Swap"].map((item) => (
              <Link
                key={item}
                to={
                  item === "Mint NFT"
                    ? "/"
                    : item === "Bun IDO"
                      ? "/bun-ido"
                      : "/swap"
                }
                className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-white border-opacity-20">
            <div className="px-2">
              <ConnectButton className="w-full bg-white text-purple-600 hover:bg-purple-100 transition duration-300  py-2 rounded-full text-sm font-medium shadow-md" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;