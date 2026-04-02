import type { NextApiRequest, NextApiResponse } from "next";
import { RowDataPacket } from "mysql2/promise";
import { formatPhoneNumber } from "@/utils/utilities";
import connection from "@/lib/mysql";

// Map payment_sessions status to legacy display status
const STATUS_MAP: Record<string, string> = {
  settled: "Successful",
  created: "Processing",
  pending: "Processing",
  confirming: "Processing",
  confirmed: "Processing",
  settling: "Processing",
  expired: "Cancelled",
  failed: "UnSuccessful",
  settlement_reversed: "UnSuccessful",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { phoneNumber, walletAddress, page = "1", limit = "10" } = query;

  if (!phoneNumber && !walletAddress) {
    return res.status(400).json({
      error: "At least one of phone number or wallet address is required",
    });
  }

  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    const queryParams: (string | number)[] = [];
    let whereClause = "";

    if (phoneNumber) {
      const phoneNo = formatPhoneNumber(phoneNumber as string);
      whereClause = "py.phone = ?";
      queryParams.push(phoneNo);
    } else {
      // wallet address: match against payer's chat_id (Telegram/chat identifier)
      whereClause = "py.chat_id = ?";
      queryParams.push(walletAddress as string);
    }

    const [[{ total }]] = await connection.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM payment_sessions ps
       INNER JOIN payers py ON ps.payer_id = py.id
       WHERE ${whereClause}`,
      queryParams
    );

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT
         ps.type        AS mode_of_payment,
         ps.fiat_amount AS Amount,
         ps.crypto,
         ps.created_at  AS Date,
         ps.status,
         ps.reference,
         ps.network,
         ps.crypto_amount
       FROM payment_sessions ps
       INNER JOIN payers py ON ps.payer_id = py.id
       WHERE ${whereClause}
       ORDER BY ps.created_at DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, limitNumber, offset]
    );

    const transactions = rows.map((row) => ({
      ...row,
      status: STATUS_MAP[row.status] ?? row.status,
    }));

    if (transactions.length > 0) {
      return res.status(200).json({
        exists: true,
        transactions,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(total / limitNumber),
          totalItems: total,
        },
      });
    } else {
      return res.status(404).json({
        exists: false,
        transactions: [],
        pagination: {
          currentPage: pageNumber,
          totalPages: 0,
          totalItems: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error checking user in database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
