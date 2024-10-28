import { formatPhoneNumber } from "@/utils/utilities";
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { phoneNumber } = req.body;

//   if (!phoneNumber) {
//     return res.status(400).json({ message: "Phone number is required" });
//   }

//   try {
//     const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
//     console.log("Twilio Account SID:", process.env.TWILIO_ACCOUNT_SID);
//     console.log(
//       "Twilio Auth Token:",
//       process.env.TWILIO_AUTH_TOKEN ? "****" : "Not set"
//     );
//     await twilioClient.messages.create({
//       body: `Your OTP is ${generatedOTP}`,
//       from: "2SettleHQ",
//       to: formatPhoneNumber(phoneNumber),
//     });

//     res.status(200).json({ success: true, otp: generatedOTP });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  // // Temporary logging for debugging (remove before deployment)
  // console.log("Account SID:", accountSid);
  // console.log("Auth Token:", authToken);
  // console.log("Twilio Phone Number:", twilioPhoneNumber);
  // console.log("To Phone number: ", formatPhoneNumber(phoneNumber));

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    return res.status(500).json({
      success: false,
      message: "Twilio credentials are not properly configured",
    });
  }

  const client = twilio(accountSid, authToken);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      // "2SettleHQ",
      to: formatPhoneNumber(phoneNumber),
    });

    res
      .status(200)
      .json({ success: true, otp, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
}
