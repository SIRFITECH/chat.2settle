import { create } from "zustand";

export type PaymentStoreType = {
  rate: string;
  paymentMode: string;
  crypto: string;
  ticker: string;
  network: string;
  wallet: string;
  assetPrice: string;
  estimateAsset: string;
  paymentAssetEstimate: string;
  paymentNairaEstimate: string;

  setRate: (val: string) => void;
  setPaymentMode: (val: string) => void;
  setCrypto: (val: string) => void;
  setTicker: (val: string) => void;
  setNetwork: (val: string) => void;
  setWallet: (val: string) => void;
  setAssetPrice: (val: string) => void;
  setEstimateAsset: (val: string) => void;
  setPaymentAssetEstimate: (val: string) => void;
  setPaymentNairaEstimate: (val: string) => void;
};

export const usePaymentStore = create<PaymentStoreType>((set) => ({
  rate: "",
  paymentMode: "",
  crypto: "",
  ticker: "",
  network: "",
  wallet: "",
  assetPrice: "",
  estimateAsset: "",
  paymentAssetEstimate: "",
  paymentNairaEstimate: "",

  setRate: (val) => set({ rate: val }),
  setPaymentMode: (val) => set({ paymentMode: val }),
  setCrypto: (val) => set({ crypto: val }),
  setTicker: (val) => set({ ticker: val }),
  setNetwork: (val) => set({ network: val }),
  setWallet: (val) => set({ wallet: val }),
  setAssetPrice: (val) => set({ assetPrice: val }),
  setEstimateAsset: (val) => set({ estimateAsset: val }),
  setPaymentAssetEstimate: (val) => set({ paymentAssetEstimate: val }),
  setPaymentNairaEstimate: (val) => set({ paymentNairaEstimate: val }),
}));
