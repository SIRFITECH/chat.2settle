import axios from "axios";
import {
  BankName,
  ReferralUser,
  ServerData,
  userData,
  vendorData,
  WalletInfo,
} from "../types/general_types";

const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

// FETCH CURRENT EXCHANGE RATE FROM DB
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
// FETCH CURRENT EXCHANGE RATE FROM DB
export const fetchTotalVolume = async (): Promise<number> => {
  try {
    const response = await axios.get<{ ytdVolume: string; dbVolume: string }>(
      `${apiURL}/api/fetchYTD`
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
    const response = await axios.get<ServerData>(`${apiURL}/api/merchant_rate`);
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
    const response = await axios.get<ServerData>(
      `${apiURL}/api/merchant_profit`
    );
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

// CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
export const checkUserExists = async (
  phone: string
): Promise<{ exists: boolean; user?: vendorData }> => {
  try {
    const response = await axios.get("/api/check_user", {
      params: { phone_number: phone },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export const checkReferralExists = async (
  referralCode: string
): Promise<{ exists: boolean; user?: ReferralUser }> => {
  try {
    const response = await axios.post("/api/referral", {
      referralCode: referralCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking referral existence:", error);
    throw error;
  }
};


export const checkTranscationExists = async (
  transac_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/check_transaction", {
      params: { transac_id: transac_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { exists: false, user: undefined };
  }
};

// CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
export const checkGiftExists = async (
  gift_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/check_gift", {
      params: { gift_id: gift_id },
    });
    const { exists, user } = response.data;

    if (!exists || !user) {
      return { exists: false };
    }
    // const gift = user[0].transaction;

    const newUser: userData = {
      crypto: user.crypto,
      network: user.network,
      estimation: user.estimation,
      Amount: user.Amount,
      charges: user.charges,
      mode_of_payment: user.mode_of_payment,
      acct_number: user.acct_number,
      bank_name: user.bank_name,
      receiver_name: user.receiver_name,
      receiver_amount: user.receiver_amount,
      crypto_sent: user.crypto_sent,
      wallet_address: user.wallet_address,
      status: "Processing",
      Date: user.Date,
      customer_phoneNumber: user.customer_phoneNumber,
      transac_id: user.transac_id,
      settle_walletLink: user.settle_walletLink,
      chat_id: user.chat_id,
      current_rate: user.current_rate,
      merchant_rate: user.merchant_rate,
      gift_status: user.gift_status,
      receiver_phoneNumber: user.receiver_phoneNumber,
      gift_chatID: user.gift_chatID,
      name: user.name,
      asset_price: user.asset_price,
      request_id: user.request_id,
      ref_code: user.ref_code,
    };

    return { exists: true, user: newUser };
    // return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export const checkRequestExists = async (
  requestID: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/confirm_request", {
      params: { request_id: requestID },
    });
    const { exists, transactions } = response.data;
    if (!exists || !transactions || transactions.length === 0) {
      return { exists: false };
    }
    const request = transactions[0].transaction;

    const user: userData = {
      crypto: request.crypto,
      network: request.network,
      estimation: request.estimation,
      Amount: request.Amount,
      charges: request.charges,
      mode_of_payment: request.mode_of_payment,
      acct_number: request.acct_number,
      bank_name: request.bank_name,
      receiver_name: request.receiver_name,
      receiver_amount: request.receiver_amount,
      crypto_sent: request.crypto_sent,
      wallet_address: request.wallet_address,
      status: "Processing",
      Date: request.Date,
      customer_phoneNumber: request.customer_phoneNumber,
      transac_id: request.transac_id,
      settle_walletLink: request.settle_walletLink,
      chat_id: request.chat_id,
      current_rate: request.current_rate,
      merchant_rate: request.merchant_rate,
      gift_status: request.gift_status,
      receiver_phoneNumber: request.receiver_phoneNumber,
      gift_chatID: request.gift_chatID,
      name: request.name,
      asset_price: request.asset_price,
      request_id: request.request_id,
      ref_code: request.ref_code,
    };
    return { exists: true, user };
  } catch (error) {
    console.error("Error checking request existence:", error);
    throw error;
  }
};

// GET THE AVAILABLE WALLET FROM DB 
export const getAvaialableWallet = async (
  network: string
): Promise<WalletInfo> => {
  try {
    const response = await axios.get(`${apiURL}/api/get_available_wallet`, {
      params: { network: network },
    });

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
        const waitTime = error.response.data.message.match(/\d+/)[0];
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

export const getDirectDebitWallet = async (type: string): Promise<string> => {
  const serial_id = 14;

  try {
    const response = await axios.get("/api/get_direct_debit_wallet", {
      params: { type, id: serial_id },
    });

    if (response.status === 200) {
      console.log("Wallet is:", response.data.wallet);
      return response.data.wallet;
    } else if (response.status === 404) {
      return "Wallet not found";
    } else if (response.status === 500) {
      return "Internal error occurred";
    }

    return "Unexpected response";
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    return "Unexpected response from server";
  }
};

export const isGiftValid = async (
  gift_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/confirm_gift", {
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

export const updateUser = async (
  updatedData: Partial<vendorData>
): Promise<void> => {
  try {
    const response = await axios.post("/api/update_user", {
      ...updatedData,
    });

    if (response.status === 200) {
      console.log("User updated successfully:", response.data);
    } else {
      console.error("Unexpected status code:", response.status);
      console.error("Failed to update user:", response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Error updating user data:", error);
    }
    throw new Error("Failed to update user data");
  }
};

// UPDATE THE TRANSACTION STATUS
export const updateTransaction = async (transac_id: string, status: string) => {
  try {
    const response = await axios.post("/api/update_transaction", {
      transac_id,
      status,
    });

    if (response.status === 200) {
      console.log("Status updated successfully:", response.data.message);
    } else {
      console.error("Failed to update status:", response.data.message);
    }
  } catch (error) {
    console.error("Error occurred while updating status:", error);
  }
};

// UPDATE THE TRANSACTION STATUS
export const updateGiftTransaction = async (
  gift_chatID: string,
  updateData: Record<string, any>
) => {
  try {
    const response = await axios.post("/api/update_gift", {
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

export const updateRequest = async (
  request_id: string,
  updateData: Record<string, any>
) => {
  try {
    const response = await axios.post("/api/update_request", {
      request_id,
      ...updateData,
    });
    console.log(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
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

// WRITE A USER TO THE WALLET TABLE
export const createUser = async (user: any): Promise<any> => {
  try {
    const response = await axios.post<any>(`${apiURL}/api/create_user`, user);
    console.log("User data created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

// CREATE TRANSACTION IN THE TRANSACTION TABLE

export const createTransaction = async (user: any): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${apiURL}/api/create_transaction`,
      user
    );
    console.log("Use transaction created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

export const OpenAI = async (updatedMessages: any, sessionId: String): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${apiURL}/api/openai`,
      { messages: updatedMessages, sessionId: sessionId }
    );
    console.log("Use transaction created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};
// CREATE TRANSACTION IN THE TRANSACTION TABLE
export const createComplain = async (complainData: any): Promise<any> => {
  try {
    const response = await axios.post<any>(
      `${apiURL}/api/create_complain`,
      complainData
    );
    console.log("Use complain created successfully");
    return response.data;
  } catch (error) {
    console.error("Error storing user data:", error);
    throw new Error("Failed to store user data");
  }
};

// FETCH COIN CURRENT PRICE (FROM BINACE TICKER)
export async function fetchCoinPrice(ticker: string): Promise<number> {
  try {
    const response = await fetch(`${apiURL}/api/get_coin_price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ticker }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.price !== "number") {
      throw new Error("Invalid response structure");
    }

    console.log("Coin price:", data.price);
    return data.price;
  } catch (error) {
    console.error("Error fetching coin price:", error);
    throw error;
  }
}

export const fetchBankNames = async (extracted: string): Promise<BankName> => {
  try {
    const response = await axios.post<BankName>(`${apiURL}/api/bank_names/`, {
      message: extracted,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bank names:", error);
    throw new Error("Failed to fetch bank names");
  }
};

// QUERY BANK DETAILS FROM NUBAN
export const fetchBankDetails = async (
  bank_code: string,
  acc_no: string
): Promise<any | null> => {
  try {
    const response = await axios.get(
      `https://app.nuban.com.ng/api/NUBAN-WBODZCTK1831?bank_code=${bank_code}&acc_no=${acc_no}`
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

export const resolveBankAccount = async (
  bank_name: string,
  acc_no: string
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

    return bank_details[0].account_name;


  } catch (error) {
    console.error(
      `Error fetching bank details for bank code ${bank_name} and account number ${acc_no}:`,
      error
    );
    return null;
  }
};


