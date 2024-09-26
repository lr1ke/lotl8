
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletConnectionProvider } from "@/providers/WalletProvider";
import "./globals.css";
import Navbar from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echolotl",
  description: "Decentralizing the future of collective diary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectionProvider>
          <Navbar />
          {children}
        </WalletConnectionProvider>
      </body>
    </html>
  );
}