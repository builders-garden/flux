import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { base, baseSepolia, blast, celo, mantle, optimism } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base, baseSepolia, mantle, celo, optimism, blast],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [mantle.id]: http(),
    [celo.id]: http(),
    [optimism.id]: http(),
    [blast.id]: http(),
  },
});
