
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { create, ruleSet, fetchCollection, fetchAsset, createCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

    export const mintRoyalty = async ( metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com')
    umi.use(walletAdapterIdentity(wallet));

    const LotlCollectionPublicKey =  publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");



    // Generate Collection
    // const collection = generateSigner(umi);
    // console.log("Collection address:", collection.publicKey.toString());

    // const collectionTx = await createCollection(umi, {
    //     collection: collection,
    //     name: "Lotl Royality Collection",
    //     uri: "https://example.com/my-collection.json",
    // }).sendAndConfirm(umi);

    // let signatureColl = base58.deserialize(collectionTx.signature)[0];
    // console.log("Collection Created: https://solana.fm/tx/" + signatureColl + "?cluster=devnet-alpha");


    //set datetime
    let datum = formatDateTime(now());

    const asset = generateSigner(umi)

    // Generate NFT w/ Royalties
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
        // collection: collection,
    
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 2000,
                creators: [
                        {
                            address: asset.publicKey,
                            percentage: 80,
                        },
                        {
                            address: LotlCollectionPublicKey,
                            percentage: 20,
                        }
                    ],
                    ruleSet: ruleSet('None'), 
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

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(assetTx.signature)[0];
    console.log("Signature: \n", signature);
    // console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(signature)[0] + "?cluster=devnet-alpha");


    // Fetch the Asset to verify that has been created
    const fetchedAsset = await fetchAsset(umi, asset.publicKey);
    // console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
    // console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(assetTx.signature)[0] + "?cluster=devnet-alpha");

    return { fetchedAsset, signature };    };


