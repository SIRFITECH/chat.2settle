// import React from 'react';
// import { MessageType } from "../types/types";

// IF USER CHOOSE TRANSACT CRYPTO< THEY SEE THIS NEXT

// export const displayTransactCrypto: MessageType (
//   nextStep: (nextStep: string) => void,
//   addChatMessages: (messages: MessageType[]) => void
// ) => {
//   {
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content:
//         (
//           <span>
//             Here is your menu:
//             <br />
//             1. Transfer money
//             <br />
//             2. Send Gift
//             <br />
//             3. Request for payment
//             <br />
//             0. Go back
//           </span>
//         )

//       },
//     ];
//     console.log("Next is howToEstimate");
//     nextStep("transferMoney");
//     addChatMessages(newMessages);
//   }
// }


// IF USER CHOOSE TRANSFER MONEY THEY SEE THIS NEXT


// export const displayTransferMoney = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void
// ) => {
//   console.log("Let's start with selecting an actions");
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Pay with:
//           <br />
//           <br />
//           1. Bitcoin (BTC)
//           <br />
//           2. Ethereum (ETH)
//           <br />
//           3. BINANCE (BNB)
//           <br />
//           4. TRON (TRX)
//           <br />
//           5. USDT
//           <br />
//           0. Go back
//           <br />
//           00. Exit
//         </span>
//       ),
//     },
//   ];
//   console.log("Next is howToEstimate");
//   nextStep("estimateAsset");
//   addChatMessages(newMessages);
// };

// USE CHOOSE WHICH WAY THEY WANT TO ESTIMATE THE PAY

// export const displayHowToEstimation = (
//   addChatMessages: (messages: MessageType[]) => void,
//   input: string
// ) => {
//   const parsedInput = input.trim();

//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: `How would you like to estimate your ${parsedInput}?`,
//     },
//     {
//       type: "incoming",
//       content: (
//         <span>
//           Here is your menu:
//           <br />
//           <br />
//           1. Naira
//           <br />
//           2. Dollar
//           <br />
//           3. Crypto
//           <br />
//           00. Exit
//         </span>
//       ),
//     },
//   ];

//   console.log("Next is estimationAmount");
//   // nextStep("payOptions");
//   addChatMessages(newMessages);
// };


// IF THE USER WANT TO PAYE WITH USDT< THEY USE 


// export const displayNetwork = (
//   addChatMessages: (messages: MessageType[]) => void,
//   nextStep: (step: string) => void,
//   input: string
// ) => {
//   const parsedInput = input.trim();
//   const newMessages: MessageType[] = [
//     {
//       type: "incoming",
//       content: (
//         <span>
//           select Network: <br />
//           <br />
//           1. ERC20 <br />
//           2. TRC20 <br />
//           3. BEP20
//           <br /> <br />
//           0. Go back <br />
//           00. Exit
//         </span>
//       ),
//     },
//   ];

//   console.log("Next is payOptions");
//   nextStep("payOptions");
//   addChatMessages(newMessages);
// };