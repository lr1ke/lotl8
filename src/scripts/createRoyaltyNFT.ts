//Create soulbound nft collection, asset

import { generateSigner, percentAmount, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';


export const mintRoyalty = async ( metadataUri: any, wallet: any) => {
const umi = createUmi('https://api.devnet.solana.com')
umi.use(walletAdapterIdentity(wallet));



    // Generate the Asset PublicKey
    const asset = generateSigner(umi)
    console.log("Asset Address: \n", asset.publicKey.toString())
      

    // Generate the Asset
    const assetTx = await create(umi, {
        asset: asset,
        // collection: collection,
        name: 'Royalty NFT',
        uri: metadataUri,
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
                    ruleSet: ruleSet('None'), // Compatibility rule set
                },
            
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


    return {
        assetAddress: asset.publicKey.toString(),
      };
    };


