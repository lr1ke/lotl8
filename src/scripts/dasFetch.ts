// import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
// import { das } from '@metaplex-foundation/mpl-core-das';
// import { publicKey } from '@metaplex-foundation/umi';
// import * as React from 'react';




// export const fetchAsset1 = async () => {


// const umi = createUmi('https://api.devnet.solana.com').use(dasApi());
// const assetId = publicKey('7Lpn9BDb59taWJtnN5J2G4rGQGWPZhFezq8CuEpHF38Y');

// // const [nft, setNft] = React.useState<string>("");
// // const [nftImage, setNftImage] = React.useState<string>("");


//   try {
//     const asset = await das.getAsset(umi, assetId);
//     console.log(asset);

// const fetch2 = asset.uri;
// console.log(fetch2);

// const fetch3 = asset.content.metadata.name;
// console.log("zeige mir metadata", fetch3)

// const fetch4 = asset.attributes?.attributeList
// const fetch4value = fetch4[0].value;
// console.log("zeige mir 4: ", fetch4);
// console.log("zeige mir fetch4value: ", fetch4value);



    
//     return asset;
//   } catch (error) {
//     console.error('Error fetching asset:', error);
//   }
// };



        // const filteredAssets1 = assetsByOwner.filter(asset => asset.hasOwnProperty('permanentFreezeDelegate'));
        // console.log("Filtered Assets1: ", filteredAssets1);

        // const filteredAssets2 = assetsByOwner.filter(asset => !asset.hasOwnProperty('permanentFreezeDelegate'));
        // console.log("Filtered Assets2: ", filteredAssets2);

        // const filteredAssets3 = assetsByOwner.filter(asset => asset.hasOwnProperty('royalties'));
        // console.log("Filtered Assets3: ", filteredAssets3);

        // let nftPic = "";
        // setNftPic(nftPic);

    //     // Iterate through the array of assets
    //     assetsByOwner.forEach(asset => {
    //       // Check if the asset has the 'attributeList'
    //       if (asset.attributes && asset.attributes.attributeList) {
    //         // Iterate through the attributeList array
    //         asset.attributes.attributeList.forEach(attribute => {
    //           // Check if the key is 'image'
    //           if (attribute.key === 'image') {
    //             console.log("Image URL:", attribute.value); // Logs the image URL
    //             nftPic = attribute.value;
    //           }
    //         });
    //       }
    //     });

    //     const firstImageValue = assetsByOwner[0].attributes.attributeList.find(attr => attr.key === 'image').value;
    //     console.log(firstImageValue);


    //     if (filteredAssets3.length > 0) {
    //         const pk = filteredAssets3[0].owner;
    //         console.log("pk ", pk);
    //     } else {
    //         console.log("No items found in filteredAssets3");
    //     }

    //     console.log("Assets fetched: ", assetsByOwner);
    // };

    // // display function outputs to ui
    // const outputs = [
    //     {
    //         title: 'Asset ID...',
    //         dependency: owner,
    //         href: `https://solscan.io/token/${owner}?cluster=devnet`,
    //     }
    // ];
