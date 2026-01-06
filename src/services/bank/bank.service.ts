import { BankName } from "@/types/general_types";
import api from "../api-client";

const nubanApi = process.env.NEXT_PUBLIC_NUBAN_API;
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

export const fetchBankDetails = async (
  bank_code: string,
  acc_no: string
): Promise<any | null> => {
  try {
    const response = await api.get(
      `https://app.nuban.com.ng/api/${nubanApi}?bank_code=${bank_code}&acc_no=${acc_no}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching bank details for bank code ${bank_code} and account number ${acc_no}:`,
      error
    );
    return null;
  }
};
