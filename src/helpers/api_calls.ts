import axios from "axios";
import {
  BankName,
  btcWalletData,
  ercWalletData,
  ServerData,
  trcWalletData,
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

// CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
export const checkUserExists = async (
  agentId: string
): Promise<{ exists: boolean; user?: vendorData }> => {
  try {
    const response = await axios.get("/api/check_user", {
      params: { agent_id: agentId },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

// UPDATE USER DATA USING CHATID
export const updateUser = async (
  chatId: string,
  updatedData: Partial<vendorData>
) => {
  try {
    const response = await axios.put("/api/update_user", {
      chatId,
      ...updatedData,
    });
    console.log("User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
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
// export const fetchCoinPrice = async (
//   symbol: string
// ): Promise<number | null> => {
//   try {
//     const response = await axios.get(
//       `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
//     );
//     return parseFloat(response.data.price);
//   } catch (error) {
//     console.error(`Error fetching price for ${symbol}:`, error);
//     return null;
//   }
// };

export const fetchCoinPrice = async (
  ticker: string
): Promise<number | null> => {
  try {
    const response = await axios.post("/api/get_coin_price", { ticker });
    return parseFloat(response.data);
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error);
    return null;
  }
};

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