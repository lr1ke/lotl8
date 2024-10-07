"use client"
import * as React from 'react';

import { useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { uploadText } from "@/scripts/uploadText";
import { uploadMetadata } from "@/scripts/uploadMetadata";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { mintSouldbound } from '@/scripts/createSoulboundAsset';
import { mintRoyalty } from '@/scripts/createRoyaltyNFT';
import html2canvas from "html2canvas";
import { uploadImage } from "@/scripts/uploadImage";

interface Asset {
  date: string;
  uriMeta: string,
  owner:  string,
  assetPk: string,
  royalties?: number,
  updateAuthority: string; 
  attributes: { key: string; value: string }[];
}



const Echoing = () => { 
  const [assetData, setAssetData] = useState<Asset | null>(null);

  const [content, setContent] = React.useState<string>("");
  const [charCount, setCharCount] = React.useState<number>(0);
  const [metaUri, setMetaUri] = React.useState<string>("");
  const contentRef = useRef<HTMLDivElement | null>(null);

  const wallet = useWallet();


  const processFetchedAsset = (fetchedAsset: any) => {
    const asset = {
      date: fetchedAsset.name,
      uriMeta: fetchedAsset.uri,      
      owner: fetchedAsset.owner,
      assetPk: fetchedAsset.publicKey,
      royalties: fetchedAsset.royalties ? fetchedAsset.royalties.basisPoints : undefined,
      //for soulbound field
      updateAuthority: fetchedAsset.updateAuthority.address,
      attributes: fetchedAsset.attributes.attributeList.map((attr: any) => ({
        key: attr.key,
        value: attr.value,
      })),
    };
  
    setAssetData(asset);
  };
  

  
    //Mint Soulbound NFT
    const handleSoulboundClick = async (event: { preventDefault: () => void }) => {
      event.preventDefault();
    
      console.log("Minting Soulbound NFT...");
    
      let picUri = "";
    
      if (contentRef.current) {
        const isMobile = window.innerWidth <= 768; // Detect mobile screen size
        
        // Set canvas dimensions based on screen size
        const canvas = document.createElement('canvas');
        canvas.width = isMobile ? window.innerWidth - 20 : 800;  // Full width for mobile, fixed size for desktop
        canvas.height = isMobile ? 1200 : 1000; // Adjust height proportionally
      
        const ctx = canvas.getContext('2d');
      
        // Set background color (optional)
        ctx!.fillStyle = '#fff'; // white background
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
        // Set text properties
        const fontSize = isMobile ? 24 : 30; // Smaller font for mobile, larger for desktop
        ctx!.font = `${fontSize}px Arial`;
        ctx!.fillStyle = '#000'; // Black text
        ctx!.textAlign = 'center';
      
        // Adjust text wrapping and padding based on screen size
        const paddingX = isMobile ? 20 : 100;
        const paddingY = isMobile ? 50 : 200;
        const maxWidth = canvas.width - 2 * paddingX;
        const lineHeight = isMobile ? 30 : 40;
      
        const words = content.split(' ');
        let line = '';
        let y = paddingY;
      
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx!.measureText(testLine);
          const testWidth = metrics.width;
      
          if (testWidth > maxWidth && n > 0) {
            ctx!.fillText(line, canvas.width / 2, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
      
        ctx!.fillText(line, canvas.width / 2, y);
      
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      
        if (blob) {
          try {
            const imageUri = await uploadImage(blob);//upload image blob
            console.log('Uploaded Image:', imageUri);
            picUri = imageUri;
          } catch (error) {
            console.error('Error during Image Upload:', error);
          }
        }
      }
          
      try {
        const [noteUri] = await uploadText(content); // Upload text content
        console.log("Uploaded Text:", noteUri);
        const metaUri = await uploadMetadata(noteUri, picUri); // Include note, image URI in metadata, upload
        setMetaUri(metaUri);
        console.log("Uploaded Metadata:", metaUri);
        const fetchedAsset = await mintSouldbound(metaUri, picUri, wallet); // Mint the NFT
        console.log("Asset Created:", fetchedAsset);
        processFetchedAsset(fetchedAsset); //process and update the state

    
      } catch (error) {
        console.error("Error during NFT minting:", error);
      }
    };
    
    //Mint NFT with Royalties
      const handleRoyaltyClick = async (event: { preventDefault: () => void}) => {
        //prevent react app from resetting
        event.preventDefault();
        
        console.log("Minting NFT /w Royalties...");

        let picUri = "";
    
        if (contentRef.current) {
          const isMobile = window.innerWidth <= 768; // Detect mobile screen size
          
          // Set canvas dimensions based on screen size
          const canvas = document.createElement('canvas');
          canvas.width = isMobile ? window.innerWidth - 20 : 800;  // Full width for mobile, fixed size for desktop
          canvas.height = isMobile ? 1200 : 1000; // Adjust height proportionally
        
          const ctx = canvas.getContext('2d');
        
          // Set background color (optional)
          ctx!.fillStyle = '#fff'; // white background
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
          // Set text properties
          const fontSize = isMobile ? 24 : 30; // Smaller font for mobile, larger for desktop
          ctx!.font = `${fontSize}px Arial`;
          ctx!.fillStyle = '#000'; // Black text
          ctx!.textAlign = 'center';
        
          // Adjust text wrapping and padding based on screen size
          const paddingX = isMobile ? 20 : 100;
          const paddingY = isMobile ? 50 : 200;
          const maxWidth = canvas.width - 2 * paddingX;
          const lineHeight = isMobile ? 30 : 40;
        
          const words = content.split(' ');
          let line = '';
          let y = paddingY;
        
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx!.measureText(testLine);
            const testWidth = metrics.width;
        
            if (testWidth > maxWidth && n > 0) {
              ctx!.fillText(line, canvas.width / 2, y);
              line = words[n] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
        
          ctx!.fillText(line, canvas.width / 2, y);
        
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        
          if (blob) {
            try {
              const imageUri = await uploadImage(blob);//upload image blob
              console.log('Uploaded Image:', imageUri);
              picUri = imageUri;
            } catch (error) {
              console.error('Error during Image Upload:', error);
            }
          }
        }

        try {
            const [noteUri] = await uploadText(content); //destrukturiere array text and geb erstes element []
            console.log("Uploaded Text:", noteUri);
            const metaUri = await uploadMetadata(noteUri, picUri); //upload metadata, include noteUri and picUri
            setMetaUri(metaUri);
            console.log("Uploaded Metadata:", metaUri);
            const fetchedAsset = await mintRoyalty(metaUri, picUri, wallet); // Mint the NFT
            console.log("Asset Created:", fetchedAsset);
            processFetchedAsset(fetchedAsset); //process and update the state
    
          } catch (error) {
          console.error("Error during NFT minting:", error);
          }
        }



        return (
          <>
              <div className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8">
                  <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
                      <img
                          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                          src="/werkstatt.jpg"
                          alt="Logo"
                          width={360}
                          height={72}
                      />
                  </div>

                  <div className="flex-grow container mx-auto mt-10 px-4 sm:px-4">
                  <h2 className="text-xl mb-7 font-semibold text-center"> Dojo</h2>


                      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-lg flex flex-col">
                          <div>

                              <form>
                                  <div ref={contentRef}>
                                      <textarea
                                          id="content"
                                          name="content"
                                          required
                                          value={content}
                                          onChange={(e) => {
                                              setContent(e.target.value);
                                              setCharCount(e.target.value.length);
                                          }}
                                          className="mb-4 border-blue-400 rounded-md h-80 w-full p-2"
                                          placeholder="This resonates with my heart, echos in my head..."
                                          maxLength={250}
                                      ></textarea>
                                      <p>{charCount}/250</p>
                                  </div>
                              </form>
      
                              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
                                  <button
                                      type="button"
                                      onClick={handleSoulboundClick}
                                      className="w-full sm:w-auto bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white py-2 px-4 rounded-md"
                                  >
                                      Soulbound NFT
                                  </button>
      
                                  <button
                                      type="button"
                                      onClick={handleRoyaltyClick}
                                      className="w-full sm:w-auto bg-gradient-to-r from-pink-300 to-yellow-200 hover:from-green-300 hover:to-blue-300 text-white py-2 px-4 rounded-md"
                                  >
                                      NFT /w Royalties
                                  </button>
                                  <ConnectWallet />

                              </div>
                          </div>
                      </div>                  

                  </div>

                  <div className="asset-info">
                  {assetData ? (
                    <div>
                            <h3 className="text-2xl mb-6 text-center opacity-50">Successfully minted!</h3>

                                <a 
                                  href={`https://xray.helius.xyz/token/${assetData.assetPk}?network=devnet`}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="bg-gradient-to-r from-green-300 to-blue-300 hover:from-pink-300 hover:to-yellow-200 text-blue-800 transition-all duration-200 border-2 border-transparent text-white p-2 mt-4 rounded"
                                  >
                                  View on helius
                                </a>
                                </div>
) : (
  <p className="text-center text-gray-500">Words, Works, Worlds</p>
)}
                </div>
                  <div className="text-sm opacity-50 text-center mt-8">
                      <h1>echo-ing...</h1>
                      <p>Words that resonate in my heart.</p>
                      <p>What resonates with me, reverberation</p>
                      <p>Words echoing in my head</p>
                  </div>
              </div>
          </>
      );
      };

export default Echoing;