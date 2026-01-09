import connection from "@/lib/mysql";
import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { gift_id } = req.query;

  if (!gift_id) {
    return res.status(400).json({ message: "gift_id is required" });
  }

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      // "SELECT * FROM `settle_database`.`2settle_transaction_table` WHERE `gift_chatID` = ?",
      "SELECT * FROM gifts WHERE `gift_id` = ?",
      [gift_id]
    );

    if (rows.length > 0) {
      res.status(200).json({ exists: true, user: rows[0] });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Server error");
  }
}
