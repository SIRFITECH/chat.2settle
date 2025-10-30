import {
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
} from "@/helpers/api_calls";

// this would hold all API calls in the chatbot
export const getRates = async () => {
  try {
    const [fetchedRate, fetchedMerchantRate, fetchedProfitRate] =
      await Promise.all([fetchRate(), fetchMerchantRate(), fetchProfitRate()]);
    return { fetchedRate, fetchedMerchantRate, fetchedProfitRate };
  } catch (error) {
    console.error("Failed to fetch rates:", error);
    return null;
  }
};
