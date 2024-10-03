
// import dotenv from 'dotenv';
// dotenv.config();
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



// const collectionPublicKey = publicKey("9M7tawjiaDKchUGmyR9MxZ4XdJT86cGmDCeBN355i4VR");


export const mintSouldbound = async ( metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com')
    umi.use(walletAdapterIdentity(wallet));
    const asset = generateSigner(umi)
    console.log("Asset Address: \n", asset.publicKey.toString())

    //set date
    let datum = formatDateTime(now());
    console.log("Time: ", datum);

    // Generate Soulbound NFT
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
        plugins: [
            {
                type: 'PermanentFreezeDelegate',
                frozen: true,
                authority: { type: 'None' },
              },
            {
                type: "Attributes",
                attributeList: [
                    {key: "image", value: picUri },
                    {key: "datum", value: datum }
                ]
            }
        ]        
    }).sendAndConfirm(umi);
    console.log("asset has been created");

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(assetTx.signature)[0];
    console.log("Signature: \n", signature);



    // Fetch the Asset to verify that has been created
    const fetchedAsset = await fetchAsset(umi, asset.publicKey);
    console.log("zeige mir uri: ", fetch1);
    console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
    console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(assetTx.signature)[0] + "?cluster=devnet-alpha");


    return fetchedAsset
    };


