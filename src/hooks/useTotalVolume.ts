import { apiURL } from "@/constants/constants";
import { ServerData } from "@/types/general_types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useTotalVolume = () => {
  return useQuery({
    queryKey: ["total-volume"],
    queryFn: () =>
      axios
        .get<ServerData>(`${apiURL}/api/dashboard/fetchYTD`)
        .then((response) => {
          const rawVolume = response.data.ytdVolume.replace(/[,$]/g, ""); // Remove commas
          const ytdVolume = parseFloat(rawVolume);
          const dbVolume = parseFloat(response.data.dbVolume);
          console.log("YTD", { ytdVolume, dbVolume });

          if (isNaN(ytdVolume) || isNaN(dbVolume)) {
            throw new Error("Invalid rate received");
          }

          return ytdVolume + dbVolume;
        }),
    staleTime: 5 * 60 * 1000, // 15 mins
  });
};

export default useTotalVolume;
