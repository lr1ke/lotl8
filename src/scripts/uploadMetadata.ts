

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

import wallet from "../wallet.json";


export const uploadMetadata = async (noteUri: any) => {

const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

console.log("Uploading NFT metadata...");

    const metadata = {
        name: "Lotl NFT",
        symbol: "Lotl",
        description: "This is an NFT from the Lotl collective diary.",
        image: "some image",
        attributes: [
            {
                trait_type: "Lotl diary entry",
                value: "anonymous"
            },
        ],
        proprieties: {
            files: [
                {
                    type: "text/plain",
                    uri: noteUri
                }
            ]
        }
    };

    const metadataUri = await umi.uploader.uploadJson(metadata);
    console.log("Your Uri:", metadataUri);
    return metadataUri; 
}