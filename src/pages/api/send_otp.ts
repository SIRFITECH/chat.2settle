import { formatPhoneNumber } from "@/utils/utilities";
import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Twilio Account SID:", process.env.TWILIO_ACCOUNT_SID);
    console.log(
      "Twilio Auth Token:",
      process.env.TWILIO_AUTH_TOKEN ? "****" : "Not set"
    );
    await twilioClient.messages.create({
      body: `Your OTP is ${generatedOTP}`,
      from: "2SettleHQ",
      to: formatPhoneNumber(phoneNumber),
    });

    res.status(200).json({ success: true, otp: generatedOTP });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}
