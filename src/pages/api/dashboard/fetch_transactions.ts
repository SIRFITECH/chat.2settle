import { NextApiRequest, NextApiResponse } from "next";
import connection from "@/lib/mysql";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { transac_id, status } = req.query;

  try {
    // Build base query
    let query = "SELECT * FROM `2settle_transaction_table` WHERE 1=1";
    const values: any[] = [];

    // Add condition for successful transactions if no status is provided
    if (status) {
      query += " AND `status` = ?";
      values.push(status);
    } else {
      query += " AND `status` = ?";
      values.push("Successful");
    }

    // Optional filter for transaction ID
    if (transac_id) {
      query += " AND `transac_id` = ?";
      values.push(transac_id);
    }

    // Order by date descending to get the most recent transactions
    query += " ORDER BY STR_TO_DATE(`Date`, '%l:%i%p %d/%m/%Y') DESC,`id` DESC";
    // Limit to 20 records
    query += " LIMIT 20";

    const [rows] = await connection.execute(query, values);
    // await connection.end();

    return res.status(200).json({ transactions: rows });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
