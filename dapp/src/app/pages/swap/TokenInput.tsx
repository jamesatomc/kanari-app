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
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium cyber-text">{label}</label>
          {balance && (
            <span className="text-xs text-[var(--cyber-muted)] flex items-center">
              <span className="mr-1">Balance:</span> 
              <span className="font-medium">{parseFloat(balance).toFixed(6)} {selectedToken}</span>
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          {/* Token Selector */}
          <div className="relative sm:w-1/3">
            <button
              className="w-full flex justify-between items-center px-3 py-2.5 
                bg-[var(--cyber-card-bg)] border border-[var(--cyber-border)] rounded-sm text-[var(--cyber-foreground)]
                hover:bg-[var(--cyber-card-bg)]/80 transition-all duration-200 text-sm sm:text-base"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedTokenData ? (
                <div className="flex items-center">
                  <img src={selectedTokenData.image} alt={selectedTokenData.name} className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  <span>{selectedTokenData.symbol}</span>
                </div>
              ) : (
                <span>Select Token</span>
              )}
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-[var(--cyber-primary)]" />
            </button>
            
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute z-20 w-full sm:w-56 mt-1 bg-[var(--cyber-card-bg)] backdrop-blur-lg rounded-sm border border-[var(--cyber-border)] shadow-xl max-h-52 overflow-y-auto">
                <ul className="py-1">
                  {availableTokens.map((token) => (
                    <li
                      key={token.symbol}
                      className="px-3 py-2.5 hover:bg-[var(--cyber-primary)]/10 active:bg-[var(--cyber-primary)]/20 
                        cursor-pointer text-[var(--cyber-foreground)] flex items-center text-sm sm:text-base"
                      onClick={() => {
                        onSelectToken(token.symbol);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <img src={token.image} alt={token.name} className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                      <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-xs text-[var(--cyber-muted)]">{token.name}</span>
                      </div>
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
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full px-3 py-2.5 bg-[var(--cyber-card-bg)] rounded-sm text-[var(--cyber-foreground)] 
                  placeholder-[var(--cyber-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--cyber-primary)] 
                  border border-[var(--cyber-border)] text-base
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
              />
              {showBalanceButtons && balance && (
                <div className="flex border-l border-[var(--cyber-border)]">
                  <button
                    onClick={handleSetHalf}
                    className="px-2 sm:px-3 py-2.5 bg-[var(--cyber-card-bg)] hover:bg-[var(--cyber-primary)]/20 
                      text-[var(--cyber-primary)] text-xs sm:text-sm font-medium transition-colors duration-200"
                  >
                    50%
                  </button>
                  <button
                    onClick={handleSetMax}
                    className="px-2 sm:px-3 py-2.5 bg-[var(--cyber-card-bg)] hover:bg-[var(--cyber-primary)]/20 
                      text-[var(--cyber-primary)] text-xs sm:text-sm font-medium rounded-sm border-l 
                      border-[var(--cyber-border)] transition-colors duration-200"
                  >
                    MAX
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
  
        {tokenPrice && (
          <div className="text-xs text-[var(--cyber-muted)]">
            1 {selectedToken} = ${tokenPrice.toFixed(2)} USD
          </div>
        )}
      </div>
    );
  };

export default TokenInput;