import React, { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { ConnectButton } from "@suiet/wallet-kit";
import { Menu, X, Home, Info, Mail } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "Kanari Sell" },
    { name: "description", content: "ICO" },
  ];
};

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <nav className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-28">
            <div className="flex items-center">
              <a href="#" className="flex-shrink-0">
                <img className="h-8 w-auto" src="/api/placeholder/32/32" alt="Logo" />
              </a>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <a href="#home" className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </a>
                  <a href="#about" className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    About
                  </a>
                  <a href="#contact" className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:block">
                <ConnectButton className="bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-4 py-2 rounded-full text-sm font-medium shadow-md" />
              </div>
              <div className="md:hidden flex items-center">
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
              <a href="#home" className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium transition duration-300">Home</a>
              <a href="#about" className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium transition duration-300">About</a>
              <a href="#contact" className="text-white hover:bg-white hover:bg-opacity-20 block px-3 py-2 rounded-md text-base font-medium transition duration-300">Contact</a>
            </div>
            <div className="pt-4 pb-3 border-t border-white border-opacity-20">
              <div className="px-2">
                <ConnectButton className="w-full bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-4 py-2 rounded-full text-sm font-medium shadow-md" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-white border-opacity-20 rounded-lg h-96 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white text-center">Welcome to Kanari Sell ICO</h1>
          </div>
        </div>
      </main>
    </div>
  );
}