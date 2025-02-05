import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// const credentials = JSON.parse(
//   fs.readFileSync(path.join(process.cwd(), "config/credentials.json"), "utf-8")
// );

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

    res.status(200).json({ ytdVolume: value });
  } catch (e) {
    console.log("Error fetching Year To Date Volume", e);
    res.status(500).send("Failed to retrieve YTD Volume");
  }
}
