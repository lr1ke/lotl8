
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { create, ruleSet, fetchAsset} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

    export const mintRoyalty = async ( metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com')
    umi.use(walletAdapterIdentity(wallet));
    const collectionPublicKey =  publicKey("HjB7oVk1Bvog9UVN6sPW6CTWMXMW2qE6cxSZ8GU8pf1w");

    //set date
    let datum = formatDateTime(now());

    const asset = generateSigner(umi)

    // Generate NFT w/ Royalties
    const assetTx = await create(umi, {
        name: datum,
        uri: metadataUri,
        asset: asset,
        collection: { publicKey: collectionPublicKey },  // Use public key only
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
                            address: collectionPublicKey,
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

    // Fetch the Asset to verify that has been created
    const fetchedAsset = await fetchAsset(umi, asset.publicKey);

    return fetchedAsset
    };


