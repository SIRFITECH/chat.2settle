import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const useRate = () => {
  return useQuery<number, Error>({
    queryKey: ["rate"],
    queryFn: () =>
      axios.get<ServerData>(`${apiURL}/api/rate`).then((response) => {
        const rawRate = response.data.rate.replace(/,/g, ""); // Remove commas
        const rate = parseFloat(rawRate);

        if (isNaN(rate)) {
          throw new Error("Invalid rate received");
        }

        return rate;
      }),
    staleTime: 5 * 60 * 1000, // 15 mins
  });
};

export default useRate;
