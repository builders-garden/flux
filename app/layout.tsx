import type { Metadata } from "next";
import { Overpass_Mono } from "next/font/google";
const overpass = Overpass_Mono({ subsets: ["latin"] });

import "./globals.css";

export const metadata: Metadata = {
  title: "Swifty",
  description: "Financial infrastructure to grow your revenue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${overpass.className} antialiased`}>{children}</body>
    </html>
  );
}
