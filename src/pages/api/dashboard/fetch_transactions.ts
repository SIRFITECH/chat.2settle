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

  const { transaction_id, status } = req.query;

  try {
    // Build base query
    // let query = "SELECT * FROM summaries WHERE 1=1";
    let query = `
SELECT *
FROM (
    SELECT 
        t.date AS date,
        t.transfer_id AS transac_id,
        t.estimate_amount,
        t.crypto_amount,
        t.crypto,
        t.current_rate, 
        t.charges,
        t.amount_payable,
        s.status,
        s.transaction_type,
        s.transaction_id
    FROM summaries s
    LEFT JOIN transfers t ON s.transaction_id = t.id
    WHERE s.transaction_type = 'transfer'

    UNION ALL

    SELECT
        g.date AS date,
        g.gift_id AS transac_id,
        g.estimate_amount,
        g.crypto_amount,
        g.crypto,
        g.current_rate,
        g.charges,
        g.amount_payable,
        s.status,
        s.transaction_type,
        s.transaction_id
    FROM summaries s
    LEFT JOIN gifts g ON s.transaction_id = g.id
    WHERE s.transaction_type = 'gift'

    UNION ALL

    SELECT
        r.date AS date,
        r.request_id AS transac_id,
        r.estimate_amount,
        r.crypto_amount,
        r.crypto,
        r.current_rate,
        r.charges,
        r.amount_payable,
        s.status,
        s.transaction_type,
        s.transaction_id
    FROM summaries s
    LEFT JOIN requests r ON s.transaction_id = r.id
    WHERE s.transaction_type = 'request'
) AS all_trx
WHERE 1=1
`;

    const values: any[] = [];

    // Add condition for successful transactions if no status is provided
    if (status) {
      query += " AND `status` = ?";
      values.push(status);
    } else {
      query += " AND `all_trx.status` = ?";
      values.push("Successful");
    }

    // Optional filter for transaction ID
    if (transaction_id) {
      query += " AND `all_trx.transaction_id` = ?";
      values.push(transaction_id);
    }

    // Order by date descending to get the most recent transactions
    query += " ORDER BY date DESC";
    // Limit to 20 records
    query += " LIMIT 20";

    const [rows] = await connection.execute(query, values);
    // await connection.end();

    return res.status(200).json({ transactions: rows });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return res.status(500).json({
      message: "There was an internal error when trying to fetch transactions",
    });
  }
}
