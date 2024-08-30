// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const {
//     phone_number,
//     bitcoin_wallet,
//     bitcoin_privateKey,
//     eth_bnb_wallet,
//     eth_bnb_privateKey,
//     tron_wallet,
//     tron_privateKey,
//   } = req.body;

//   if (!phone_number) {
//     return res.status(400).json({ message: "Phone number is required" });
//   }

//   const dbHost = process.env.host;
//   const dbUser = process.env.user;
//   const dbPassword = process.env.password;
//   const dbName = process.env.database;

//   try {
//     const connection = await mysql.createConnection({
//       host: dbHost,
//       user: dbUser,
//       password: dbPassword,
//       database: dbName,
//     });

//     const [result] = await connection.execute<mysql.ResultSetHeader>(
//       `UPDATE \`Telegram_Database\`.\`2Settle_walletAddress\`
//        SET
//          bitcoin_wallet = COALESCE(?, bitcoin_wallet),
//          bitcoin_privateKey = COALESCE(?, bitcoin_privateKey),
//          eth_bnb_wallet = COALESCE(?, eth_bnb_wallet),
//          eth_bnb_privateKey = COALESCE(?, eth_bnb_privateKey),
//          tron_wallet = COALESCE(?, tron_wallet),
//          tron_privateKey = COALESCE(?, tron_privateKey)
//        WHERE phone_number = ?`,
//       [
//         bitcoin_wallet,
//         bitcoin_privateKey,
//         eth_bnb_wallet,
//         eth_bnb_privateKey,
//         tron_wallet,
//         tron_privateKey,
//         phone_number,
//       ]
//     );

//     await connection.end();

//     if (result.affectedRows > 0) {
//       res
//         .status(200)
//         .json({ message: "Wallet information updated successfully" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (err) {
//     console.error("Error updating the database:", err);
//     res.status(500).send("Server error");
//   }
// }
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    phone_number,
    bitcoin_wallet = null,
    bitcoin_privateKey = null,
    eth_bnb_wallet = null,
    eth_bnb_privateKey = null,
    tron_wallet = null,
    tron_privateKey = null,
  } = req.body;

  if (!phone_number) {
    return res.status(400).json({ message: "Phone number is required" });
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

    const [result] = await connection.execute<mysql.ResultSetHeader>(
      `UPDATE \`settle_database\`.\`2Settle_walletAddress\`
       SET 
         bitcoin_wallet = COALESCE(?, bitcoin_wallet),
         bitcoin_privateKey = COALESCE(?, bitcoin_privateKey),
         eth_bnb_wallet = COALESCE(?, eth_bnb_wallet),
         eth_bnb_privateKey = COALESCE(?, eth_bnb_privateKey),
         tron_wallet = COALESCE(?, tron_wallet),
         tron_privateKey = COALESCE(?, tron_privateKey)
       WHERE phone_number = ?`,
      [
        bitcoin_wallet,
        bitcoin_privateKey,
        eth_bnb_wallet,
        eth_bnb_privateKey,
        tron_wallet,
        tron_privateKey,
        phone_number,
      ]
    );


    await connection.end();

    if (result.affectedRows > 0) {
      res
        .status(200)
        .json({ message: "Wallet information updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Server error");
  }
}

// import mysql from "mysql2/promise";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "PUT") {
//     res.setHeader("Allow", ["PUT"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const dbHost = process.env.host;
//   const dbUser = process.env.user;
//   const dbPassword = process.env.password;
//   const dbName = process.env.database;

//   const {
//     phone_number,
//     bitcoin_wallet,
//     bitcoin_privateKey,
//     eth_bnb_wallet,
//     eth_bnb_privateKey,
//     tron_wallet,
//     tron_privateKey,
//   } = req.body;

//   if (!phone_number) {
//     return res.status(400).json({ error: "Phone number is required" });
//   }

//   const updatedWalletData: Partial<{
//     bitcoin_wallet: string;
//     bitcoin_privateKey: string;
//     eth_bnb_wallet: string;
//     eth_bnb_privateKey: string;
//     tron_wallet: string;
//     tron_privateKey: string;
//   }> = {
//     bitcoin_wallet,
//     bitcoin_privateKey,
//     eth_bnb_wallet,
//     eth_bnb_privateKey,
//     tron_wallet,
//     tron_privateKey,
//   };

//   // Remove undefined fields from updatedWalletData
//   for (const key in updatedWalletData) {
//     if (
//       updatedWalletData[key as keyof typeof updatedWalletData] === undefined
//     ) {
//       delete updatedWalletData[key as keyof typeof updatedWalletData];
//     }
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: dbHost,
//       user: dbUser,
//       password: dbPassword,
//       database: dbName,
//     });

//     const [result] = await connection.query<mysql.ResultSetHeader>(
//       "UPDATE Telegram_Database.2Settle_walletAddress SET ? WHERE phone_number = ?",
//       [updatedWalletData, phone_number]
//     );

//     await connection.end();

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res
//       .status(200)
//       .json({ message: "User wallet information updated successfully" });
//   } catch (err) {
//     console.error("Error updating wallet data:", err);
//     res.status(500).send("Server error");
//   }
// }
