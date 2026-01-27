import { saveTransferTransaction } from "@/services/transactionService/transferService/helpers/saveTransaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
   if (req.method !== "POST") {
     return res.status(405).json({ error: "Method not allowed" });
   }

   try {
     const transferId = await saveTransferTransaction(req.body);
     return res.status(200).json({ transferId });
   } catch (err: any) {
     return res.status(500).json({ error: err.message });
   }
}
