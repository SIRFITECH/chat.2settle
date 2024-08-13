// async function mongoroApi(
//   acct_number,
//   bank_name,
//   bank_code,
//   receiver_name,
//   db,
//   transac_id
// ) {
//   console.log(receiver_name);
//   const user = {
//     accountNumber: acct_number,
//     accountBank: bank_code,
//     bankName: bank_name,
//     amount: "100",
//     saveBeneficiary: false,
//     accountName: receiver_name,
//     narration: "Sirftiech payment",
//     currency: "NGN",
//     callbackUrl: "http://localhost:3000/payment/success",
//     debitCurrency: "NGN",
//     pin: "111111",
//   };

//   try {
//     const response = await fetch(
//       "https://api-biz-dev.mongoro.com/api/v1/openapi/transfer",
//       {
//         method: "POST", // HTTP method
//         headers: {
//           "Content-Type": "application/json", // Content type
//           accessKey: "75bba1c960a6ce7b608e001d9e167c44a9713e40",
//           token: "117da1d3e93c89c3ca3fbd3885e5a6e29b49001a",
//         },
//         body: JSON.stringify(user), // Data to be sent
//       }
//     );

//     const responseData = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         `Network response was not ok: ${response.status} ${response.statusText}`
//       );
//     }
//     if (responseData) {
//       console.log("working baby");
//       const user = { status: "Successful" };
//       db.query(`UPDATE 2settle_transaction_table SET ? WHERE transac_id = ?`, [
//         user,
//         transac_id,
//       ]);
//     }
//     console.log("Transaction successful:", responseData);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { accountNumber, accountBank, bankName, accountName, pin, amount } =
    req.body;

  // Log the incoming request body
  console.log("Request body:", req.body);

  // Check for missing fields and log an error if any are missing
  if (
    !accountNumber ||
    !accountBank ||
    !bankName ||
    !accountName ||
    !pin ||
    !amount
  ) {
    console.log("Missing required fields:", {
      accountNumber,
      accountBank,
      bankName,
      accountName,
      pin,
      amount,
    });
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = {
    accountNumber,
    accountBank,
    bankName,
    amount,
    saveBeneficiary: false,
    accountName,
    narration: "BwB 21-on-21 payment",
    currency: "NGN",
    callbackUrl: "http://localhost:3000/payment/success",
    debitCurrency: "NGN",
    pin: pin,
  };
  const mongoroTransferUrl =
    "https://api-biz-dev.mongoro.com/api/v1/openapi/transfer";

  try {
    // Log the user data before sending the request
    console.log("Sending request with user data:", user);

    const response = await axios.post(mongoroTransferUrl, user, {
      headers: {
        "Content-Type": "application/json",
        accessKey: process.env.MONGORO_ACCESS_KEY_API,
        token: process.env.MONGORO_TOKEN,
      },
    });

    // Log the successful response data
    console.log("Response data:", response.data);

    res
      .status(200)
      .json({ message: "Transaction successful", data: response.data });
  } catch (error) {
    console.error("Error occurred during API request:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error response from API:", error.response);

        res.status(error.response.status).json({
          message: error.response.data.message || "Error",
          error: error.response.data,
        });
      } else {
        console.error("Network or other error:", error.message);

        res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    } else {
      console.error("Non-Axios error:", error);

      res.status(500).json({ message: "Unknown Error", error: String(error) });
    }
  }
}
