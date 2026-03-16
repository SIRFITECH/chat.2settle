import { BankName } from "@/types/general_types";
import api from "../api-client";
import axios from "axios";

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

interface FetchBankDetailsResponse {
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code: string;
}

export const fetchBankDetails = async (
  bank_code: string,
  acc_no: string,
): Promise<FetchBankDetailsResponse[] | null> => {
  try {
    const response = await axios.get(
      `https://app.nuban.com.ng/api/${nubanApi}?bank_code=${bank_code}&acc_no=${acc_no}`,
    );
    return response.data;
  } catch (error) {
    // log error
    if (error instanceof axios.AxiosError) {
      console.error("NUBAN API ERROR:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error(
        `Error fetching bank details for bank code ${bank_code} and account number ${acc_no}:`,
      );
    }
    return null;
  }
};

export const resolveBankAccount = async (
  bank_name: string,
  acc_no: string,
): Promise<any | null> => {
  try {
    const bank = await fetchBankNames(bank_name);

    const text = bank.message[0]; // "1. OPAY 100004"

    // Remove the "1." at the start
    const cleanText = text.replace(/^\d+\.\s*/, ""); // "OPAY 100004"

    // Split by space
    const parts = cleanText.split(" ");

    // Bank name is everything except the last part
    const bankName = parts.slice(0, -1).join(" ");
    // "OPAY"

    // Bank code is the last part
    const bankCode = parts[parts.length - 1];

    const bank_details = await fetchBankDetails(bankCode, acc_no);

    return bank_details ? bank_details[0].account_name : null;
  } catch (error) {
    console.error(
      `Error fetching bank details for bank code ${bank_name} and account number ${acc_no}:`,
      error,
    );
    return null;
  }
};
