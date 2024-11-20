import React, { useState, useEffect } from 'react';
import Navbar from '~/navbar';
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";

const Pool = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const wallet = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  const [isCreatingPool, setIsCreatingPool] = useState(false);
  const [isRemovingLiquidity, setIsRemovingLiquidity] = useState(false);
  const [coinX, setCoinX] = useState('');
  const [coinY, setCoinY] = useState('');
  const [poolId, setPoolId] = useState('');
  const [lpTokenId, setLpTokenId] = useState('');
  const [feeBps, setFeeBps] = useState(10);
  const [walletCoins, setWalletCoins] = useState([]);

  useEffect(() => {
    if (wallet.connected) {
      fetchWalletCoins();
    }
  }, [wallet.connected]);

  const fetchWalletCoins = async () => {
    try {
      // Assuming wallet.getCoins() is a method to fetch coins from the connected wallet
      const coins = await wallet.getCoins();
      setWalletCoins(coins);
    } catch (error) {
      console.error('Error fetching wallet coins:', error);
    }
  };

  async function addLiquidity() {
    if (!wallet.connected) return;

    setIsAddingLiquidity(true);
    const tx = new TransactionBlock();
    const packageObjectId = "0x0068cf62444d032fcbcef8c0f1e493d3fd3b05f1e18954adc8606b6fa95cd431";

    tx.moveCall({
      target: `${packageObjectId}::dex::add_liquidity`,
      arguments: [
        tx.object(poolId),
        tx.pure(coinX),
        tx.pure(coinY),
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('successfully!', resData);
      alert('Liquidity added successfully');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsAddingLiquidity(false);
    }
  }

  async function createPool() {
    if (!wallet.connected) return;

    setIsCreatingPool(true);
    const tx = new TransactionBlock();
    const packageObjectId = "0x0068cf62444d032fcbcef8c0f1e493d3fd3b05f1e18954adc8606b6fa95cd431";

    tx.moveCall({
      target: `${packageObjectId}::dex::create_pool`,
      arguments: [
        tx.pure(feeBps),
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('successfully!', resData);
      alert('Pool created successfully');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsCreatingPool(false);
    }
  }

  async function removeLiquidity() {
    if (!wallet.connected) return;

    setIsRemovingLiquidity(true);
    const tx = new TransactionBlock();
    const packageObjectId = "0x0068cf62444d032fcbcef8c0f1e493d3fd3b05f1e18954adc8606b6fa95cd431";

    tx.moveCall({
      target: `${packageObjectId}::dex::remove_liquidity`,
      arguments: [
        tx.object(poolId),
        tx.object(lpTokenId),
      ],
    });

    try {
      const resData = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
      console.log('successfully!', resData);
      alert('Liquidity removed successfully');
    } catch (e) {
      console.error('failed', e);
      setError('Transaction failed. Please try again.');
    } finally {
      setIsRemovingLiquidity(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <div className="max-w-lg mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Liquidity Pool</h1>

        {wallet.connected ? (
          <>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Create Pool</h2>
              <input
                type="number"
                value={feeBps}
                onChange={(e) => setFeeBps(Number(e.target.value))}
                placeholder="Fee (bps)"
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              />
              <button onClick={createPool} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full transition duration-300">
                {isCreatingPool ? 'Creating...' : 'Create Pool'}
              </button>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6 mt-8">
              <h2 className="text-xl font-semibold">Add Liquidity</h2>
              <input
                type="text"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                placeholder="Pool ID"
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              />
              <select
                value={coinX}
                onChange={(e) => setCoinX(e.target.value)}
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              >
                <option value="">Select Coin X</option>
                {walletCoins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name}
                  </option>
                ))}
              </select>
              <select
                value={coinY}
                onChange={(e) => setCoinY(e.target.value)}
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              >
                <option value="">Select Coin Y</option>
                {walletCoins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.symbol} - {coin.name}
                  </option>
                ))}
              </select>
              <button onClick={addLiquidity} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded w-full transition duration-300">
                {isAddingLiquidity ? 'Adding...' : 'Add Liquidity'}
              </button>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-xl p-6 space-y-6 mt-8">
              <h2 className="text-xl font-semibold">Remove Liquidity</h2>
              <input
                type="text"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value)}
                placeholder="Pool ID"
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              />
              <input
                type="text"
                value={lpTokenId}
                onChange={(e) => setLpTokenId(e.target.value)}
                placeholder="LP Token ID"
                className="border p-2 rounded mb-2 w-full bg-gray-800 text-white"
              />
              <button onClick={removeLiquidity} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded w-full transition duration-300">
                {isRemovingLiquidity ? 'Removing...' : 'Remove Liquidity'}
              </button>
            </div>
          </>
        ) : (
          <ConnectButton className="w-full bg-purple-500 hover:bg-purple-600 text-white p-2 rounded transition duration-300">
            Connect Wallet
          </ConnectButton>
        )}

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pool;
