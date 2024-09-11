import { createWalletClient, encodeFunctionData, http } from "viem";
import { chainParser } from "../utils";
import { privateKeyToAccount } from "viem/accounts";
import {
  getContractAddressByChainId,
  getTokenAddressByChainId,
} from "../constants";
import { FLUX_SUB_ABI } from "./sub-abi";

export async function createSubscription(
  subscriberAddress: string,
  merchantAddress: string,
  chainId: number,
  amount: bigint,
  interval: number
) {
  const walletClient = createWalletClient({
    chain: chainParser(chainId),
    transport: http(),
  });
  const account = privateKeyToAccount(
    process.env.SUBSCRIPTION_WORKER_PRIVATE_KEY as `0x${string}`
  );
  const toAddress = getContractAddressByChainId(chainId);
  const tokenAddress = getTokenAddressByChainId(chainId);
  const data = encodeFunctionData({
    abi: FLUX_SUB_ABI,
    functionName: "createSubscription",
    args: [
      subscriberAddress,
      merchantAddress,
      tokenAddress!,
      amount,
      BigInt(interval),
    ],
  });
  const txHash = await walletClient.sendTransaction({
    account: account,
    to: toAddress as `0x${string}`,
    value: BigInt("0"),
    data: data,
  });
  return txHash;
}
