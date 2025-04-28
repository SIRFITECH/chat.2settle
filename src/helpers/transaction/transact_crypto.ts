import { WalletAddress, WalletType } from "@/types/wallet_types";

export const getWalletType = (wallet: WalletAddress | null): WalletType => {
  if (!wallet) return "UNKNOWN";
  if (wallet.startsWith("0x")) return "EVM";
  if (
    wallet.startsWith("1") ||
    wallet.startsWith("3") ||
    wallet.startsWith("bc1")
  )
    return "BTC";
  return "UNKNOWN";
};
