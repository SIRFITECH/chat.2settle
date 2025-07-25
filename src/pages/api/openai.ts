// pages/api/chat.js

import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});
const token = process.env.OPENAI_API_KEY
const openai = new OpenAI({
  baseURL: "https://models.github.ai/inference",
  apiKey: token
});




export default async function handler(
  req: NextApiRequest,

  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { messages } = req.body;

  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o", // or 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: 'You are a helpful crypto assistant for 2settle. You help users convert crypto to naira and send to wallets like OPay, Kuda, etc.',
        },
        ...messages,
      ],
    });

    const reply = chatResponse.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
}




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
//       model: 'gpt-4o', // or 'gpt-3.5-turbo'
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


