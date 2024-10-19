'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';
import { any } from 'prop-types';
import { publicKey } from '@metaplex-foundation/umi';
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faHome, faLink } from '@fortawesome/free-solid-svg-icons';
import { das } from '@metaplex-foundation/mpl-core-das';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

interface Attribute {
  key: string;
  value: string;
}

const Loty = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [tradeableAll, setTradeableAll] = useState<any[]>([]);

  const wallet = useWallet();
  const umi = createUmi('https://api.devnet.solana.com')
    .use(walletAdapterIdentity(wallet))
    .use(dasApi());

  const handleFetchTradeableClick = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!wallet || !wallet.publicKey) {
      console.error('Wallet not connected or public key unavailable');
      return;
    }

    try {
      // Fetch all tradeable assets
      const assets = await das.searchAssets(umi, {
        creator: publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w"),
      });
      // Sort assets by the creation date
      const sortedAssets = assets.sort((a, b) => {
        const dateA = new Date(a.name); // Assuming "name" is the creation date
        const dateB = new Date(b.name);
        return dateB.getTime() - dateA.getTime(); // Sort in descending order
      });
      console.log(sortedAssets);
      setTradeableAll(sortedAssets);
    } catch (error) {
      console.error("Error fetching collection:", error);
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
        <div className="container mx-auto mt-10 px-4 sm:px-0">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4 opacity-50 text-center">Lot-y</h1>
            <h2 className="text-xl font-semibold mb-4 text-center opacity-80">Sanctuary for All</h2>
            <ConnectWallet />
            <button
              onClick={handleFetchTradeableClick}
              className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!wallet || !wallet.publicKey}
            >
              Show all tradeable Lotl NFTs
            </button>
            <div className="p-4">
              <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {tradeableAll.length > 0 ? (
                  tradeableAll.map((asset, index) => {
                    const imageUrl = asset.attributes?.attributeList?.find((attr: Attribute) => attr.key === 'image')?.value;
                    return (
                      <div key={asset.publicKey} className='bg-white-100 rounded-lg p-4 shadow'>
                        <h2 className='text-md opacity-50 mb-2'>{asset.name}</h2>
                        {imageUrl ? (
                          <img
                            onClick={() => setSelectedImage(imageUrl)}
                            width={150}
                            height={150}
                            src={imageUrl}
                            className='rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105'
                            alt="NFTImage"
                          />
                        ) : (
                          <p>No image available</p>
                        )}

                        <div className="mt-2 flex items-start space-x-1">
                          <button
                            onClick={() => window.open(`https://xray.helius.xyz/token/${asset.publicKey}?network=devnet`, '_blank')}
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faHome} className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => window.open(`https://magiceden.io/item-details/${asset.publicKey}`, '_blank')}
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faLink} className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className='col-span-2'>Click a button! <br /> Check if your wallet is connected!</p>
                )}
              </div>
              {selectedImage && (
                <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
                  <div className='relative'>
                    <img
                      src={selectedImage}
                      alt="Zoomed NFT"
                      className='max-w-full max-h-full'
                    />
                    <button
                      onClick={closeModal}
                      className='absolute top-2 right-2 bg-white text-black rounded-full p-1 hover:bg-gray-300'
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loty;