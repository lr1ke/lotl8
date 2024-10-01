"use client"
import * as React from 'react';

import { useEffect, useState, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { mintNFT } from "@/scripts/createCollectionAndAsset";
import { uploadText } from "@/scripts/uploadText";
import { uploadMetadata } from "@/scripts/uploadMetadata";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { mintSouldbound } from '@/scripts/createSoulboundAsset';
import { mintRoyalty } from '@/scripts/createRoyaltyNFT';
// import html2canvas from "html2canvas";
// import { uploadImage } from "@/scripts/uploadImage";



const Echoing = () => { 
  const [data, setData] = React.useState<string>('');
  const [content, setContent] = React.useState<string>("");
  const [charCount, setCharCount] = React.useState<number>(0);
  const [metaUri, setMetaUri] = React.useState<string>("");


  // const contentRef = useRef<HTMLDivElement>(null);

  const wallet = useWallet();





  async function handlePublishClick() {
    if (!data) return
    try {
      setData('')
      const response = await fetch('/api/uploadText', {
        method: 'POST',
        body: JSON.stringify(data), 
      })
      const json = await response.json()
      console.log('json:', json)
    } catch(err) {
      console.log({ err })
    }
  }

  const handleMintClick = async () => {
    console.log("Minting NFT...");

    // let imgData = "";

    // if (contentRef.current) {
    //   //mache foto von div
    //   const canvas = await html2canvas(contentRef.current); 
    //   const imgData = canvas.toDataURL("image/jpeg"); //imgData is a base64 string
    //   const img = document.createElement("img");
    //   img.src = imgData;
    //   document.body.appendChild(img);
    // }

    try {
        const [noteUri] = await uploadText(content); //destrukturiere array text and geb erstes element []
        console.log("Uploaded Text:", noteUri);
        const metaUri = await uploadMetadata(noteUri);
        setMetaUri(metaUri);
        console.log("Uploaded Metadata:", metaUri);
        const { collectionAddress, assetAddress } = await mintNFT(metaUri , wallet);
        console.log("Collection Address:", collectionAddress);
        console.log("Asset Address:", assetAddress);

      } catch (error) {
      console.error("Error during NFT minting:", error);
      }
    }


    const handleSoulboundClick = async () => {
      console.log("Minting Soulbound NFT...");
    
      try {
          const [noteUri] = await uploadText(content); //destrukturiere array text and geb erstes element []
          console.log("Uploaded Text:", noteUri);
          const metaUri = await uploadMetadata(noteUri);
          setMetaUri(metaUri);
          console.log("Uploaded Metadata:", metaUri);
          const { assetAddress } = await mintSouldbound(metaUri , wallet);
          console.log("Asset Address:", assetAddress);
  
        } catch (error) {
        console.error("Error during NFT minting:", error);
        }
      }
  

      const handleRoyaltyClick = async () => {
        console.log("Minting NFT /w Royalties...");
    
        try {
            const [noteUri] = await uploadText(content); //destrukturiere array text and geb erstes element []
            console.log("Uploaded Text:", noteUri);
            const metaUri = await uploadMetadata(noteUri);
            setMetaUri(metaUri);
            console.log("Uploaded Metadata:", metaUri);
            const { assetAddress } = await mintRoyalty(metaUri , wallet);
            console.log("Asset Address:", assetAddress);
    
          } catch (error) {
          console.error("Error during NFT minting:", error);
          }
        }
    


  return (
    <>
            <div className="flex min-h-screen flex-col items-center justify-between p-16">
                <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
                    <img
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                        src="/Screenshot 2024-06-11 at 18.11.01.png"
                        alt="Logo"
                        width={360}
                        height={72}
                    />
                </div>

                <div className="flex-grow container mx-auto mt-10 px-4 sm:px:0">
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg flex flex-col">
                        <div>
                            <h2 className="text-xl mb-4 font-semibold text-center">Your Dojo</h2>
                            <form onSubmit={handlePublishClick}>
                                <br />
                                {/* <div ref={contentRef}> */}
                                <textarea
                                    id="content"
                                    name="content"
                                    required
                                    value={content}
                                    onChange={(e) => {
                                        setContent(e.target.value);
                                        setCharCount(e.target.value.length);
                                    }}
                                    className="mb-4 border-blue-400 rounded-l-md h-80 w-full"
                                    placeholder="this resonates with my heart, echos in my head..."
                                    maxLength={250}
                                ></textarea>
                                <p>{charCount}/250</p>
                                {/* </div> */}
                                <br />
                            </form>
                            <div className="flex space-x-4 mb-4">
                            <button
                                  type="button"
                                  onClick={handleMintClick}
                                  className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
                                >Soulbound Collection & NFT
                                </button>
                                <button
                                  type="button"
                                  onClick={handleSoulboundClick}
                                  className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
                                >Soulbound NFT
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRoyaltyClick }
                                  className="flex-1 bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white p-2 rounded px-4 py-2 rounded-r-md"
                                >NFT /w Royalties
                                </button>
                                </div>
                                <ConnectWallet />
                                
                        </div>
                    </div>
                </div>

                <div className="text-sm opacity-50">
                    <h1>echo-ing...</h1>
                    <p>Words that resonate in my heart.</p>
                    <p>Diese Worte hallen wider in meinem Herzen</p>
                    <p>Etwas, das nachhallt in meinem Kopf</p>
                    <p>What resonates with me, reverberation</p>
                    <p>Alltagssplitter, Fragment</p>
                    <p>What is echoing in my head</p>
                </div>
            </div>



      {/* 
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
          <a target="_blank" rel="no-opener" href={metaUri}>View Arweave Data</a>
        )
      } */}


    </>
    
  );
};

export default Echoing;