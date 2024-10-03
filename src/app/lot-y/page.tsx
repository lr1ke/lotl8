// 'use client'

// import * as React from 'react';
// import { useEffect, useState, useRef } from "react";
// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
// import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
// import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
// import { PublicKey } from "@solana/web3.js"; // For converting the Solana wallet public key if needed
// import { useWallet } from '@solana/wallet-adapter-react';
// import { toast } from 'react-toastify';
// import Image from 'next/image';
// import { any } from 'prop-types';

// // import { ExternalLinkIcon } from '@heroicons/react/outline';



// const Loty = () => {
//     const [selectedImage, setSelectedImage] = useState<string | null>(null); //für zoom
//     const wallet = useWallet();
//     const [nftAssets, setNftAssets] = useState<any[]>([]);
//     const [owner, setOwner] = React.useState<string>("");

//     const umi = createUmi('https://api.devnet.solana.com');
//     umi.use(walletAdapterIdentity(wallet));

//     if (!wallet || !wallet.publicKey) {
//         console.error('Wallet not connected or public key unavailable');
//         return;
//     }

//     const InhaberIn = umiPublicKey(wallet.publicKey);
//     setOwner(InhaberIn);

//     //verschiedene clicks: alle zeigen, die einen die anderen,...


//     const handlefetchAllClick = async (event: React.FormEvent) => {
//         event.preventDefault();

//     }

//     const handlefetchSoulbound = async (event: React.FormEvent) => {
//       event.preventDefault();

//   }

//   const handlefetchRoyalty = async (event: React.FormEvent) => {
//     event.preventDefault();

// }






//         // Fetch all NFTs by owner
//         const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
//             skipDerivePlugins: false,
//         });

//         // Extract NFT information and update the state
//         const fetchedAssets = assetsByOwner.map(asset => {
//             const imageAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'image');
//             const nftPic = imageAttr ? imageAttr.value : null;
//             const datumAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'datum');
//             const datum = datumAttr ? datumAttr.value : null;

//             return {
//                 name: asset.name,
//                 owner: asset.owner,
//                 href: `https://solscan.io/token/${asset.publicKey}?cluster=devnet`,
//                 nftPic,
//                 datum,
//             };
//         });

//         setNftAssets(fetchedAssets);
//     };

//     const closeModal = () => {
//         setSelectedImage(null);
//     };

//     return (
//         <>
//             <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialised">
//                 <div className="container mx-auto mt-10 px-4 sm:px-0">
//                     <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
//                         <h1 className="text-2xl font-semibold mb-8 text-center">Lot-i</h1>
//                         <h2 className="text-xl font-semibold mb-8 text-center opacity-50"> Archive of self</h2>

//                         <form onSubmit={handlefetchOwnerClick} className='p-4'>
//                             <div className='flex justify-between items-center'>
//                                 <button
//                                     type='submit'
//                                     className='flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-blue-800 p-2 transition-all duration-200 border-2 border-transparent hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
//                                     disabled={!wallet || !wallet.publicKey}
//                                 >
//                                     Show all my diary entries
//                                 </button>
//                             </div>

//                             <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4'>
//                                 {nftAssets.length > 0 ? (
//                                     nftAssets.map((nft, index) => (
//                                         <div key={nft.href} className='bg-white-100 rounded-lg p-4 shadow'>
//                                             <h2 className='text-md opacity-50 mb-2'>{nft.datum}</h2>
//                                             <a
//                                                 href={nft.href}
//                                                 target='_blank'
//                                                 rel='noopener noreferrer'
//                                                 className='text-blue-500 italic hover:text-blue-700 transition-all duration-200 mb-2 block'
//                                             >
//                                                 {nft.owner.slice(0, 19)}...
//                                             </a>
//                                             {nft.nftPic ? (
//                                                 <img
//                                                     onClick={() => setSelectedImage(nft.nftPic)}
//                                                     width={150}
//                                                     height={150}
//                                                     src={nft.nftPic}
//                                                     className='rounded-lg border-2 border-gray-300 cursor-pointer hover:shadow-lg transition-transform transform hover:scale-105'
//                                                     alt="NFTImage"
//                                                 />
//                                             ) : (
//                                                 <p>No image available</p>
//                                             )}
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <p className='col-span-2 text-center'>No NFTs found</p>
//                                 )}
//                             </div>
//                         </form>

//                         {selectedImage && (
//                             <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50'>
//                                 <div className='relative'>
//                                     <img
//                                         src={selectedImage}
//                                         alt="Zoomed NFT"
//                                         className='max-w-full max-h-full'
//                                     />
//                                     <button
//                                         onClick={closeModal}
//                                         className='absolute top-2 right-2 bg-white text-black rounded-full p-1 hover:bg-gray-300'
//                                     >
//                                         Close
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Loty;
