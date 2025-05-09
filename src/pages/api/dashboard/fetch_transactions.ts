// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }

//   const { transac_id, status } = req.query;

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

//     // Build base query
//     let query =
//       "SELECT * FROM `settle_database`.`2settle_transaction_table` WHERE 1=1";
//     const values: any[] = [];

//     // Optional filters
//     if (transac_id) {
//       query += " AND `transac_id` = ?";
//       values.push(transac_id);
//     }

//     if (status) {
//       query += " AND `status` = ?";
//       values.push(status);
//     }

//     query += " ORDER BY `Date` ";

//     const [rows] = await connection.execute(query, values);
//     await connection.end();

//     return res.status(200).json({ transactions: rows });
//   } catch (err) {
//     console.error("Error fetching transactions:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { transac_id, status } = req.query;

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

    // Build base query
    let query = "SELECT * FROM `2settle_transaction_table` WHERE 1=1";
    const values: any[] = [];

    // Add condition for successful transactions if no status is provided
    if (status) {
      query += " AND `status` = ?";
      values.push(status);
    } else {
      // Assuming 'success' is the value for successful transactions
      // Replace 'success' with the actual value used in your database
      query += " AND `status` = ?";
      values.push("Successful");
    }

    // Optional filter for transaction ID
    if (transac_id) {
      query += " AND `transac_id` = ?";
      values.push(transac_id);
    }

    // Order by date descending to get the most recent transactions
    query += " ORDER BY `id` DESC";

    // Limit to 20 records
    query += " LIMIT 20";

    const [rows] = await connection.execute(query, values);
    await connection.end();

    return res.status(200).json({ transactions: rows });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
