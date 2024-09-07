import ImageKit from "imagekit";

export const FLUX_IMAGEKIT_URL_ENDPOINT =
  "https://ik.imagekit.io/buildersgarden/flux/";
export const IMAGEKIT_PUBLIC_KEY = "public_k1LSzOuC5idqGtjPwkT8ti4UJNY=";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: FLUX_IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = async (file: File, fileName: string) => {
  const imageBytes = await file!.arrayBuffer();
  const imageBuffer = Buffer.from(imageBytes);
  const response = await imagekit.upload({
    file:imageBuffer, //required
    fileName, //required
  });
  return response.url;
};

export const deleteImage = async (imageUrl: string) => {
  const response = await imagekit.deleteFile(imageUrl);
  return response;
};
