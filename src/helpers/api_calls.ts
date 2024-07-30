import axios from "axios";
import {
  BankName,
  btcWalletData,
  ercWalletData,
  ServerData,
  trcWalletData,
  userData,
  vendorData,
} from "../types/types";

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
      params: { vendor_phoneNumber: phone },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};
// CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
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
    throw error;
  }
};

export const updateUser = async (
  phone: string,
  updatedData: Partial<vendorData>
): Promise<void> => {
  try {
    const response = await axios.put("/api/update_user", {
      phone,
      ...updatedData,
    });

    if (response.status === 200) {
      console.log("User updated successfully:", response.data);
    } else {
      console.error("Failed to update user:", response.data);
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    throw new Error("Failed to update user data");
  }
};

// CREATE A NEW USER USING CHATID
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

// GENERATE BTC WALLET FROM OUR HD WALLET
export const generateBTCWalletAddress = async (): Promise<btcWalletData> => {
  try {
    const response = await axios.get(`${apiURL}/api/generate_btc_wallet`);
    const { address: bitcoin_wallet, private_key: bitcoin_privateKey } =
      response.data;
    return { bitcoin_wallet, bitcoin_privateKey };
    // return data;
  } catch (error) {
    console.error("Error generating BTC wallet:", error);
    throw error;
  }
};

// GENERATE ERC20 WALLET FROM OUR HD WALLET
export const generateERCWalletAddress = async (): Promise<ercWalletData> => {
  try {
    const response = await axios.get(`${apiURL}/api/generate_erc_wallet`);

    const { address: eth_bnb_wallet, private_key: eth_bnb_privateKey } =
      response.data;

    return { eth_bnb_wallet, eth_bnb_privateKey };
  } catch (error) {
    console.error("Error generating BTC wallet:", error);
    throw error;
  }
};

// GENERATE TRC20 WALLET FROM OUR HD WALLET
export const generateTronWalletAddress = async (): Promise<trcWalletData> => {
  try {
    const response = await axios.get(`${apiURL}/api/generate_tron_wallet`);
    const { address: tron_wallet, private_key: tron_privateKey } =
      response.data;

    return { tron_wallet, tron_privateKey };
  } catch (error) {
    console.error("Error generating BTC wallet:", error);
    throw error;
  }
};

// FETCH COIN CURRENT PRICE (FROM BINACE TICKER)
export async function fetchCoinPrice(ticker: string): Promise<number> {
  try {
    const response = await fetch("/api/get_coin_price", {
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
// COLLECT BANK NAMES FROM DB
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
