import { ServerData } from "@/types/general_types";
import api from "../api-client";
// FETCH CURRENT EXCHANGE RATE FROM DB
export const fetchRate = async (): Promise<number> => {
  try {
    const response = await api.get<ServerData>(`/api/rates/rate`);
    const rawRate = response.data.rate.replace(/,/g, "");
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


// FETCH CURRENT EXCHANGE RATE FROM DB
export const fetchTotalVolume = async (): Promise<number> => {
  try {
    const response = await api.get<{ ytdVolume: string; dbVolume: string }>(
      `/api/dashboard/fetchYTD`
    );
    const rawVolume = response.data.ytdVolume.replace(/[,$]/g, ""); // Remove commas
    const ytdVolume = parseFloat(rawVolume);
    const db = parseFloat(response.data.dbVolume);

    if (isNaN(ytdVolume) || isNaN(db)) {
      throw new Error("Invalid rate received");
    }

    return ytdVolume + db;
  } catch (error) {
    console.error("Error fetching rates:", error);
    throw error;
  }
};

// FETCH MERCHANT RATE FROM DB
export const fetchMerchantRate = async (): Promise<number> => {
  try {
    const response = await api.get<ServerData>(`/api/rates/merchant_rate`);
    const rawRate = response.data.merchantRate.replace(/,/g, "");
    const merchant_rate = parseFloat(rawRate);

    if (isNaN(merchant_rate)) {
      throw new Error("Invalid rate received");
    }

    return merchant_rate;
  } catch (error) {
    console.error("Error fetching merchant rate:", error);
    throw error;
  }
};

// FETCH PROFIT RATE FROM DB
export const fetchProfitRate = async (): Promise<number> => {
  try {
    const response = await api.get<ServerData>(`/api/rates/merchant_profit`);
    const rawRate = response.data.profitRate.replace(/,/g, "");
    const profitRate = parseFloat(rawRate);

    if (isNaN(profitRate)) {
      throw new Error("Invalid profit rate received");
    }

    return profitRate;
  } catch (error) {
    console.error("Error fetching profit rate:", error);
    throw error;
  }
};

