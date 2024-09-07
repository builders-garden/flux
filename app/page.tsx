"use client";

import { Button } from "@nextui-org/react";
import { useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: (user, isNewUser) => {
      console.log(user, isNewUser);
      router.push("/dashboard");
    },
  });

  return (
    <div className="flex flex-row justify-center items-center justify-items-center min-h-screen p-24 pb-20 gap-16 sm:p-20]">
      <div className="flex flex-row justify-center">
        <div className="w-1/2 flex flex-col gap-4">
          <div className="text-6xl font-black text-primary">
            Financial infrastructure to grow your revenue
          </div>
          <div className="text-lg">
            Join the millions of companies of all sizes that use Stripe to
            accept payments online and in person, embed financial services,
            power custom revenue models, and build a more profitable business.
          </div>
          <Button radius="full" color="primary" onClick={() => login()}>
            Start now
          </Button>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
}
