"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import tronweb from "tronweb/lib/esm/tronweb";
import { useTronWeb } from "@/hooks/wallet/useTronWeb";

const ConnectTronWallet = () => {
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"install" | "unlock" | null>(null);
  const { tronWeb, isReady } = useTronWeb();

  // useEffect(() => {
  //   let poll: NodeJS.Timeout;

  //   const detectWallet = () => {
  //     if (!window.tronWeb) {
  //       setModalType("install");
  //       return;
  //     }

  //     if (!window.tronWeb.ready) {
  //       setModalType("unlock");
  //       poll = setInterval(() => {
  //         if (window.tronWeb?.ready) {
  //           clearInterval(poll);
  //           setIsModalOpen(false);
  //           setModalType(null);
  //           connectTronWallet();
  //         }
  //       }, 500);
  //       return;
  //     }

  //     connectTronWallet();
  //   };

  //   detectWallet();

  //   return () => {
  //     if (poll) clearInterval(poll);
  //   };
  // }, []);

  const connectTronWallet = async () => {
    if (window.tronWeb && window.tronWeb.ready) {
      try {
        const userAddress = window.tronWeb.defaultAddress.base58;
        setAddress(userAddress);

        // Determine network
        const networkType = window.tronWeb.fullNode.host.includes("shasta")
          ? "Shasta Testnet"
          : window.tronWeb.fullNode.host.includes("nile")
          ? "Nile Testnet"
          : "Mainnet";
        setNetwork(networkType);

        // Get balance
        const balanceSun = await window.tronWeb.trx.getBalance(userAddress);
        const balanceTRX = window.tronWeb.fromSun(balanceSun).toString();
        setBalance(balanceTRX);

        console.log("TronLink is connected:", userAddress);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error connecting to Tron wallet:", error);
      }
    } else {
      console.log("Please connect Tron wallet.");
      if (!window.tronWeb) {
        setModalType("install");
        setIsModalOpen(true);
      } else if (!window.tronWeb.ready) {
        setModalType("unlock");
        setIsModalOpen(true);
      }
    }
  };

  const handleConnectClick = () => {
    if (!window.tronWeb) {
      setModalType("install");
      setIsModalOpen(true);
    } else if (!window.tronWeb.ready) {
      setModalType("unlock");
      setIsModalOpen(true);
    } else {
      connectTronWallet();
    }
  };

  return (
    <div>
      {address ? (
        <div className="flex flex-col space-y-2 p-2">
          <p className="text-sm">
            <strong>Address:</strong> {address.slice(0, 6)}...
            {address.slice(-4)}
          </p>
          <p className="text-sm">
            <strong>Network:</strong> {network}
          </p>
          <p className="text-sm">
            <strong>Balance:</strong> {Number.parseFloat(balance).toFixed(4)}{" "}
            TRX
          </p>
        </div>
      ) : (
        <Button
          className="bg-transparent h-6 border border-transparent shadow-none hover:bg-red-400"
          onClick={handleConnectClick}
        >
          Connect Wallet
        </Button>
      )}

      {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === "install"
                ? "Install a Tron Wallet"
                : "Unlock Your Tron Wallet"}
            </DialogTitle>
            <DialogDescription>
              {modalType === "install"
                ? "To connect your wallet, please install TronLink or Trust Wallet."
                : "Please unlock your TronLink wallet by opening the extension and entering your password."}
            </DialogDescription>
          </DialogHeader>

          {modalType === "install" ? (
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
          ) : modalType === "unlock" ? (
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                After unlocking your wallet, this dialog will close
                automatically.
              </p>
              <Button
                onClick={() => connectTronWallet()}
                className="bg-red-700 hover:bg-red-600"
              >
                Check Connection Again
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default ConnectTronWallet;
