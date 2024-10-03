import * as React from 'react';

import { useEffect, useState, useRef } from "react";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { publicKey as umiPublicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js"; // For converting the Solana wallet public key if needed

export const fetchAssetOwner = async (wallet : any) => {

    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));
    if (!wallet || !wallet.publicKey) {
        console.error('Wallet not connected or public key unavailable');
        return;
    }
    console.log('Wallet Public Key:', wallet.publicKey.toString());

// Convert wallet public key to Umi format
const owner = umiPublicKey(wallet.publicKey);
console.log(owner);

//fetch  all NFT by 
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})

const filteredAssets1 = assetsByOwner.filter(asset => asset.hasOwnProperty('permanentFreezeDelegate'));
console.log("Filtered Assets1: ", filteredAssets1);

const filteredAssets2 = assetsByOwner.filter(asset => !asset.hasOwnProperty('permanentFreezeDelegate'));
console.log("Filtered Assets2: ", filteredAssets2);

const filteredAssets3 = assetsByOwner.filter(asset => asset.hasOwnProperty('royalties'));
console.log("Filtered Assets3: ", filteredAssets3);

const pk = filteredAssets3[0].owner;
console.log("pk ", pk)

console.log("Assets fetched: ", assetsByOwner)
return assetsByOwner;
}

