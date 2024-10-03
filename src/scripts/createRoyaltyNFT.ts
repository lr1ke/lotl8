
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



export const mintRoyalty = async ( metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com')
    umi.use(walletAdapterIdentity(wallet));
    const asset = generateSigner(umi)
    console.log("Asset Address: \n", asset.publicKey.toString())

    //set date
    let datum = formatDateTime(now());
    console.log("Time: ", datum);
      
    // Generate NFT w/ Royalties
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
        plugins: [
            {
                type: 'Royalties',
                basisPoints: 1500,
                creators: [
                        {
                            address: asset.publicKey,
                            percentage: 100,
                        },
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
    console.log("asset has been created");

    // Deserialize the Signature from the Transaction
    const signature = base58.deserialize(assetTx.signature)[0];
    console.log("Signature: \n", signature);

    // Fetch the Asset to verify that has been created
    const fetchedAsset = await fetchAsset(umi, asset.publicKey);
    console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
    console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(assetTx.signature)[0] + "?cluster=devnet-alpha");

    return fetchedAsset
    };


