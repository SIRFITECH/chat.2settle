import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { ticker } = req.body;

  console.log("Received request with symbol:", ticker);

  if (!ticker || typeof ticker !== "string") {
    return res
      .status(400)
      .json({ error: "Ticker is required and must be a string" });
  }

  try {
    console.log(`Fetching data for symbol: ${ticker}`);
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${ticker}`
    );
    console.log("Data fetched successfully:", response.data);
    const { price } = response.data;
    res.status(200).send(price);
  } catch (error) {
    console.error("Error fetching coin price:", error);
    res.status(500).send("Server error");
  }
}
