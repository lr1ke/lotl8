//Create soulbound nft collection that is immutable

import { generateSigner, publicKey, percentAmount, createSignerFromKeypair, signerIdentity, none } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

import wallet from "../walletCollection.json";

// Create a dummy 
const dummyPublicKey = publicKey('11111111111111111111111111111111');

export const mintSoulboundCollection = async (metaUri: any) => {

    //Create umi Signer connection
    const umi = createUmi("https://api.devnet.solana.com", "finalized")
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));
    

    // Generate the Collection PublicKey
    const collection = generateSigner(umi)
    console.log("Collection Address: \n", collection.publicKey.toString())

    // Generate the collection
    const collectionTx = await createCollection(umi, {
        collection: collection,
        name: 'Lotl Souldbound Collection',       
        uri: metaUri,
        updateAuthority: dummyPublicKey, //makes the collection immutable
        plugins: [
            {
                type: "PermanentFreezeDelegate",
                frozen: true,
                authority: { type: "None" }
            }
        ]
    }).sendAndConfirm(umi);



    // Deserialize the Signature from the Transaction
    let signatureTx = base58.deserialize(collectionTx.signature)[0];
    console.log(signatureTx);
    console.log("Collection Created: https://solana.fm/tx/" + signatureTx + "?cluster=devnet-alpha");


    // Fetch the Collection to verify that has been created
    let fetchedCollection = await fetchCollection(umi, collection.publicKey);
    console.log("Verify that the Collection has been Minted: \n", fetchedCollection);

    

    return fetchedCollection
    };




