import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import { SheetData } from "../../types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .send({ message: "Only POST requests are accepted?" });
  }

  const body = req.body as SheetData;

  https: try {
    const privateKey = `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDN0TxePPvntTfw\ndPF5cMmgKNW7mf+tzdYGmx1zP0uJW4W3aEudwZSEauhFuJnZHZEbmqQTG3AY8967\n0LEuUAI4z1kvPU8z5UeK1WkEpJSI2TO8xjIracr25dAXgeKZY+/UNe8F2DpOlwWV\nAx6sfTuCBruwK75TucnRrExxNmMImANdlBoqfEPNPVc4LZMui23pzrpc/bpsPCW7\nMd/XdJzT3wvZ6rabBWvVMiUH2Wt8cO7pPX/QNHH3W6TQKxNbYp3iEIKVsG3cTcJi\n4yYtOgT3Cy3++KZ/v2EqENPtpG9iPOW2HPsXD5WAasiAiwDTpcpUchoAjeTLClIH\nqAIPvGTZAgMBAAECggEANPOZAXHVKXbhLncXzTOsXA1Fd9+V/URQxSBRQl5Nc8hd\nLaOimLK+IBdVLOLiig5mT+DIR7Yub+0GJ/H4M78X4z/NZS7z2pkpf9mKDEy/fjnL\naszfCXZNZpoXoISlJOumP0Wk+i74SVHneL/1u1D452oODbQjYm0RNGWMwS/J6OKl\nCPd0KRK+Rm7keeTgpr/TP7H8r0QpeWnTEIJdBoiij3PAFb58/cwj5WVMjDlxu/P1\nvxyX0YTh2YnJ/SiD1eRWfytKMHr5QdFiDk6QFvdBc3Dgq8IEnuRE3GF/JM+Bz9k1\nnGAI8/CROIXg2d8EDRriYaUk2lzBvFBqH/nIPitM5QKBgQDsd5UpCG1ntbXhUB29\nCm3AQQsN4TtTFVVy0yLg1GyZ6wenFz9OHkMBxDEvO9R7fEyu664Z13qha2ZXHHre\nFBiW+ZyCTAYI2D92bdweMPZvt7fUwJnyjGbV5JgKj/X+eEzrTXjjuzYdbP+W0EGs\nZaz2QEbyYO3GJopjjAfS0liMjwKBgQDe0YWVIaZKExu9Ig4wPhJST4PqKwDmlEQk\ni8E8bbJgxPGykMzMrOcSFpKsA9T9hcWDR8EQGFN9s7pXDi+zF/IwB+4/ucYu89Sq\nAVD3Wh6um4bY9+FQ9YDnc9XN/fkphKLnBsMDk2VkkHq0lbP9x08+FAYhkrIMnou0\n9sLQRWX8FwKBgA4oitHOI17WTnGTLnSnLzMXseW+2qJ64IbjhW8YyPfeTrL+fVfc\nD/8HFDrTxkEujBjdG6uIb1tC5vnIRsMNSPuhLnHOw328FPCuW0Ojgt3ljig67/zJ\n005zRXc8b2oxIcnk9ZwNFYxlflg1V/lOjTChYJ4al6IJpLeZJs7EsXCZAoGAViA+\ntipPkIpaSn0DZvpXMqGxp63/pyDgRhAPHUB5lpYJpq/5uZOLrZ40C3Ffvq8abWgq\n5AHDI+94s3W0UlGLN62ZFeDFDhkJtrzTgwi+m1dahDssSJLcxJotpnXo/XdbUFl4\nv8UViA2goHTNIecMZj5vMEL3t5EBB23qV367sPkCgYAzx1IHzLaojlgWxqyNQ++h\nnGC1vfaWNvt7+Ne7Bx0ponVHf4dGf88CrbPNye5s/k1ET59b1wnGZTss1rcmwf/K\nhwxZQDWIhmZX1BAveH9LoO7m28JunhX9orBLoaUtP5/QFYLk6P+u3eAyRgqTVSnd\nthqjAEtPH+GErF4xuDyVyw==\n-----END PRIVATE KEY-----\n`;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({
      auth,
      version: "v4",
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "C3:G3",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            body["Gift ID"],
            body["Account Name"],
            body["Account Number"],
            body["Bank Name"],
            body["Payment Amount"],
          ],
        ],
      },
    });

    return res.status(200).json({
      data: response.data,
    });
  } catch (e) {
    console.error("Error appending to Google Sheet:", e);
    return res.status(500).send({ message: "Error appending to Google Sheet" });
  }
}
