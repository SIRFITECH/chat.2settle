// // OPERATINAL FUNCTIONS

// import ShortenedAddress from "@/components/ShortenAddress";

// import { MessageType } from "../types/general_types";
// import { formatCurrency } from "../helpers/format_currency";
// import {
//   generateComplainId,
//   generateGiftId,
//   generateTransactionId,
// } from "../utils/utilities";
// import {
//   checkGiftExists,
//   checkRequestExists,
//   checkTranscationExists,
//   createComplain,
//   createTransaction,
//   fetchBankDetails,
//   fetchBankNames,
//   isGiftValid,
//   updateGiftTransaction,
//   updateTransaction,
// } from "../helpers/api_calls";
// import {
//   countWords,
//   getLastReportId,
//   getNextReportID,
//   isValidWalletAddress,
//   makeAReport,
// } from "../helpers/api_call/reportly_page_calls";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { greetings } from "./chatConstants";
// import {
//   displayHowToEstimation,
//   displayPayIn,
//   displaySearchBank,
//   displayTransactCrypto,
//   displayTransferMoney,
// } from "@/menus/transact_crypto";
// import { displayCustomerSupportAssurance, displayCustomerSupportWelcome, displayEnterTransactionId } from "@/menus/customer_support";
// import { displayKYCInfo } from "@/menus/request_paycard";
// import { displayGiftFeedbackMessage, displayTransactIDWelcome } from "@/menus/transaction_id";
// import { displayReportlyFraudsterWalletAddress, displayReportlyName, displayReportlyNote, displayReportlyPhoneNumber, displayReportlyReporterWalletAddress } from "@/menus/reportly";

// // ON HI | HELLO | HOWDY | HEY PROMPT

// export const helloMenu = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function
// ) => {
//   console.log("we are at the start");
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     window.localStorage.setItem("transactionID", "");
//     setSharedPaymentMode("");
//     if (walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               How far {telFirstName} 👋
//               <br />
//               <br />
//               You are connected as{" "}
//               <b>
//                 <ShortenedAddress wallet={wallet} />
//               </b>
//               <br />
//               <br />
//               1. To disconnect wallet <br />
//               2. Continue to transact
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("chooseAction");
//     } else {
//       setSharedPaymentMode("");
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               How far {telFirstName}👋
//               <br />
//               <br />
//               Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual
//               assistance, <br />
//               <b>Your wallet is not connected,</b> reply with:
//               <br />
//               <br />
//               1. To connect wallet <br />
//               2. To just continue
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       console.log("Wallet not connected");
//     }
//     nextStep("chooseAction");
//   }
// };

// // TRANSACT CRYPTO SEQUENCE FUNCTIONS
// export const choiceMenu = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   const choice = chatInput.trim();
//   if (greetings.includes(choice.toLowerCase())) {
//     helloMenu(choice, addChatMessages, nextStep);
//     goToStep("start");
//   } else if (choice === "0") {
//     prevStep();
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (choice.toLowerCase() === "1") {
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectButton />,
//           timestamp: new Date(),
//           isComponent: true,
//           componentName: "ConnectButton",
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("transactCrypto");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectButton />,
//           timestamp: new Date(),
//           isComponent: true,
//           componentName: "ConnectButton",
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("transactCrypto");
//     }
//   } else if (choice.toLowerCase() === "2") {
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued <b>without connecting your wallet</b>
//               <br />
//               <br />
//               Today Rate: <b>{formattedRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("transactCrypto");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued as{" "}
//               <b>
//                 <ShortenedAddress wallet={wallet} />
//               </b>
//               <br />
//               <br />
//               Today Rate: <b>{formattedRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("transactCrypto");
//     }
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: (
//           <span>
//             You need to make a valid choice
//             <br />
//             <br />
//             Please Try again, or say 'Hi' or 'Hello' to start over
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//   }
//   setChatInput("");
// };
// // WELCOME USER DEPENDING ON IF THEY CONNECT WALLET OR NOT

// export const welcomeMenu = (addChatMessages: Function) => {
//   if (walletIsConnected) {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: (
//           <span>
//             How far {telFirstName} 👋
//             <br />
//             <br />
//             You are connected as
//             <b>
//               <ShortenedAddress wallet={wallet} />
//             </b>
//             <br />
//             <br />
//             Your wallet is connected. The current rate is
//             <b> {formattedRate}/$1</b>
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             1. Transact Crypto
//             <br />
//             2. Request for paycard
//             <br />
//             3. Customer support
//             <br />
//             4. Transaction ID
//             <br />
//             5. Reportly,
//           </span>
//         ),
//       },
//     ] as unknown as MessageType[]);
//   } else {
//     {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued <b>without connecting your wallet</b>
//               <br />
//               <br />
//               Today Rate: <b>{formattedRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ {telFirstName}, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }
// };

// // HANDLE THE CHOICE FROM ABOVE

// export const handleMakeAChoice = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     goToStep("start");
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput === "0") {
//     prevStep();
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput === "1") {
//     // console.log("The choice is ONE, TRANSACT CRYPTO");
//     displayTransactCrypto(addChatMessages);

//     nextStep("transferMoney");
//   } else if (chatInput === "2") {
//     // console.log("The choice is TWO, REQUEST PAY CARD");
//     displayKYCInfo(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     displayCustomerSupportWelcome(addChatMessages, nextStep);
//   } else if (chatInput === "4") {
//     // console.log("The choice is FOUR, TRANSACTION ID");
//     displayTransactIDWelcome(addChatMessages, nextStep);
//   } else if (chatInput === "5") {
//     // console.log("The choice is FIVE, REPORTLY");
//     displayReportlyWelcome(addChatMessages, nextStep);
//     // nextStep("transferMoney");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
// // HANDLE TRANSFER MONEY MENU

// export const handleTransferMoney = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function
// ) => {
//   setSharedWallet("");
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "0") {
//     prevStep();
//     welcomeMenu();
//   } else if (chatInput === "1") {
//     setSharedPaymentMode("transferMoney");
//     displayTransferMoney(addChatMessages);
//     nextStep("estimateAsset");
//   } else if (chatInput === "2") {
//     displayTransferMoney(addChatMessages);
//     setSharedPaymentMode("Gift");

//     nextStep("estimateAsset");
//   } else if (chatInput === "3") {
//     displayPayIn(
//       addChatMessages,
//       "Naira",
//       sharedRate,
//       "",
//       "",
//       sharedPaymentMode
//     );
//     setSharedEstimateAsset("Naira");
//     nextStep("enterBankSearchWord");

//     setSharedPaymentMode("request");
//   } else if (sharedPaymentMode.toLowerCase() === "request") {
//     displayTransferMoney(addChatMessages);
//     nextStep("estimateAsset");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // HANDLE ESTIMATE PAYMENT IN ASSET MENU

// export const handleEstimateAsset = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Here is your menu:
//               <br />
//               <br />
//               1. Transfer money
//               <br />
//               2. Send Gift
//               <br />
//               3. Request for payment
//               <br />
//               0. Go back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       console.log("Next is howToEstimate");
//       addChatMessages(newMessages);
//     })();
//   } else if (chatInput === "00") {
//     goToStep("chooseAction");
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput === "1") {
//     displayHowToEstimation(addChatMessages, "Bitcoin (BTC)", sharedPaymentMode);
//     setSharedTicker("BTCUSDT");
//     setSharedCrypto("BTC");
//     setSharedNetwork("BTC");
//     nextStep("payOptions");
//   } else if (chatInput === "2") {
//     const parsedInput = "Ethereum (ETH)";

//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: `How would you like to estimate your ${parsedInput}?`,
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             <br />
//             1. Naira
//             <br />
//             2. Dollar
//             <br />
//             3. Crypto
//             <br />
//             00. Exit
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];

//     addChatMessages(newMessages);

//     setSharedTicker("ETHUSDT");
//     setSharedCrypto("ETH");
//     setSharedNetwork("ERC20");
//     nextStep("payOptions");
//   } else if (chatInput === "3") {
//     const parsedInput = "BINANCE (BNB)";

//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: `How would you like to estimate your ${parsedInput}?`,
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             <br />
//             1. Naira
//             <br />
//             2. Dollar
//             <br />
//             3. Crypto
//             <br />
//             00. Exit
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];

//     addChatMessages(newMessages);

//     setSharedTicker("BNBUSDT");
//     setSharedCrypto("BNB");
//     setSharedNetwork("BEP20");
//     nextStep("payOptions");
//   } else if (chatInput === "4") {
//     const parsedInput = "TRON (TRX)";

//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: `How would you like to estimate your ${parsedInput}?`,
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             <br />
//             1. Naira
//             <br />
//             2. Dollar
//             <br />
//             3. Crypto
//             <br />
//             00. Exit
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];

//     console.log("Next is estimationAmount");

//     addChatMessages(newMessages);

//     setSharedTicker("TRXUSDT");
//     setSharedCrypto("TRX");
//     setSharedNetwork("TRC20");
//     nextStep("payOptions");
//   } else if (chatInput === "5") {
//     const newMessages: MessageType[] = [
//       {
//         type: "incoming",
//         content: (
//           <span>
//             select Network: <br />
//             <br />
//             1. ERC20 <br />
//             2. TRC20 <br />
//             3. BEP20
//             <br /> <br />
//             0. Go back <br />
//             00. Exit
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ];

//     addChatMessages(newMessages);
//     setSharedTicker("USDT");
//     setSharedCrypto("USDT");
//     nextStep("network");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: "Invalid choice. Choose a valid estimate asset",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
// // HANDLE NETWORK FOR DOLLAR TRANSFER

// export const handleNetwork = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       displayTransferMoney(addChatMessages);
//     })();
//   } else if (chatInput === "1") {
//     displayHowToEstimation(addChatMessages, "USDT (ERC20)", sharedPaymentMode);

//     setSharedTicker("USDT");
//     setSharedCrypto("USDT");
//     setSharedNetwork("ERC20");
//     nextStep("payOptions");
//   } else if (chatInput === "2") {
//     displayHowToEstimation(addChatMessages, "USDT (TRC20)", sharedPaymentMode);
//     setSharedTicker("USDT");
//     setSharedCrypto("USDT");
//     setSharedNetwork("TRC20");
//     nextStep("payOptions");
//   } else if (chatInput === "3") {
//     // sharedGiftId

//     console.log("This is the requestID:", sharedGiftId);
//     sharedPaymentMode.toLowerCase() === "request"
//       ? displayRequestPaymentSummary(
//           addChatMessages,
//           "",
//           sharedPaymentMode,
//           "738920"
//         )
//       : displayHowToEstimation(
//           addChatMessages,
//           "USDT (BEP20)",
//           sharedPaymentMode
//         );
//     setSharedTicker("USDT");
//     setSharedCrypto("USDT");
//     setSharedNetwork("BEP20");
//     console.log("sharedPaymentMode:", sharedPaymentMode);
//     // sharedPaymentMode.toLowerCase() === "request"
//     //   ? nextStep("charge")
//     //   : nextStep("payOptions");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. Choose your prefered network or say Hi if you are stock.",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // HANDLE THE ASSETS FOR ESTIMATION

// export const handlePayOptions = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       displayHowToEstimation(
//         addChatMessages,
//         `${sharedCrypto} (${sharedNetwork})`,
//         sharedPaymentMode
//       );
//     })();
//   } else if (chatInput === "1") {
//     displayPayIn(
//       addChatMessages,
//       "Naira",
//       sharedRate,
//       sharedTicker,
//       sharedAssetPrice,
//       sharedPaymentMode
//     );
//     setSharedEstimateAsset("Naira");
//     nextStep("charge");
//   } else if (chatInput === "2") {
//     displayPayIn(
//       addChatMessages,
//       "Dollar",
//       sharedRate,
//       sharedTicker,
//       chatInput,
//       sharedPaymentMode
//     );
//     setSharedEstimateAsset("Dollar");
//     nextStep("charge");
//   } else if (chatInput === "3") {
//     displayPayIn(
//       addChatMessages,
//       sharedCrypto,
//       sharedRate,
//       sharedTicker,
//       sharedAssetPrice,
//       sharedPaymentMode
//     );
//     setSharedEstimateAsset(sharedCrypto);
//     nextStep("charge");
//   } else {
//     displayPayIn(
//       addChatMessages,
//       "Naira",
//       sharedRate,
//       "",
//       "",
//       sharedPaymentMode
//     );
//     setSharedEstimateAsset("Naira");
//     nextStep("charge");
//   }
// };

// // HANDLE ESTIMATE IN SELECTED ASSET
// export const handleCharge = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       prevStep();
//       displayHowToEstimation(
//         addChatMessages,
//         `${sharedCrypto} (${sharedNetwork})`,
//         sharedPaymentMode
//       );
//     })();
//   } else if (chatInput != "0") {
//     setSharedAmount(chatInput.trim());
//     console.log("Lets see what comes in", chatInput.trim());
//     displayCharge(
//       addChatMessages,
//       nextStep,
//       chatInput,
//       sharedEstimateAsset,
//       sharedRate,
//       sharedAssetPrice,
//       sharedCrypto,
//       setSharedCharge,
//       setSharedPaymentAssetEstimate,
//       setSharedPaymentNairaEstimate,
//       setSharedNairaCharge,
//       setSharedChargeForDB,
//       sharedPaymentMode
//     );
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. Do you want to include charge in your estimate or not?.",

//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // GET USER BANK DETAILS FROM NUBAN
// export const handleSearchBank = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   // IS USER TRYING TO CLAIM GIFT?
//   let wantsToClaimGift =
//     sharedPaymentMode.toLowerCase().trim() === "claim gift";
//   let wantsToSendGift = sharedPaymentMode.toLowerCase().trim() === "gift";
//   let wantsToRequestPayment =
//     sharedPaymentMode.toLowerCase().trim() === "request";

//   if (wantsToClaimGift) {
//     console.log("USER WANTS TO CLAIM GIFT");
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput, addChatMessages, nextStep);
//     } else if (chatInput.trim() === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu("hi", addChatMessages, nextStep);
//       })();
//     } else if (chatInput.trim() === "0") {
//       (() => {
//         prevStep();
//         displayTransactIDWelcome(addChatMessages, nextStep);
//       })();
//     } else if (chatInput !== "0") {
//       const gift_id = chatInput.trim();
//       setLoading(true);
//       setSharedGiftId(gift_id);
//       let giftExists = (await checkGiftExists(gift_id)).exists;
//       setLoading(false);
//       // IF GIFT_ID EXIST IN DB,
//       if (giftExists) {
//         displaySearchBank(addChatMessages, nextStep);
//       } else {
//         addChatMessages([
//           {
//             type: "incoming",
//             content: "Invalid gift_id. Try again",
//             timestamp: new Date(),
//           },
//         ]);
//       }
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid choice. You need to choose an action from the options",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   } else if (wantsToSendGift) {
//     console.log("USER WANTS TO SEND GIFT");
//     const chargeFixed = parseFloat(sharedCharge);
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput, addChatMessages, nextStep);
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu("hi", addChatMessages, nextStep);
//       })();
//     } else if (chatInput === "0") {
//       (() => {
//         prevStep();
//         displayPayIn(
//           addChatMessages,
//           sharedEstimateAsset,
//           sharedRate,
//           sharedCrypto,
//           sharedAssetPrice,
//           sharedCrypto
//         );
//       })();
//     } else if (chatInput === "1") {
//       const finalAssetPayment = parseFloat(sharedPaymentAssetEstimate);
//       const finalNairaPayment =
//         parseFloat(sharedPaymentNairaEstimate) - parseFloat(sharedNairaCharge);

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
//       setSharedChargeForDB(
//         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
//       ),
//         displaySearchBank(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       const finalAssetPayment =
//         parseFloat(sharedPaymentAssetEstimate) + parseFloat(sharedCharge);
//       const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
//       setSharedChargeForDB(
//         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
//       );
//       displaySearchBank(addChatMessages, nextStep);
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid choice. Please choose with the options or say 'Hi' to start over.",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   } else if (wantsToRequestPayment) {
//     console.log("USER WANTS TO REQUEST PAYMENT");
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput, addChatMessages, nextStep);
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu("hi", addChatMessages, nextStep);
//       })();
//     } else if (chatInput === "0") {
//       (() => {
//         prevStep();
//         displayPayIn(
//           addChatMessages,
//           sharedEstimateAsset,
//           sharedRate,
//           sharedCrypto,
//           sharedAssetPrice,
//           sharedCrypto
//         );
//       })();
//     } else {
//       // chatInput.trim()
//       // CLEAN THE STRING HERE
//       chatInput = chatInput.replace(/[^0-9.]/g, "");
//       if (Number(chatInput) > 20000 && Number(chatInput) < 2000000) {
//         setSharedPaymentNairaEstimate(chatInput);
//         displaySearchBank(addChatMessages, nextStep);
//       } else {
//         addChatMessages([
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 You can only recieve <br />
//                 <b>Min: {formatCurrency("20000", "NGN", "en-NG")}</b> and <br />
//                 <b>Max: {formatCurrency("2000000", "NGN", "en-NG")}</b>
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ]);
//       }
//     }
//   } else {
//     console.log("USER WANTS TO TRANSACT CRYPTO");
//     const chargeFixed = parseFloat(sharedCharge);
//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//       helloMenu(chatInput, addChatMessages, nextStep);
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu("hi", addChatMessages, nextStep);
//       })();
//     } else if (chatInput === "0") {
//       (() => {
//         prevStep();
//         displayPayIn(
//           addChatMessages,
//           sharedEstimateAsset,
//           sharedRate,
//           sharedCrypto,
//           sharedAssetPrice,
//           sharedCrypto
//         );
//       })();
//     } else if (chatInput === "1") {
//       const finalAssetPayment = parseFloat(sharedPaymentAssetEstimate);
//       const finalNairaPayment =
//         parseFloat(sharedPaymentNairaEstimate) - parseFloat(sharedNairaCharge);

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
//       setSharedChargeForDB(
//         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
//       ),
//         displaySearchBank(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       const finalAssetPayment =
//         parseFloat(sharedPaymentAssetEstimate) + parseFloat(sharedCharge);
//       const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
//       setSharedChargeForDB(
//         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
//       );
//       displaySearchBank(addChatMessages, nextStep);
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid choice. Please choose with the options or say 'Hi' to start over.",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   }
// };

// // HELP USER SELECT BANK FROM LIST
// export const handleSelectBank = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       displayCharge(
//         addChatMessages,
//         nextStep,
//         sharedAmount,
//         sharedEstimateAsset,
//         sharedRate,
//         sharedAssetPrice,
//         sharedCrypto,
//         setSharedCharge,
//         setSharedPaymentAssetEstimate,
//         setSharedPaymentNairaEstimate,
//         setSharedNairaCharge,
//         setSharedChargeForDB,
//         sharedPaymentMode
//       );
//     })();
//   } else if (chatInput != "0") {
//     // console.log(chatInput.trim());
//     let bankList: [] = [];
//     setLoading(true);

//     try {
//       const bankNames = await fetchBankNames(chatInput.trim());
//       bankList = bankNames["message"];

//       if (Array.isArray(bankList)) {
//         const bankNameList = bankList.map((bank: string) =>
//           bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, "")
//         );

//         setSharedBankNames(bankNameList);
//       } else {
//         bankList = [];
//         console.error("The fetched bank names are not in the expected format.");
//       }
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error("Failed to fetch bank names:", error);
//     }

//     displaySelectBank(addChatMessages, nextStep, bankList, setSharedBankCodes);
//   }
// };

// //GET USER BANK DATA AFTER COLLECTING ACCOUNT NUMBER
// export const handleBankAccountNumber = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: FUnction
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       // console.log("THIS IS WHERE WE ARE");
//       prevStep();
//       displaySelectBank(
//         addChatMessages,
//         nextStep,
//         sharedBankNames,
//         setSharedBankCodes
//       );
//     })();
//   } else if (chatInput != "0") {
//     console.log(chatInput.trim());

//     displayEnterAccountNumber(
//       addChatMessages,
//       nextStep,
//       chatInput,
//       sharedBankCodes,
//       setSharedSelectedBankCode,
//       sharedBankNames,
//       setSharedSelectedBankName
//     );
//   }
// };

// // VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME

// export const handleContinueToPay = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       // console.log("THIS IS WHERE WE ARE");
//       prevStep();
//       displaySearchBank(addChatMessages, nextStep);
//     })();
//   } else if (chatInput !== "0") {
//     if (chatInput === "1" || chatInput === "2") {
//       displayEnterPhone(addChatMessages, nextStep);
//     } else {
//       let bank_name = "";
//       let account_name = "";
//       let account_number = "";

//       setLoading(true);

//       try {
//         const bankData = await fetchBankDetails(
//           sharedSelectedBankCode,
//           chatInput.trim()
//         );

//         bank_name = bankData[0].bank_name;
//         account_name = bankData[0].account_name;
//         account_number = bankData[0].account_number;

//         if (!account_number) {
//           const newMessages: MessageType[] = [
//             {
//               type: "incoming",
//               content: <span>Invalid account number. Please try again.</span>,
//               timestamp: new Date(),
//             },
//           ];
//           addChatMessages(newMessages);
//           setLoading(false);
//           return; // Exit the function to let the user try again
//         }

//         setLoading(false);
//         updateBankData({
//           acct_number: account_number,
//           bank_name: sharedSelectedBankName,
//           receiver_name: account_name,
//         });
//         displayContinueToPay(
//           addChatMessages,
//           nextStep,
//           account_name,
//           sharedSelectedBankName,
//           account_number,
//           sharedPaymentMode
//         );
//       } catch (error) {
//         console.error("Failed to fetch bank data:", error);
//         const errorMessage: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Failed to fetch bank data. Please check your accouunt number and
//                 try again.
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addChatMessages(errorMessage);
//         setLoading(false);
//       }
//     }
//   }
// };
// // MISSING HANDLE FUNCTION< HANDLE PHONE NUMBER

// export const handlePhoneNumber = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "0") {
//     (() => {
//       // console.log("THIS IS WHERE WE ARE");
//       prevStep();
//       displaySearchBank(addChatMessages, nextStep);
//     })();
//   } else if (chatInput !== "0") {
//     displayEnterPhone(addChatMessages, nextStep);
//   }
// };
// // final part to finish transaction
// export const handleCryptoPayment = async (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   setLoading: Function,
//   goToStep
// ) => {
//   const phoneNumber = chatInput.trim();

//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput != "0") {
//     setLoading(true);

//     if (!phoneNumberPattern.test(phoneNumber)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid phone number, <b>{phoneNumber}</b> is not a
//               valid phone number.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       setLoading(false);
//       addChatMessages(newMessages);
//       return;
//     }

//     setSharedPhone(phoneNumber);

//     const isGift = sharedPaymentMode.toLowerCase() === "claim gift";
//     const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
//     const requestPayment = sharedPaymentMode.toLowerCase() === "request";

//     const network =
//       sharedCrypto.toLowerCase() === "usdt"
//         ? sharedNetwork.toLowerCase()
//         : sharedCrypto.toLowerCase();

//     if (!isGift && !requestPayment) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <div className="flex flex-col items-center">
//               <p className="mb-4">
//                 Do you understand that you need to complete your payment within{" "}
//                 <b>5 minutes</b>, otherwise you may lose your money.
//               </p>

//               <ConfirmAndProceedButton
//                 phoneNumber={phoneNumber}
//                 setLoading={setLoading}
//                 sharedPaymentMode={sharedPaymentMode}
//                 processTransaction={processTransaction}
//                 network={network}
//               />
//             </div>
//           ),
//           timestamp: new Date(),
//         },
//       ];

//       setLoading(false);
//       addChatMessages(newMessages);
//     } else {
//       await processTransaction(phoneNumber, isGift, isGiftTrx, requestPayment);
//     }
//   } else {
//     setLoading(false);
//     console.log("User input not recognized");
//   }
// };

// const processTransaction = async (
//   phoneNumber: string,
//   isGift: boolean,
//   isGiftTrx: boolean,
//   requestPayment: boolean,
//   activeWallet?: string,
//   lastAssignedTime?: Date
// ) => {
//   // one last check is for USER WANT TO PAY REQUEST
//   try {
//     if (isGift) {
//       // UPDATE THE USER GIFT PAYMENT DATA
//       console.log("USER WANTS TO CLAIM GIFT");

//       const giftStatus = (await isGiftValid(sharedGiftId)).user?.gift_status;
//       const transactionStatus = (await isGiftValid(sharedGiftId)).user?.status;

//       try {
//         const giftNotClaimed =
//           giftStatus?.toLocaleLowerCase() === "not claimed" &&
//           transactionStatus?.toLocaleLowerCase() === "successful";

//         const giftClaimed =
//           giftStatus?.toLocaleLowerCase() === "claimed" &&
//           transactionStatus?.toLocaleLowerCase() === "successful";

//         const paymentPending =
//           giftStatus?.toLocaleLowerCase() === "not claimed" &&
//           transactionStatus?.toLocaleLowerCase() === "processing";

//         const giftNotPaid =
//           giftStatus?.toLocaleLowerCase() === "cancel" &&
//           transactionStatus?.toLocaleLowerCase() === "unsuccessful";

//         if (giftNotClaimed) {
//           const giftUpdateDate = {
//             gift_chatID: sharedGiftId,
//             acct_number: bankData.acct_number,
//             bank_name: bankData.bank_name,
//             receiver_name: bankData.receiver_name,
//             receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//             gift_status: "Processing",
//           };

//           // Only update the status to "Claimed" if payoutMoney is successful
//           // update the status to "Processing" and for the user to claim his gift
//           await updateGiftTransaction(sharedGiftId, giftUpdateDate);

//           setLoading(false);
//           displayGiftFeedbackMessage(addChatMessages, nextStep);
//           helloMenu("hi");
//         } else if (giftClaimed) {
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content: "This gift is already claimed",
//               timestamp: new Date(),
//             },
//           ]);
//           helloMenu("hi");
//           goToStep("start");
//         } else if (paymentPending) {
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content: (
//                 <span>
//                   We are yet to confirm the crypto payment <br />
//                   Please check again later.
//                 </span>
//               ),
//               timestamp: new Date(),
//             },
//             {
//               type: "incoming",
//               content:
//                 "If it persists, it could be that the gifter has not sent the asset yet.",
//               timestamp: new Date(),
//             },
//           ]);
//           helloMenu("hi");
//           goToStep("start");
//         } else if (giftNotPaid) {
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content: (
//                 <span>
//                   This gift has been canceled. <br />
//                   You have to contact your gifter to do the transaction again.
//                 </span>
//               ),
//               timestamp: new Date(),
//             },
//           ]);
//           helloMenu("hi");
//           goToStep("start");
//         } else {
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content: (
//                 <span>
//                   We have an issue determining this gift status.
//                   <br />
//                   You have to reach our customer support.
//                 </span>
//               ),
//               timestamp: new Date(),
//             },
//           ]);
//           helloMenu("hi");
//           goToStep("start");
//         }
//       } catch (error) {
//         console.error("Error during gift claim process:", error);

//         // Rollback or retain the transaction status in case of failure
//         await updateGiftTransaction(sharedGiftId, {
//           gift_status: giftStatus,
//         });

//         setLoading(false);
//         addChatMessages([
//           {
//             type: "incoming",
//             content: (
//               <span>Sorry, the transaction failed. Please try again.</span>
//             ),
//             timestamp: new Date(),
//           },
//         ]);
//         displayEnterId(addChatMessages, nextStep, sharedPaymentMode);
//       }
//     } else if (isGiftTrx) {
//       console.log("USER WANTS TO SEND GIFT");
//       const transactionID = generateTransactionId();
//       setSharedTransactionId(transactionID.toString());
//       window.localStorage.setItem("transactionID", transactionID.toString());
//       const giftID = generateGiftId();
//       setSharedGiftId(giftID.toString());
//       window.localStorage.setItem("giftID", giftID.toString());

//       // Add validation
//       if (
//         !sharedPaymentAssetEstimate ||
//         isNaN(parseFloat(sharedPaymentAssetEstimate))
//       ) {
//         console.error(
//           "Invalid sharedPaymentAssetEstimate:",
//           sharedPaymentAssetEstimate
//         );
//         setLoading(false);
//         addChatMessages([
//           {
//             type: "incoming",
//             content:
//               "There was an error calculating the payment amount. Please try again.",
//             timestamp: new Date(),
//           },
//         ]);
//         setLoading(false);
//         return;
//       }
//       const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
//         .toFixed(8)
//         .toString()} ${sharedCrypto} `;
//       const date = getFormattedDateTime();
//       console.log("sharedPaymentNairaEstimate", sharedPaymentNairaEstimate);

//       displaySendPayment(
//         addChatMessages,
//         nextStep,
//         activeWallet ?? "",
//         sharedCrypto,
//         sharedPaymentAssetEstimate,
//         sharedPaymentNairaEstimate,
//         transactionID,
//         sharedNetwork,
//         sharedPaymentMode,
//         giftID,
//         lastAssignedTime
//       );

//       console.log("User data created", activeWallet);

//       setLoading(false);
//       console.log("testing for gift:", sharedPaymentNairaEstimate);
//       // let's save the transaction details to db
//       const userDate = {
//         crypto: sharedCrypto,
//         network: sharedNetwork,
//         estimation: sharedEstimateAsset,
//         Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
//         charges: sharedChargeForDB,
//         mode_of_payment: sharedPaymentMode,
//         acct_number: null,
//         bank_name: null,
//         receiver_name: null,
//         receiver_amount: formatCurrency(
//           sharedPaymentNairaEstimate,
//           "NGN",
//           "en-NG"
//         ),
//         crypto_sent: paymentAsset,
//         wallet_address: activeWallet,
//         Date: date,
//         status: "Processing",
//         customer_phoneNumber: formatPhoneNumber(phoneNumber),
//         transac_id: transactionID.toString(),
//         gift_chatID: giftID.toString(),
//         settle_walletLink: null,
//         chat_id: chatId,
//         current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//         merchant_rate: merchantRate,
//         profit_rate: profitRate,
//         name: null,
//         gift_status: "Not Claimed",
//         asset_price:
//           sharedCrypto.toLowerCase() != "usdt"
//             ? formatCurrency(sharedAssetPrice, "USD")
//             : formatCurrency(sharedRate, "NGN", "en-NG"),
//       };
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });

//       console.log("User gift data created", userDate);
//     } else if (requestPayment) {
//       console.log("USER WANTS TO DO A REQUEST TRANSACTION");
//       if (sharedGiftId) {
//         const requestStatus = (await checkRequestExists(sharedGiftId)).exists;
//         if (requestStatus) {
//         }
//       }

//       console.log("USER WANTS TO REQUEST PAYMENT");

//       // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
//       const transactionID = generateTransactionId();
//       const requestID = generateTransactionId();
//       setSharedTransactionId(transactionID.toString());
//       window.localStorage.setItem("transactionID", transactionID.toString());
//       const date = getFormattedDateTime();

//       setLoading(false);
//       console.log("testing for request crypto:", sharedPaymentNairaEstimate);
//       // let's save the transaction details to db
//       const userDate = {
//         crypto: null,
//         network: null,
//         estimation: sharedEstimateAsset,
//         Amount: null,
//         charges: null,
//         mode_of_payment: sharedPaymentMode,
//         acct_number: bankData.acct_number,
//         bank_name: bankData.bank_name,
//         receiver_name: bankData.receiver_name,
//         receiver_amount: formatCurrency(
//           sharedPaymentNairaEstimate,
//           // "200000",
//           "NGN",
//           "en-NG"
//         ),
//         crypto_sent: null,
//         wallet_address: null,
//         Date: date,
//         status: "Processing",
//         receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//         customer_phoneNumber: formatPhoneNumber(phoneNumber),
//         transac_id: transactionID.toString(),
//         request_id: requestID.toString(),
//         settle_walletLink: "",
//         chat_id: chatId,
//         current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//         merchant_rate: merchantRate,
//         profit_rate: profitRate,
//         name: "",
//         asset_price:
//           sharedCrypto.toLowerCase() != "usdt"
//             ? formatCurrency(sharedAssetPrice, "USD")
//             : formatCurrency(sharedRate, "NGN", "en-NG"),
//       };
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });

//       console.log("request payment data created", userDate);
//       // nextStep("start");
//       // helloMenu("hi");
//       displaySendPayment(
//         addChatMessages,
//         nextStep,
//         activeWallet ?? "",
//         sharedCrypto,
//         sharedPaymentAssetEstimate,
//         sharedPaymentNairaEstimate,
//         transactionID,
//         sharedNetwork,
//         sharedPaymentMode,
//         requestID,
//         lastAssignedTime
//       );
//       setLoading(false);
//       nextStep("start");
//       helloMenu("hi");
//     } else {
//       console.log("USER WANTS TO MAKE A REGULAR TRX");
//       const transactionID = generateTransactionId();
//       setSharedTransactionId(transactionID.toString());
//       window.localStorage.setItem("transactionID", transactionID.toString());
//       if (
//         !sharedPaymentAssetEstimate ||
//         isNaN(parseFloat(sharedPaymentAssetEstimate))
//       ) {
//         console.error(
//           "Invalid sharedPaymentAssetEstimate:",
//           sharedPaymentAssetEstimate
//         );
//         setLoading(false);
//         addChatMessages([
//           {
//             type: "incoming",
//             content:
//               "There was an error calculating the payment amount. Please try again.",
//             timestamp: new Date(),
//           },
//         ]);
//         setLoading(false);
//         return;
//       }

//       const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
//         .toFixed(8)
//         .toString()} ${sharedCrypto} `;
//       const date = getFormattedDateTime();

//       displaySendPayment(
//         addChatMessages,
//         nextStep,
//         activeWallet ?? "",
//         sharedCrypto,
//         sharedPaymentAssetEstimate,
//         sharedPaymentNairaEstimate,
//         transactionID,
//         sharedNetwork,
//         sharedPaymentMode,
//         0,
//         lastAssignedTime
//       );

//       setLoading(false);
//       console.log("testing for transact crypto:", sharedPaymentNairaEstimate);
//       // let's save the transaction details to db
//       const userDate = {
//         crypto: sharedCrypto,
//         network: sharedNetwork,
//         estimation: sharedEstimateAsset,
//         Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
//         charges: sharedChargeForDB,
//         mode_of_payment: sharedPaymentMode,
//         acct_number: bankData.acct_number,
//         bank_name: bankData.bank_name,
//         receiver_name: bankData.receiver_name,
//         receiver_amount: formatCurrency(
//           sharedPaymentNairaEstimate,
//           "NGN",
//           "en-NG"
//         ),
//         crypto_sent: paymentAsset,
//         wallet_address: activeWallet,
//         Date: date,
//         status: "Processing",
//         customer_phoneNumber: formatPhoneNumber(phoneNumber),
//         transac_id: transactionID.toString(),
//         settle_walletLink: "",
//         chat_id: chatId,
//         current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//         merchant_rate: merchantRate,
//         profit_rate: profitRate,
//         name: "",
//         asset_price:
//           sharedCrypto.toLowerCase() != "usdt"
//             ? formatCurrency(sharedAssetPrice, "USD")
//             : formatCurrency(sharedRate, "NGN", "en-NG"),
//       };
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });
//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });

//       console.log("User data created", userDate);
//     }
//   } catch (error) {
//     console.error("Error during transaction", error);
//   }
// };

// export const handleConfirmTransaction = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "0") {
//   } else if (chatInput.trim().length > 3) {
//     console.log("Input is:", chatInput.trim());
//     const transaction_id = chatInput.trim();
//     setLoading(true);
//     setSharedTransactionId(transaction_id);
//     let transactionExists = (await checkTranscationExists(transaction_id))
//       .exists;

//     console.log(
//       "User phone:",
//       (await checkTranscationExists(transaction_id)).user?.customer_phoneNumber
//     );

//     setLoading(false);
//     // IF TRANSACTION_ID EXIST IN DB,
//     if (transactionExists) {
//       displayConfirmPayment(addChatMessages, nextStep);
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Invalid transaction_id. Try again",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   } else {
//     if (chatInput.trim() === "1") {
//       updateTransaction(sharedTransactionId, procesingStatus);
//       displayConfirmPayment(addChatMessages, nextStep);
//     } else if (chatInput.trim() === "2") {
//       updateTransaction(sharedTransactionId, cancelledStatus);
//       displayConfirmPayment(addChatMessages, nextStep);
//     }
//   }
// };

// // ALLOW USER TO START A NEW TRANSACTION OR CONTACT SUPPORT
// export const handleTransactionProcessing = (
//   chatInput: string,
//   addChatMessages: Function,
//   prevStep: Function,
//   nextStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displaySearchBank(addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "1") {
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput.trim() === "2") {
//     goToStep("supportWelcome");
//     displayCustomerSupportWelcome(addChatMessages, nextStep);
//   }
// };
// // REQUEST PAYCARD SEQUENCE FUNCTIONS

// // TELL USERS ABOUT DATA NEEDED FOR PAYCARD REQUEST
// export const handleKYCInfo = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput,addChatMessages, nextStep);
//   } else if (chatInput === "1") {
//     displayKYCInfo(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     helloMenu("hi", addChatMessages, nextStep);
//     goToStep("start");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // GIVE USERS LINK TO REG

// export const handleRegKYC = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput,addChatMessages, nextStep);
//   } else if (chatInput === "1") {
//     displayRegKYC(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     helloMenu("hi",addChatMessages, nextStep);
//     goToStep("start");
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // GIVE USERS LINK TO REG
// export const handleThankForKYCReg = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "1") {
//     displayThankForKYCReg(addChatMessages, nextStep);
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     goToStep("start");
//     helloMenu("hi",addChatMessages, nextStep);
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // CUSTOMER SUPPORT SEQUENCE FUNCTIONS

// // ALLOW USER TO USER THEIR TRANSACTION ID TO MAKE A COMPLAIN
// export const handleCustomerSupportAssurance = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput === "0") {
//     (() => {
//       prevStep();
//       displayCustomerSupportWelcome(addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "1") {
//     displayCustomerSupportAssurance(addChatMessages, nextStep);
//     helloMenu("hi", addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     displayEnterTransactionId(addChatMessages, nextStep);
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
// // ALLOW USERS ENTER TRANSACTION ID
// export const handleTransactionId = async (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   setLoading: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput !== "0") {
//     const transaction_id = chatInput.trim();
//     setLoading(true);
//     setSharedTransactionId(transaction_id);
//     const transactionExists = (await checkTranscationExists(transaction_id))
//       .exists;

//     console.log(
//       "User phone:",
//       (await checkTranscationExists(transaction_id)).user?.customer_phoneNumber
//     );

//     setLoading(false);
//     // IF TRANSACTION_ID EXIST IN DB,
//     if (transactionExists) {
//       displayMakeComplain(addChatMessages, nextStep);
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Invalid transaction_id. Try again",
//           timestamp: new Date(),
//         },
//       ]);
//     }
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
// // MAKE COMPLAIN
// export const handleMakeComplain = async (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function,
//   setLoading: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayEnterTransactionId(addChatMessages, nextStep);
//     })();
//   } else if (chatInput !== "0") {
//     const message = chatInput.trim();
//     const words = message.trim().split(/\s+/);
//     let validMessage = words.length < 100 ? true : false;
//     // IF TRANSACTION_ID EXIST IN DB,

//     if (validMessage) {
//       setLoading(true);
//       const complainId = generateComplainId();
//       const phone = (await checkTranscationExists(sharedTransactionId)).user
//         ?.customer_phoneNumber;
//       console.log("User phone number is:", phone);

//       await createComplain({
//         transaction_id: sharedTransactionId,
//         complain: message,
//         status: "pending",
//         Customer_phoneNumber: phone,
//         complain_id: complainId,
//       });
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Your complain is noted.You can also reach out to our customer care. +2349069400430 if you don't want to wait",
//           timestamp: new Date(),
//         },
//       ]);
//       helloMenu("hi", addChatMessages, nextStep);
//       goToStep("start");
//     } else {
//       console.log("Invalid message length");
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "Invalid entry, Please enter your message in not more that 100 words",
//           timestamp: new Date(),
//         },
//       ]);
//       return;
//     }
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // ENTER TRANSACTION ID TO COMPLETE TRANSACTION
// export const handleCompleteTransactionId = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput);
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       choiceMenu("2");
//     })();
//   } else if (chatInput === "1") {
//     displayEnterCompleteTransactionId(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     console.log("Let's see what is going on HERE!!!");
//     displayEnterId(addChatMessages, nextStep, "Claim Gift");
//     setSharedPaymentMode("Claim Gift");
//   } else if (chatInput === "3") {
//     displayEnterId(addChatMessages, nextStep, "request");
//     setSharedPaymentMode("request");
//   }
// };

// // CUSTOMER TRANSACTION ID SEQUENCE FUNCTIONS

// // ALLOW USERS ENTER GIFT ID
// export const handleGiftRequestId = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function,
//   setLoading: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       // console.log("Going back from handlePayOptions");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayTransactIDWelcome(addChatMessages, nextStep);
//     })();
//   } else if (chatInput !== "0") {
//     const needed_id = chatInput.trim();
//     setLoading(true);
//     setSharedGiftId(chatInput.trim());

//     try {
//       let giftExists = false;
//       let requestExists = false;

//       // Check if it's a gift or request
//       if (sharedPaymentMode === "Claim Gift") {
//         giftExists = (await checkGiftExists(needed_id)).exists;
//       } else {
//         requestExists = (await checkRequestExists(needed_id)).exists;
//       }

//       const idExists = giftExists || requestExists;

//       console.log("gift is processing");

//       // IF GIFT_ID EXIST IN DB,
//       if (idExists) {
//         if (giftExists) {
//           // Handle gift exists case
//           displayGiftFeedbackMessage(addChatMessages, nextStep);
//           helloMenu("hi");
//         } else if (requestExists) {
//           // Handle request exists case
//           // displayRequestFeedbackMessage(addChatMessages, nextStep);
//           displayTransferMoney(addChatMessages);
//           nextStep("estimateAsset");
//         }
//       } else {
//         addChatMessages([
//           {
//             type: "incoming",
//             content: `Invalid ${
//               sharedPaymentMode === "Claim Gift" ? "gift" : "request"
//             }_id. Try again`,
//             timestamp: new Date(),
//           },
//         ]);
//       }
//     } catch (error) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Error checking ID. Please try again.",
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   //   let giftExists: boolean;
//   //   // = (await checkGiftExists(needed_id)).exists;
//   //   let requestExists: boolean;
//   //   // = (await checkRequestExists(needed_id)).exists;
//   //   const idExists =
//   //     sharedPaymentMode === "Claim Gift"
//   //       ? (giftExists = (await checkGiftExists(needed_id)).exists)
//   //       : (requestExists = (await checkRequestExists(needed_id)).exists);

//   //   console.log("gift is processing");

//   //   // IF GIFT_ID EXIST IN DB,
//   //   if (idExists) {
//   //     if (giftExists) {
//   //       displayGiftFeedbackMessage(addChatMessages, nextStep);
//   //       helloMenu("hi");
//   //       setLoading(false);
//   //     } else {
//   //       displayGiftFeedbackMessage(addChatMessages, nextStep);
//   //       helloMenu("hi");
//   //       setLoading(false);
//   //     }
//   //   } else {
//   //     addChatMessages([
//   //       {
//   //         type: "incoming",
//   //         content: "Invalid gift_id. Try again",
//   //         timestamp: new Date(),
//   //       },
//   //     ]);
//   //     setLoading(false);
//   //   }
//   // } else {
//   //   addChatMessages([
//   //     {
//   //       type: "incoming",
//   //       content:
//   //         "Invalid choice. You need to choose an action from the options",
//   //       timestamp: new Date(),
//   //     },
//   //   ]);
//   // }
// };
// // CUSTOMER REPORTLY SEQUENCE FUNCTIONS

// // first page for reportly, with 3 options and goBack
// export const handleReportlyWelcome = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       welcomeMenu();
//     })();
//   } else if (chatInput === "1") {
//     setSharedReportlyReportType("Track Transaction");
//     console.log("Omo, na to report Track Transaction, input is: ", chatInput);
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     console.log("Omo, na to report Stolen funds, input is: ", chatInput);
//     setSharedReportlyReportType("Stolen funds | disappear funds");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     console.log("Omo, na to report Fraud, input is: ", chatInput);
//     setSharedReportlyReportType("Fraud");
//     displayReportlyName(addChatMessages, nextStep);
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // ALLOW REPORTER TO ENTER NAME
// export const handleReporterName = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput === "1") {
//     setSharedReportlyReportType("Track Transaction");
//     console.log("Omo, na to report Track Transaction");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "2") {
//     console.log("Omo, na to report Stolen funds");
//     setSharedReportlyReportType("Stolen funds | disappear funds");
//     displayReportlyName(addChatMessages, nextStep);
//   } else if (chatInput === "3") {
//     console.log("Omo, na to report Fraud");

//     setSharedReportlyReportType("Fraud");
//     displayReportlyName(addChatMessages, nextStep);
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content:
//           "Invalid choice. You need to choose an action from the options",
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };

// // Option to allow user tract transaction, enter name or goBack to the very start
// export const handleEnterReporterPhoneNumber = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       goToStep("reporterName");
//       displayReportlyName(addChatMessages, nextStep);
//     })();
//   } else {
//     const name = chatInput.trim();

//     if (name === "") {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a your name. You can not summit an empty space
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterName(chatInput.trim());
//     console.log(`Full name is ${reporterName}`);
//     displayReportlyPhoneNumber(addChatMessages, nextStep);
//   }
// };

// export const handleEnterReporterWalletAddress = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayReportlyName(addChatMessages, nextStep);
//     })();
//   } else {
//     let phoneNumber = chatInput.trim();
//     if (!phoneNumberPattern.test(phoneNumber)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid phone number, <b>{phoneNumber}</b> is not a
//               valid phone number.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterPhoneNumber(phoneNumber);
//     console.log(`Reporter phone number  is ${reporterPhoneNumber}`);
//     displayReportlyReporterWalletAddress(addChatMessages, nextStep);
//   }
// };

// export const handleEnterFraudsterWalletAddress = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayReportlyPhoneNumber(addChatMessages, nextStep);
//     })();
//   } else {
//     const wallet = chatInput.trim();
//     const lastReportId = async () => {
//       try {
//         const lastReportId = await getLastReportId();
//         const lastId = getNextReportID(lastReportId);
//         const report_id = `Report_${lastId}`;

//         setReportId(report_id);
//       } catch (e) {
//         console.log("we got into a challenge bro", e);
//       }
//     };
//     lastReportId();
//     if (!isValidWalletAddress(wallet)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid wallet address, <b>{wallet}</b> is not a
//               valid wallet address.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }
//     setReporterWalletAddress(wallet);

//     displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
//   }
// };

// export const handleReportlyNote = (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayReportlyReporterWalletAddress(addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "1") {
//     (() => {
//       goToStep("reportlyNote");
//       displayReportlyNote(addChatMessages, nextStep);
//     })();
//   } else {
//     const wallet = chatInput.trim();
//     if (!isValidWalletAddress(wallet)) {
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a valid wallet address, <b>{wallet}</b> is not a
//               valid wallet address.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }

//     setFraudsterWalletAddress(wallet);
//     displayReportlyNote(addChatMessages, nextStep);
//   }
// };

// export const handleReporterFarwell = async (
//   chatInput: string,
//   addChatMessages: Function,
//   nextStep: Function,
//   prevStep: Function,
//   goToStep: Function,
//   setLoading: Function
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     console.log("Going back to start");
//     goToStep("start");
//     helloMenu(chatInput, addChatMessages, nextStep);
//   } else if (chatInput.trim() === "00") {
//     (() => {
//       console.log("Going back from handleReportlyWelcome");
//       goToStep("start");
//       helloMenu("hi", addChatMessages, nextStep);
//     })();
//   } else if (chatInput.trim() === "0") {
//     (() => {
//       prevStep();
//       displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
//     })();
//   } else {
//     const note = chatInput.trim();

//     const wordCount = countWords(note);

//     if (!(wordCount <= 100)) {
//       console.log("word count is: ", wordCount);
//       const newMessages: MessageType[] = [
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Please enter a note within the specified word count. Your note is{" "}
//               {wordCount} words long. The maximum allowed is 100 words.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ];
//       addChatMessages(newMessages);
//       return;
//     }

//     setDescriptionNote(note);
//     const reportData: reportData = {
//       name: reporterName,
//       phone_Number: formatPhoneNumber(reporterPhoneNumber),
//       wallet_address: reporterWalletAddress,
//       fraudster_wallet_address: fraudsterWalletAddress,
//       description: note,
//       complaint: sharedReportlyReportType,
//       status: "pending",
//       report_id: reportId,
//       confirmer: "",
//     };
//     setLoading(true);
//     try {
//       await makeAReport(reportData);
//       // re write write_report api to throw error if we get any response other than 200
//       // if (response.status !== 200) {
//       //   throw new Error(`API responded with status ${response.status}`);
//       // }
//       setReporterName("");
//       setReporterPhoneNumber("");
//       setReporterWalletAddress("");
//       setFraudsterWalletAddress("");
//       setDescriptionNote("");
//       displayReportlyFarwell(addChatMessages, nextStep);
//       helloMenu("hi", addChatMessages, nextStep);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Aje!!, there was a issue saving the report.
//               <br />
//               Maybe check your internet and try again or say 'hi' to go to the
//               start of the conversation
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       console.log("Aje!!, there was a issue saving the report", error);
//     }
//     return;
//   }
// };
