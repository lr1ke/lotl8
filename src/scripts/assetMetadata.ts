import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



export const uploadMetadata = async (noteUri:string, wallet: any) => {

    const umi = createUmi("https://api.devnet.solana.com", "finalized")
    umi.use(irysUploader());
    umi.use(walletAdapterIdentity(wallet));
    console.log("Uploading NFT metadata...");

    const metadata = {
        name: "Lotl NFT",
        symbol: "Lotl",
        description: "This is an NFT from the Lotl collective diary.",
        image: noteUri,
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
    }

    // const nftUri = await umi.uploader.uploadJson(metadata);
    const metadataUri = await umi.uploader.uploadJson (metadata);
    console.log("metadata Link:", metadataUri);
    return metadataUri;
}