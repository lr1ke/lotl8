
// import dotenv from 'dotenv';
// dotenv.config();
import { generateSigner, publicKey, now, dateTime, formatDateTime } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, pluginAuthority, ruleSet, fetchAsset, fetchCollection} from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';



// // const collectionPublicKey = publicKey("9M7tawjiaDKchUGmyR9MxZ4XdJT86cGmDCeBN355i4VR");


export const mintSouldbound = async (metadataUri: any, picUri: any, wallet: any) => {

    const umi = createUmi('https://api.devnet.solana.com');
    umi.use(walletAdapterIdentity(wallet));

    // const collectionSigner = generateSigner(umi);
    // console.log("Collection Address: \n", collectionSigner.publicKey.toString());

    // // Save the public key to localStorage
    // localStorage.setItem("storedCollectionPublicKey", collectionSigner.publicKey.toString());

    // // Generate the collection
    // const collectionTx = await createCollection(umi, {
    //     collection: collectionSigner,
    //     name: 'Lotl NFT Collection',
    //     uri: 'someUri',
    // }).sendAndConfirm(umi);

    // console.log("Collection minted: ", collectionTx.signature);


    // Retrieve the stored public key
    const storedCollectionPublicKey = localStorage.getItem("storedCollectionPublicKey");

    if (!storedCollectionPublicKey) {
        throw new Error("Collection Public Key not found.");
    }

    const collectionPublicKey = publicKey(storedCollectionPublicKey);  // Convert string to PublicKey

    // Set date
    let datum = formatDateTime(now());
    console.log("Time: ", datum);

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
    return assetTx;
}



//     const umi = createUmi('https://api.devnet.solana.com')
//     umi.use(walletAdapterIdentity(wallet));

//     // Generate the Collection PublicKey
//     const collection = generateSigner(umi);

// //     // Store the collection object in localStorage by serializing it as a JSON string
// // localStorage.setItem("storedCollectionKey", JSON.stringify(collection.publicKey.toString()));

    
   


// //     // Generate the collection
//     const collectionTx = await createCollection(umi, {
//         collection: collection,
//         name: 'Lotl NFT Collection',
//         uri: 'someUri',
//     }).sendAndConfirm(umi);

//     // Deserialize the Signature from the Transaction
//     let signature1 = base58.deserialize(collectionTx.signature)[0];
//     console.log(signature1);



//  // Fetch the Collection to verify that has been created
//  let fetchedCollection = await fetchCollection(umi, collection.publicKey);
//  console.log("Verify that the Collection has been Minted: \n", fetchedCollection);



// // // Retrieve the collection public key stored earlier
// // const storedCollectionKey = localStorage.getItem("storedCollectionKey");
// // if (!storedCollectionKey) {
// //     throw new Error("Stored collection key not found in localStorage");
// // }

// // // Convert the stored collection key back to the expected type
// // const collection = JSON.parse(storedCollectionKey);

//     //set date
//     let datum = formatDateTime(now());
//     console.log("Time: ", datum);

//     const asset = generateSigner(umi)

//     // Generate Soulbound NFT
//     const assetTx = await create(umi, {
//         name: datum,
//         uri: metadataUri,
//         asset: asset,
//         collection: collection,
//         plugins: [
//             {
//                 type: 'PermanentFreezeDelegate',
//                 frozen: true,
//                 authority: { type: 'None' },
//               },
//             {
//                 type: "Attributes",
//                 attributeList: [
//                     {key: "image", value: picUri },
//                     {key: "datum", value: datum }
//                 ]
//             }
//         ]        
//     }).sendAndConfirm(umi);
//     console.log("asset has been created");

//     // Deserialize the Signature from the Transaction
//     const signature = base58.deserialize(assetTx.signature)[0];
//     console.log("Signature: \n", signature);



//     // Fetch the Asset to verify that has been created
//     const fetchedAsset = await fetchAsset(umi, asset.publicKey);
//     console.log("Verify that the Asset has been Minted: \n", fetchedAsset);
//     console.log("Asset Created: https://solana.fm/tx/" + base58.deserialize(assetTx.signature)[0] + "?cluster=devnet-alpha");


//     return fetchedAsset
//     };