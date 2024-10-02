//Create soulbound nft collection

import { generateSigner, percentAmount, createSignerFromKeypair, signerIdentity, none } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

import wallet from "../walletCollection.json";



export const mintRoyaltyCollection = async () => {

    //Create umi Signer connection
    const umi = createUmi("https://api.devnet.solana.com", "finalized")
    let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keyair);
    umi.use(signerIdentity(myKeypairSigner));

    // Generate the Collection PublicKey
    const collection = generateSigner(umi)
    console.log("Collection Address: \n", collection.publicKey.toString())

    // Generate the collection
    const collectionTx = await createCollection(umi, {
        collection: collection,
        name: 'Lotl NFT w/ Royalties Collection',       
        uri: 'metaData',

    }).sendAndConfirm(umi);



    // Deserialize the Signature from the Transaction
    let signatureTx = base58.deserialize(collectionTx.signature)[0];
    console.log(signatureTx);

    // Fetch the Collection to verify that has been created
    let fetchedCollection = await fetchCollection(umi, collection.publicKey);
    console.log("Verify that the Collection has been Minted: \n", fetchedCollection);

    

    return {
        collectionAddress: collection.publicKey.toString(),
      };
    };


