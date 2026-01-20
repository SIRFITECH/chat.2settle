// /**
//  * handle bank search,
//  */

// import { checkGiftExists, fetchBankNames } from "@/helpers/api_calls";
// import { formatCurrency } from "@/helpers/format_currency";
// import {
//   displaySearchBank,
//   displayPayIn,
//   displayCharge,
//   displaySelectBank,
//   displayEnterAccountNumber,
// } from "@/menus/transact_crypto";
// import { displayTransactIDWelcome } from "@/menus/transaction_id";
// import { greetings } from "../helpers/ChatbotConsts";
// import { helloMenu } from "./general";
// import { MessageType } from "@/types/general_types";
// import { WalletAddress } from "@/lib/wallets/types";
// import { StepId } from "@/core/machines/steps";

// // GET USER BANK DETAILS FROM NUBAN
// export const handleSearchBank = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   sharedCharge: string,
//   sharedPaymentMode: string,
//   sharedCrypto: string,
//   sharedPaymentAssetEstimate: string,
//   sharedRate: string,
//   sharedPaymentNairaEstimate: string,
//   sharedAssetPrice: string,
//   sharedEstimateAsset: string,
//   sharedNairaCharge: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedGiftId: (giftId: string) => void,
//   setSharedPaymentAssetEstimate: (ticker: string) => void,
//   setSharedPaymentNairaEstimate: (crypto: string) => void,
//   setSharedChargeForDB: (network: string) => void,
//   setSharedPaymentMode: (mode: string) => void,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>
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
//       helloMenu(
//         addChatMessages,
//         chatInput,
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//     } else if (chatInput.trim() === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu(
//           addChatMessages,
//           "hi",
//           nextStep,
//           walletIsConnected,
//           wallet,
//           telFirstName,
//           setSharedPaymentMode
//         );
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
//       console.log("Gift is", giftExists);
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
//       helloMenu(
//         addChatMessages,
//         chatInput,
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu(
//           addChatMessages,
//           "hi",
//           nextStep,
//           walletIsConnected,
//           wallet,
//           telFirstName,
//           setSharedPaymentMode
//         );
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
//       helloMenu(
//         addChatMessages,
//         chatInput,
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu(
//           addChatMessages,
//           "hi",
//           nextStep,
//           walletIsConnected,
//           wallet,
//           telFirstName,
//           setSharedPaymentMode
//         );
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
//       helloMenu(
//         addChatMessages,
//         chatInput,
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
//     } else if (chatInput === "00") {
//       (() => {
//         goToStep("start");
//         helloMenu(
//           addChatMessages,
//           "hi",
//           nextStep,
//           walletIsConnected,
//           wallet,
//           telFirstName,
//           setSharedPaymentMode
//         );
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
//         parseFloat(sharedPaymentNairaEstimate) -
//         parseFloat(sharedNairaCharge.replace(/[^\d.]/g, ""));
//       console.log("Naira charger is :", sharedNairaCharge);
//       console.log(
//         "We are setting setSharedPaymentNairaEstimate to:",
//         finalNairaPayment.toString()
//       );

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       setSharedPaymentNairaEstimate(finalNairaPayment.toString());
//       setSharedChargeForDB(
//         `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
//       ),
//         displaySearchBank(addChatMessages, nextStep);
//     } else if (chatInput === "2") {
//       const finalAssetPayment =
//         parseFloat(sharedPaymentAssetEstimate) +
//         parseFloat(sharedCharge.replace(/[^\d.]/g, ""));
//       // const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

//       console.log(
//         "We are setting setSharedPaymentNairaEstimate to:",
//         sharedPaymentNairaEstimate
//       );

//       setSharedPaymentAssetEstimate(finalAssetPayment.toString());
//       // setSharedPaymentNairaEstimate(finalNairaPayment.toString());
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
// export const handleSelectBank = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   sharedPaymentMode: string,
//   sharedCrypto: string,
//   sharedAmount: string,
//   sharedRate: string,
//   sharedAssetPrice: string,
//   sharedEstimateAsset: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedBankNames: (bankName: string[]) => void,
//   setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>,
//   setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>,
//   setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>,
//   setSharedCharge: React.Dispatch<React.SetStateAction<string>>,
//   setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>,
//   setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>,
//   setSharedPaymentMode: (mode: string) => void,
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(
//       addChatMessages,
//       chatInput,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu(
//         addChatMessages,
//         "hi",
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
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
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   sharedBankCodes: string[],
//   sharedBankNames: string[],
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>,
//   setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>,
//   setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(
//       addChatMessages,
//       chatInput,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu(
//         addChatMessages,
//         "hi",
//         nextStep,
//         walletIsConnected,
//         wallet,
//         telFirstName,
//         setSharedPaymentMode
//       );
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
