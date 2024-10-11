// import { NextApiRequest, NextApiResponse } from "next";
// import mysql, { RowDataPacket } from "mysql2/promise";

// // Create a MySQL connection (use your own credentials here)
// const connection = mysql.createPool({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { network } = req.query;

//   if (!network) {
//     return res.status(400).json({ message: "Network parameter is required" });
//   }

//   try {
//     // Query to get the relevant transaction row
//     const query = "SELECT * FROM settle_database.2Settle_walletAddress LIMIT 1";
//     const [rows] = await connection.query<RowDataPacket[]>(query);

//     if (!rows.length) {
//       return res.status(404).json({ message: "No transaction data found" });
//     }

//     const transaction = rows[0];
//     let walletAddress = "";
//     let flagColumn = "";

//     switch (network) {
//       case "btc":
//         if (transaction.bitcoin_flag) {
//           walletAddress = transaction.bitcoin_wallet;
//           flagColumn = "bitcoin_flag";
//         }
//         break;
//       case "erc20":
//       case "ethereum":
//         if (transaction.erc20_flag || transaction.ethereum_flag) {
//           walletAddress = transaction.eth_bnb_wallet;
//           flagColumn = transaction.erc20_flag ? "erc20_flag" : "ethereum_flag";
//         }
//         break;
//       case "bep20":
//       case "binance":
//         if (transaction.bep20_flag || transaction.binance_flag) {
//           walletAddress = transaction.eth_bnb_wallet;
//           flagColumn = transaction.bep20_flag ? "bep20_flag" : "binance_flag";
//         }
//         break;
//       case "tron":
//       case "trc20":
//         if (transaction.tron_flag) {
//           walletAddress = transaction.tron_wallet;
//           flagColumn = "tron_flag";
//         }
//         break;
//       case "brc20":
//         if (transaction.brc20_flag) {
//           walletAddress = transaction.bitcoin_wallet;
//           flagColumn = "brc20_flag";
//         }
//         break;
//       default:
//         return res.status(400).json({ message: "Unsupported network" });
//     }

//     if (!walletAddress) {
//       return res.status(404).json({ message: "No available wallet yet" });
//     }

//     // Update the flag to false after fetching the wallet using walletAddress
//     const updateQuery = `UPDATE settle_database.2Settle_walletAddress SET ${flagColumn} = 'false' WHERE bitcoin_wallet = ? OR eth_bnb_wallet = ? OR tron_wallet = ?`;
//     await connection.query(updateQuery, [
//       walletAddress,
//       walletAddress,
//       walletAddress,
//     ]);

//     return res.status(200).json({ walletAddress });
//   } catch (error) {
//     console.error("Error fetching wallet:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// }

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
