import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { request_id, ...fieldsToUpdate } = req.body;

  if (!request_id) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

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

    // Dynamically build the query
    const setClause = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");
    const values = Object.values(fieldsToUpdate);

    const query = `UPDATE requests SET ${setClause} WHERE request_id = ?`;

    const [result] = await connection.execute<mysql.ResultSetHeader>(query, [
      ...values,
      request_id,
    ]);

    await connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Transaction updated successfully" });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (err) {
    console.error("Error updating the database:", err);
    res.status(500).send("Server error");
  }
}
