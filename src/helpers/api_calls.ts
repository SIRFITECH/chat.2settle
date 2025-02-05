import axios from "axios";
import {
  BankName,
  // btcWalletData,
  // ercWalletData,
  // PayoutData,
  ReferralUser,
  ServerData,
  // trcWalletData,
  userData,
  vendorData,
  WalletInfo,
} from "../types/general_types";
import useErrorHandler from "@/hooks/useErrorHandler";

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
    const response = await axios.get<{ ytdVolume: string }>(
      `${apiURL}/api/fetchYTD`
    );
    const rawVolume = response.data.ytdVolume.replace(/[,$]/g, ""); // Remove commas
    const ytdVolume = parseFloat(rawVolume);
    console.log("YTD", rawVolume);

    if (isNaN(ytdVolume)) {
      throw new Error("Invalid rate received");
    }

    return ytdVolume;
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
export const checkRequestExists = async (
  requestID: string
): Promise<{ exists: boolean; user?: userData }> => {
  try {
    const response = await axios.get("/api/confirm_request", {
      params: { request_id: requestID },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking request existence:", error);
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

export const getDirectDebitWallet = async (): Promise<string> => {
  try {
    const response = await axios.get("/api/get_direct_debit_wallet");
    if (response.status === 200) {
      console.log("wallet is:", response.data.wallet);
      return response.data.wallet;
    } else if (response.status === 500) {
      return "Internal error occured";
    } else if (response.status === 404) {
      return "Wallet not found";
    }
    return "walet";
  } catch (error) {
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
// // COLLECT BANK NAMES FROM DB
// export const fetchBankNames = async (
//   extracted: string,
//   handleError: (message: string) => void,
//   setLoading: (loading: boolean) => void
// ): Promise<BankName> => {
//   try {
//     setLoading(true);
//     const response = await axios.post<BankName>(`${apiURL}/api/bank_names/`, {
//       message: extracted,
//     });
//     if (!response.data) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.data;
//   } catch (error) {
//     handleError(
//       error instanceof Error ? error.message : "Failed to fetch bank names"
//     );
//     throw error;
//   } finally {
//     setLoading(false);
//   }
// };
// export const fetchBankDetails = async (
//   bank_code: string,
//   acc_no: string
// ): Promise<any | null> => {
//   try {
//     const response = await axios.get(
//       `https://app.nuban.com.ng/api/NUBAN-WBODZCTK1831?bank_code=${bank_code}&acc_no=${acc_no}`
//     );
//     return response.data;
//   } catch (error) {
//     // handleError(error);
//     // throw error;
//     console.error(
//       `Error fetching bank details for bank code ${bank_code} and account number ${acc_no}:`,
//       error
//     );
//     return null;
//   }
// };

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

// import axios from "axios";
// import {
//   BankName,
//   // btcWalletData,
//   // ercWalletData,
//   // PayoutData,
//   ServerData,
//   // SheetData,
//   // trcWalletData,
//   userData,
//   vendorData,
//   WalletInfo,
// } from "../types/general_types";

// const apiURL = process.env.NEXT_PUBLIC_API_URL || "";

// // FETCH CURRENT EXCHANGE RATE FROM DB
// export const fetchRate = async (): Promise<number> => {
//   try {
//     const response = await axios.get<ServerData>(`${apiURL}/api/rate`);
//     const rawRate = response.data.rate.replace(/,/g, ""); // Remove commas
//     const rate = parseFloat(rawRate);

//     if (isNaN(rate)) {
//       throw new Error("Invalid rate received");
//     }

//     return rate;
//   } catch (error) {
//     console.error("Error fetching rates:", error);
//     throw error;
//   }
// };
// // FETCH CURRENT EXCHANGE RATE FROM DB
// export const fetchTotalVolume = async (): Promise<number> => {
//   // try {
//   //   const response = await axios.get<ServerData>(`${apiURL}/api/rate`);
//   //   const rawRate = response.data.rate.replace(/,/g, ""); // Remove commas
//   //   const rate = parseFloat(rawRate);

//   //   if (isNaN(rate)) {
//   //     throw new Error("Invalid rate received");
//   //   }

//   //   return rate;
//   // } catch (error) {
//   //   console.error("Error fetching rates:", error);
//   //   throw error;
//   // }
//   const ytdVolume = 800000;
//   return ytdVolume;
// };

// // FETCH MERCHANT RATE FROM DB
// export const fetchMerchantRate = async (): Promise<number> => {
//   try {
//     const response = await axios.get<ServerData>(`${apiURL}/api/merchant_rate`);
//     const rawRate = response.data.merchantRate.replace(/,/g, "");
//     const merchant_rate = parseFloat(rawRate);

//     if (isNaN(merchant_rate)) {
//       throw new Error("Invalid rate received");
//     }

//     return merchant_rate;
//   } catch (error) {
//     console.error("Error fetching merchant rate:", error);
//     throw error;
//   }
// };

// // FETCH PROFIT RATE FROM DB
// export const fetchProfitRate = async (): Promise<number> => {
//   try {
//     const response = await axios.get<ServerData>(
//       `${apiURL}/api/merchant_profit`
//     );
//     const rawRate = response.data.profitRate.replace(/,/g, "");
//     const profitRate = parseFloat(rawRate);

//     if (isNaN(profitRate)) {
//       throw new Error("Invalid profit rate received");
//     }

//     return profitRate;
//   } catch (error) {
//     console.error("Error fetching profit rate:", error);
//     throw error;
//   }
// };

// // CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
// export const checkUserExists = async (
//   phone: string
// ): Promise<{ exists: boolean; user?: vendorData }> => {
//   try {
//     const response = await axios.get("/api/check_user", {
//       params: { phone_number: phone },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error checking user existence:", error);
//     throw error;
//   }
// };
// // CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
// export const checkTranscationExists = async (
//   transac_id: string
// ): Promise<{ exists: boolean; user?: userData }> => {
//   // if (!navigator.onLine) {
//   //   console.error("No internet connection");
//   //   return { error: "No internet connection" };
//   // }
//   try {
//     const response = await axios.get("/api/check_transaction", {
//       params: { transac_id: transac_id },
//     });
//     return response.data;
//   } catch (error) {
//     // if (!error.response) {
//     //   // Handle network error
//     //   console.error("No internet connection");
//     //   return { error: "No internet connection" };
//     // } else {
//     //   // Handle other errors
//     //   console.error("Error:", error.response.status);
//     //   return { error: "Something went wrong" };
//     // }
//     console.error("Error checking user existence:", error);
//     return { exists: false, user: undefined };
//   }
// };
// // CHECK IF USER EXISTS IN OUR DB RECORDS USING CHATID, SO WE CAN GET THEIR WALLET ADDRESS
// export const checkGiftExists = async (
//   gift_id: string
// ): Promise<{ exists: boolean; user?: userData }> => {
//   try {
//     const response = await axios.get("/api/check_gift", {
//       params: { gift_id: gift_id },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error checking user existence:", error);
//     throw error;
//   }
// };

// // GET THE AVAILABLE WALLET FROM DB

// export const getAvaialableWallet = async (
//   network: string
// ): Promise<WalletInfo> => {
//   try {
//     const response = await axios.get("/api/get_available_wallet", {
//       params: { network: network },
//     });

//     if (response.status === 200 && response.data.activeWallet) {
//       console.log(
//         `Available wallet for ${network}:`,
//         response.data.activeWallet
//       );
//       return {
//         activeWallet: response.data.activeWallet,
//         lastAssignedTime: response.data.lastAssignedTime,
//       };
//     } else {
//       console.log("The error status is:", response.status);
//       throw new Error(
//         `No wallet found for network: ${network} error is ${response.status}`
//       );
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       if (error.response.status === 404) {
//         console.error(`No active wallet found for network ${network}`);
//         throw new Error(`No active wallet available for network: ${network}`);
//       } else if (error.response.status === 503) {
//         const waitTime = error.response.data.message.match(/\d+/)[0];
//         throw new Error(
//           `Ops!! you will have to wait a little longer. Please try again in ${waitTime} seconds.`
//         );
//       } else {
//         console.error(
//           `API error for network ${network}:`,
//           error.response.data.message
//         );
//         throw new Error(`API error for network: ${network}`);
//       }
//     } else {
//       console.error(`Error fetching wallet for network ${network}:`, error);
//       throw new Error(`Failed to fetch wallet for network: ${network}`);
//     }
//   }
// };
// export const isGiftValid = async (
//   gift_id: string
// ): Promise<{ exists: boolean; user?: userData }> => {
//   try {
//     const response = await axios.get("/api/confirm_gift", {
//       params: { gift_id },
//     });

//     if (response.data.exists && response.data.transactions.length > 0) {
//       // Extract the first transaction as the userData object
//       const firstTransaction: userData =
//         response.data.transactions[0].transaction;

//       // Return the exists flag and the user object
//       return { exists: true, user: firstTransaction };
//     } else {
//       return { exists: false };
//     }
//   } catch (error) {
//     console.error("Error checking gift validity:", error);
//     throw error;
//   }
// };

// export const updateUser = async (
//   updatedData: Partial<vendorData>
// ): Promise<void> => {
//   try {
//     const response = await axios.post("/api/update_user", {
//       ...updatedData,
//     });

//     if (response.status === 200) {
//       console.log("User updated successfully:", response.data);
//     } else {
//       console.error("Unexpected status code:", response.status);
//       console.error("Failed to update user:", response.data);
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error:", error.response?.data || error.message);
//     } else {
//       console.error("Error updating user data:", error);
//     }
//     throw new Error("Failed to update user data");
//   }
// };

// // UPDATE THE TRANSACTION STATUS
// export const updateTransaction = async (transac_id: string, status: string) => {
//   try {
//     const response = await axios.post("/api/update_transaction", {
//       transac_id,
//       status,
//     });

//     if (response.status === 200) {
//       console.log("Status updated successfully:", response.data.message);
//     } else {
//       console.error("Failed to update status:", response.data.message);
//     }
//   } catch (error) {
//     console.error("Error occurred while updating status:", error);
//   }
// };

// // UPDATE THE TRANSACTION STATUS
// export const updateGiftTransaction = async (
//   gift_chatID: string,
//   updateData: Record<string, any>
// ) => {
//   try {
//     const response = await axios.post("/api/update_gift", {
//       gift_chatID,
//       ...updateData,
//     });
//     console.log(response.data); // Handle the response
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       // Server responded with a status other than 2xx
//       console.error("Server error:", error.response?.data);
//     } else if (error instanceof Error) {
//       // Network or other error
//       console.error("Network error:", error.message);
//     } else {
//       // Some other unknown error
//       console.error("An unknown error occurred");
//     }
//   }
// };

// const payoutQueue: (() => Promise<void>)[] = [];
// let isProcessingQueue = false;

// export function addToPayoutQueue(call: () => Promise<void>) {
//   payoutQueue.push(call);

//   // If the queue is not currently processing, start processing
//   if (!isProcessingQueue) {
//     processPayoutQueue();
//   }
// }

// async function processPayoutQueue() {
//   isProcessingQueue = true;
//   let isFirstCall = true; // To track if it's the first call

//   while (payoutQueue.length > 0) {
//     console.log(`We have ${payoutQueue.length} transaction(s) to start with`);
//     const nextCall = payoutQueue.shift();
//     const pendingInQueue = payoutQueue.length;

//     if (nextCall) {
//       console.log(`We have ${pendingInQueue} pending transactions`);

//       // Execute the next API call
//       await nextCall();

//       // Add a 3-second delay after every call except the first one
//       if (!isFirstCall && pendingInQueue > 0) {
//         await new Promise((resolve) => setTimeout(resolve, 3000));
//       }

//       // After the first call, set the flag to false to allow delay for the next calls
//       isFirstCall = false;
//     }
//   }

//   isProcessingQueue = false;
// }

// export const getGiftNaira = async (gift_id: string): Promise<number> => {
//   try {
//     // Log the URL and params before making the request
//     console.log("Requesting gift naira with:", `${apiURL}/api/user_naira`, {
//       gift_id,
//     });

//     const response = await axios.get<userData>(`${apiURL}/api/user_naira`, {
//       params: { gift_id },
//     });

//     const rawGiftNaira = response.data.receiver_amount
//       // .replace("₦", "");
//       ?.replace(/[^\d.]/g, "");
//     /[^\d.]/g;

//     // 831683;
//     // 0177367583

//     const giftNaira = parseFloat(rawGiftNaira || "");
//     const giftNairaRounded = Math.round(giftNaira);
//     if (isNaN(giftNairaRounded)) {
//       throw new Error("Invalid giftNaira received");
//     }

//     return giftNairaRounded;
//   } catch (error) {
//     console.error("Error fetching gift naira:", error);
//     throw error;
//   }
// };

// // WRITE A USER TO THE WALLET TABLE
// export const createUser = async (user: any): Promise<any> => {
//   try {
//     const response = await axios.post<any>(`${apiURL}/api/create_user`, user);
//     console.log("User data created successfully");
//     return response.data;
//   } catch (error) {
//     console.error("Error storing user data:", error);
//     throw new Error("Failed to store user data");
//   }
// };

// // CREATE TRANSACTION IN THE TRANSACTION TABLE

// export const createTransaction = async (user: any): Promise<any> => {
//   try {
//     const response = await axios.post<any>(
//       `${apiURL}/api/create_transaction`,
//       user
//     );
//     console.log("Use transaction created successfully");
//     return response.data;
//   } catch (error) {
//     console.error("Error storing user data:", error);
//     throw new Error("Failed to store user data");
//   }
// };
// // CREATE TRANSACTION IN THE TRANSACTION TABLE
// export const createComplain = async (complainData: any): Promise<any> => {
//   try {
//     const response = await axios.post<any>(
//       `${apiURL}/api/create_complain`,
//       complainData
//     );
//     console.log("Use complain created successfully");
//     return response.data;
//   } catch (error) {
//     console.error("Error storing user data:", error);
//     throw new Error("Failed to store user data");
//   }
// };

// // FETCH COIN CURRENT PRICE (FROM BINACE TICKER)
// export async function fetchCoinPrice(ticker: string): Promise<number> {
//   try {
//     const response = await fetch("/api/get_coin_price", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ ticker }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     if (typeof data.price !== "number") {
//       throw new Error("Invalid response structure");
//     }

//     console.log("Coin price:", data.price);
//     return data.price;
//   } catch (error) {
//     console.error("Error fetching coin price:", error);
//     throw error;
//   }
// }
// // COLLECT BANK NAMES FROM DB
// export const fetchBankNames = async (extracted: string): Promise<BankName> => {
//   try {
//     const response = await axios.post<BankName>(`${apiURL}/api/bank_names/`, {
//       message: extracted,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching bank names:", error);
//     throw new Error("Failed to fetch bank names");
//   }
// };

// // QUERY BANK DETAILS FROM NUBAN
// export const fetchBankDetails = async (
//   bank_code: string,
//   acc_no: string
// ): Promise<any | null> => {
//   try {
//     const response = await axios.get(
//       `https://app.nuban.com.ng/api/NUBAN-WBODZCTK1831?bank_code=${bank_code}&acc_no=${acc_no}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       `Error fetching bank details for bank code ${bank_code} and account number ${acc_no}:`,
//       error
//     );
//     return null;
//   }
// };
