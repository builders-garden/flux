"use client";
import WorldIDVerifyButton from "@/components/world-id-verify-button";
import { usePaymentLink } from "@/hooks";
import { Token, TOKENS } from "@/lib/constants";
import { shortenAddress } from "@/lib/utils";
import { Input, Image, Button, Select, SelectItem } from "@nextui-org/react";
import { MailIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function PayPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { isPending, paymentLink } = usePaymentLink(slug);
  const { connect } = useConnect();
  const { address } = useAccount();
  const [selectedToken, setSelectedToken] = useState<Set<number>>(new Set([]));
  const [email, setEmail] = useState<string>("");
  const [worldIdVerified, setWorldIdVerified] = useState<boolean>(
    !paymentLink || paymentLink?.requiresWorldId ? false : true
  );
  if (isPending || !paymentLink) {
    return (
      <div className="min-h-screen min-w-screen">
        <div className="grid grid-cols-4 h-screen">
          <div className="col-span-2 bg-gray-50 p-4 h-full"></div>
          <div className="col-span-2 bg-white p-4 h-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-screen">
      <div className="grid grid-cols-4 h-screen">
        <div className="col-span-2 bg-gray-50 p-32 h-full flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <div className="rounded-full p-2 shadow-sm bg-white">
              <StoreIcon className="text-gray-400" />
            </div>
            <span className="text-sm font-semibold">
              {paymentLink?.user?.companyName ||
                shortenAddress(paymentLink?.user?.address)}
            </span>
          </div>
          <Image
            src={paymentLink?.product.imageUrl}
            width={250}
            height={250}
            className="rounded-lg"
            alt="Product Image"
          />
          <h1 className="text-3xl font-semibold">
            {paymentLink?.product.name}
          </h1>
          <p>{paymentLink?.product.description}</p>
          <h2 className="text-xl font-semibold">
            $
            {parseFloat(paymentLink?.product.price.toString() || "0").toFixed(
              2
            )}
          </h2>
        </div>
        <div className="col-span-2 bg-white p-4 h-full flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4">
          {address && (
            <>
              <Input
                autoFocus
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Email"
                placeholder="Enter your email"
                variant="bordered"
                isRequired
                value={email}
                onValueChange={setEmail}
              />
              <h3 className="text-lg font-semibold text-start">
                Payment method
              </h3>
              <Select
                items={TOKENS}
                variant="bordered"
                placeholder="Select token and chain"
                labelPlacement="outside"
                selectedKeys={selectedToken}
                // @ts-expect-error - Fix this
                onSelectionChange={setSelectedToken}
                isRequired
              >
                {(token: Token) => (
                  <SelectItem
                    key={`${token.symbol}-${token.address}-${token.chainId}`}
                    textValue={`${token.symbol} (${token.chainName})`}
                  >
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small">
                          {token.symbol} ({token.chainName})
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
              {paymentLink?.requiresWorldId && (
                <WorldIDVerifyButton
                  productId={paymentLink?.product.id}
                  paymentLinkId={paymentLink?.id}
                  onSuccess={() => {
                    console.log("World ID verified");
                    setWorldIdVerified(true);
                  }}
                  onError={() => {
                    console.error("Error verifying World ID");
                    setWorldIdVerified(false);
                  }}
                />
              )}
              <Button
                color="success"
                className="w-full"
                isDisabled={!email || !selectedToken || !worldIdVerified}
              >
                Pay
              </Button>
            </>
          )}
          {!address && (
            <Button
              color="primary"
              onClick={() => connect({ connector: injected() })}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
