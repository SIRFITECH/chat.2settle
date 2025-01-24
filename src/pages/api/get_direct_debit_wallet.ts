import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Message not allowed" });
  }

  try {
    // connect to db
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT eth_bnb_wallet
        FROM settle_database.2Settle_walletAddress
        WHERE serial_id = ?`,[14]
    );

    if (rows.length === 0) {
      res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({ wallet: rows[0].eth_bnb_wallet });
  } catch (error) {
    console.error("There was an error fetching wallet data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
