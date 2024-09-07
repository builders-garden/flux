"use client";
import { PRODUCT_PURCHASE_ACTION_ID } from "@/lib/world-id";
import { Button, Image } from "@nextui-org/react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function WorldIDVerifyButton({
  productId,
  paymentLinkId,
  onSuccess,
  onError,
}: {
  productId: string;
  paymentLinkId: string;
  onSuccess: () => void;
  onError: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const verifyProof = async (proof: unknown) => {
    setLoading(true);
    const response = await fetch(`/api/payment-links/${paymentLinkId}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ proof }),
    });
    if (response.ok) {
      setIsVerified(true);
      onSuccess();
      setLoading(false);
    } else {
      onError();
      setLoading(false);
      throw new Error("You already purchased this product.");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {!isVerified && (
        <IDKitWidget
          app_id={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID! as `app_${string}`}
          action={PRODUCT_PURCHASE_ACTION_ID(productId, paymentLinkId)}
          verification_level={VerificationLevel.Device}
          handleVerify={verifyProof}
          onSuccess={onSuccess}
          onError={onError}
          // signal={address}
        >
          {({ open }) => (
            <Button
              color="primary"
              className="w-full"
              onClick={open}
              startContent={
                <Image
                  src={"/logos/worldcoin.svg"}
                  width={24}
                  height={24}
                  alt="Worldcoin Logo"
                />
              }
              isLoading={loading}
            >
              {loading ? "Verifying..." : "Verify with World ID"}
            </Button>
          )}
        </IDKitWidget>
      )}
      {isVerified && (
        <div className="flex flex-row gap-2 items-center">
          <CheckCircle className="text-green-500" />
          <span>Verified successfully with</span>
          <div className="flex flex-row items-center justify-center gap-1 text-xs bg-primary text-white rounded-md px-2 py-1">
            <Image
              src={"/logos/worldcoin.svg"}
              width={12}
              height={12}
              alt="Worldcoin Logo"
            />
            World ID
          </div>
        </div>
      )}
      <div className="text-xs">
        This verification ensures you are purchasing the product only once.
      </div>
    </div>
  );
}
