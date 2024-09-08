"use client";

import usePimlico from "@/hooks/use-pimlico";
import { Button } from "@nextui-org/react";
import { useLogin } from "@privy-io/react-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { predictSmartAccountAddress } = usePimlico();
  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
      if (isNewUser) {
        const smartAccountAddress = await predictSmartAccountAddress();
        await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({
            email: user.email?.address,
            address: user.wallet?.address,
            smartAccountAddress,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-row justify-center items-center justify-items-center min-h-screen p-8 md:p-24 pb-20 gap-4 md:gap-24">
      <div className="flex flex-col-reverse md:flex-row justify-start md:justify-between items-center w-full">
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="text-2xl md:text-6xl font-black text-primary text-center md:text-left">
            Financial infrastructure to grow your revenue
          </div>
          <div className="text-lg text-center md:text-left">
            Financial infrastructure to grow your revenue. Companies use Flux to
            accept payments online and in person, embed financial services,
            power custom revenue models, and build a more profitable business.
          </div>
          <Button radius="full" color="primary" onClick={() => login()}>
            Start now
          </Button>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Image
            alt="Flux"
            src={"/logo-homepage.png"}
            height={400}
            width={400}
          />
        </div>
      </div>
    </div>
  );
}
