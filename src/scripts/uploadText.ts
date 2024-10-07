//upload note to aarweave

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import dotenv from 'dotenv';
dotenv.config();

const walletPrivateKeyString = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
if (!walletPrivateKeyString) {
  throw new Error('WALLET_PRIVATE_KEY is not defined in your .env file');
}
const walletPrivateKeyArray: number[] = JSON.parse(walletPrivateKeyString);
const walletPrivateKeyUint8Array = new Uint8Array(walletPrivateKeyArray);

export const uploadText = async (text: string) => {

    const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletPrivateKeyUint8Array));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());
    
let genText = createGenericFile(text, 'my-file.txt', { contentType: "text/plain" });
const textUri = await umi.uploader.upload([genText]);

console.log(textUri);
return textUri;
}

