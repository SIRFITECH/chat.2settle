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
import { fetchProfitRate } from "../../helpers/api_calls";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const marchentProfit = await fetchProfitRate();
    if (!marchentProfit) {
      console.error("Error: marchentProfit is undefined or null");
      return res
        .status(500)
        .json({ error: "Failed to fetch merchant profit rate" });
    }

    const apiKey = process.env.NAIRA_API_KEY;
    if (!apiKey) {
      console.error("Error: NAIRA_API_KEY is not set");
      return res.status(500).json({ error: "API key is missing" });
    }

    const apiUrl = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=NGN`;
    const response = await axios.get(apiUrl);
    console.log("Currency API response:", response.data);

    const { NGN } = response.data.data;

    if (NGN) {
      const nairaRate = NGN.value;
      if (typeof nairaRate !== "number" || typeof marchentProfit !== "number") {
        console.error("Error: nairaRate or marchentProfit is not a number");
        return res.status(500).json({ error: "Invalid rate data" });
      }

      const rawRate = nairaRate - marchentProfit;
      const percentage = 0.8;
      const increase = (percentage / 100) * rawRate;
      const adjustedRate = rawRate - increase;
      const formattedRate = adjustedRate.toLocaleString();

      res.status(200).json({ rate: formattedRate });
    } else {
      res.status(404).json({ error: "Naira rate not found" });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error fetching Naira rate:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("General error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
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
