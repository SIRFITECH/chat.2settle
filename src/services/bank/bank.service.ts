import { BankName } from "@/types/general_types";
import api from "../api-client";
export const fetchBankNames = async (extracted: string): Promise<BankName> => {
  try {
    const response = await api.post<BankName>(`/api/banks/bank_names/`, {
      message: extracted,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bank names:", error);
    throw new Error("Failed to fetch bank names");
  }
};
