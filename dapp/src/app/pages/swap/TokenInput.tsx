// TokenInput.tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

  interface Token {
    symbol: string;
    name: string;
    image: string;
  }
  
  interface TokenInputProps {
    label: string;
    selectedToken: string;
    onSelectToken: (token: string) => void;
    amount: string;
    onAmountChange: (amount: string) => void;
    tokenPrice?: number;
    error?: string | null;
    setError: (error: string | null) => void;
    balance?: string;
    showBalanceButtons?: boolean;
  }

  const availableTokens = [
    { name: 'Sui', symbol: 'SUI', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png', contract: '0x2::sui::SUI' },
    { name: 'USDCoin', symbol: 'USDC', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png', contract: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC' },
  ];
  
  // TokenInput.tsx
  export const TokenInput: React.FC<TokenInputProps> = ({
    label,
    selectedToken,
    onSelectToken,
    amount,
    onAmountChange,
    tokenPrice,
    setError,
    balance,
    showBalanceButtons = false,
  }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    // Handle amount change and validate input
    const handleAmountChange = (value: string) => {
      if (value === '' || parseFloat(value) >= 0) {
        setError(null);
        onAmountChange(value);
      } else {
        setError('Amount must be a positive number');
      }
    };
  
    const handleSetHalf = () => {
      if (balance) {
        const halfAmount = (parseFloat(balance) / 2).toString();
        onAmountChange(halfAmount);
      }
    };
  
    const handleSetMax = () => {
      if (balance) {
        onAmountChange(balance);
      }
    };
  
  
    const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);
  
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-200">{label}</label>
          {balance && (
            <span className="text-xs text-gray-400">
              Balance: {parseFloat(balance).toFixed(6)} {selectedToken}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          {/* Token Selector */}
          <div className="relative sm:w-1/3">
            <button
              className="w-full flex justify-between items-center px-4 py-2.5 
                bg-white/10 border border-orange-500/20 rounded-xl text-white
                hover:bg-white/20 transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedTokenData ? (
                <div className="flex items-center">
                  <img src={selectedTokenData.image} alt={selectedTokenData.name} className="h-6 w-6 mr-2" />
                  <span>{selectedTokenData.symbol}</span>
                </div>
              ) : (
                <span>Select Token</span>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {/* Dropdown remains the same */}
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg rounded-xl border border-orange-500/20 shadow-lg max-h-60 overflow-y-auto">
                <ul className="py-1">
                  {availableTokens.map((token) => (
                    <li
                      key={token.symbol}
                      className="px-4 py-2.5 hover:bg-orange-500/10 cursor-pointer text-white flex items-center"
                      onClick={() => {
                        onSelectToken(token.symbol);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img src={token.image} alt={token.name} className="h-6 w-6 mr-2" />
                      {token.symbol} - {token.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
  
          {/* Input Group */}
          <div className="sm:flex-1">
            <div className="flex">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 rounded-l-xl text-white 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                  border border-orange-500/20
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
              />
              {showBalanceButtons && balance && (
                <div className="flex border-l border-orange-500/20">
                  <button
                    onClick={handleSetHalf}
                    className="px-3 py-2.5 bg-white/10 hover:bg-orange-500/20 
                      text-orange-400 text-sm font-medium transition-colors duration-200"
                  >
                    50%
                  </button>
                  <button
                    onClick={handleSetMax}
                    className="px-3 py-2.5 bg-white/10 hover:bg-orange-500/20 
                      text-orange-400 text-sm font-medium rounded-r-xl border-l 
                      border-orange-500/20 transition-colors duration-200"
                  >
                    MAX
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {tokenPrice && (
          <div className="text-sm text-gray-400">
            1 {selectedToken} = ${tokenPrice.toFixed(2)} USD
          </div>
        )}
      </div>
    );
  };

export default TokenInput;