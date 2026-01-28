import { saveRequestTransaction } from "@/services/transactionService/requestService/helpers/saveRequest";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const requestId = await saveRequestTransaction(req.body);
    return res.status(200).json({ requestId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
