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
  createTransaction,
  fetchCoinPrice,
  fetchRate,
  getAvaialableWallet,
  resolveBankAccount,
} from "@/helpers/api_calls";
import { extractTransactionData, getNextMissingField } from "@/lib/nlpHelpers";
import { calculateCryptoAmount } from "@/utils/menuUtils/transactCryptoUtils";
import { sessionStore } from "@/lib/sessionStore";

// at top of the file (outside handler)
type Sess = Record<string, any>;

declare global {
  // eslint-disable-next-line no-var
  var __SESSIONS__: Sess | undefined;
}

const session: Sess = global.__SESSIONS__ ?? (global.__SESSIONS__ = {});

const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: process.env.OPENAI_API_KEY!,
});

//let session: { [key: string]: any } = {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST allowed" });

  const { messages, sessionId } = req.body;


  
  // const sessions = sessionStore.get(sessionId) || {}; 
// const sessionId = '386490'
  if (!session[sessionId]) {
    session[sessionId] = {};
  }

  console.log('session...', session)
  console.log('sessionId', sessionId)
   // 2. Extract info from latest user message using GPT
   const extracted = await extractTransactionData(
    messages[messages.length - 1].content
  );

  // 3. Update session
  const updatedSession = { ...session[sessionId], ...extracted };
  console.log("Updatedddd session:", updatedSession)
  
    if (
      updatedSession.bankName &&
      updatedSession.accountNumber &&
      !updatedSession.receiverName
    ) {
      const name = await resolveBankAccount(
        updatedSession.bankName,
        updatedSession.accountNumber
      );   
      if (name) updatedSession['receiverName'] = name;
    }
  
  if (updatedSession.phoneNumber) {
     const lowercase = updatedSession.network.toLowerCase()
     console.log('this is the network:',lowercase)
          const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
            lowercase
          );
      updatedSession['activeWallet'] = activeWallet;
    if (updatedSession.estimationType === 'naira') {
      updatedSession['numbersOnly'] = updatedSession.amount.replace(/[^0-9.]/g, '');
      const parsedValue = parseFloat(updatedSession['numbersOnly']);
      if (!isNaN(parsedValue)) {
        if (updatedSession['numbersOnly'] <= 2000000 && updatedSession['numbersOnly'] >= 20000) {
          updatedSession['amountNum'] = updatedSession['numbersOnly'];
          const nairaValue = Number(updatedSession['amountNum'])
          updatedSession['amountString'] = nairaValue.toLocaleString()
          if (updatedSession['amountNum'] <= 100000) {
            updatedSession['transactionFee'] = 500;
          } else if (updatedSession['amountNum'] <= 1000000) {
            updatedSession['transactionFee'] = 1000;
          } else if (updatedSession['amountNum'] <= 2000000) {
            updatedSession['transactionFee'] = 1500;
          } else if (updatedSession['amountNum'] >= 2100000) {
            updatedSession['transactionFee'] = 2000;
          }
             
          updatedSession['amountNum'] = updatedSession['amountNum'] + updatedSession['transactionFee']
          updatedSession['dollaramount'] = updatedSession['amountNum'] / updatedSession.rate
          updatedSession['asset'] = updatedSession['dollaramount'] / updatedSession.assetPrice
          updatedSession['totalcrypto'] = updatedSession['asset'].toFixed(8)
          updatedSession['amountNum'] = Number(updatedSession['amountNum'])
          updatedSession['amountString'] = updatedSession['amountNum'].toLocaleString()
          updatedSession['effort'] = updatedSession['amountNum'] * 0.01;
          

        }
      }
    } else if (updatedSession.estimationType === 'dollar') {
      updatedSession['numbersOnly'] = updatedSession.amount.replace(/[^0-9.]/g, '');
     updatedSession['amountNum'] = parseFloat(updatedSession['numbersOnly']);
      const less100 = 100000 / updatedSession.rate
      const less1million = 1000000 / updatedSession.rate
      const less2million = 2000000 / updatedSession.rate
      if (updatedSession['amountNum'] <= less100) {
        updatedSession['transactionFee'] = 500;
      } else if (updatedSession['amountNum'] <= less1million) {
        updatedSession['transactionFee'] = 1000;
      } else if (updatedSession['amountNum'] <= less2million) {
        updatedSession['transactionFee'] = 1500;
      }
       
      updatedSession['dollarTransactionFee'] = updatedSession['transactionFee'] / updatedSession.rate
      updatedSession['nairaAmount'] = updatedSession['amountNum'] * updatedSession.rate
      updatedSession['dollaramount'] = updatedSession['amountNum'] + updatedSession['dollarTransactionFee']
      updatedSession['asset'] = updatedSession['dollaramount'] / updatedSession.assetPrice
      updatedSession['totalcrypto'] = updatedSession['asset'].toFixed(8)
      updatedSession['nairaAmount'] = Number(updatedSession['nairaAmount'])
      updatedSession['amountString']   =  updatedSession['nairaAmount'].toLocaleString()
      updatedSession['effort'] = updatedSession['nairaAmount'] * 0.01;

     }
  }
  if (updatedSession.activeWallet) {
     createTransaction(session[sessionId])
   }
  try {
    // 1. Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful, cheerful and concise Nigerian crypto assistant for 2settle.
                You help users convert crypto to naira and send to Nigerian bank accounts.
                Never ask about charges, fees, deductions, or service charge in any form.
.
                Collect these details step-by-step (ask one at a time): 

                Keep responses short, friendly, and clear. Never ask for more than one detail at a time.
   
You collect details step-by-step, but SKIP questions if they have already been provided earlier in the conversation or stored in the session.

Session data so far:'
- Asset: ${updatedSession.asset}
- Network: ${updatedSession.network}
- Estimation Type: ${updatedSession.estimationType}
- Amount: ${updatedSession.amount}
- Bank Name: ${updatedSession.bankName}
- Account Number: ${updatedSession.accountNumber} 
- phone number: ${updatedSession.phoneNumber} 
- total crypto: ${updatedSession['totalcrypto']}



1. Asset (BTC, ETH, BNB, TRON, USDT)
2. Network (only if asset is USDT)
3. Estimation type: crypto, naira, or dollar
4. Amount
5. Bank name
6. Account number
7. ask if the account details is correctly Name:${updatedSession.receiverName} Bank name:${updatedSession.bankName} Account number:${updatedSession.accountNumber}
8.  phone number
9. after phone number then display you are sending ${updatedSession['totalcrypto']} ${updatedSession.network} to this wallet address ${updatedSession.activeWallet} and you will be receiving ₦${updatedSession['amountString']}.
10.this question should follow, would you like to save this person as beneficiary?
11. if user say YES. ask the user what name will you like to save the beneficiary with? 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            =iug
  If user says they want to send to "mom", "dad", or another person:
1. Ask: "What’s your [relation]’s full name?"

                If the user gives multiple values, extract what you can, confirm it, and move to the next question.
                If the user provides a value but you need another value to compute, extract the value you have,
                then ask for the value you need to compute the next one
                eg if a user says he wants to send USDT, you need network to get wallet.
                If a user choose to use BTC, the network should automatically be BTC and like that, only exception is USDT.
              `
          ,
        },
        ...messages,
      ],
    });

    const reply = aiResponse.choices[0].message.content || "";

   
    // 4. Auto-fetch info if ready
    if (updatedSession.asset && !updatedSession.assetPrice ) {
      // updatedSession.network;
      console.log("Updated session:", updatedSession)
      updatedSession.assetPrice = await fetchCoinPrice(updatedSession.network);
    }

    if (!updatedSession.rate) {
      updatedSession.rate = await fetchRate();
    }

    // if (
    //   updatedSession.bankName &&
    //   updatedSession.accountNumber &&
    //   !updatedSession.receiverName
    // ) {
    //   const name = await resolveBankAccount(
    //     updatedSession.bankName,
    //     updatedSession.accountNumber
    //   );   
    //   if (name) updatedSession['receiverName'] = name;
    // }

    // 5. Check what is still missing
    const missingField = getNextMissingField(updatedSession);

    // 6. Prompt accordingly
    let followUp = "";
 if (missingField === "bankName")
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
    // sessionStore.set(sessionId, updatedSession);
    session[sessionId] = updatedSession

    console.log('the updated sessionss....',session[sessionId])
    res.status(200).json({
      reply: reply + "\n\n" + followUp,
      session: updatedSession,
    });
  } catch (err) {
    console.error("Error in /api/openai:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}


// 1. Asset (BTC, ETH, BNB, TRON, USDT)
// 2. Network (only if asset is USDT)
// 3. Estimation type: crypto, naira, or dollar (only if the user mention naira or dollar or the amount of the asset)
// 4. Amount
// 5. Bank name
// 6. Account number




// 1. Asset (BTC, ETH, BNB, TRON, USDT)
//    - Always ask for the asset unless the user has already mentioned it in their first message.
//    - Example: If the user says "I want to convert my 2 BNB to naira", you already know the asset is BNB, so skip this step.

  
// 2. Network (only if asset is USDT)
//    - Ask for the network ONLY if the asset is USDT.
//    - If the asset is not USDT, skip this step.

//   Step 3: Estimation type (crypto, naira, or dollar)

// Normally ask: "How do you want to estimate your transaction? (crypto, naira, or dollar)".

// Skip asking   if the user already mentioned both amount and its type:

// “I want to convert 2 BNB” → estimation type = crypto.

// “I want to send 20k naira” → estimation type = naira.

// “I want to send 50 dollars” → estimation type = dollar.

// The AI should detect intent even if the wording is different (e.g., “convert my 2 BTC”, “send twenty thousand”, “give me cash for $50”).

// Step 4: Amount

// If the amount is not given earlier, ask for it.

// If the amount is already given, confirm it before moving forward.

// Step 5: Bank name
// Step 6: Account number
