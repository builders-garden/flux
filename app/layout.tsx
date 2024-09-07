import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const overpass = Overpass({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flux",
  description: "Financial infrastructure to grow your revenue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${overpass.className} antialiased h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
