import slugify from "slugify";

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const nameToSlug = (text: string) => {
  if (!text) return "";
  return slugify(text, {
    lower: true,
    trim: true,
    replacement: "-",
  });
};
