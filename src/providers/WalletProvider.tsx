"use client";

import React, { useMemo, ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
// import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolflareWalletAdapter, PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

// import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';


// Define the props interface
interface WalletConnectionProviderProps {
  children: ReactNode;
}
export const WalletConnectionProvider: React.FC<
  WalletConnectionProviderProps
> = ({ children }) => {

const network = WalletAdapterNetwork.Devnet;

const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(() => [new SolflareWalletAdapter(), new PhantomWalletAdapter], []);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
