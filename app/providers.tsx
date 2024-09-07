"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={{
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
          },
          embeddedWallets: {
            createOnLogin: "all-users",
          },
        }}
      >
        <main className="h-full">{children}</main>
      </PrivyProvider>
    </NextUIProvider>
  );
}
