// import mysql, { RowDataPacket } from "mysql2/promise";
// import { NextApiRequest, NextApiResponse } from "next";

// const pool = mysql.createPool({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Message not allowed" });
//   }

//   try {
//     // connect to db
//     const [rows] = await pool.query<RowDataPacket[]>(
//       `SELECT eth_bnb_wallet
//         FROM settle_database.2Settle_walletAddress
//         WHERE serial_id = ?`,[14]
//     );

//     if (rows.length === 0) {
//       res.status(404).json({ message: "Wallet not found" });
//     }

//     res.status(200).json({ wallet: rows[0].eth_bnb_wallet });
//   } catch (error) {
//     console.error("There was an error fetching wallet data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// Mapping input strings to DB column names
const walletColumnMap: Record<string, string> = {
  btc: "bitcoin_wallet",
  eth: "eth_bnb_wallet",
  bnb: "eth_bnb_wallet",
  erc20: "eth_bnb_wallet",
  bep20: "eth_bnb_wallet",
  trx: "tron_wallet",
  trc20: "tron_wallet",
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, id } = req.query;

  if (typeof type !== "string" || typeof id !== "string") {
    return res.status(400).json({
      message:
        "Invalid or missing query parameters: 'type' and 'id' are required.",
    });
  }

  const column = walletColumnMap[type.toLowerCase()];
  if (!column) {
    return res.status(400).json({
      message: "Invalid wallet type. Use 'btc', 'eth', 'bnb', or 'trx'.",
    });
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT \`${column}\` AS wallet FROM settle_database.2Settle_walletAddress WHERE serial_id = ?`,
      [id]
    );

    if (rows.length === 0 || !rows[0].wallet) {
      return res
        .status(404)
        .json({ message: "Wallet not found for the given ID and type." });
    }

    return res.status(200).json({ wallet: rows[0].wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
