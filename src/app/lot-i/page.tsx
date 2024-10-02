 "use client"
import * as React from 'react';

import { useEffect, useState, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { ConnectWallet } from "@/components/ui/ConnectWallet";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { generateSigner, publicKey, percentAmount, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { fetchAssetOwner } from '../api/fetchAssetsOwner';


const loti = async () => {
 
    const fetchedAssets = fetchAssetOwner();

    






return (
    <>
    
    
    </>
);
};

export default loti;