//upload metadata Collection to aarweave


import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "../wallet.json";



export const uploadMetadataColl = async (picUri: any) => {

const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

console.log("Uploading NFT metadata...");

    const metadata = {
        "name": "Lotl Soulbound NFT Collection",
        "symbol": "LTL",
        "description": "Archive of all soulbound NFTs.",
        "image": picUri,
        "attributes": [
            {
                "trait_type": "Collective diary",
                "value": "Soulbound NFT"
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