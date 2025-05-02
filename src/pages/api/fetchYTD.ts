import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import mysql from "mysql2/promise";

const getGoogleCredentials = () => {
  const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (!base64)
    throw new Error("Google credentials missing in environment variables");
  return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  }

  try {
    // fetch the volume from excel
    const sheetID = process.env.SHEET_ID;
    const range = process.env.RANGE;
    const credentials = getGoogleCredentials();

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetID,
      range: range,
    });

    const value = response.data.values ? response.data.values[0][0] : null;

    const dbHost = process.env.host;
    const dbUser = process.env.user;
    const dbPassword = process.env.password;
    const dbName = process.env.database;

    const connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    const [rows]: any = await connection.execute(
      `SELECT receiver_amount, current_rate  FROM 2settle_transaction_table WHERE status = 'Successful'`
    );

    await connection.end();

    const dbVolume = rows.reduce((total: number, row: any) => {
      const rawAmount = (row.receiver_amount || "").replace(/[₦, ]/g, "");
      const nairaAmount = parseFloat(rawAmount);
      const rawRate = (row.current_rate || "").replace(/[₦,]/g, "");
      const rate = parseFloat(rawRate);

      if (!isNaN(nairaAmount) && !isNaN(rate) && rate !== 0) {
        return total + nairaAmount / rate;
      }

      return total;
    }, 0);

    res.status(200).json({ ytdVolume: value, dbVolume: dbVolume.toFixed(8) });
  } catch (e) {
    console.log("Error fetching Year To Date Volume", e);
    res.status(500).send("Failed to retrieve YTD Volume");
  }
}
