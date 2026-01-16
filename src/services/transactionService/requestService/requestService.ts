import { userData } from "@/types/general_types";
import api from "../../api-client"
import axios from "axios";

export const isRequestValid = async (
  request_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await api.get("/api/requests/check_request", {
      params: { request_id },
    });

    if (response.data.exists && response.data.user) {
      // Extract the first transaction as the userData object
      const firstTransaction: userData = response.data.user;
      

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
