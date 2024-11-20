import React, { useState } from 'react';
import Navbar from '~/navbar';

const IDOSale: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-3xl font-bold">IDO Sale</h1>
            </div>
        </div>
    </div>
  );
};

export default IDOSale;