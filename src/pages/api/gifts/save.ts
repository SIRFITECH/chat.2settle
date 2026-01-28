import { saveGiftTransaction } from "@/services/transactionService/giftService/helpers/saveGift";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const giftId = await saveGiftTransaction(req.body);
    return res.status(200).json({ giftId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
