"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Mint from "./components/Mint";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <div>
        <h1>Demo Wallet Adapter and Mint</h1>
      </div>
      <div>
        <WalletMultiButton />
      </div>
      <div>{publicKey ? <Mint /> : <h2>Sorry there is no wallet</h2>}</div>
    </main>
  );
}
