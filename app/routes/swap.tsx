import { useEffect, useRef, useState } from 'react';
import { ArrowDownUp, ChevronDown, Loader } from 'lucide-react';
import Navbar from '~/navbar';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";

export default function Swap() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tokenFrom, setTokenFrom] = useState('');
  const [tokenTo, setTokenTo] = useState('');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wallet = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSwap = async () => {
    setError(null);
    setIsSwapping(true);
    try {
      // Your swap logic here
      // For example:
      // await performSwap(tokenFrom, tokenTo, amountFrom, amountTo);
      console.log('Swapping', amountFrom, tokenFrom, 'for', amountTo, tokenTo);
      // Simulating a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      setError("An error occurred during the swap.");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />

      <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Token Swap</h1>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6">
          <div className="space-y-4">
            <TokenInput
              label="From"
              selectedToken={tokenFrom}
              onSelectToken={setTokenFrom}
              amount={amountFrom}
              onAmountChange={setAmountFrom}
            />
            <div className="flex justify-center">
              <button
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 transition duration-300"
                onClick={() => {
                  setTokenFrom(tokenTo);
                  setTokenTo(tokenFrom);
                  setAmountFrom(amountTo);
                  setAmountTo(amountFrom);
                }}
              >
                <ArrowDownUp className="h-6 w-6" />
              </button>
            </div>
            <TokenInput
              label="To"
              selectedToken={tokenTo}
              onSelectToken={setTokenTo}
              amount={amountTo}
              onAmountChange={setAmountTo}
            />
          </div>

          {wallet.connected ? (
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300 flex items-center justify-center"
              onClick={handleSwap}
              disabled={isSwapping}
            >
              {isSwapping ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Swapping...
                </>
              ) : (
                "Swap"
              )}
            </button>
          ) : (
            <ConnectButton
              className="w-full bg-white text-purple-600 hover:bg-purple-100 transition duration-300 px-8 py-3 rounded-xl text-lg font-semibold shadow-lg"
            />
          )}

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TokenInputProps {
  label: string;
  selectedToken: string;
  onSelectToken: (token: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
}

const availableTokens = [
  { name: 'Sui', symbol: 'SUI', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png' },
  { name: 'Bitcoin', symbol: 'BTC', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
  { name: 'USDCircle', symbol: 'USDC', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' },
];

const TokenInput: React.FC<TokenInputProps> = ({
  label,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
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

  const selectedTokenData = availableTokens.find(token => token.symbol === selectedToken);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">{label}</label>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative flex-1">
          <button
            className="w-full flex justify-between items-center px-4 py-2 bg-white bg-opacity-10 border border-gray-300 rounded-md text-white"
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
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <ul className="py-1">
                {availableTokens.map((token) => (
                  <li
                    key={token.symbol}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex items-center"
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
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-white bg-opacity-10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );
};