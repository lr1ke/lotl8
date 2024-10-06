'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { any } from 'prop-types';
import { fetchCollection, fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey} from '@metaplex-foundation/umi';
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faHome } from '@fortawesome/free-solid-svg-icons';



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
  href: string;
  nftPic: string | null;
  datum: string | null;
  basisPoints: number | null; // Either a number for royalties or null if no royalties
}



const Loty = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null); //für zoom
    const [owner, setOwner] = React.useState<string>("");
    const [all, setAll] = useState<any[]>([]);
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
              console.log("Collection: ", collection);
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



  // const nftAssets: NftAsset[] = [/* Your NFT data here */];

      // Handle the click on the "Detail" button
      const handleShowDetails = (nft: NftAsset) => {
        setSelectedNft(nft);  // Set the selected NFT
    };

    // Close details
    const handleCloseDetails = () => {
        setSelectedNft(null);  // Reset selected NFT to hide the details
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


            return {
                name: asset.name,
                owner: asset.owner,
                href: `https://solscan.io/token/${asset.publicKey}?cluster=devnet`,
                nftPic,
                datum,
                basisPoints,
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
                        <h2 className="text-xl font-semibold mb-4 text-center opacity-80"> Sanctuary for all notes</h2>
                        <h3 className="text-sm mb-8 text-center opacity-50"> current collection size: {collectionAll?.currentSize}</h3>
                        <h4 className="text-sm mb-8 text-center opacity-50">Browse the Lotl NFT Collection</h4>
                        <div className='p-4'>
                        <ConnectWallet />
                        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <button
                              onClick={handleFetchAllClick}
                              className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                              disabled={!wallet || !wallet.publicKey}
                            >
                              Whole Lotl Collection
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
                                <div key={nft.href} className='bg-white-100 rounded-lg p-4 shadow'>
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
                                onClick={() => handleShowDetails(nft)}
                              className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacitiy-50"
                            >
                              <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => console.log(`Owner: ${nft.owner}`)}
                              className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacitiy-50"
                            >
                              <FontAwesomeIcon icon={faHome} className="h-4 w-4 text-grey-500" />
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

                                {/* Show NFT details when an NFT is selected */}
                                {selectedNft && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">NFT Details</h2>
                            <p><strong>Date:</strong>{selectedNft.name}</p>
                            <p><strong>Owner:</strong> {selectedNft.owner}</p>

                            <p><strong>Type:</strong> 
                              {selectedNft.basisPoints !== null 
                                ? `${selectedNft.basisPoints / 100}% Royalties`  // Divide by 100 to convert to percentage
                                : 'Soulbound NFT'}
                            </p>
                            <p>
                            <a 
                              href={selectedNft.href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-white transition-all border border-gray-300 duration-200  p-2 mt-4 rounded inline-block text-center hover:bg-gray-100"
                            >
                              View on Solscan
                            </a>
                            </p>
                            <button
                              onClick={handleCloseDetails}
                              className="bg-gradient-to-r from-green-300 to-blue-300 hover:from-pink-300 hover:to-yellow-200 text-blue-800 transition-all duration-200 border-2 border-transparent text-white p-2 mt-4 rounded"
                            >
                              Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Loty;
