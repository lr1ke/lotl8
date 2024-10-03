'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js"; // For converting the Solana wallet public key if needed
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

// import { ExternalLinkIcon } from '@heroicons/react/outline';



const Loti = () => {
    const [nftAssets, setNftAssets] = useState<any[]>([]); // Store fetched assets
    const [owner, setOwner] = React.useState<string>("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null); // Modal state for image zoom
    const wallet = useWallet();

    const handlefetchOwnerClick = async (event: { preventDefault: () => void }) => {
        // prevent react app from resetting
        event.preventDefault();

        const umi = createUmi('https://api.devnet.solana.com');
        umi.use(walletAdapterIdentity(wallet));
        if (!wallet || !wallet.publicKey) {
            console.error('Wallet not connected or public key unavailable');
            return;
        }
        // console.log('Wallet Public Key:', wallet.publicKey.toString());

        // Convert wallet public key to Umi format
        const owner = umiPublicKey(wallet.publicKey);
        // console.log(owner);
        // setOwner(owner);
        setOwner(owner.toString());


        // Fetch all NFTs by owner
        const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
            skipDerivePlugins: false,
        });

        const fetchedAssets = assetsByOwner.map(asset => {
            const imageAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'image');
            const nftPic = imageAttr ? imageAttr.value : null;
            return {
                name: asset.name,
                owner: asset.owner,
                href: `https://solscan.io/token/${asset.publicKey}?cluster=devnet`,
                nftPic,
            };
        });

        setNftAssets(fetchedAssets);
    };
    const closeModal = () => {
        setSelectedImage(null); // Close the modal
    };

        

        // const filteredAssets1 = assetsByOwner.filter(asset => asset.hasOwnProperty('permanentFreezeDelegate'));
        // console.log("Filtered Assets1: ", filteredAssets1);

        // const filteredAssets2 = assetsByOwner.filter(asset => !asset.hasOwnProperty('permanentFreezeDelegate'));
        // console.log("Filtered Assets2: ", filteredAssets2);

        // const filteredAssets3 = assetsByOwner.filter(asset => asset.hasOwnProperty('royalties'));
        // console.log("Filtered Assets3: ", filteredAssets3);

        // let nftPic = "";
        // setNftPic(nftPic);

    //     // Iterate through the array of assets
    //     assetsByOwner.forEach(asset => {
    //       // Check if the asset has the 'attributeList'
    //       if (asset.attributes && asset.attributes.attributeList) {
    //         // Iterate through the attributeList array
    //         asset.attributes.attributeList.forEach(attribute => {
    //           // Check if the key is 'image'
    //           if (attribute.key === 'image') {
    //             console.log("Image URL:", attribute.value); // Logs the image URL
    //             nftPic = attribute.value;
    //           }
    //         });
    //       }
    //     });

    //     const firstImageValue = assetsByOwner[0].attributes.attributeList.find(attr => attr.key === 'image').value;
    //     console.log(firstImageValue);


    //     if (filteredAssets3.length > 0) {
    //         const pk = filteredAssets3[0].owner;
    //         console.log("pk ", pk);
    //     } else {
    //         console.log("No items found in filteredAssets3");
    //     }

    //     console.log("Assets fetched: ", assetsByOwner);
    // };

    // // display function outputs to ui
    // const outputs = [
    //     {
    //         title: 'Asset ID...',
    //         dependency: owner,
    //         href: `https://solscan.io/token/${owner}?cluster=devnet`,
    //     }
    // ];




    return (
        <>
   
            <form onSubmit={event => handlefetchOwnerClick(event)} className='p-4'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-lg sm:text-2xl font-semibold'>
                        Fetch all my NFTs 🖼️
                    </h2>
                    <button
                        type='submit'
                        className='bg-blue-500 text-white rounded-lg py-1 sm:py-2 px-4 font-semibold transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!wallet || !wallet.publicKey}
                    >
                        Fetch all
                    </button>
                </div>

                Display fetched NFTs in a grid
                <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {nftAssets.length > 0 ? (
                        nftAssets.map((nft, index) => (
                            <div key={nft.name} className='bg-gray-100 rounded-lg p-4 shadow'>
                                <h3 className='text-md font-semibold mb-2'>{nft.name}</h3>
                                <a
                                    href={nft.href}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-500 italic hover:text-blue-700 transition-all duration-200 mb-2 block'
                                >
                                    {nft.owner.slice(0, 25)}...
                                </a>
                                {nft.nftPic ? (
                                    <Image
                                        onClick={() => setSelectedImage(nft.nftPic)}
                                        width={150}
                                        height={150}
                                        src={nft.nftPic || '/fallback.png'} // Provide a fallback if nftPic is undefined

                                        className='rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105'
                                        alt="NFTImage"
                                    />
                                ) : (
                                    <p>No image available</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className='col-span-2 text-center'>No NFTs found</p>
                    )}
                </div>
            </form>

            {/* Modal for image zoom */}
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

            {/* <button
                type="button"
                onClick={handlefetchOwnerClick}
                className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
            >
                FetchAssets
            </button> */}
        </>
    );
};

export default Loti;