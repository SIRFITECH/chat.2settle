import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useTotalVolume = () => {
  return useQuery({
    queryKey: ["total-volume"],
    queryFn: () =>
      axios.get<ServerData>(`${apiURL}/api/fetchYTD`).then((response) => {
        const rawVolume = response.data.ytdVolume.replace(/[,$]/g, ""); // Remove commas
        const ytdVolume = parseFloat(rawVolume);
        console.log("YTD", rawVolume);

        if (isNaN(ytdVolume)) {
          throw new Error("Invalid rate received");
        }

        return ytdVolume;
      }),
    staleTime: 15 * 60 * 1000, // 15 mins
  });
};

export default useTotalVolume;
