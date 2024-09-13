import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";
import { ExchangeRate } from "../../types/types";

export default async function handler(
  req: NextApiRequest,

  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const dbHost = process.env.host;
  const dbUser = process.env.user;
  const dbPassword = process.env.password;
  const dbName = process.env.database;

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const [results] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM 2Settle_ExchangeRate"
    );

    const result = results[0] as ExchangeRate;

    const merchantRate = result.merchant_rate;
    await connection.end();

    res.status(200).json({ merchantRate: merchantRate });
  } catch (err) {
    console.error(
      "Error querying the 2Settle_ExchangeRate from database:",
      err
    );
    res.status(500).send("Server error");
  }
}
