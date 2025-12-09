import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useRate = () => {
  return useQuery<number, Error>({
    queryKey: ["rate"],
    queryFn: () =>
      axios.get<ServerData>(`${apiURL}/api/rates/rate`).then((response) => {
        const rawRate = response.data.rate.replace(/,/g, "");
        const rate = parseFloat(rawRate);

        if (isNaN(rate)) {
          throw new Error("Invalid rate received");
        }

        return rate;
      }),
    staleTime: 5 * 60 * 1000, // 15 mins
    retry: 3,
    // retry with exponential backoff and jitter for randomeness
    retryDelay: (attempt) => {
      const base = Math.pow(2, attempt) * 1000;
      const jitter = Math.random() * 1000;
      return base + jitter;
    },
  });
  
};

export default useRate;
