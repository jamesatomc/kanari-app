'use client'; 
import Navbar from "@/app/components/Navbar";
import { useEffect, useRef, useState } from 'react';
import { ArrowDownUp, ChevronDown, Loader } from 'lucide-react';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import axios from 'axios';

const availableTokens = [
  { name: 'Sui', symbol: 'SUI', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/20947.png', contract: '0x2::sui::SUI' },
  { name: 'USDCoin', symbol: 'USDC', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png', contract: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC' },
];

export default function Swap() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tokenFrom, setTokenFrom] = useState('SUI');
  const [tokenTo, setTokenTo] = useState('USDC');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{[key: string]: number}>({});

  const wallet = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    fetchTokenPrices();
    const interval = setInterval(fetchTokenPrices, 60000); // Update prices every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tokenFrom && tokenTo && amountFrom && tokenPrices[tokenFrom] && tokenPrices[tokenTo]) {
      calculateAmountTo(tokenFrom, tokenTo, amountFrom);
    }
  }, [tokenFrom, tokenTo, amountFrom, tokenPrices]);

  const fetchTokenPrices = async () => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=sui,usd-coin&vs_currencies=usd`);
      setTokenPrices({
        SUI: response.data.sui.usd,
        USDC: response.data['usd-coin'].usd
      });
    } catch (error) {
      console.error('Error fetching token prices:', error);
    }
  };

  const calculateAmountTo = (from: string, to: string, amount: string) => {
    const fromPrice = tokenPrices[from];
    const toPrice = tokenPrices[to];
    if (fromPrice && toPrice) {
      const calculatedAmountTo = (parseFloat(amount) * fromPrice) / toPrice;
      setAmountTo(calculatedAmountTo.toFixed(6));
    }
  };

  const handleAmountFromChange = (value: string) => {
    setAmountFrom(value);
    if (tokenFrom && tokenTo && tokenPrices[tokenFrom] && tokenPrices[tokenTo]) {
      calculateAmountTo(tokenFrom, tokenTo, value);
    }
  };

  async function swap() {
    if (!wallet.connected) return;

    setIsSwapping(true);
    // Create a new transaction block
    const tx = new TransactionBlock();
    // Set the sender of the transaction
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";
    // Call the swap_tokens function on the swap package
    tx.moveCall({
      target: `${packageObjectId}::swap::swap_tokens`,
      arguments: [
        tx.pure(tokenFrom),
        tx.pure(tokenTo),
        tx.pure(amountFrom),
        tx.pure(amountTo),
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('successfully!', resData);
      alert('Swap successful');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  }

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="px-4 pt-4">
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
              onAmountChange={handleAmountFromChange}
              tokenPrice={tokenPrices[tokenFrom]}
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
              tokenPrice={tokenPrices[tokenTo]}
            />
          </div>

          {wallet.connected ? (
            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition duration-300 flex items-center justify-center"
              onClick={swap}
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


// TokenInput.tsx
interface TokenInputProps {
  label: string;
  selectedToken: string;
  onSelectToken: (token: string) => void;
  amount: string;
  onAmountChange: (amount: string) => void;
  tokenPrice: number | undefined;
}

// TokenInput.tsx
const TokenInput: React.FC<TokenInputProps> = ({
  label,
  selectedToken,
  onSelectToken,
  amount,
  onAmountChange,
  tokenPrice,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
          onChange={(e) => handleAmountChange(e.target.value)}
          className="flex-1 px-4 py-2 bg-white bg-opacity-10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      {/* {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )} */}
      {tokenPrice && (
        <div className="text-sm text-gray-300">
          1 {selectedToken} = ${tokenPrice.toFixed(2)} USD
        </div>
      )}
    </div>
  );
};