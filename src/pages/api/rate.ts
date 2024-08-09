// import mysql, { RowDataPacket } from "mysql2/promise";
// import { NextApiRequest, NextApiResponse } from "next";
// import { ExchangeRate } from "../../types/types";

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

//     const [results] = await connection.query<RowDataPacket[]>(
//       "SELECT * FROM 2Settle_ExchangeRate"
//     );

//     const result = results[0] as ExchangeRate;
//     const raw = result.rate;
//     const array_rate = raw.toString();
//     const numRate = Number(array_rate);
//     const percentage = 0.8;
//     const increase = (percentage / 100) * numRate;
//     const rate = numRate - increase;
//     const data = rate.toLocaleString();

//     await connection.end();

//     res.status(200).json({ rate: data });
//   } catch (err) {
//     console.error(
//       "Error querying the 2Settle_ExchangeRate from database:",
//       err
//     );
//     res.status(500).send("Server error");
//   }
// }

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import { ExchangeRate } from "../../types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Database credentials from environment variables
  const dbHost = process.env.host;
  const dbUser = process.env.user;
  const dbPassword = process.env.password;
  const dbName = process.env.database;

  try {
    // Establish a connection to the database
    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    // Query the database for the merchant profit rate
    const [results] = await connection.query<RowDataPacket[]>(
      "SELECT profit_rate FROM 2Settle_ExchangeRate"
    );

    // Ensure we have results and extract the profit rate
    const result = results[0] as ExchangeRate;
    const merchantProfit = result.profit_rate;

    // Close the database connection
    await connection.end();

    // Fetch the Naira rate from the external API
    const apiKey = process.env.NAIRA_API_KEY;
    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=NGN`;

    const response = await axios.get(apiUrl);
    const { NGN } = response.data.data;

    if (NGN) {
      // Calculate the adjusted rate using the profit rate from the database
      const nairaRate = NGN.value;
      const rawRate = nairaRate - parseFloat(merchantProfit);
      const percentage = 0.8;
      const increase = (percentage / 100) * rawRate;
      const adjustedRate = rawRate - increase;
      const formattedRate = adjustedRate.toLocaleString();

      // Send the calculated rate back as a response
      res.status(200).json({ rate: formattedRate });
    } else {
      res.status(404).json({ error: "Naira rate not found" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
}

// import axios from "axios";
// import { NextApiRequest, NextApiResponse } from "next";
// import { fetchProfitRate } from "../../helpers/api_calls";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
//   const marchentProfit = await fetchProfitRate();
//   const apiKey = process.env.NAIRA_API_KEY;
//   const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=NGN`;

//   try {
//     const response = await axios.get(apiUrl);
//     const { NGN } = response.data.data;

//     if (NGN) {
//       const nairaRate = NGN.value;
//       const rawRate = nairaRate - marchentProfit;
//       const percentage = 0.8;
//       const increase = (percentage / 100) * rawRate;
//       const adjustedRate = rawRate - increase;
//       const formattedRate = adjustedRate.toLocaleString();

//       res.status(200).json({ rate: formattedRate });
//     } else {
//       res.status(404).json({ error: "Naira rate not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching Naira rate:", error);
//     res.status(500).send("Server error");
//   }
// }
