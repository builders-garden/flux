import { prisma } from "./index";
import { createThirdwebClient } from "thirdweb";
import { upload } from "thirdweb/storage";

const generateHTML = (slug: string) =>
  `<html>
    <head>
     <meta http-equiv="refresh" content="0; URL=https://flux.builders.garden/pay/${slug}" />
   </head>
  </html>
`;

export const createRecord = async (slug: string, address: string) => {
  try {
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY!,
    });

    const campaignURI = await upload({
      client,
      files: [new File([generateHTML(slug)], `index.html`)],
    });

    const newRecord = await prisma.record.create({
      data: {
        owner: address,
        name: `${slug}.fluxlink.eth`,
        addresses: {},
        texts: {},
        contenthash: campaignURI.replace("/index.html", ""),
      },
    });

    return newRecord;
  } catch (error) {
    console.error("Error creating ENS record:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
