import { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

type Network = "btc" | "eth" | "bnb" | "trx" | "erc20" | "bep20" | "trc20";

const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { network } = req.query;

  if (!network || typeof network !== "string" || !isValidNetwork(network)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing network parameter" });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT
        bitcoin_wallet, eth_bnb_wallet, tron_wallet,
        bitcoin_flag, ethereum_flag, binance_flag, tron_flag,
        erc20_flag, trc20_flag, bep20_flag
      FROM 2Settle_walletAddress
      WHERE ${getFlagColumn(network)} = 'true'
      LIMIT 1
      FOR UPDATE`
    );

    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return res
        .status(404)
        .json({ message: `No active wallet found for ${network}` });
    }

    const wallet = rows[0];
    const activeWallet = getWalletForNetwork(wallet, network);
    const flagToUpdate = getFlagColumn(network);

    if (activeWallet) {
      await connection.query(
        `UPDATE 2Settle_walletAddress SET ${flagToUpdate} = 'false' WHERE ${getWalletColumn(
          network
        )} = ?`,
        [activeWallet]
      );

      await connection.commit();
      connection.release();

      return res.status(200).json({ activeWallet });
    } else {
      await connection.rollback();
      connection.release();
      return res
        .status(404)
        .json({ message: `No active wallet found for ${network}` });
    }
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Database query error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function isValidNetwork(network: string): network is Network {
  return ["btc", "eth", "bnb", "trx", "erc20", "bep20", "trc20"].includes(
    network
  );
}

function getFlagColumn(network: Network): string {
  switch (network) {
    case "btc":
      return "bitcoin_flag";
    case "eth":
      return "ethereum_flag";
    case "bnb":
      return "binance_flag";
    case "trx":
      return "tron_flag";
    case "erc20":
      return "erc20_flag";
    case "bep20":
      return "bep20_flag";
    case "trc20":
      return "trc20_flag";
  }
}

function getWalletColumn(network: Network): string {
  switch (network) {
    case "btc":
      return "bitcoin_wallet";
    case "eth":
    case "bnb":
    case "erc20":
    case "bep20":
      return "eth_bnb_wallet";
    case "trx":
    case "trc20":
      return "tron_wallet";
  }
}

function getWalletForNetwork(
  wallet: RowDataPacket,
  network: Network
): string | null {
  switch (network) {
    case "btc":
      return wallet.bitcoin_wallet;
    case "eth":
    case "bnb":
    case "erc20":
    case "bep20":
      return wallet.eth_bnb_wallet;
    case "trx":
    case "trc20":
      return wallet.tron_wallet;
    default:
      return null;
  }
}
