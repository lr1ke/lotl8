import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
// import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';


const umi = createUmi("https://api.devnet.solana.com", "finalized")

// let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
// const myKeypairSigner = createSignerFromKeypair(umi, keyair);
// umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

export const upLoadMetadata = async (myUri:string) => {

umi.use(mockStorage());

    console.log("Uploading NFT metadata...");

    const metadata = {
        name: "Echolotl NFT",
        symbol: "Echolotl",
        description: "This is an anonymous entry in the Echolotl collective diary.",
        image: myUri,
        attributes: [
            {
                trait_type: "Collective diary entry",
                value: "Echolotl"
            },
        ],
        proprieties: {
            files: [
                {
                    type: "image/jpeg",
                    uri: myUri
                }
            ]
        }
    }

    // const nftUri = await umi.uploader.uploadJson(metadata);
    const metadataUri = await umi.uploader.uploadJson (metadata);

    console.log("metadata Link:", metadataUri);
return metadataUri;
}