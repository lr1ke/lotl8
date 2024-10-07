'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { any } from 'prop-types';
import { fetchCollection, fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey} from '@metaplex-foundation/umi';
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faHome, faLink } from '@fortawesome/free-solid-svg-icons';



interface Collection {
  currentSize: number;
  key: number;
  name: string;
  numMinted: number;
  publicKey: string;
  updateAuthority: string;
  uri: string;
}

interface NftAsset {
  name: string;
  owner: string;
  nftPic: string | null;
  datum: string | null;
  basisPoints: number | null; // Either a number for royalties or null if no royalties
  assetPk: string
}



const Loty = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null); //für zoom    // const [owner, setOwner] = React.useState<string>("");
    const [nftAssets, setNftAssets] = useState<NftAsset[]>([]);
    const [collectionAll, setCollectionAll] = useState<Collection | null>(null);
    const [selectedNft, setSelectedNft] = useState<NftAsset | null>(null);  // To track the selected NFT


    const wallet = useWallet();
    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));

    // Fetch collection props as number minted when the page loads
    useEffect(() => {
      const fetchCollectionData = async () => {
          const collectionId = umiPublicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");
          try {
              const collection = await fetchCollection(umi, collectionId);
              setCollectionAll(collection);
          } catch (error) {
              console.error('Error fetching collection:', error);
          }
      };     
      // Only fetch if the wallet is connected
      if (wallet && wallet.publicKey && !collectionAll) {
          fetchCollectionData();
      }
  }, [wallet, umi, collectionAll]);


      // Handle the click on the "Detail" button
      const handleShowDetails = (nft: NftAsset) => {
        setSelectedNft(nft);  // Set the selected NFT
    };


  const handleFetchAllClick = async () => {
    // Ensure wallet is connected
    if (!wallet || !wallet.publicKey) {
        console.error('Wallet not connected or public key unavailable');
        return;
    }

    // Collection ID (replace with your actual collection public key)
    const collectionId = umiPublicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");

    try {
        // Fetch all assets from the collection
        const assetsInCollection = await fetchAssetsByCollection(umi, collectionId, {
            skipDerivePlugins: false,
        });

        // Map through the fetched assets and extract necessary information
        const fetchedAssets = assetsInCollection.map(asset => {
            const imageAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'image');
            const nftPic = imageAttr ? imageAttr.value : null;
            const datumAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'datum');
            const datum = datumAttr ? datumAttr.value : null;
            const basisPoints = asset.royalties?.basisPoints ?? null;
            const assetPk = asset.publicKey;


            return {
                name: asset.name,
                owner: asset.owner,
                nftPic,
                datum,
                basisPoints,
                assetPk
            };
        });

        // Update the state with the fetched assets
        setNftAssets(fetchedAssets);
        console.log('Fetched assets:', fetchedAssets);
    } catch (error) {
        console.error('Error fetching assets from collection:', error);
    }
};


    // for image zoom out
    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialised">
                <div className="container mx-auto mt-10 px-4 sm:px-0">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold mb-4 opacity-50 text-center">Lot-y</h1>
                        <h2 className="text-xl font-semibold mb-4 text-center opacity-80"> Sanctuary for All</h2>
                        <h3 className="text-sm mb-8 text-center opacity-50"> current collection size: {collectionAll?.currentSize}</h3>

                        <ConnectWallet />

                        <div className="p-4">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <button
                              onClick={handleFetchAllClick}
                              className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              disabled={!wallet || !wallet.publicKey}
                            >
                              Show all 
                            </button>
                            <button
                              onClick={handleFetchAllClick}
                              className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              disabled={!wallet || !wallet.publicKey}
                            >
                              Only Soulbound NFTs
                            </button>
                            <button
                              onClick={handleFetchAllClick}
                              className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              disabled={!wallet || !wallet.publicKey}
                            >
                              Only tradeable NFTs
                            </button>
                          </div>

                          <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                          {nftAssets.length > 0 ? (
                                    nftAssets.map((nft, index) => (
                                <div key={nft.assetPk} className='bg-white-100 rounded-lg p-4 shadow'>
                                  <h2 className='text-md opacity-50 mb-2'>{nft.datum}</h2>

                                  {nft.nftPic ? (
                                    <img
                                      onClick={() => setSelectedImage(nft.nftPic)}
                                      width={150}
                                      height={150}
                                      src={nft.nftPic}
                                      className='rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105'
                                      alt="NFTImage"
                                    />
                                  ) : (
                                    <p>No image available</p>
                                  )}

                          <div className="mt-2 flex items-start space-x-1">
                          
                          <button
                            onClick={() => window.open(`https://xray.helius.xyz/token/${nft.assetPk}?network=devnet`, '_blank')}
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-gray-500" />
                          </button>
                            <button
                              onClick={() => console.log(`Owner: ${nft.owner}`)}
                              className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacitiy-50"
                            >
                              <FontAwesomeIcon icon={faHome} className="h-4 w-4 text-grey-500" />
                            </button>
                            <button
                            onClick={() => window.open(`https://magiceden.io/item-details/${nft.assetPk}`, '_blank')}
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faLink} className="h-4 w-4 text-gray-500" />
                          </button>

                          </div>
                                </div>
                              ))
                            ) : (
                              <p className='col-span-2 '>Click a button! <br/> Check if your wallet is connected!</p>
                            )}
                          </div>
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
        </>
    );
};

export default Loty;
