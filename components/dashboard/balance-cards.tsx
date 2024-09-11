import { useUserStore } from "@/lib/store";
import { BASE_USDC_ADDRESS } from "@/lib/utils";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { createPublicClient, erc20Abi, formatUnits, http } from "viem";
import { base } from "viem/chains";

export default function BalanceCards() {
  const [usdBalance, setUsdBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    if (currentUser) fetchBalance();
  }, [currentUser]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(),
      });
      const usdcBalance = await publicClient?.readContract({
        abi: erc20Abi,
        address: BASE_USDC_ADDRESS,
        functionName: "balanceOf",
        args: [
          currentUser?.smartAccountAddress ||
            (currentUser?.address! as `0x${string}`),
        ],
      });

      if (usdcBalance) {
        const parsedUsdcBalance = formatUnits(usdcBalance, 6);

        setUsdBalance(Number(parsedUsdcBalance));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Balance</div>
      <div className="grid grid-cols-2 gap-x-4">
        <Card>
          <CardHeader className="pb-1">USD</CardHeader>
          <CardBody className="text-lg font-bold pt-0">
            ${usdBalance.toFixed(2)}
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-1">EUR</CardHeader>
          <CardBody className="text-lg font-bold pt-0">
            €{(usdBalance * 0.9).toFixed(2)}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
