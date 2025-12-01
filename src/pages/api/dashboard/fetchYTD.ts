import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import connection from "@/lib/mysql";
import { RowDataPacket } from "mysql2";

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

    // fetch and sum all the successful dollar amounts from the database
    const [rows]: any = await connection.execute(
      `SELECT total_dollar  FROM summaries WHERE status = 'Successful'`
    );

    const dbVolume = rows.reduce((total: number, row: any) => {
      const dollarAmount = parseFloat(row.total_dollar);
      if (!isNaN(dollarAmount)) {
        return total + dollarAmount;
      }

      return total;
    }, 0);

    res.status(200).json({ ytdVolume: value, dbVolume: dbVolume.toFixed(8) });
  } catch (e) {
    console.log("Error fetching Year To Date Volume", e);
    res.status(500).send("Failed to retrieve YTD Volume");
  }
}
