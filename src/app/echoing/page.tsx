"use client"

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { mintNFT } from "@/scripts/createCollectionAndAsset";
import { uploadText } from "@/scripts/uploadText";
import { uploadMetadata } from "@/scripts/uploadMetadata";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



const Echoing = () => { 
  const [data, setData] = useState('')

  const [noteUri, setNoteUri] = useState("");
  const [metaUri, setMetaUri] = useState("");
  const wallet = useWallet();
  const text = "some note";

  // async function handleUploadClick() {
  //   if (!data) return
  //   try {
  //     setData('')
  //     const response = await fetch('/api/uploadText', {
  //       method: 'POST',
  //       body: JSON.stringify(data), 
  //     })
  //     const json = await response.json()
  //     console.log('json:', json)
  //     setTransaction(json.txId)
  //   } catch(err) {
  //     console.log({ err })
  //   }
  // }

  const handleMintClick = async () => {
    console.log("Minting NFT...");

    try {
        const [noteUri] = await uploadText(text); //destrukturiere array text and geb erstes element []
        console.log("Uploaded Text:", noteUri);
        const metaUri = await uploadMetadata(noteUri);
        console.log("Uploaded Metadata:", metaUri);
        const { collectionAddress, assetAddress } = await mintNFT(metaUri , wallet);
        console.log("Collection Address:", collectionAddress);
        console.log("Asset Address:", assetAddress);

      } catch (error) {
      console.error("Error during NFT minting:", error);
      }
  };


  // const handleUploadTextClick = async () => {
  //   try {
  //     const myUri = await uploadText();
  //     console.log("Uploaded Text:", myUri);
  //   } catch (error) {
  //     console.error("Error during Text Upload:", error);
  //   }
  // };

  return (
    <>
      {/* Mint NFT Button with loading state */}
      <button
        type="button"
        onClick={handleMintClick}
        className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
      >
        Mint Soulbound NFT
      </button>

      {/* <button
        type="button"
        onClick={handleUploadTextClick}
        className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
      >
        Upload Text
      </button>
      <input
        placeholder="Create a post"
        onChange={e => setData(e.target.value)}
        className="text-black px-2 py-1"
      /> */}
      {/* <button
        onClick={handleUploadClick}
        className="text-black bg-white mt-2 px-12"
      >Upload text</button>

      {
        transaction && (
          <a target="_blank" rel="no-opener" href={transaction}>View Arweave Data</a>
        )
      } */}

      <ConnectWallet />

    </>
    
  );
};

export default Echoing;