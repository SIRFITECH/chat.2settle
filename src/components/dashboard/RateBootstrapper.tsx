"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePaymentStore } from "stores/paymentStore";
import {
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
  fetchTotalVolume,
} from "@/services/rate/rates.service";

// this is an invisible component that fetches and sets the rate in the payment store
export function RateBootstrapper() {
  const { rate, lastRateFetchedAt, setRate } = usePaymentStore();
  const { profitRate, lastProfitRateFetchedAt, setProfitRate } =
    usePaymentStore();
  const { merchantRate, lastMerchantRateFetchedAt, setMerchantRate } =
    usePaymentStore();
  const { totalVolume, lastTotalVolumeFetchedAt, setTotalVolume } =
    usePaymentStore();

  // --- RATE ---
  const shouldFetch = !rate || Date.now() - lastRateFetchedAt > 3 * 60 * 1000;

  const { data: rateData } = useQuery({
    queryKey: ["rate"],
    queryFn: fetchRate,
    enabled: shouldFetch,
  });

  useEffect(() => {
    if (rateData) {
      setRate(rateData.toString());
    }
  }, [rateData, setRate]);

  // --- PROFIT RATE ---
  const shouldFetchProfitRate =
    !rate || Date.now() - lastRateFetchedAt > 15 * 60 * 1000;

  const { data: profitData } = useQuery({
    queryKey: ["profit_rate"],
    queryFn: fetchProfitRate,
    enabled: shouldFetchProfitRate,
  });

  useEffect(() => {
    if (profitData) {
      setRate(profitData.toString());
    }
  }, [profitData, setProfitRate]);

  // --- MERCHANT RATE ---

  const shouldFetchMerchantRate =
    !merchantRate || Date.now() - lastMerchantRateFetchedAt > 15 * 60 * 1000;

  const { data: merchantData } = useQuery({
    queryKey: ["merchant_rate"],
    queryFn: fetchMerchantRate,
    enabled: shouldFetchMerchantRate,
  });

  useEffect(() => {
    if (merchantData) {
      setMerchantRate(merchantData.toString());
    }
  }, [merchantData, setMerchantRate]);

  // --- TOTAL VOLUME ---

  const shouldFetchVolume =
    !totalVolume || Date.now() - lastTotalVolumeFetchedAt > 15 * 60 * 1000;
  const { data: volumeData } = useQuery({
    queryKey: ["total-volume"],
    queryFn: fetchTotalVolume,
    enabled: shouldFetchVolume,
  });
  useEffect(() => {
    if (volumeData) {
      setTotalVolume(volumeData.toString());
    }
  }, [volumeData, setTotalVolume]);

  return null;
}

// this is an invisible component that fetches and sets the rate in the payment store
// export function RateBootstrapper() {
//   const store = usePaymentStore();

//   // --- RATE ---
//   const shouldFetchRate =
//     !store.rate || Date.now() - store.lastRateFetchedAt > 3 * 60 * 1000;

//   const { data: rateData } = useQuery({
//     queryKey: ["rate"],
//     queryFn: fetchRate,
//     enabled: shouldFetchRate,
//   });

//   useEffect(() => {
//     if (rateData) store.setRate(rateData.toString());
//   }, [rateData, store]);

//   // --- PROFIT RATE ---
//   const shouldFetchProfitRate =
//     !store.profitRate ||
//     Date.now() - store.lastProfitRateFetchedAt > 15 * 60 * 1000;

//   const { data: profitData } = useQuery({
//     queryKey: ["profit_rate"],
//     queryFn: fetchProfitRate,
//     enabled: shouldFetchProfitRate,
//     retry: 3,
//     retryDelay: (attempt) => Math.pow(2, attempt) * 3000 + Math.random() * 3000,
//     staleTime: 15 * 60 * 1000,
//   });

//   useEffect(() => {
//     if (profitData) store.setProfitRate(profitData.toString());
//   }, [profitData, store]);

// //   // --- MERCHANT RATE ---
// //   const shouldFetchMerchantRate =
// //     !store.merchantRate ||
// //     Date.now() - store.lastMerchantRateFetchedAt > 15 * 60 * 1000;

// //   const { data: merchantData } = useQuery({
// //     queryKey: ["merchant_rate"],
// //     queryFn: fetchMerchantRate,
// //     enabled: shouldFetchMerchantRate,
// //     retry: 3,
// //     retryDelay: (attempt) => Math.pow(2, attempt) * 2000 + Math.random() * 2000,
// //     staleTime: 15 * 60 * 1000,
// //   });

// //   useEffect(() => {
// //     if (merchantData) store.setMerchantRate(merchantData.toString());
// //   }, [merchantData, store]);

// //   // --- TOTAL VOLUME ---
// //   const shouldFetchVolume =
// //     !store.totalVolume ||
// //     Date.now() - store.lastTotalVolumeFetchedAt > 5 * 60 * 1000;

// //   const { data: volumeData } = useQuery({
// //     queryKey: ["total-volume"],
// //     queryFn: fetchTotalVolume,
// //     enabled: shouldFetchVolume,
// //     retry: 3,
// //     retryDelay: (attempt) => Math.pow(2, attempt) * 1000 + Math.random() * 1000,
// //     staleTime: 5 * 60 * 1000,
// //   });

// //   useEffect(() => {
// //     if (volumeData) store.setTotalVolume(volumeData.toString());
// //   }, [volumeData, store]);

//   return null;
// }
