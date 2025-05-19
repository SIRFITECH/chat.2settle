import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletType } from "@/lib/wallets/types";

interface WalletConnectionState {
  walletType: WalletType | null;
  setWalletType: (type: WalletType) => void;
  clearWalletType: () => void;
}

export const useWalletStore = create(
  persist<WalletConnectionState>(
    (set) => ({
      walletType: null,
      setWalletType: (type) => set({ walletType: type }),
      clearWalletType: () => set({ walletType: null }),
    }),
    {
      name: "connected-wallet-type",
    }
  )
);
