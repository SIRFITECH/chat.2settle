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

  const dbHost = process.env.host;
  const dbUser = process.env.user;
  const dbPassword = process.env.password;
  const dbName = process.env.database;

  const {
    crypto,
    network,
    estimation,
    Amount,
    charges,
    mode_of_payment,
    acct_number,
    bank_name,
    receiver_name,
    receiver_amount,
    receiver_phoneNumber,
    crypto_sent,
    wallet_address,
    Date,
    status = "Uncompleted",
    customer_phoneNumber,
    transac_id,
    request_id,
    settle_walletLink,
    chat_id,
    current_rate,
    merchant_rate,
    profit_rate,
    name,
    gift_status,
    gift_chatID,
    asset_price,
    ref_code,
    effort
  } = req.body;

  const userData = {
    crypto,
    network,
    estimation,
    Amount,
    charges,
    mode_of_payment,
    acct_number,
    bank_name,
    receiver_name,
    receiver_amount,
    receiver_phoneNumber,
    crypto_sent,
    wallet_address,
    Date,
    status,
    customer_phoneNumber,
    transac_id,
    request_id,
    settle_walletLink,
    chat_id,
    current_rate,
    merchant_rate,
    profit_rate,
    name,
    gift_status,
    gift_chatID,
    asset_price,
    ref_code,
    effort
  };

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const query = "INSERT INTO 2settle_transaction_table SET ?";
    const [result] = await connection.query(query, userData);

    await connection.end();

    res.status(200).json({ message: "User data stored successfully", result });
  } catch (err) {
    console.error("Error storing user data:", err);
    res.status(500).send("Server error");
  }
}
