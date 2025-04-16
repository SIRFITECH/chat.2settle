import { connectXverseWallet } from "@/helpers/btc/connect_btc_wallet";
import React from "react";

const ConnectBTCButton = () => {
  return (
    <button onClick={() => connectXverseWallet()}>Connect BTC Wallet</button>
  );
};

export default ConnectBTCButton;
