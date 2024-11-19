import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { referralCode, referralCategory } = req.body;

    // Here you would typically:
    // 1. Validate the referral code
    // 2. Check if the category is valid (amb or mkt)
    // 3. Store the referral in your database
    // 4. Update the referrer's stats

    // For this example, we'll just send back a success message
    res.status(200).json({ message: "Referral recorded successfully" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
