import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Make the HTTP request to the external API using axios
    const response = await axios.get(
      "https://hd-wallet-api.vercel.app/ethereumWallet"
    );

    // Process the data if needed (this example assumes `data` is already in the desired format)
    const data = response.data;

    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting btc Wallet:", err);
    res.status(500).send("Server error");
  }
}
