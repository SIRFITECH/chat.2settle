import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  lastRateFetchedAt: number;

  profitRate: string;
  lastProfitRateFetchedAt: number;

  merchantRate: string;
  lastMerchantRateFetchedAt: number;

  totalVolume: string;
  lastTotalVolumeFetchedAt: number;

  setRate: (val: string) => void;
  setProfitRate: (val: string) => void;
  setMerchantRate: (val: string) => void;
  setTotalVolume: (val: string) => void;
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

export const usePaymentStore = create<PaymentStoreType>()(
  persist(
    (set) => ({
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
      lastRateFetchedAt: 0,
      profitRate: "",
      lastProfitRateFetchedAt: 0,
      merchantRate: "",
      lastMerchantRateFetchedAt: 0,
      totalVolume: "",
      lastTotalVolumeFetchedAt: 0,

      setPaymentMode: (val) => set({ paymentMode: val }),
      setCrypto: (val) => set({ crypto: val }),
      setTicker: (val) => set({ ticker: val }),
      setNetwork: (val) => set({ network: val }),
      setWallet: (val) => set({ wallet: val }),
      setAssetPrice: (val) => set({ assetPrice: val }),
      setEstimateAsset: (val) => set({ estimateAsset: val }),
      setPaymentAssetEstimate: (val) => set({ paymentAssetEstimate: val }),
      setPaymentNairaEstimate: (val) => set({ paymentNairaEstimate: val }),
      setRate: (rate) => set({ rate, lastRateFetchedAt: Date.now() }),
      setProfitRate: (val: string) =>
        set({ profitRate: val, lastProfitRateFetchedAt: Date.now() }),
      setMerchantRate: (val: string) =>
        set({ merchantRate: val, lastMerchantRateFetchedAt: Date.now() }),
      setTotalVolume: (val: string) =>
        set({ totalVolume: val, lastTotalVolumeFetchedAt: Date.now() }),
    }),
    {
      name: "payment-store",
      partialize: (state) => ({
        rate: state.rate,
        lastRateFetchedAt: state.lastRateFetchedAt,
        profitRate: state.profitRate,
        lastProfitRateFetchedAt: state.lastProfitRateFetchedAt,
        merchantRate: state.merchantRate,
        lastMerchantRateFetchedAt: state.lastMerchantRateFetchedAt,
        totalVolume: state.totalVolume,
        lastTotalVolumeFetchedAt: state.lastTotalVolumeFetchedAt,
      }),
    }
  )
);
