import slugify from "slugify";
import { Chain, celo, base, mantle, sei } from "viem/chains";

export const shortenAddress = (address: string) => {
  if (!address) return "";
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

export const BASE_USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const BASE_SEPOLIA_USDC_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

export const chainParser = (chainId: number): Chain => {
  switch (chainId) {
    case 42220:
      return celo;
    case 8453:
      return base;
    case 5000:
      return mantle;
    case 713715: // Assuming this is the chainId for Sei
      return sei;
    default:
      return base;
  }
};