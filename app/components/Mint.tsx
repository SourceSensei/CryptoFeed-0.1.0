"use client";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
  PublicKey,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

function Mint() {
  const { connection } = useConnection();
  const { publicKey, wallet } = useWallet();

  const metadata = {
    name: "TestNFT",
    symbol: "INFT",
    description: "My new custom NFT 2",
    image:
      "https://s2.glbimg.com/6fLjMPYo50gB1llNwE11EVXdf8w=/620x430/e.glbimg.com/og/ed/f/original/2022/02/21/https___hypebeast.com_image_2021_10_bored-ape-yacht-club-nft-3-4-million-record-sothebys-metaverse-0.jpg",
    creators: [{ address: publicKey, share: 100 }],
  };

  async function mintOne() {
    const keypair = wallet;

    if (!publicKey) throw new WalletNotConnectedError();

    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    console.log(wallet);

    const metaplex = Metaplex.make(connection)
      // set our keypair to use, and pay for the transaction
      .use(walletAdapterIdentity(keypair?.adapter))
      // define a storage mechanism to upload with
      .use(
        bundlrStorage({
          address: "https://devnet.bundlr.network",
          providerUrl: "https://api.devnet.solana.com",
          timeout: 60000,
        })
      );

    const { uri } = await metaplex.nfts().uploadMetadata(metadata);

    console.log("Uploading metadata...");
    console.log("Metadata uploaded:", uri);

    const { nft, response } = await metaplex.nfts().create({
      uri,
      name: metadata.name,
      symbol: metadata.symbol,

      // `sellerFeeBasisPoints` is the royalty that you can define on nft
      sellerFeeBasisPoints: 500, // Represents 5.00%.

      isMutable: true,
    });

    console.log(nft);
    console.log({ txSignature: response.signature });
  }

  return (
    <div>
      <button onClick={mintOne}>Mint now</button>
    </div>
  );
}

export default Mint;
