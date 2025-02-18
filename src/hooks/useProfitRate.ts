import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const useRate = () => {
  return useQuery<number, Error>({
    queryKey: ["profit_rate"],
    queryFn: () =>
      axios
        .get<ServerData>(`${apiURL}/api/merchant_profit`)
        .then((response) => {
          const rawRate = response.data.profitRate.replace(/,/g, "");
          const profitRate = parseFloat(rawRate);

          if (isNaN(profitRate)) {
            throw new Error("Invalid profit rate received");
          }

          return profitRate;
        }),
    staleTime: 15 * 60 * 1000, // 15 mins
c  });
};

export default useRate;
