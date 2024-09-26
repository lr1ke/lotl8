'use server';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { readFile } from "fs/promises";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';


import wallet from "../wallet.json";

export const upLoadText = async () => {


const umi = createUmi("https://api.devnet.solana.com", "confirmed")
umi.use(mockStorage());

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));


    // Utilizzare la path assoluta
    const note = "Ein rosaroter Sommermontag"
    const myFile = createGenericFile(note, "TestNFT")

    const [myUri] = await umi.uploader.upload([myFile]);

    console.log(myUri);
    return myUri;
}
