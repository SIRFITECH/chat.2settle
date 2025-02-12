import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useRate = () => {
  return useQuery<number, Error>({
    queryKey: ["merchant_rate"],
    queryFn: () =>
      axios.get<ServerData>(`${apiURL}/api/merchant_rate`).then((response) => {
        const rawRate = response.data.merchantRate.replace(/,/g, "");
        const merchant_rate = parseFloat(rawRate);

        if (isNaN(merchant_rate)) {
          throw new Error("Invalid rate received");
        }

        return merchant_rate;
      }),
    staleTime: 15 * 60 * 1000, // 15 mins
   });
};

export default useRate;
