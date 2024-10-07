//upload metadata to aarweave


import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import dotenv from 'dotenv';
dotenv.config();

const walletPrivateKeyString = process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY;
if (!walletPrivateKeyString) {
  throw new Error('WALLET_PRIVATE_KEY is not defined in your .env file');
}
const walletPrivateKeyArray: number[] = JSON.parse(walletPrivateKeyString);
const walletPrivateKeyUint8Array = new Uint8Array(walletPrivateKeyArray);



export const uploadMetadata = async (noteUri: any, picUri: any) => {

const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletPrivateKeyUint8Array));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

    const metadata = {
        "name": "Lotl NFT",
        "symbol": "LTL",
        "description": "Lotl collective diary NFT.",
        "image": picUri,
        "attributes": [
            {
                "trait_type": "diary entry",
                "value": "anonymous"
            },
            {
                "trait_type": "content",
                "value": noteUri
            },
        ],
        "proprieties": {
            "files": [
                {
                    "uri": picUri,
                    "type": "image/png"
                }
            ]
        }
    };

    const metadataUri = await umi.uploader.uploadJson(metadata);
    console.log("Your Uri:", metadataUri);
    return metadataUri; 
}