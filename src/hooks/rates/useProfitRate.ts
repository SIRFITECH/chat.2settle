import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useProfitRate = () => {
  return useQuery<number, Error>({
    queryKey: ["profit_rate"],
    queryFn: () =>
      axios
        .get<ServerData>(`${apiURL}/api/rates/merchant_profit`)
        .then((response) => {
          const rawRate = response.data.profitRate.replace(/,/g, "");
          const profitRate = parseFloat(rawRate);

          if (isNaN(profitRate)) {
            throw new Error("Invalid profit rate received");
          }

          return profitRate;
        }),
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 3000;
      const jitter = Math.random() * 3000;
      return base + jitter;
    },
    staleTime: 15 * 60 * 1000, // 15 mins
  });
};

export default useProfitRate;
