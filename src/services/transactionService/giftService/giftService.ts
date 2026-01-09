import { userData } from "@/types/general_types";
import api from "../../api-client"
import axios from "axios";

export const isGiftValid = async (
  gift_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await api.get("/api/gifts/confirm_gift", {
      params: { gift_id },
    });

    if (response.data.exists && response.data.transactions.length > 0) {
      // Extract the first transaction as the userData object
      const firstTransaction: userData =
        response.data.transactions[0].transaction;

      // Return the exists flag and the user object
      return { exists: true, user: firstTransaction };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error checking gift validity:", error);
    throw error;
  }
};

export const updateGiftTransaction = async (
  gift_chatID: string,
  updateData: Record<string, any>
) => {
  try {
    const response = await api.post("/api/gifts/update_gift", {
      gift_chatID,
      ...updateData,
    });
    console.log(response.data); // Handle the response
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Server responded with a status other than 2xx
      console.error("Server error:", error.response?.data);
    } else if (error instanceof Error) {
      // Network or other error
      console.error("Network error:", error.message);
    } else {
      // Some other unknown error
      console.error("An unknown error occurred");
    }
  }
};
