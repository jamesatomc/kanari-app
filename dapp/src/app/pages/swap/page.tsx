'use client';

import { useEffect, useState } from 'react';
import { ArrowDownUp, Loader } from 'lucide-react';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Transaction } from "@mysten/sui/transactions";
import axios from 'axios';
import TokenInput from './TokenInput';


export default function Swap() {
  const [tokenFrom, setTokenFrom] = useState('SUI');
  const [tokenTo, setTokenTo] = useState('USDC');
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});

  const wallet = useWallet();


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
    const tx = new Transaction();
    // Set the sender of the transaction
    const packageObjectId = "0x609c115685a74836cf97ab74fddec5892162d0c5599a80beece772a1ab6ce65a";
    // Call the swap_tokens function on the swap package
    tx.moveCall({
      target: `${packageObjectId}::swap::swap_tokens`,
      arguments: [
        tx.pure.string(tokenFrom),
        tx.pure.string(tokenTo),
        tx.pure.string(amountFrom),
        tx.pure.string(amountTo),
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransaction({
        transaction: tx,
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


  // At the top of your Swap component, add balances state
  const [balances, setBalances] = useState<{ [key: string]: string }>({
    SUI: '1000.00',  // Mock balance
    USDC: '500.00'   // Mock balance
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div>


      <main className="">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center">
            Token <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Swap</span>
          </h1>

          <div className="flex justify-center items-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-orange-200/20 dark:border-white/10">
              <div className="space-y-6 flex flex-col items-center w-full">

              
                <TokenInput
                  label="From"
                  selectedToken={tokenFrom}
                  onSelectToken={setTokenFrom}
                  amount={amountFrom}
                  onAmountChange={handleAmountFromChange}
                  tokenPrice={tokenPrices[tokenFrom]}
                  error={error}
                  setError={setError}
                  balance={balances[tokenFrom]}
                  showBalanceButtons={true}
                />
              
                <div className="flex justify-center -my-3 relative z-10">
                  <button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 
                      hover:from-orange-600 hover:to-orange-700 text-white 
                      rounded-full p-2.5 transition-all duration-300 
                      shadow-lg hover:shadow-orange-500/30 
                      hover:scale-110 active:scale-95
                      border border-orange-500/20"
                    onClick={() => {
                      setTokenFrom(tokenTo);
                      setTokenTo(tokenFrom);
                      setAmountFrom(amountTo);
                      setAmountTo(amountFrom);
                    }}
                  >
                    <ArrowDownUp className="h-5 w-5 transition-transform hover:rotate-180" />
                  </button>
                </div>
              
                <TokenInput
                  label="To"
                  selectedToken={tokenTo}
                  onSelectToken={setTokenTo}
                  amount={amountTo}
                  onAmountChange={setAmountTo}
                  tokenPrice={tokenPrices[tokenTo]}
                  error={error}
                  setError={setError}
                  balance={balances[tokenTo]}
                  showBalanceButtons={false}
                />

                <div className="w-full flex justify-center pt-4">
                  {wallet.connected ? (
                    <button
                      className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center justify-center w-full md:w-auto ${isSwapping ? "opacity-50 cursor-not-allowed" : ""} hover:shadow-orange-500/30`}
                      onClick={swap}
                      disabled={isSwapping}
                    >
                      {isSwapping ? (
                        <>
                          <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Swapping...
                        </>
                      ) : (
                        "Swap Tokens"
                      )}
                    </button>
                  ) : (
                    <ConnectButton
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition duration-300 px-8 py-4 rounded-full text-lg font-semibold shadow-lg w-full md:w-auto hover:shadow-orange-500/30"
                    />
                  )}
                </div>

                {error && (
                  <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mt-4 text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}



