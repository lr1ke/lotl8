"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; 
import "@solana/wallet-adapter-react-ui/styles.css";


export const ConnectWallet: React.FC = () => {
  const { wallet, connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (connected) {
      console.log("Connected to Phantom Wallet", publicKey?.toString());
      console.log("Wallet info", wallet);
      console.log("Wallet connected", connected);
    }
  }, [connected, publicKey]);

  if (!mounted) return null; 

  return (
    <div className="flex justify-end">
      <WalletMultiButton  />
    </div>
  );
};