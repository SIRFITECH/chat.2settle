// TODO: We have to split this into the individual transaction types

import mysql from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const dbHost = process.env.DB_HOST!;
  const dbUser = process.env.DB_USER!;
  const dbPassword = process.env.DB_PASSWORD!;
  const dbName = process.env.DB_DATABASE!;

  const userData = req.body;

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    // ✅ Get or Create PAYER
    async function getOrCreatePayer(row: any): Promise<number> {
      const [results]: any = await connection.query(
        "SELECT id FROM payers WHERE chat_id = ? OR phone = ? LIMIT 1",
        [row.chat_id, row.customer_phoneNumber]
      );

      if (results.length > 0) {
        return results[0].id;
      }

      const user = {
        chat_id: row.chat_id,
        phone: row.customer_phoneNumber,
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO payers SET ?",
        user
      );

      return insertResult.insertId;
    }

    // ✅ Get or Create RECEIVER
    async function getOrCreateReceiver(row: any): Promise<number | null> {
      const [results]: any = await connection.query(
        "SELECT id FROM receivers WHERE bank_account = ? AND bank_name = ? LIMIT 1",
        [row.acct_number, row.bank_name]
      );

      if (results.length > 0) {
        return results[0].id;
      }

      if (!row.acct_number || !row.bank_name) return null;

      const user = {
        bank_name: row.bank_name,
        bank_account: row.acct_number,
        account_name: row.receiver_name,
        phone: row.receiver_phoneNumber,
        is_vendor: false,
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO receivers SET ?",
        user
      );

      return insertResult.insertId;
    }

    // ✅ Insert TRANSFER
    async function insertTransfer(
      row: any,
      receiverId: number,
      payerId: number
    ): Promise<number> {
      const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

      const date = new Date(row.Date);

      const amountMatch = row.charges?.match(/\d+(\.\d+)?/);
      const chargeAmount = amountMatch ? Number(amountMatch[0]) : 0;

      const transfer = {
        status: row.status,
        crypto: row.crypto,
        network: row.network,
        estimate_asset: row.estimation,
        estimate_amount: clean(row.Amount),
        amount_payable: clean(row.receiver_amount),
        charges: chargeAmount,
        crypto_amount: clean(row.crypto_sent),
        date: date,
        receiver_id: receiverId,
        transfer_id: row.transac_id,
        payer_id: payerId,
        current_rate: clean(row.current_rate),
        merchant_rate: clean(row.merchant_rate),
        profit_rate: clean(row.profit_rate),
      };

      const [insertResult]: any = await connection.query(
        "INSERT INTO transfers SET ?",
        transfer
      );

      return insertResult.insertId;
    }

    // ✅ Insert SUMMARY
    async function insertSummary(
      row: any,
      transactionId: number,
      transaction_type: string
    ) {
      const clean = (val: string) => Number(val?.replace(/[^0-9.]/g, "") || 0);

      const naira = clean(row.receiver_amount);
      const rate = clean(row.current_rate);
      const dollarAmount = rate ? naira / rate : 0;

      const summary = {
        transaction_type,
        total_dollar: dollarAmount,
        total_naira: naira,
        transaction_id: transactionId,
      };

      await connection.query("INSERT INTO summaries SET ?", summary);
    }

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

    await connection.end();

    res.status(200).json({
      message: "User data stored successfully"
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
