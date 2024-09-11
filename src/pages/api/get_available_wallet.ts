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

//     switch (network) {
//       case "btc":
//         if (transaction.bitcoin_flag) {
//           walletAddress = transaction.bitcoin_wallet;
//         }
//         break;
//       case "erc20":
//       case "ethereum":
//         if (transaction.erc20_flag || transaction.ethereum_flag) {
//           walletAddress = transaction.eth_bnb_wallet;
//         }
//         break;
//       case "bep20":
//       case "binance":
//         if (transaction.bep20_flag || transaction.binance_flag) {
//           walletAddress = transaction.eth_bnb_wallet;
//         }
//         break;
//       case "tron":
//       case "trc20":
//         if (transaction.tron_flag) {
//           walletAddress = transaction.tron_wallet;
//         }
//         break;
//       case "brc20":
//         if (transaction.brc20_flag) {
//           walletAddress = transaction.bitcoin_wallet;
//         }
//         break;
//       default:
//         return res.status(400).json({ message: "Unsupported network" });
//     }

//     if (!walletAddress) {
//       return res.status(404).json({ message: "No available wallet yet" });
//     }

//     return res.status(200).json({ walletAddress });
//   } catch (error) {
//     console.error("Error fetching wallet:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise";

// Create a MySQL connection (use your own credentials here)
const connection = mysql.createPool({
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
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { network } = req.query;

  if (!network) {
    return res.status(400).json({ message: "Network parameter is required" });
  }

  try {
    // Query to get the relevant transaction row
    const query = "SELECT * FROM settle_database.2Settle_walletAddress LIMIT 1";
    const [rows] = await connection.query<RowDataPacket[]>(query);

    if (!rows.length) {
      return res.status(404).json({ message: "No transaction data found" });
    }

    const transaction = rows[0];
    let walletAddress = "";
    let flagColumn = "";

    switch (network) {
      case "btc":
        if (transaction.bitcoin_flag) {
          walletAddress = transaction.bitcoin_wallet;
          flagColumn = "bitcoin_flag";
        }
        break;
      case "erc20":
      case "ethereum":
        if (transaction.erc20_flag || transaction.ethereum_flag) {
          walletAddress = transaction.eth_bnb_wallet;
          flagColumn = transaction.erc20_flag ? "erc20_flag" : "ethereum_flag";
        }
        break;
      case "bep20":
      case "binance":
        if (transaction.bep20_flag || transaction.binance_flag) {
          walletAddress = transaction.eth_bnb_wallet;
          flagColumn = transaction.bep20_flag ? "bep20_flag" : "binance_flag";
        }
        break;
      case "tron":
      case "trc20":
        if (transaction.tron_flag) {
          walletAddress = transaction.tron_wallet;
          flagColumn = "tron_flag";
        }
        break;
      case "brc20":
        if (transaction.brc20_flag) {
          walletAddress = transaction.bitcoin_wallet;
          flagColumn = "brc20_flag";
        }
        break;
      default:
        return res.status(400).json({ message: "Unsupported network" });
    }

    if (!walletAddress) {
      return res.status(404).json({ message: "No available wallet yet" });
    }

    // Update the flag to false after fetching the wallet using walletAddress
    const updateQuery = `UPDATE settle_database.2Settle_walletAddress SET ${flagColumn} = 'false' WHERE bitcoin_wallet = ? OR eth_bnb_wallet = ? OR tron_wallet = ?`;
    await connection.query(updateQuery, [
      walletAddress,
      walletAddress,
      walletAddress,
    ]);

    return res.status(200).json({ walletAddress });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}
