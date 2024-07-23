import mysql from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const dbHost = process.env.host;
  const dbUser = process.env.user;
  const dbPassword = process.env.password;
  const dbName = process.env.database;

  const {
    agent_id,
    vendor_phoneNumber,
    bitcoin_wallet,
    bitcoin_privateKey,
    eth_bnb_wallet,
    eth_bnb_privateKey,
    tron_wallet,
    tron_privateKey,
  } = req.body;

  if (!agent_id) {
    return res.status(400).json({ error: "Agent ID is required" });
  }

  const updatedUserData: Partial<{
    agent_id: string;
    vendor_phoneNumber: string;
    bitcoin_wallet: string;
    bitcoin_privateKey: string;
    eth_bnb_wallet: string;
    eth_bnb_privateKey: string;
    tron_wallet: string;
    tron_privateKey: string;
  }> = {
    agent_id,
    vendor_phoneNumber,
    bitcoin_wallet,
    bitcoin_privateKey,
    eth_bnb_wallet,
    eth_bnb_privateKey,
    tron_wallet,
    tron_privateKey,
  };

  // Remove undefined fields from updatedUserData
  for (const key in updatedUserData) {
    if (updatedUserData[key as keyof typeof updatedUserData] === undefined) {
      delete updatedUserData[key as keyof typeof updatedUserData];
    }
  }

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const [result] = await connection.query<mysql.ResultSetHeader>(
      "UPDATE 2settle_vendor SET ? WHERE agent_id = ?",
      [updatedUserData, agent_id]
    );

    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).send("Server error");
  }
}
