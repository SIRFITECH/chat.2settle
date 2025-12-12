import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useMerchantRate = () => {
  return useQuery<number, Error>({
    queryKey: ["merchant_rate"],
    queryFn: () =>
      axios
        .get<ServerData>(`${apiURL}/api/rates/merchant_rate`)
        .then((response) => {
          const rawRate = response.data.merchantRate.replace(/,/g, "");
          const merchant_rate = parseFloat(rawRate);

          if (isNaN(merchant_rate)) {
            throw new Error("Invalid rate received");
          }

          return merchant_rate;
        }),
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 2000; 
      const jitter = Math.random() * 2000; 
      return base + jitter;
    },
    staleTime: 15 * 60 * 1000, // 15 mins
  });
};

export default useMerchantRate;
