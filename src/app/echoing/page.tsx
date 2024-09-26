"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { mintNFT } from "@/scripts/createCollectionAndAsset";
import { upLoadText } from "@/scripts/uploadText";
import { upLoadMetadata } from "@/scripts/assetMetadata";

const Echoing = () => {
    const [myUri, setMyUri] = useState("");
    // const [metadataUri, setMetadataUri] = useState("");


  const handleMintClick = async () => {
    try {
        const myUri = await upLoadText();
        console.log("Uploaded Text:", myUri);
        setMyUri(myUri);
      } catch (error) {
        console.error("Error during Text Upload:", error);
      }
    //   try {
    //     const metadataUri = await upLoadMetadata(myUri);
    //     console.log("Uploaded Metadata:", metadataUri);
    //     setMetadataUri(metadataUri);
    //   } catch (error) {
    //     console.error("Error during Metadata Upload:", error);
    //   }


    try { 
      const { collectionAddress, assetAddress } = await mintNFT(myUri);
      console.log("Collection Address:", collectionAddress);
      console.log("Asset Address:", assetAddress);
    } catch (error) {
      console.error("Error during NFT minting:", error);
    }
  };

  const handleUploadTextClick = async () => {
    try {
      const myUri = await upLoadText();
      console.log("Uploaded Text:", myUri);
    } catch (error) {
      console.error("Error during Text Upload:", error);
    }
  };

  return (
    <>
      {/* Mint NFT Button with loading state */}
      <button
        type="button"
        onClick={handleMintClick}
        className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
      >
        Mint NFT
      </button>

      <button
        type="button"
        onClick={handleUploadTextClick}
        className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
      >
        Upload Text
      </button>
    </>
  );
};

export default Echoing;