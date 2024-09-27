'use server';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile } from "@metaplex-foundation/umi";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";




export const uploadText = async (wallet: any): Promise<string> => {

const umi = createUmi("https://api.devnet.solana.com", "confirmed")
umi.use(irysUploader());
umi.use(walletAdapterIdentity(wallet));

    const note = "Ein rosaroter Sommermontag"
    const myFile = createGenericFile(note, "TestNFT")

    const [noteUri] = await umi.uploader.upload([myFile]);
    console.log(noteUri);
    return noteUri;
}
