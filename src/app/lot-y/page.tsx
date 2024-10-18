'use client'

import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core';
import { useWallet } from '@solana/wallet-adapter-react';
import { any } from 'prop-types';
import { fetchCollection, fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'
import { publicKey } from '@metaplex-foundation/umi';
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faHome, faLink } from '@fortawesome/free-solid-svg-icons';
import { das }  from '@metaplex-foundation/mpl-core-das';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';





interface NftAsset {
  name: string;
  owner: string;
  nftPic: string | null;
  datum: string | null;
  basisPoints: number | null; // Either a number for royalties or null if no royalties
  assetPk: string
}



const Loty = () => {
    // const [collectionAll, setCollectionAll] = useState<Collection | null>(null);
    // const [nftAssets, setNftAssets] = useState<NftAsset[]>([]);
    // const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // const [selectedNft, setSelectedNft] = useState<NftAsset
    const [tradeableAll, setTradeableAll] = useState<any[]>([]);


    const wallet = useWallet();
    // const umi = createUmi('https://api.devnet.solana.com');
    // umi.use(walletAdapterIdentity(wallet));

    const umi = createUmi('https://api.devnet.solana.com')
  .use(walletAdapterIdentity(wallet))
  .use(dasApi());

  
//  // Fetch all tradeable Lotl NFTs when page loads
// useEffect(() => {
//   const fetchTradeable = async () => {
//     try {
//       const assets = await das.searchAssets(umi, {
//         creator: publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w"),
//         // sortBy: undefined,
//       });
//       console.log(assets);
//       setTradeableAll(assets);
//     } catch (error) {
//       console.error("Error fetching collection:", error);
//     }
//   };
//   // Only fetch if the wallet is connected
//   if (wallet && wallet.publicKey && !tradeableAll.length) {
//     fetchTradeable();
//   }
// }, [wallet, umi]);


useEffect(() => {
  const fetchTradeable = async () => {
    try {
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
  if (wallet && wallet.publicKey && !tradeableAll.length) {
    fetchTradeable();
  }
}, [wallet, umi]);



//  const asset = await das.searchAssets(umi, {
  // limit: 10,
  // showFiles: false,
  // showMetadata: false,
  // showRoyalties: false,
  // showAttributes: false,
  // showPreviewsRoyalties: false,
  // showPreviewsAttributes: false,
  // showPreviewsExtended: false,
  // showPreviewsDataExtended: false,
  // showPreviewsFilesExtended: false,
  // showPreviewsMetadataExtended: false,
  // showPreviewsRoyaltiesExtended: false,
// });



//     // Fetch collection props as number minted when the page loads
//     useEffect(() => {
//       const fetchCollectionData = async () => {
//           const collectionId = umiPublicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");
//           try {
//               const collection = await fetchCollection(umi, collectionId);
//               setCollectionAll(collection);
//           } catch (error) {
//               console.error('Error fetching collection:', error);
//           }
//       };     
//       // Only fetch if the wallet is connected
//       if (wallet && wallet.publicKey && !collectionAll) {
//           fetchCollectionData();
//       }
//   }, [wallet, umi, collectionAll]);


//       // Handle the click on the "Detail" button
//       const handleShowDetails = (nft: NftAsset) => {
//         setSelectedNft(nft);  // Set the selected NFT
//     };


//   const handleFetchAllClick = async () => {
//     // Ensure wallet is connected
//     if (!wallet || !wallet.publicKey) {
//         console.error('Wallet not connected or public key unavailable');
//         return;
//     }

//     const collectionId = umiPublicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");

//     try {
//         // Fetch all assets from the collection
//         const assetsInCollection = await fetchAssetsByCollection(umi, collectionId, {
//             skipDerivePlugins: false,
//         });

//         // Map through the fetched assets and extract necessary information
//         const fetchedAssets = assetsInCollection.map(asset => {
//             const imageAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'image');
//             const nftPic = imageAttr ? imageAttr.value : null;
//             const datumAttr = asset.attributes?.attributeList?.find(attr => attr.key === 'datum');
//             const datum = datumAttr ? datumAttr.value : null;
//             const basisPoints = asset.royalties?.basisPoints ?? null;
//             const assetPk = asset.publicKey;


//             return {
//                 name: asset.name,
//                 owner: asset.owner,
//                 nftPic,
//                 datum,
//                 basisPoints,
//                 assetPk
//             };
//         });

//         // Update the state with the fetched assets
//         setNftAssets(fetchedAssets);
//         console.log('Fetched assets:', fetchedAssets);
//     } catch (error) {
//         console.error('Error fetching assets from collection:', error);
//     }
// };


//     // for image zoom out
//     const closeModal = () => {
//         setSelectedImage(null);
//     };

    return (
        <>
                                <h1 className="text-2xl font-semibold mb-4 opacity-50 text-center">Lot-y</h1>
                        <h2 className="text-xl font-semibold mb-4 text-center opacity-80"> Sanctuary for All</h2>

        <p>Coming soon</p>
        
            <div className="flex flex-col min-h-screen bg-gray-100 font-sans antialised">
                <div className="container mx-auto mt-10 px-4 sm:px-0">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold mb-4 opacity-50 text-center">Lot-y</h1>
                        <h2 className="text-xl font-semibold mb-4 text-center opacity-80"> Sanctuary for All</h2>
                        {/* <h3 className="text-sm mb-8 text-center opacity-50"> current collection size: {collectionAll?.currentSize}</h3> */}

                        <ConnectWallet />

                        <div className="p-4">


                          <div className='mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                          {tradeableAll.length > 0 ? (
                                    tradeableAll.map((asset, index) => (
                                    <div key={asset.publicKey} className='bg-white-100 rounded-lg p-4 shadow'>
                                  <h2 className='text-md opacity-50 mb-2'>{asset.name}</h2>
                                  {/* const imageUrl = asset.attributes?.attributeList?.find(attr => attr.key === 'image')?.value;
                                  {imageUrl ? (
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
                                  )} */}

                          <div className="mt-2 flex items-start space-x-1">
                          
                          <button
                            onClick={() => window.open(`https://xray.helius.xyz/token/${nft.assetPk}?network=devnet`, '_blank')}
                            className="bg-white text-gray-600 p-1 text-xs rounded border border-gray-300 hover:bg-gray-100 transition opacity-50"
                          >
                            <FontAwesomeIcon icon={faQuestionCircle} className="h-4 w-4 text-gray-500" />
                          </button>
                            <button
                              // onClick={() => console.log(`Owner: ${asset.owner}`)}
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

                        {/* {selectedImage && (
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
                        )} */}

                    </div>
                </div>

            </div>
        </>
    );
};

export default Loty;
