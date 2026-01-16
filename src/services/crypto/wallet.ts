import { WalletInfo } from "@/types/general_types";
import api from "../api-client"
import axios from "axios";

export const getAvaialableWallet = async (
  network: string
): Promise<WalletInfo> => {
  try {
    const response = await api.get(
      `/api/transaction/get_available_wallet`,
      {
        params: { network: network },
      }
    );

    if (response.status === 200 && response.data.activeWallet) {
      console.log(
        `Available wallet for ${network}:`,
        response.data.activeWallet
      );
      return {
        activeWallet: response.data.activeWallet,
        lastAssignedTime: response.data.lastAssignedTime,
      };
    } else {
      console.log("The error status is:", response.status);
      throw new Error(
        `No wallet found for network: ${network} error is ${response.status}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        console.error(`No active wallet found for network ${network}`);
        throw new Error(`No active wallet available for network: ${network}`);
      } else if (error.response.status === 503) {
        let waitTime = "a few";
        if (error.response?.data?.message) {
          const match = error.response.data.message.match(/\d+/);
          if (match && match[0] !== "0") {
            waitTime = match[0];
          }
        }
        throw new Error(
          `Ops!! you will have to wait a little longer. Please try again in ${waitTime} seconds.`
        );
      } else {
        console.error(
          `API error for network ${network}:`,
          error.response.data.message
        );
        throw new Error(`API error for network: ${network}`);
      }
    } else {
      console.error(`Error fetching wallet for network ${network}:`, error);
      throw new Error(`Failed to fetch wallet for network: ${network}`);
    }
  }
};