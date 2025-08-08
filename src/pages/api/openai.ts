// // pages/api/chat.js

// import { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAI } from 'openai';

// //const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
// const token = process.env.OPENAI_API_KEY
// const openai = new OpenAI({
//   baseURL: "https://models.github.ai/inference",
//   apiKey: token
// });

// export default async function handler(
//   req: NextApiRequest,

//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Only POST allowed' });
//   }

//   const { messages } = req.body;

//   try {
//     const chatResponse = await openai.chat.completions.create({
//       model: "gpt-4o", // or 'gpt-3.5-turbo'
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful crypto assistant for 2settle. You help users convert crypto to naira and send to wallets like OPay, Kuda, etc.',
//         },
//         ...messages,
//       ],
//     });

//     const reply = chatResponse.choices[0].message.content;
//     res.status(200).json({ reply });
//   } catch (error) {
//     console.error('OpenAI error:', error);
//     res.status(500).json({ message: 'Something went wrong', error });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import {
  fetchCoinPrice,
  fetchRate,
  resolveBankAccount,
} from "@/helpers/api_calls";
import { extractTransactionData, getNextMissingField } from "@/lib/nlpHelpers";
import { calculateCryptoAmount } from "@/utils/menuUtils/transactCryptoUtils";
import { sessionStore } from "@/lib/sessionStore";

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST allowed" });

  const { messages, sessionId } = req.body;
  const session = sessionStore.get(sessionId) || {};

  try {
    // 1. Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful, cheerful and concise Nigerian crypto assistant for 2settle.
                You help users convert crypto to naira and send to Nigerian bank accounts.
                Collect these details step-by-step (ask one at a time):
                1. Asset (BTC, ETH, BNB, TRON, USDT)
                2. Network (only if asset is USDT)
                3. Estimation type: crypto, naira, or dollar
                4. Amount
                5. Charges mode: add (top up) or deduct (remove from amount)
                6. Bank name
                7. Account number

                Keep responses short, friendly, and clear. Never ask for more than one detail at a time.

                If the user gives multiple values, extract what you can, confirm it, and move to the next question.
                If the user provides a value but you need another value to compute, extract the value you have,
                then ask for the value you need to compute the next one
                eg if a user says he wants to send USDT, you need network to get wallet.
                If a user choose to use BTC, the network should automatically be BTC and like that, only exception is USDT.
              `,
        },
        ...messages,
      ],
    });

    const reply = aiResponse.choices[0].message.content || "";

    // 2. Extract info from latest user message using GPT
    const extracted = await extractTransactionData(
      messages[messages.length - 1].content
    );

    // 3. Update session
    const updatedSession = { ...session, ...extracted };

    // 4. Auto-fetch info if ready
    if (updatedSession.asset && !updatedSession.assetPrice ) {
      // updatedSession.network;
      console.log("Updated session:", updatedSession)
      updatedSession.assetPrice = await fetchCoinPrice(updatedSession.network);
    }

    if (!updatedSession.rate) {
      updatedSession.rate = await fetchRate();
    }

    if (
      updatedSession.bankName &&
      updatedSession.accountNumber &&
      !updatedSession.receiverName
    ) {
      const name = await resolveBankAccount(
        updatedSession.bankName,
        updatedSession.accountNumber
      );
      if (name) updatedSession.receiverName = name;
    }

    // 5. Check what is still missing
    const missingField = getNextMissingField(updatedSession);

    // 6. Prompt accordingly
    let followUp = "";
    if (missingField === "chargesMode")
      followUp = "How should we apply service charge – add or deduct?";
    else if (missingField === "bankName")
      followUp = "Which bank are you sending to?";
    else if (missingField === "accountNumber")
      followUp = "Please enter the recipient’s account number.";
    else if (missingField === "confirmBank") {
      followUp = `You're sending to ${updatedSession.receiverName} – ${updatedSession.bankName} (${updatedSession.accountNumber}). Confirm?`;
    } else if (missingField === "summary") {
      const cryptoAmount = calculateCryptoAmount(updatedSession);
      followUp = `You're about to send NGN ${updatedSession.naira} to ${updatedSession.receiverName} (${updatedSession.bankName} - ${updatedSession.accountNumber}) using ${cryptoAmount} ${updatedSession.asset}. Should I generate a payment wallet?`;
    }

    // 7. Save session
    sessionStore.set(sessionId, updatedSession);

    res.status(200).json({
      reply: reply + "\n\n" + followUp,
      session: updatedSession,
    });
  } catch (err) {
    console.error("Error in /api/openai:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
