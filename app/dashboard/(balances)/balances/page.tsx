"use client";
import { useUserStore } from "@/lib/store";
import { BASE_USDC_ADDRESS } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import { AlertTriangleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { createPublicClient, erc20Abi, formatUnits, http } from "viem";
import { base } from "viem/chains";

export default function BalancesPage() {
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
    <section className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Balances</h1>
      <div className="grid grid-cols-2 gap-x-2">
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
      <Divider />
      <div className="flex flex-col space-y-2">
        {(!currentUser?.companyName ||
          !currentUser?.companyUrl ||
          !currentUser?.bankAccountBic ||
          !currentUser.bankAccountCountry ||
          !currentUser.bankAccountNumber) && (
          <Card>
            <CardBody className="bg-amber-500 text-amber-900 flex flex-row space-x-2 items-center">
              <AlertTriangleIcon />
              <p className="text-sm">
                You need to provide your full name, company name and URL, and
                the bank data in order to receive off-ramp payments from Flux.
                <br />
                Please check your <span className="font-bold">
                  settings
                </span>{" "}
                page in the top right corner to update your profile.
              </p>
            </CardBody>
          </Card>
        )}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-bold">Payouts</h2>
          <Button color="success">Payout</Button>
        </div>
        <p className="text-xl">
          Transfer your Flux balance to your bank account.
        </p>
      </div>
      <div className="flex flex-col max-w-lg space-y-2">
        <div className="flex flex-row justify-between">
          <p>On the way to your bank account</p>
          <p>$0.00</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Sent to your bank account</p>
          <p>$0.00</p>
        </div>
        <Divider className="max-w-lg" />
        <div className="flex flex-row justify-between">
          <p className="font-bold">Total</p>
          <p className="font-bold">$0.00</p>
        </div>
      </div>
    </section>
  );
}
