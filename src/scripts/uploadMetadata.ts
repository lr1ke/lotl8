//upload metadata to aarweave


import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "../wallet.json";



export const uploadMetadata = async (noteUri: any, picUri: any) => {

const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

console.log("Uploading NFT metadata...");

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