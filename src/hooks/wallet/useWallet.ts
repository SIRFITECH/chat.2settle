// import { WalletContext } from "@/lib/wallets";
// import { WalletType } from "@/lib/wallets/types";
// import { useEffect, useState } from "react";
// import { useWalletStore } from "./useWalletStore";

// export function useWallet(type: WalletType) {
//   const { walletType } = useWalletStore();
//   // const [wallet] = useState(() => new WalletContext(type));
//   const [wallet, setWallet] = useState<WalletContext | null>(null);

//   useEffect(() => {
//     if (walletType) {
//       const context = new WalletContext(walletType);
//       setWallet(context);
//     }
//   }, [walletType]);

//   if (!wallet) return null;

//   const connect = () => wallet.connect.bind(wallet);
//   const disconnect = () => wallet.disconnect.bind(wallet);
//   const getWalletAddress = () => wallet.getWalletAddress.bind(wallet);
//   const getBalance = () => wallet.getBalance.bind(wallet);
//   const getENS = () => wallet.getENS.bind(wallet);

//   return {
//     connect,
//     disconnect,
//     getWalletAddress,
//     getBalance,
//     getENS,
//   };
// }
