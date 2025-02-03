import tronweb from "@/utils/tronweb";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import Link from "next/link";

const ConnectTronWallet = () => {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!window.tronWeb) {
      setIsModalOpen(true);
    } else if (window.tronWeb.ready) {
      connectTronWallet();
    } else {
      window.addEventListener("tronWeb#initialized", () => {
        connectTronWallet();
      });
    }
  }, []);

  const connectTronWallet = async () => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      setAddress(window.tronWeb.defaultAddress.base58);
      setNetwork(
        tronweb.fullNode.host.includes("shasta") ? "Shasta Testnet" : "Mainnet"
      );

      const balanceSun = await tronweb.trx.getBalance();
      const balanceTRX = tronweb.fromSun(balanceSun).toString();
      setBalance(balanceTRX);
    } else {
      console.log("Please connect Tron wallet.");
    }
  };

  return (
    <div>
      {address ? (
        <div>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Network:</strong> {network}
          </p>
          <p>
            <strong>Balance:</strong> {balance} TRX
          </p>
        </div>
      ) : (
        <Button
          className="bg-transparent h-6 border border-transparent shadow-none hover:bg-red-400"
          onClick={() => {
            console.log("Connect clicked");
            setIsModalOpen(true);
          }}
        >
          Connect Wallet
        </Button>
      )}

      {/* Modal to prompt wallet installation */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install a Tron Wallet</DialogTitle>
            <DialogDescription>
              To connect your wallet, please install TronLink or Trust Wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <Button asChild variant="outline">
              <a
                href="https://www.tronlink.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install TronLink
              </a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://trustwallet.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install Trust Wallet
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default ConnectTronWallet;
