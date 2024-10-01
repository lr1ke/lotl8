import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import wallet from "../wallet.json";

export const uploadImage = async (blob: Blob) => {
  const umi = createUmi("https://api.mainnet-beta.solana.com", "finalized");
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
  const myKeypairSigner = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(myKeypairSigner)).use(irysUploader());

  console.log("Uploading image...");

  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const nftImage = createGenericFile(uint8Array, "NoteImage.png", { contentType: "image/png" });

  const [imageUri] = await umi.uploader.upload([nftImage]);
  return imageUri;
};
