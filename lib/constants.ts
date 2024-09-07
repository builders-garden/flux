import { WebhookEventType } from "@prisma/client";

export const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const LIFI_DIAMOND_PROXY = "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae"; //on most chains

export interface Token {
  symbol: string;
  chainId: number;
  chainName: string;
  address: string;
  decimals: number;
}

export const TOKENS: Token[] = [
  // Optimism (Chain ID: 10)
  {
    symbol: "USDC",
    chainId: 10,
    chainName: "Optimism",
    address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
    decimals: 6,
  },
  {
    symbol: "USDT",
    chainId: 10,
    chainName: "Optimism",
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
    decimals: 6,
  },
  {
    symbol: "DAI",
    chainId: 10,
    chainName: "Optimism",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    decimals: 18,
  },
  {
    symbol: "ETH",
    chainId: 10,
    chainName: "Optimism",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },

  // Base (Chain ID: 8453)
  {
    symbol: "USDC",
    chainId: 8453,
    chainName: "Base",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
  },
  {
    symbol: "DAI",
    chainId: 8453,
    chainName: "Base",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
  },
  {
    symbol: "ETH",
    chainId: 8453,
    chainName: "Base",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },

  // Celo (Chain ID: 42220)
  {
    symbol: "cUSD",
    chainId: 42220,
    chainName: "Celo",
    address: "0x765de816845861e75a25fca122bb6898b8b1282a",
    decimals: 18,
  },
  {
    symbol: "cEUR",
    chainId: 42220,
    chainName: "Celo",
    address: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73",
    decimals: 18,
  },
  {
    symbol: "DAI",
    chainId: 42220,
    chainName: "Celo",
    address: "0xe4fe50cdd716522a56204352f00aa110f731932d",
    decimals: 18,
  },
  {
    symbol: "CELO",
    chainId: 42220,
    chainName: "Celo",
    address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    decimals: 18,
  },
  {
    symbol: "WETH",
    chainId: 42220,
    chainName: "Celo",
    address: "0x122013fd7df1c6f636a5bb8f03108e876548b455",
    decimals: 18,
  },

  // Mantle (Chain ID: 5000)
  {
    symbol: "USDC",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    decimals: 6,
  },
  {
    symbol: "USDT",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    decimals: 6,
  },
  {
    symbol: "WETH",
    chainId: 5000,
    chainName: "Mantle",
    address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
    decimals: 18,
  },
  {
    symbol: "MNT",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },

  // Blast (Chain ID: 81457)
  {
    symbol: "USDB",
    chainId: 81457,
    chainName: "Blast",
    address: "0x4300000000000000000000000000000000000003",
    decimals: 18,
  },
  {
    symbol: "ETH",
    chainId: 81457,
    chainName: "Blast",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
  {
    symbol: "WBTC",
    chainId: 81457,
    chainName: "Blast",
    address: "0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692",
    decimals: 8,
  },
  {
    symbol: "BLAST",
    chainId: 81457,
    chainName: "Blast",
    address: "0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad",
    decimals: 18,
  },
  // Sei (Chain ID: 1329)
  {
    symbol: "USDC",
    chainId: 1329,
    chainName: "Sei",
    address: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    decimals: 6,
  },
  {
    symbol: "USDT",
    chainId: 1329,
    chainName: "Sei",
    address: "0xB75D0B03c06A926e488e2659DF1A861F860bD3d1",
    decimals: 6,
  },
  {
    symbol: "SEI",
    chainId: 1329,
    chainName: "Sei",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
  },
];

export interface RecurringPayment {
  contractAddress: string;
  chainId: number;
  chainName: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
}

export const RECURRING_PAYMENTS: RecurringPayment[] = [
  // Sei (Chain ID: 1329)
  {
    contractAddress: "0xea6f7e3978ae26798c1d508957EAAD439bbeF5f4",
    chainId: 1329,
    chainName: "Sei",
    tokenAddress: "0x3894085Ef7Ff0f0aeDf52E2A2704928d1Ec074F1",
    tokenSymbol: "USDC",
    tokenDecimals: 6,
  },
  // Mantle (Chain ID: 5000)
  {
    contractAddress: "0xea6f7e3978ae26798c1d508957EAAD439bbeF5f4",
    chainId: 5000,
    chainName: "Mantle",
    tokenAddress: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    tokenSymbol: "USDC",
    tokenDecimals: 6,
  },
  // Celo (Chain ID: 42220)
  {
    contractAddress: "0xF69671827C264d9A6E7CF30970015c3692Fc1d97",
    chainId: 42220,
    chainName: "Celo",
    tokenAddress: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    tokenSymbol: "cUSD",
    tokenDecimals: 18,
  },
  // Base (Chain ID: 8453)
  {
    contractAddress: "0x1ee31c573296354aE74728035b276Bc44681bbcA",
    chainId: 8453,
    chainName: "Base",
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    tokenSymbol: "USDC",
    tokenDecimals: 6,
  },
];

export const WEBHOOK_EVENTS = [
  {
    id: WebhookEventType.CUSTOMER_CREATED,
    name: "Customer created",
  },
  {
    id: WebhookEventType.PAYMENT_SUCCESSFUL,
    name: "Payment successful",
  },
  {
    id: WebhookEventType.SUBSCRIPTION_CREATED,
    name: "Subscription created",
  },
  {
    id: WebhookEventType.SUBSCRIPTION_CANCELLED,
    name: "Subscription cancelled",
  },
];

export const getContractAddressByChainId = (
  chainId: number
): string | undefined => {
  const payment = RECURRING_PAYMENTS.find((p) => p.chainId === chainId);
  return payment?.contractAddress;
};
export const getTokenAddressByChainId = (
  chainId: number
): string | undefined => {
  const payment = RECURRING_PAYMENTS.find((p) => p.chainId === chainId);
  return payment?.tokenAddress;
};
