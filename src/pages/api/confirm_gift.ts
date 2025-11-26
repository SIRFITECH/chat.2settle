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

  // const dbHost = process.env.host;
  // const dbUser = process.env.user;
  // const dbPassword = process.env.password;
  // const dbName = process.env.database;
  const { gift_id } = req.query;

  if (!gift_id) {
    return res.status(400).json({ message: "gift_id is required" });
  }

  try {
    // const connection = await mysql.createConnection({
    //   host: dbHost,
    //   user: dbUser,
    //   password: dbPassword,
    //   database: dbName,
    // });

    // const query = `
    //   SELECT
    //     *
    //   FROM
    //     \`settle_database\`.\`2settle_transaction_table\`
    //   WHERE
    //     \`gift_chatID\` = ?
    //   AND
    //     \`status\` IN ('Successful', 'Processing', 'UnSuccessful', 'Uncompleted', 'cancel')
    //   AND
    //     \`gift_status\` IN ('pending', 'Not claimed', 'Claimed')
    // `;
    const query = `
      SELECT
        *
      FROM
        gift
      WHERE
        gift_id = ?
      AND
        status IN ('Successful', 'Processing', 'UnSuccessful', 'Uncompleted', 'cancel')
      AND
        gift_status IN ('pending', 'Not claimed', 'Claimed')
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [gift_id]);

    await connection.end();

    if (rows.length > 0) {
      // If there are rows, return them along with their statuses
      const result = rows.map((row) => ({
        status: row.status,
        gift_status: row.gift_status,
        transaction: row,
      }));

      res.status(200).json({ exists: true, transactions: result });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Server error");
  }
}
