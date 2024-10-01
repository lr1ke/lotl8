//upload metadata to aarweave


import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "../wallet.json";
import { symbol } from "prop-types";

const nftImageUrl = "https://nathan-galindo.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage-2.614ae0c9.jpg&w=640&q=75";


export const uploadMetadata = async (noteUri: any, picUri: any) => {

const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

console.log("Uploading NFT metadata...");

    const metadata = {
        "name": "Lotl NFT",
        "symbol": "LTLN",
        "description": "Lotl collective diary NFT.",
        "image": picUri,
        "attributes": [
            {
                "trait_type": "diary entry",
                "value": "anonymous"
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