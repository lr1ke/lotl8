'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js"; // For converting the Solana wallet public key if needed
import { useWallet } from '@solana/wallet-adapter-react';
import Image from 'next/image';
import { any } from 'prop-types';
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { faQuestionCircle, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface NftAsset {
  name: string;
  owner: string;
  nftPic: string | null;
  datum: string | null;
  basisPoints: number | null; // Either a number for royalties or null if no royalties
  assetPk: string
}


const Loti = () => {
    const [owner, setOwner] = React.useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);//for zooming
    const [nftAssets, setNftAssets] = useState<NftAsset[]>([]);
    const wallet = useWallet();



    const handlefetchOwnerClick = async (event: React.FormEvent) => {
        event.preventDefault();


        const umi = createUmi('https://api.devnet.solana.com');
        umi.use(walletAdapterIdentity(wallet));

        if (!wallet || !wallet.publicKey) {
            console.error('Wallet not connected or public key unavailable');
            return;
        }

        let owner = umiPublicKey(wallet.publicKey);
        setOwner(owner);


        try {
        // Fetch all NFTs by owner
        const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
            skipDerivePlugins: false,
        });
        console.log("Assets by owner:", assetsByOwner);
      // Sort assets by the creation date
      const sortedAssets = assetsByOwner.sort((a, b) => {
        const dateA = new Date(a.name); // Assuming "name" is the creation date
        const dateB = new Date(b.name);
        return dateB.getTime() - dateA.getTime(); // Sort in descending order
      });

        // Extract NFT information and update the state
        const fetchedAssets = sortedAssets.map(asset => {
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
                assetPk,
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

        //   // Handle the click on the "Detail" button
        //   const handleShowDetails = (nft: NftAsset) => {
        //     setSelectedNft(nft);  // Set the selected NFT
        // };
    
        // // Close details
        // const handleCloseDetails = () => {
        //     setSelectedNft(null);  // Reset selected NFT to hide the details
        // };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialiased">
                <div className="container mx-auto mt-10 px-4 sm:px-0">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold mb-8 text-center">Lot-i</h1>
                        <h2 className="text-xl font-semibold mb-8 text-center opacity-50">Archive of self</h2>
                        <ConnectWallet />

                        <div className="p-4">

                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <button
                                    onClick={handlefetchOwnerClick}
                                    className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={!wallet || !wallet.publicKey}
                                >
                                    All my NFTs
                            
                                </button>
    
                                <button
                                    onClick={handlefetchOwnerClick}
                                    className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={!wallet || !wallet.publicKey}
                                >
                                    My Soulbound NFTs
                                </button>
    
                                <button
                                    onClick={handlefetchOwnerClick}
                                    className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                    disabled={!wallet || !wallet.publicKey}
                                >
                                    My Tradeable NFTs
                                </button>
                            </div>
    
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {nftAssets.length > 0 ? (
                                    nftAssets.map((nft, index) => (
                                        <div key={nft.assetPk} className="bg-white-100 rounded-lg p-4 shadow">
                                            <h2 className="text-md opacity-50 mb-2">{nft.datum}</h2>

                                            {nft.nftPic ? (
                                                <img
                                                    onClick={() => setSelectedImage(nft.nftPic)}
                                                    width={150}
                                                    height={150}
                                                    src={nft.nftPic}
                                                    className="rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105"
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

export default Loti;
