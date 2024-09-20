import { userData } from "@/types/types";
import axios from "axios";

// CHECK IF USER HAS HISTORY IN OUR DB RECORDS USING PHONE NUMBER OR WALLET, SO WE CAN POPULATE THEIR TRANSACTIONS ARRAY
// export const checkUserHasHistory = async (
//   phone?: string,
//   walletAddress?: string
// ): Promise<{ exists: boolean; user?: userData }> => {
//   // Ensure that at least one parameter is provided
//   if (!phone && !walletAddress) {
//     throw new Error("Either phone number or wallet address must be provided.");
//   }

//   try {
//     const response = await axios.get("/api/check_user", {
//       params: {
//         phone_number: phone ?? null,
//         wallet_address: walletAddress ?? null,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error checking user existence:", error);
//     throw error;
//   }
// };

export const checkUserHasHistory = async (
  phone?: string,
  walletAddress?: string
): Promise<{ exists: boolean; transactions?: userData }> => {
  if (!phone && !walletAddress) {
    throw new Error("Either phone number or wallet address must be provided.");
  }

  try {
    const response = await axios.get("/api/check_user", {
      params: {
        phoneNumber: phone || undefined,
        walletAddress: walletAddress || undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

export const sendOtp = async (
  phone: string,
  otp: string
): Promise<{ sent: boolean }> => {
  //IF THE SENDING OF THE OTP IS SUCCESSFULL, THEN WE ALLOW FOR DISSPLAY OF HISTORY
  // 1. Send OTP to user
  // 2. save the otp in db
  // 3. block any other call for otp with 3 sec
  return { sent: true };
};

export const handlePhoneNumber = async (phoneNumber: string) => {
  // Check if phone number exists in the database
  const hasHistory = await checkUserHasHistory(phoneNumber);

  if (!hasHistory) {
    throw new Error("No history found for " + { phoneNumber });
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Send OTP
  await sendOtp(phoneNumber, otp);

  return otp;
};
