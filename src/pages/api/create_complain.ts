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

//   try {
//     const connection = await mysql.createConnection({
//       host: dbHost,
//       user: dbUser,
//       password: dbPassword,
//       database: dbName,
//     });

//     const [rows] = await connection.query<RowDataPacket[]>(
//       "SELECT complain, transaction_id, Customer_phoneNumber, status, complain_id FROM `Telegram_Database`.`2settle_complain_table`"
//     );

//     await connection.end();

//     if (rows.length > 0) {
//       res.status(200).json({ complaints: rows });
//     } else {
//       res.status(200).json({ complaints: [] });
//     }
//   } catch (err) {
//     console.error("Error querying the database:", err);
//     res.status(500).send("Server error");
//   }
// }

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
    transaction_id,
    complain,
    status,
    Customer_phoneNumber,
    complain_id,
  } = req.body;

  const complainData = {
    transaction_id,
    complain,
    status,
    Customer_phoneNumber,
    complain_id,
  };

  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const query = "INSERT INTO 2settle_complain_table SET ?";
    const [result] = await connection.query(query, complainData);

    await connection.end();

    res.status(200).json({ message: "Complain data stored successfully", result });
  } catch (err) {
    console.error("Error storing user data:", err);
    res.status(500).send("Server error");
  }
}
