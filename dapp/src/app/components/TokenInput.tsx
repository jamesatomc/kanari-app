// components/TokenInput.tsx
import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const availableTokens = [
  { name: 'Sui', symbol: 'SUI', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png' },
  { name: 'USDCoin', symbol: 'USDC', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' },
];

interface TokenInputProps {
  label: string;
  selectedToken: string;
  onSelectToken: (token: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  tokenPrice?: number;
  error?: string | null;
  setError: (error: string | null) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  tokenPrice,
  error,
  setError,
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

  const handleAmountChange = (value: string) => {
    if (value === '' || parseFloat(value) >= 0) {
      setError(null);
      onAmountChange(value);
    } else {
      setError('Amount must be a positive number');
    }
  };

  const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-200">{label}</label>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative flex-1">
          <button
            className="w-full flex justify-between items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedTokenData ? (
              <div className="flex items-center">
                <img 
                  src={selectedTokenData.image} 
                  alt={selectedTokenData.name} 
                  className="h-6 w-6 mr-2 rounded-full"
                />
                <span>{selectedTokenData.symbol}</span>
              </div>
            ) : (
              <span>Select Token</span>
            )}
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden"
            >
              <ul className="py-1">
                {availableTokens.map((token) => (
                  <li
                    key={token.symbol}
                    className="px-4 py-2 hover:bg-white/5 cursor-pointer text-white flex items-center"
                    onClick={() => {
                      onSelectToken(token.symbol);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <img 
                      src={token.image} 
                      alt={token.name} 
                      className="h-6 w-6 mr-2 rounded-full"
                    />
                    {token.symbol} - {token.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {tokenPrice && (
        <div className="text-sm text-gray-300">
          1 {selectedToken} = ${tokenPrice.toFixed(2)} USD
        </div>
      )}
    </div>
  );
};

export default TokenInput;