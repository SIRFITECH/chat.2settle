// TODO: We have to split this into the individual transaction types

import connection from "@/lib/mysql";
import {
  getOrCreatePayer,
  getOrCreateReceiver,
  insertSummary,
  insertTransfer,
} from "@/services/transactionService/transaction/transactionService";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // const dbHost = process.env.DB_HOST!;
  // const dbUser = process.env.DB_USER!;
  // const dbPassword = process.env.DB_PASSWORD!;
  // const dbName = process.env.DB_DATABASE!;

  const userData = req.body;

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    // ✅ Get or Create PAYER

    // ✅ Process Data
    async function processTransactions(data: any[]) {
      for (const row of data) {
        try {
          const payerId = await getOrCreatePayer(row);
          const receiverId = await getOrCreateReceiver(row);

          if (!receiverId) continue;

          const transferId = await insertTransfer(row, receiverId, payerId);
          await insertSummary(row, transferId, "transfer");
        } catch (err) {
          console.error("Transaction Error:", err);
        }
      }
    }

    // ✅ MAIN DATABASE INSERT
    // const [result] = await connection.query(
    //   "INSERT INTO settle_transaction_table SET ?",
    //   userData
    // );

    // ✅ Process transfers if it's an array
    if (Array.isArray(userData)) {
      await processTransactions(userData);
    }

    // await connection.end();

    res.status(200).json({
      message: "User data stored successfully",
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
