
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { create, ruleSet, fetchCollection, fetchAsset, createCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

    export const mintRoyalty = async ( metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com')
    umi.use(walletAdapterIdentity(wallet));

    let walletPublicKey = wallet.publicKey;

    const lotlCollectionPublicKey =  publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");




    //set datetime
    let datum = formatDateTime(now());

    const asset = generateSigner(umi)

    // Generate NFT w/ Royalties
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
    
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 2000,
                creators: [
                        {
                            address: walletPublicKey,
                            percentage: 80,
                        },
                        {
                            address: lotlCollectionPublicKey ,
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


