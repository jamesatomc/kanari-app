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
    <div className="space-y-3">
      {/* Header with label and balance */}
      <div className="flex justify-between items-center px-1">
        <label className="text-sm font-bold">
          <span className="bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-secondary)] bg-clip-text text-transparent">
            {label}
          </span>
        </label>
        {balance && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[var(--cyber-muted)]">Balance:</span>
            <span className="text-xs font-medium bg-[var(--cyber-card-bg)]/70 px-2.5 py-1 rounded-full border border-[var(--cyber-border)]/30">
              {parseFloat(balance).toFixed(4)} {selectedToken}
            </span>
          </div>
        )}
      </div>
      
      {/* Main input container */}
      <div className="relative p-4 bg-[var(--cyber-card-bg)]/80 backdrop-blur-sm border-2 border-[var(--cyber-border)]/70 rounded-2xl hover:shadow-md transition-all duration-300">
        <div className="flex flex-col space-y-3">
          {/* Token selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 px-3 py-2 bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)]/60 rounded-xl hover:bg-[var(--cyber-card-bg)]/90 transition-all duration-200 shadow-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedTokenData && (
                <img 
                  src={selectedTokenData.image} 
                  alt={selectedTokenData.name} 
                  className="h-6 w-6 rounded-full border border-[var(--cyber-border)]/30"
                />
              )}
              <span className="font-medium">{selectedToken}</span>
              <ChevronDown className="h-4 w-4 text-[var(--cyber-primary)]" />
            </button>
            
            {isDropdownOpen && (
              <div 
                ref={dropdownRef} 
                className="absolute z-20 w-56 mt-2 bg-[var(--cyber-card-bg)] backdrop-blur-lg rounded-xl border border-[var(--cyber-border)]/70 shadow-xl max-h-52 overflow-y-auto"
              >
                <div className="py-2 px-3 text-xs font-bold text-[var(--cyber-muted)] border-b border-[var(--cyber-border)]/30">
                  Select Token
                </div>
                <ul className="py-2">
                  {availableTokens.map((token) => (
                    <li
                      key={token.symbol}
                      className="mx-2 my-1 px-3 py-2 hover:bg-[var(--cyber-primary)]/10 cursor-pointer flex items-center text-sm rounded-lg transition-all duration-200"
                      onClick={() => {
                        onSelectToken(token.symbol);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img 
                        src={token.image} 
                        alt={token.name} 
                        className="h-7 w-7 mr-3 rounded-full border border-[var(--cyber-border)]/30"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold">{token.symbol}</span>
                        <span className="text-xs text-[var(--cyber-muted)]">{token.name}</span>
                      </div>
                      {token.symbol === selectedToken && (
                        <div className="w-4 h-4 ml-auto rounded-full bg-[var(--cyber-accent)]"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amount input */}
          <div className="w-full">
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full text-2xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 placeholder-[var(--cyber-muted)]/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {tokenPrice && (
              <div className="text-xs text-[var(--cyber-muted)] mt-1">
                ≈ ${(parseFloat(amount || '0') * tokenPrice).toFixed(2)} USD
              </div>
            )}
          </div>

          {/* Balance buttons */}
          <div className="flex justify-end">
            {showBalanceButtons && balance && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSetHalf}
                  className="px-2.5 py-1.5 bg-[var(--cyber-primary)]/10 hover:bg-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] text-xs font-medium rounded-lg border border-[var(--cyber-primary)]/30 
                    transition-all duration-200"
                >
                  50%
                </button>
                <button
                  onClick={handleSetMax}
                  className="px-2.5 py-1.5 bg-[var(--cyber-primary)]/10 hover:bg-[var(--cyber-primary)]/20 
                    text-[var(--cyber-primary)] text-xs font-medium rounded-lg border border-[var(--cyber-primary)]/30
                    transition-all duration-200"
                >
                  MAX
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInput;