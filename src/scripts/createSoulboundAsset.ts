import { generateSigner, publicKey, now, formatDateTime } from '@metaplex-foundation/umi';
import { create, fetchAsset, fetchCollection, createCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { base58 } from '@metaplex-foundation/umi/serializers';
import dotenv from 'dotenv';
// Load existing .env file
dotenv.config();




export const mintSouldbound = async (metadataUri: any, picUri: any, wallet: any) => {

    

    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));



    const collectionPublicKey =  publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");
    const collection = await fetchCollection(umi, collectionPublicKey);

    let datum = formatDateTime(now());
    const asset = generateSigner(umi);
    console.log("Asset Address: \n", asset.publicKey.toString());

    // Generate the Soulbound NFT
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,

        collection: collection, 
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

    return { fetchedAsset, signature };    };
