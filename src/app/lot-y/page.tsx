"use client"
import * as React from 'react';

import { useEffect, useState, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner, publicKey, percentAmount, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'


const loty = async () => {
    const [apiUrl, setApiUrl] = React.useState<string>("");
    const [nft, setNft] = React.useState<string>("");
    const [nftImage, setNftImage] = React.useState<string>("");

    const wallet = useWallet(); 
    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));

    let owner = "";
    // Check if the wallet is connected and has a publicKey
    if (wallet && wallet.publicKey) {
    const owner = publicKey(wallet.publicKey.toString());  // Convert wallet's public key to Umi publicKey
  
    console.log('Owner Public Key:', owner.toString());
  } else {
    console.error("Wallet not connected or doesn't have a public key");
  }

//fetch  all NFT by 


const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})

console.log(assetsByOwner)


return (
    <>
    
    
    </>
);
};

export default loty;