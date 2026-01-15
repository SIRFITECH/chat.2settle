// import connection from "@/lib/mysql";
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

//   // const dbHost = process.env.host;
//   // const dbUser = process.env.user;
//   // const dbPassword = process.env.password;
//   // const dbName = process.env.database;
//   const { request_id } = req.query;

//   if (!request_id) {
//     return res.status(400).json({ message: "request_id is required" });
//   }

//   try {
//     // const connection = await mysql.createConnection({
//     //   host: dbHost,
//     //   user: dbUser,
//     //   password: dbPassword,
//     //   database: dbName,
//     // });

//     const query = `
//       SELECT
//         *
//       FROM
//        requests
//       WHERE
//         request_id = ?
//       AND
//         status IN ('Successful', 'Processing', 'UnSuccessful', 'Uncompleted', 'cancel')
//     `;

//     const [rows] = await connection.query<RowDataPacket[]>(query, [request_id]);

//     await connection.end();

//     if (rows.length > 0) {
//       // If there are rows, return them along with their statuses
//       const result = rows.map((row) => ({
//         status: row.status,
//         request_id: row.request_id,
//         transaction: row,
//       }));

//       res.status(200).json({ exists: true, transactions: result });
//     } else {
//       res.status(200).json({ exists: false });
//     }
//   } catch (err) {
//     console.error("Error querying the database:", err);
//     res.status(500).send("Server error");
//   }
// }

import connection from "@/lib/mysql";
import  { RowDataPacket } from "mysql2/promise";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { request_id } = req.query;

  if (!request_id) {
    return res.status(400).json({ message: "request_id is required" });
  }

  if (request_id.length > 6 || request_id.length < 6) {
    return res.status(400).json({ message: "request_id is required" });
  }

  try {
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT *   FROM requests WHERE request_id = ?",
      [request_id]
    );

    if (rows.length > 0) {
      res.status(200).json({ exists: true, user: rows[0] });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Server error");
  }
}

