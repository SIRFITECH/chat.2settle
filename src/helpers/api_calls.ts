import axios from "axios";
import { ServerData } from "../types/types";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

export const fetchRate = async (): Promise<number> => {
  try {
    const response = await axios.get<ServerData>(`${apiURL}/api/rate`);
    const rawRate = response.data.rate.replace(/,/g, ""); // Remove commas
    const rate = parseFloat(rawRate);

    if (isNaN(rate)) {
      throw new Error("Invalid rate received");
    }

    return rate;
  } catch (error) {
    console.error("Error fetching rates:", error);
    throw error;
  }
};
