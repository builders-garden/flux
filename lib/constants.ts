export const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export interface Token {
  symbol: string;
  chainId: number;
  chainName: string;
  address: string;
}

export const TOKENS: Token[] = [
  // Optimism (Chain ID: 10)
  {
    symbol: "USDC",
    chainId: 10,
    chainName: "Optimism",
    address: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
  },
  {
    symbol: "USDT",
    chainId: 10,
    chainName: "Optimism",
    address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  },
  {
    symbol: "DAI",
    chainId: 10,
    chainName: "Optimism",
    address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  },
  {
    symbol: "ETH",
    chainId: 10,
    chainName: "Optimism",
    address: "0x0000000000000000000000000000000000000000",
  },

  // Base (Chain ID: 8453)
  {
    symbol: "USDC",
    chainId: 8453,
    chainName: "Base",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  {
    symbol: "DAI",
    chainId: 8453,
    chainName: "Base",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
  },
  {
    symbol: "ETH",
    chainId: 8453,
    chainName: "Base",
    address: "0x0000000000000000000000000000000000000000",
  },

  // Celo (Chain ID: 42220)
  {
    symbol: "cUSD",
    chainId: 42220,
    chainName: "Celo",
    address: "0x765de816845861e75a25fca122bb6898b8b1282a",
  },
  {
    symbol: "cEUR",
    chainId: 42220,
    chainName: "Celo",
    address: "0xd8763cba276a3738e6de85b4b3bf5fded6d6ca73",
  },
  {
    symbol: "DAI",
    chainId: 42220,
    chainName: "Celo",
    address: "0xe4fe50cdd716522a56204352f00aa110f731932d",
  },
  {
    symbol: "CELO",
    chainId: 42220,
    chainName: "Celo",
    address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  },
  {
    symbol: "WETH",
    chainId: 42220,
    chainName: "Celo",
    address: "0x122013fd7df1c6f636a5bb8f03108e876548b455",
  },

  // Mantle (Chain ID: 5000)
  {
    symbol: "USDC",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
  },
  {
    symbol: "USDT",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
  },
  {
    symbol: "WETH",
    chainId: 5000,
    chainName: "Mantle",
    address: "0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111",
  },
  {
    symbol: "MNT",
    chainId: 5000,
    chainName: "Mantle",
    address: "0x0000000000000000000000000000000000000000",
  },

  // Blast (Chain ID: 81457)
  {
    symbol: "USDB",
    chainId: 81457,
    chainName: "Blast",
    address: "0x4300000000000000000000000000000000000003",
  },
  {
    symbol: "ETH",
    chainId: 81457,
    chainName: "Blast",
    address: "0x0000000000000000000000000000000000000000",
  },
  {
    symbol: "WBTC",
    chainId: 81457,
    chainName: "Blast",
    address: "0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692",
  },
  {
    symbol: "BLAST",
    chainId: 81457,
    chainName: "Blast",
    address: "0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad",
  },
];

export const LIFI_DIAMOND_PROXY = "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae";
