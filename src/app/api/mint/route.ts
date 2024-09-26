// import { generateSigner, percentAmount, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// import { base58 } from '@metaplex-foundation/umi/serializers';
// import { createCollectionV1, createPlugin, createV1, pluginAuthority, ruleSet, fetchAssetV1, fetchCollectionV1} from '@metaplex-foundation/mpl-core';

// import wallet from "@/wallet.json";


// export const mintNFT = async () => {

// const umi = createUmi("https://api.devnet.solana.com", "finalized")
// let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
// const myKeypairSigner = createSignerFromKeypair(umi, keypair);
// umi.use(signerIdentity(myKeypairSigner));


//     // Generate the Collection PublicKey
//     const collection = generateSigner(umi)
//     console.log("Collection Address: \n", collection.publicKey.toString())

//     // Generate the collection
//     const collectinTx = await createCollectionV1(umi, {
//         collection: collection,
//         name: 'My Collection',
//         uri: 'https://example.com/my-collection.json',
//     }).sendAndConfirm(umi)

//     // Deserialize the Signature from the Transaction
//     let signature = base58.deserialize(collectinTx.signature)[0];
//     console.log(signature);

//     // Fetch the Collection to verify that has been created
//     let fetchedCollection = await fetchCollectionV1(umi, collection.publicKey);
//     console.log("Verify that the Collection has been Minted: \n", fetchedCollection);

//     // Generate the Asset PublicKey
//     const asset = generateSigner(umi)
//     console.log(asset.publicKey.toString())

//     // Generate the Asset
//     const assetTx = await createV1(umi, {
//         name: 'My NFT',
//         uri: 'https://example.com/my-nft.json',
//         asset: asset,
//         collection: collection.publicKey, // collection to which the asset belongs collection: publicKey("...")
//     }).sendAndConfirm(umi);

//     // Deserialize the Signature from the Transaction
//     signature = base58.deserialize(assetTx.signature)[0];
//     console.log(signature);

//     // Fetch the Asset to verify that has been created
//     const fetchedAsset = await fetchAssetV1(umi, asset.publicKey);
//     console.log("Verify that the Asset has been Minted: \n", fetchedAsset);

//     // Fetch the Collection again to verify that the Asset has been added
//     fetchedCollection = await fetchCollectionV1(umi, collection.publicKey);
//     console.log("Verify that the Asset has been Added to the collection: \n", fetchedCollection);

//     return {
//         collectionAddress: collection.publicKey.toString(),
//         assetAddress: asset.publicKey.toString(),
//       };
//     };


// /*

//     CreateCollectionV1 Instruction:
//     -----------------------------------
//     Accounts:
//     - collection: Signer;                           // The Asset KeyPair to initialize the Asset
//     - authority?: Signer;                           // [?] The Authority signing for creation. Defaults to the Umi Authority if not present.
//     - payer?: Signer;                               // [?] The Account paying for the storage fees. Defaults to the Umi Payer if not present.

//     Data:
//     - name: string;
//     - uri: string;
//     - plugins?: OptionOrNullable<Array<PluginAuthorityPairArgs>>;

// */

// /*

//      Additional Example:
//     -----------------------------------
//     - Create Collection With the Royalty Plugin:

//         await createCollectionV1(umi, {
//             collection: collectionSigner,
//             name: 'My NFT',
//             uri: 'https://example.com/my-nft.json',
//             plugins: [
//                 {
//                 plugin: createPlugin(
//                     {
//                         type: 'Royalties',
//                         data: {
//                             basisPoints: 500,
//                             creators: [
//                                 {
//                                     address: generateSigner(umi).publicKey,
//                                     percentage: 20,
//                                 },
//                                 {
//                                     address: generateSigner(umi).publicKey,
//                                     percentage: 80,
//                                 },
//                             ],
//                             ruleSet: ruleSet('None'), // Compatibility rule set
//                         },
//                     }
//                 ),
//                 authority: pluginAuthority("None"),
//                 },
//             ],
//         }).sendAndConfirm(umi)


// */

// /*

//     CreateV1 Instruction:
//     -----------------------------------
//     Accounts:
//     - asset: Signer;                                    // The Asset KeyPair to initialize the Asset
//     - collection?: PublicKey | Pda;                     // [?] The Collection to which the Asset belongs.
//     - authority?: Signer;                               // [?] The Authority signing for creation. Defaults to the Umi Authority if not present.
//     - payer?: Signer;                                   // [?] The Account paying for the storage fees. Defaults to the Umi Payer if not present.
//     - owner?: PublicKey | Pda;                          // [?] The Owner of the new Asset. Defaults to the Authority if not present. Can be used to mint something directly to a user.
//     - updateAuthority?: PublicKey | Pda;                // [?] The Authority on the new Asset. Defaults to the Authority if not present.

//     Data:
//     - name: string;
//     - uri: string;
//     - plugins?: OptionOrNullable<Array<PluginAuthorityPairArgs>>;

// */

// /*

//     Additional Example:
//     -----------------------------------
//     - Create Asset With the Royalty Plugin:

//         await createV1(umi, {
//             asset: assetSigner,
//             name: 'My NFT',
//             uri: 'https://example.com/my-nft.json',
//             plugins: [
//                 {
//                 plugin: createPlugin(
//                     {
//                         type: 'Royalties',
//                         data: {
//                             basisPoints: 500,
//                             creators: [
//                                 {
//                                     address: generateSigner(umi).publicKey,
//                                     percentage: 20,
//                                 },
//                                 {
//                                     address: generateSigner(umi).publicKey,
//                                     percentage: 80,
//                                 },
//                             ],
//                             ruleSet: ruleSet('None'), // Compatibility rule set
//                         },
//                     }
//                 ),å
//                 authority: pluginAuthority("None"),
//                 },
//             ],
//         }).sendAndConfirm(umi)

// */
