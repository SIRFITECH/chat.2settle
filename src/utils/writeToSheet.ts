import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function appendToSheet(
  spreadsheetId: string,
  range: string,
  values: any[]
) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handling newline characters
    scopes: SCOPES,
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const request = {
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values: [values],
      },
    };
    const response = await sheets.spreadsheets.values.append(request);
    return response.data;
  } catch (error) {
    console.error("Error appending to Google Sheet:", error);
    throw error;
  }
}
