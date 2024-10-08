import mysql, { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";
import { BankName } from "../../types/general_types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
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

    const { message: extracted } = req.body;

    const [results] = await connection.query<BankName[]>(
      "SELECT * FROM 2settle_bank_details WHERE bank_name LIKE ?",
      [`${extracted}%`]
    );

    await connection.end();

    if (results.length > 0) {
      const bank_names = results.map(
        (row, index) => `${index + 1}. ${row.bank_name} ${row.bank_code}`
      );
      res.status(200).json({ message: bank_names });
    } else {
      res.status(200).json({ message: "Bank not found. Try again" });
    }
  } catch (err) {
    console.error(
      "Error querying the 2settle_bank_details from database:",
      err
    );
    res.status(500).send("Server error");
  }
}
