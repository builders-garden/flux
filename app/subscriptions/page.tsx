"use client";
import { useUserSubscriptions } from "@/hooks";
import { getContractAddressByChainId } from "@/lib/constants";
import { FLUX_SUB_ABI } from "@/lib/subscriptions/sub-abi";
import { shortenAddress } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
} from "@nextui-org/react";
import { Product, Subscription } from "@prisma/client";
import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";

export default function Subscriptions() {
  const { address } = useAccount();
  const { isPending, error, subscriptions, refetch } = useUserSubscriptions(
    address || "0x"
  );
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (address) refetch();
  }, [address]);

  if (!address) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <Button color="primary">Connect Wallet</Button>
      </div>
    );
  }

  const cancelSubscription = async (
    subscription: Subscription & { product: Product }
  ) => {
    setLoading(true);
    try {
      await walletClient?.switchChain({ id: subscription.chainId });

      const cancelSubTx = await walletClient?.writeContract({
        abi: FLUX_SUB_ABI,
        address: getContractAddressByChainId(subscription.chainId)!,
        functionName: "cancelSubscription",
        args: [BigInt(subscription.subscriptionId)],
      });

      if (cancelSubTx) {
        await publicClient?.waitForTransactionReceipt({
          hash: cancelSubTx,
        });

        await fetch(
          `/api/public/subscriptions?subscriptionId=${subscription.id}`,
          {
            method: "DELETE",
          }
        );

        await refetch();
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col p-8">
      <h1 className="text-3xl font-bold">Flux Subscriptions</h1>
      {isPending && (
        <div className="flex flex-col items-center justify-center h-full">
          <Spinner />
        </div>
      )}
      {!isPending && subscriptions.length === 0 && (
        <h2 className="mt-4">
          No subscriptions found for {shortenAddress(address)}.
        </h2>
      )}
      {!isPending && subscriptions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {subscriptions.map(
            (subscription: Subscription & { product: Product }) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <h2 className="font-bold">{subscription.product.name}</h2>
                </CardHeader>
                <CardBody>
                  <p>
                    <span className="font-bold">Price</span>: $
                    {parseFloat(subscription.product.price.toString())} / month
                  </p>
                  <p>
                    <span className="font-bold">Created at</span>:{" "}
                    {subscription.createdAt.toString()}
                  </p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Button
                    className="w-full"
                    color="danger"
                    isLoading={loading}
                    onClick={async () => {
                      await walletClient?.switchChain({
                        id: subscription.chainId,
                      });
                      await cancelSubscription(subscription);
                    }}
                  >
                    Cancel Subscription
                  </Button>
                </CardFooter>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}
