// import mysql, { RowDataPacket } from "mysql2/promise";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const dbHost = process.env.host;
//   const dbUser = process.env.user;
//   const dbPassword = process.env.password;
//   const dbName = process.env.database;
//   const { phone_number } = req.query;

//   if (!phone_number) {
//     return res.status(400).json({ message: "phone_number is required" });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: dbHost,
//       user: dbUser,
//       password: dbPassword,
//       database: dbName,
//     });

//     const [rows] = await connection.query<RowDataPacket[]>(
//       "SELECT * FROM `2Settle_walletAddress` WHERE `phone_number` = ?",
//       [phone_number]
//     );
//     // `settle_database`.

//     await connection.end();

//     if (rows.length > 0) {
//       res.status(200).json({ exists: true, user: rows[0] });
//     } else {
//       res.status(200).json({ exists: false });
//     }
//   } catch (err) {
//     console.error("Error querying the database:", err);
//     res.status(500).send("Server error");
//   }
// }

// FOR TRANSACTION TABLE

import type { NextApiRequest, NextApiResponse } from "next";
import mysql, { RowDataPacket } from "mysql2/promise"; // Use the promise version of mysql2 for async/await
import { formatPhoneNumber } from "@/utils/utilities";

// Create a connection pool (replace with your actual DB credentials)
const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { query } = req;
//   const { phoneNumber, walletAddress } = query;

//   // If neither input is provided, return an error
//   if (!phoneNumber && !walletAddress) {
//     return res.status(400).json({
//       error: "At least one of phone number or wallet address is required",
//     });
//   }

//   try {
//     // Construct dynamic query based on which parameters are provided
//     let queryStr = `
//       SELECT * FROM settle_database.2settle_transaction_table 
//       WHERE 1=1
//     `;
//     const queryParams: (string | null)[] = [];

//     // If phoneNumber is provided, add it to the query
//     if (phoneNumber) {
//       const phoneNo = formatPhoneNumber(phoneNumber as string);
//       queryStr += " AND customer_phoneNumber = ?";
//       queryParams.push(phoneNo as string);
//     }

//     // If walletAddress is provided, add it to the query
//     if (walletAddress) {
//       queryStr += " AND wallet_address = ?";
//       queryParams.push(walletAddress as string);
//     }

//     // Execute the query, and explicitly type the result as RowDataPacket[]
//     const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);

//     // Return all matching transactions
//     if (rows.length > 0) {
//       return res.status(200).json({ exists: true, transactions: rows });
//     } else {
//       return res.status(404).json({ exists: false, transactions: [] });
//     }
//   } catch (error) {
//     console.error("Error checking user in database:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { phoneNumber, walletAddress } = query;

  if (!phoneNumber && !walletAddress) {
    return res.status(400).json({
      error: "At least one of phone number or wallet address is required",
    });
  }

  try {
    let queryStr = `
      SELECT * FROM settle_database.2settle_transaction_table 
      WHERE 1=1
    `;
    const queryParams: (string | null)[] = [];

    if (phoneNumber) {
      const phoneNo = formatPhoneNumber(phoneNumber as string);
      queryStr += " AND customer_phoneNumber = ?";
      queryParams.push(phoneNo);
    }

    if (walletAddress) {
      queryStr += " AND wallet_address = ?";
      queryParams.push(walletAddress as string);
    }

    const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);

    // Return the rows (transactions) in the "transactions" field
    if (rows.length > 0) {
      return res.status(200).json({ exists: true, transactions: rows });
    } else {
      return res.status(404).json({ exists: false, transactions: [] });
    }
  } catch (error) {
    console.error("Error checking user in database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// // FOR USER TABLE
// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql, { RowDataPacket } from "mysql2/promise"; // Use the promise version of mysql2 for async/await

// // Create a connection pool (replace with your actual DB credentials)
// const db = mysql.createPool({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { query } = req;
//   const { phoneNumber, walletAddress } = query;

//   // If neither input is provided, return an error
//   if (!phoneNumber && !walletAddress) {
//     return res.status(400).json({
//       error: "At least one of phone number or wallet address is required",
//     });
//   }

//   try {
//     // Construct dynamic query based on which parameters are provided
//     let queryStr = `
//       SELECT * FROM settle_database.2settle_user
//       WHERE 1=1
//     `;
//     const queryParams: (string | null)[] = [];

//     // If phoneNumber is provided, add it to the query
//     if (phoneNumber) {
//       queryStr += " AND phone_number = ?";
//       queryParams.push(phoneNumber as string);
//     }

//     // If walletAddress is provided, add it to the query
//     if (walletAddress) {
//       queryStr += " AND wallet_address = ?";
//       queryParams.push(walletAddress as string);
//     }

//     // Execute the query, and explicitly type the result as RowDataPacket[]
//     const [rows] = await db.query<RowDataPacket[]>(queryStr, queryParams);

//     // Check if any rows were returned
//     if (rows.length > 0) {
//       return res.status(200).json({ exists: true, user: rows[0] });
//     } else {
//       return res.status(404).json({ exists: false });
//     }
//   } catch (error) {
//     console.error("Error checking user in database:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// }
