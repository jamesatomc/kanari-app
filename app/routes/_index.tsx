import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { ConnectButton } from "@suiet/wallet-kit";

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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-orange-500 p-4">
        <div className="flex justify-between items-center">
          <div className="text-white text-lg">Brand</div>
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex space-x-4">
            <a href="#home" className="text-white hover:text-gray-200">Home</a>
            <a href="#about" className="text-white hover:text-gray-200">About</a>
            <a href="#contact" className="text-white hover:text-gray-200">Contact</a>
          </div>
          <div className="hidden lg:block">
            <ConnectButton />
          </div>
        </div>
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <a href="#home" className="block text-white hover:text-gray-200 mt-4">Home</a>
          <a href="#about" className="block text-white hover:text-gray-200 mt-4">About</a>
          <a href="#contact" className="block text-white hover:text-gray-200 mt-4">Contact</a>
          <div className="mt-4">
            <ConnectButton />
          </div>
        </div>
      </nav>
    </div>
  );
}
