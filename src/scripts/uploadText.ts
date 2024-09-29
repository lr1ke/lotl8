
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";


import wallet from "../wallet.json";



export const uploadText = async (text: string) => {

    const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());
    
    console.log("Uploading note...");

let genText = createGenericFile(text, 'my-file.txt', { contentType: "text/plain" });

const textUri = await umi.uploader.upload([genText]);

console.log(textUri);
return textUri;
}

