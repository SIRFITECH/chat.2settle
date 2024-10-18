import axios from "axios";
import {
  BankName,
  btcWalletData,
  ercWalletData,
  PayoutData,
  ServerData,
  SheetData,
  trcWalletData,
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
  // try {
  //   const response = await axios.get<ServerData>(`${apiURL}/api/rate`);
  //   const rawRate = response.data.rate.replace(/,/g, ""); // Remove commas
  //   const rate = parseFloat(rawRate);

  //   if (isNaN(rate)) {
  //     throw new Error("Invalid rate received");
  //   }

  //   return rate;
  // } catch (error) {
  //   console.error("Error fetching rates:", error);
  //   throw error;
  // }
  const ytdVolume = 800000;
  return ytdVolume;
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
// CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
export const checkTranscationExists = async (
  transac_id: string
): Promise<{ exists: boolean; user?: userData }> => {
  // if (!navigator.onLine) {
  //   console.error("No internet connection");
  //   return { error: "No internet connection" };
  // }
  try {
    const response = await axios.get("/api/check_transaction", {
      params: { transac_id: transac_id },
    });
    return response.data;
  } catch (error) {
    // if (!error.response) {
    //   // Handle network error
    //   console.error("No internet connection");
    //   return { error: "No internet connection" };
    // } else {
    //   // Handle other errors
    //   console.error("Error:", error.response.status);
    //   return { error: "Something went wrong" };
    // }
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
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

// GET THE AVAILABLE WALLET FROM DB

export const getAvaialableWallet = async (
  network: string
): Promise<WalletInfo> => {
  try {
    const response = await axios.get("/api/get_available_wallet", {
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

const payoutQueue: (() => Promise<void>)[] = [];
let isProcessingQueue = false;

// export function addToPayoutQueue(call: () => Promise<void>) {
//   payoutQueue.push(call);

//   // If the queue is not currently processing, start processing
//   if (!isProcessingQueue) {
//     processPayoutQueue();
//   }
// }

// export async function processPayoutQueue() {
//   isProcessingQueue = true;

//   while (payoutQueue.length > 0) {
//     const nextCall = payoutQueue.shift();
//     const pendingInQueue = payoutQueue.length;

//     if (nextCall) {
//       console.log(`We have ${pendingInQueue} pending tranactions`);
//       // Execute the next API call
//       await nextCall();

//       // Introduce a 3-second delay between calls
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//     }
//   }

//   isProcessingQueue = false;
// }

export function addToPayoutQueue(call: () => Promise<void>) {
  payoutQueue.push(call);

  // If the queue is not currently processing, start processing
  if (!isProcessingQueue) {
    processPayoutQueue();
  }
}

async function processPayoutQueue() {
  isProcessingQueue = true;
  let isFirstCall = true; // To track if it's the first call

  while (payoutQueue.length > 0) {
    console.log(`We have ${payoutQueue.length} transaction(s) to start with`);
    const nextCall = payoutQueue.shift();
    const pendingInQueue = payoutQueue.length;

    if (nextCall) {
      console.log(`We have ${pendingInQueue} pending transactions`);

      // Execute the next API call
      await nextCall();

      // Add a 3-second delay after every call except the first one
      if (!isFirstCall && pendingInQueue > 0) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      // After the first call, set the flag to false to allow delay for the next calls
      isFirstCall = false;
    }
  }

  isProcessingQueue = false;
}

export async function payoutMoney(data: PayoutData) {
  return new Promise((resolve, reject) => {
    addToPayoutQueue(async () => {
      try {
        const response = await axios.post("/api/payout_gift", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Transaction successful:", response.data);
        resolve(response.data); // Resolve when the transaction is successful
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error("Error response from API:", error.response.data);
            reject(
              new Error(error.response.data.message || "Transaction failed")
            ); // Reject in case of error
          } else {
            console.error("Network or other error:", error.message);
            reject(new Error("Internal Server Error"));
          }
        } else {
          console.error("Unexpected error:", error);
          reject(new Error("Unexpected Error"));
        }
      }
    });
  });
}

export async function appendToGoogleSheet(data: SheetData) {
  try {
    const response = await axios.post("/api/send_to_support", data);
    console.log("Response from server:", response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error appending to Google Sheet:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

// export async function appendToGoogleSheet(data: SheetData) {
//   try {
//     const response = await fetch("/api/send_to_support", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     // Ensure that the response is OK
//     if (!response.ok) {
//       console.error(
//         "Server returned an error:",
//         response.status,
//         response.statusText
//       );
//       const errorText = await response.text(); // Get the full response
//       console.error("Full response:", errorText);
//       throw new Error("Failed to append data to Google Sheet");
//     }

//     // Parse the response as JSON
//     const content = await response.json();
//     console.log("Content is ", content);
//   } catch (error) {
//     console.error("Error during fetch operation:", error);
//   }
// }

export const getGiftNaira = async (gift_id: string): Promise<number> => {
  try {
    // Log the URL and params before making the request
    console.log("Requesting gift naira with:", `${apiURL}/api/user_naira`, {
      gift_id,
    });

    const response = await axios.get<userData>(`${apiURL}/api/user_naira`, {
      params: { gift_id },
    });

    const rawGiftNaira = response.data.receiver_amount
      // .replace("₦", "");
      ?.replace(/[^\d.]/g, "");
    /[^\d.]/g;

    // 831683;
    // 0177367583

    const giftNaira = parseFloat(rawGiftNaira || "");
    const giftNairaRounded = Math.round(giftNaira);
    if (isNaN(giftNairaRounded)) {
      throw new Error("Invalid giftNaira received");
    }

    return giftNairaRounded;
  } catch (error) {
    console.error("Error fetching gift naira:", error);
    throw error;
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
