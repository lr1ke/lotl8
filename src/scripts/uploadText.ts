'use server';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile } from "@metaplex-foundation/umi";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



export const upLoadText = async (wallet: any) => {

const umi = createUmi("https://api.devnet.solana.com", "confirmed")
umi.use(mockStorage());
// Register Wallet Adapter to Umi
umi.use(walletAdapterIdentity(wallet));

    const note = "Ein rosaroter Sommermontag"
    const myFile = createGenericFile(note, "TestNFT")

    const [myUri] = await umi.uploader.upload([myFile]);
    console.log(myUri);
    return myUri;
}
