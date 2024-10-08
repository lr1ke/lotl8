import { generateSigner, publicKey, now, formatDateTime } from '@metaplex-foundation/umi';
import { create, fetchAsset} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { base58 } from '@metaplex-foundation/umi/serializers';


export const mintSouldbound = async (metadataUri: any, picUri: any, wallet: any) => {


    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));

    //only needs to run once to mint Lotl collection
    // const collectionSigner = generateSigner(umi);
    // console.log("Collection Address: \n", collectionSigner.publicKey.toString());
    // // Generate the collection
    // const collectionTx = await createCollection(umi, {
    //     collection: collectionSigner,
    //     name: 'Lotl NFT Collection',
    //     uri: 'someUri',
    // }).sendAndConfirm(umi);

    // console.log("Collection minted: ", collectionTx.signature);

    const collectionPublicKey =  publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");

    let datum = formatDateTime(now());
    const asset = generateSigner(umi);

    // Generate the Soulbound NFT
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
        collection: { publicKey: collectionPublicKey },  // Use public key only
        plugins: [
            {
                type: 'PermanentFreezeDelegate',
                frozen: true,
                authority: { type: 'None' },
            },
            {
                type: "Attributes",
                attributeList: [
                    { key: "image", value: picUri },
                    { key: "datum", value: datum }
                ]
            }
        ]
    }).sendAndConfirm(umi);
    console.log("Asset has been created");

         // Deserialize the Signature from the Transaction
         const signature = base58.deserialize(assetTx.signature)[0];
         console.log("Signature: \n", signature);
     
         // Fetch the Asset to verify that has been created
         const fetchedAsset = await fetchAsset(umi, asset.publicKey);
         console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
         console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(assetTx.signature)[0] + "?cluster=devnet-alpha");
     
         return fetchedAsset
     }
 


