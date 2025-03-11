import { helloMenu } from "@/features/chatbot/handlers/general";
import { displaySendPayment } from "@/menus/transact_crypto";
import {
  displayGiftFeedbackMessage,
  displayEnterId,
} from "@/menus/transaction_id";
import {
  BaseTransactionParams,
  // ProcessGiftSendTransactionParams,
  // ProcessGiftTransactionParams,
} from "@/types/transaction_types.ts/process_transaction";
import {
  formatPhoneNumber,
  generateTransactionId,
  generateGiftId,
} from "@/utils/utilities";
import { content } from "googleapis/build/src/apis/content";
import { has } from "lodash";
import {
  isGiftValid,
  updateGiftTransaction,
  createTransaction,
  checkRequestExists,
} from "../api_calls";
import { formatCurrency } from "../format_currency";
import { getFormattedDateTime } from "../format_date";
import { MessageType } from "@/types/general_types";

//   async function processTransaction(
//     phoneNumber: string,
//     isGift: boolean,
//     isGiftTrx: boolean,
//     requestPayment: boolean,
//     activeWallet?: string,
//     lastAssignedTime?: Date
//   ) {
//     // one last check is for USER WANT TO PAY REQUEST
//     try {
//       if (isGift) {
//         // UPDATE THE USER GIFT PAYMENT DATA
//         console.log("USER WANTS TO CLAIM GIFT");

//         const giftStatus = (await isGiftValid(sharedGiftId)).user?.gift_status;
//         const transactionStatus = (await isGiftValid(sharedGiftId)).user
//           ?.status;

//         try {
//           const giftNotClaimed =
//             giftStatus?.toLocaleLowerCase() === "not claimed" &&
//             transactionStatus?.toLocaleLowerCase() === "successful";

//           const giftClaimed =
//             giftStatus?.toLocaleLowerCase() === "claimed" &&
//             transactionStatus?.toLocaleLowerCase() === "successful";

//           const paymentPending =
//             giftStatus?.toLocaleLowerCase() === "not claimed" &&
//             transactionStatus?.toLocaleLowerCase() === "processing";

//           const giftNotPaid =
//             giftStatus?.toLocaleLowerCase() === "cancel" &&
//             transactionStatus?.toLocaleLowerCase() === "unsuccessful";

//           if (giftNotClaimed) {
//             const giftUpdateDate = {
//               gift_chatID: sharedGiftId,
//               acct_number: bankData.acct_number,
//               bank_name: bankData.bank_name,
//               receiver_name: bankData.receiver_name,
//               receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//               gift_status: "Processing",
//             };

//             // Only update the status to "Claimed" if payoutMoney is successful
//             // update the status to "Processing" and for the user to claim his gift
//             await updateGiftTransaction(sharedGiftId, giftUpdateDate);

//             setLoading(false);
//             displayGiftFeedbackMessage(addChatMessages, nextStep);
//             helloMenu("hi");
//           } else if (giftClaimed) {
//             setLoading(false);
//             addChatMessages([
//               {
//                 type: "incoming",
//                 content: "This gift is already claimed",
//                 timestamp: new Date(),
//               },
//             ]);
//             helloMenu("hi");
//             goToStep("start");
//           } else if (paymentPending) {
//             setLoading(false);
//             addChatMessages([
//               {
//                 type: "incoming",
//                 content: (
//                   <span>
//                     We are yet to confirm the crypto payment <br />
//                     Please check again later.
//                   </span>
//                 ),
//                 timestamp: new Date(),
//               },
//               {
//                 type: "incoming",
//                 content:
//                   "If it persists, it could be that the gifter has not sent the asset yet.",
//                 timestamp: new Date(),
//               },
//             ]);
//             helloMenu("hi");
//             goToStep("start");
//           } else if (giftNotPaid) {
//             setLoading(false);
//             addChatMessages([
//               {
//                 type: "incoming",
//                 content: (
//                   <span>
//                     This gift has been canceled. <br />
//                     You have to contact your gifter to do the transaction again.
//                   </span>
//                 ),
//                 timestamp: new Date(),
//               },
//             ]);
//             helloMenu("hi");
//             goToStep("start");
//           } else {
//             setLoading(false);
//             addChatMessages([
//               {
//                 type: "incoming",
//                 content: (
//                   <span>
//                     We have an issue determining this gift status.
//                     <br />
//                     You have to reach our customer support.
//                   </span>
//                 ),
//                 timestamp: new Date(),
//               },
//             ]);
//             helloMenu("hi");
//             goToStep("start");
//           }
//         } catch (error) {
//           console.error("Error during gift claim process:", error);

//           // Rollback or retain the transaction status in case of failure
//           await updateGiftTransaction(sharedGiftId, {
//             gift_status: giftStatus,
//           });

//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content: (
//                 <span>Sorry, the transaction failed. Please try again.</span>
//               ),
//               timestamp: new Date(),
//             },
//           ]);
//           displayEnterId(addChatMessages, nextStep, sharedPaymentMode);
//         }
//       } else if (isGiftTrx) {
//         console.log("USER WANTS TO SEND GIFT");
//         const transactionID = generateTransactionId();
//         setSharedTransactionId(transactionID.toString());
//         window.localStorage.setItem("transactionID", transactionID.toString());
//         const giftID = generateGiftId();
//         setSharedGiftId(giftID.toString());
//         window.localStorage.setItem("giftID", giftID.toString());

//         // Add validation
//         if (
//           !sharedPaymentAssetEstimate ||
//           isNaN(parseFloat(sharedPaymentAssetEstimate))
//         ) {
//           console.error(
//             "Invalid sharedPaymentAssetEstimate:",
//             sharedPaymentAssetEstimate
//           );
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content:
//                 "There was an error calculating the payment amount. Please try again.",
//               timestamp: new Date(),
//             },
//           ]);
//           setLoading(false);
//           return;
//         }
//         const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
//           .toFixed(8)
//           .toString()} ${sharedCrypto} `;
//         const date = getFormattedDateTime();
//         console.log("sharedPaymentNairaEstimate", sharedPaymentNairaEstimate);

//         displaySendPayment(
//           addChatMessages,
//           nextStep,
//           activeWallet ?? "",
//           sharedCrypto,
//           sharedPaymentAssetEstimate,
//           sharedPaymentNairaEstimate,
//           transactionID,
//           sharedNetwork,
//           sharedPaymentMode,
//           giftID,
//           ethConnect,
//           lastAssignedTime
//         );

//         console.log("User data created", activeWallet);

//         setLoading(false);
//         console.log("testing for gift:", sharedPaymentNairaEstimate);
//         // let's save the transaction details to db
//         const userDate = {
//           crypto: sharedCrypto,
//           network: sharedNetwork,
//           estimation: sharedEstimateAsset,
//           Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
//           charges: sharedChargeForDB,
//           mode_of_payment: sharedPaymentMode,
//           acct_number: null,
//           bank_name: null,
//           receiver_name: null,
//           receiver_amount: formatCurrency(
//             sharedPaymentNairaEstimate,
//             "NGN",
//             "en-NG"
//           ),
//           crypto_sent: paymentAsset,
//           wallet_address: activeWallet,
//           Date: date,
//           status: "Processing",
//           customer_phoneNumber: formatPhoneNumber(phoneNumber),
//           transac_id: transactionID.toString(),
//           gift_chatID: giftID.toString(),
//           settle_walletLink: null,
//           chat_id: chatId,
//           current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//           merchant_rate: merchantRate,
//           profit_rate: profitRate,
//           name: null,
//           gift_status: "Not Claimed",
//           asset_price:
//             sharedCrypto.toLowerCase() != "usdt"
//               ? formatCurrency(sharedAssetPrice, "USD")
//               : formatCurrency(sharedRate, "NGN", "en-NG"),
//         };
//         await createTransaction(userDate).then(() => {
//           // clear the ref code from the cleint

//           localStorage.removeItem("referralCode");
//           localStorage.removeItem("referralCategory");
//         });

//         console.log("User gift data created", userDate);
//       } else if (requestPayment) {
//         console.log("USER WANTS TO DO A REQUEST TRANSACTION");
//         if (sharedGiftId) {
//           const requestStatus = (await checkRequestExists(sharedGiftId)).exists;
//           if (requestStatus) {
//           }
//         }

//         console.log("USER WANTS TO REQUEST PAYMENT");

//         // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
//         const transactionID = generateTransactionId();
//         const requestID = generateTransactionId();
//         setSharedTransactionId(transactionID.toString());
//         window.localStorage.setItem("transactionID", transactionID.toString());
//         const date = getFormattedDateTime();

//         setLoading(false);
//         console.log("testing for request crypto:", sharedPaymentNairaEstimate);
//         // let's save the transaction details to db
//         const userDate = {
//           crypto: null,
//           network: null,
//           estimation: sharedEstimateAsset,
//           Amount: null,
//           charges: null,
//           mode_of_payment: sharedPaymentMode,
//           acct_number: bankData.acct_number,
//           bank_name: bankData.bank_name,
//           receiver_name: bankData.receiver_name,
//           receiver_amount: formatCurrency(
//             sharedPaymentNairaEstimate,
//             // "200000",
//             "NGN",
//             "en-NG"
//           ),
//           crypto_sent: null,
//           wallet_address: null,
//           Date: date,
//           status: "Processing",
//           receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//           customer_phoneNumber: formatPhoneNumber(phoneNumber),
//           transac_id: transactionID.toString(),
//           request_id: requestID.toString(),
//           settle_walletLink: "",
//           chat_id: chatId,
//           current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//           merchant_rate: merchantRate,
//           profit_rate: profitRate,
//           name: "",
//           asset_price:
//             sharedCrypto.toLowerCase() != "usdt"
//               ? formatCurrency(sharedAssetPrice, "USD")
//               : formatCurrency(sharedRate, "NGN", "en-NG"),
//         };
//         await createTransaction(userDate).then(() => {
//           // clear the ref code from the cleint

//           localStorage.removeItem("referralCode");
//           localStorage.removeItem("referralCategory");
//         });

//         console.log("request payment data created", userDate);

//         displaySendPayment(
//           addChatMessages,
//           nextStep,
//           activeWallet ?? "",
//           sharedCrypto,
//           sharedPaymentAssetEstimate,
//           sharedPaymentNairaEstimate,
//           transactionID,
//           sharedNetwork,
//           sharedPaymentMode,
//           requestID,
//           ethConnect,
//           lastAssignedTime
//         );
//         setLoading(false);
//         nextStep("start");
//         helloMenu("hi");
//       } else {
//         console.log("USER WANTS TO MAKE A REGULAR TRX");
//         const transactionID = generateTransactionId();
//         // React.useMemo(()=>getFormattedDateTime(), []);
//         setSharedTransactionId(transactionID.toString());
//         window.localStorage.setItem("transactionID", transactionID.toString());
//         if (
//           !sharedPaymentAssetEstimate ||
//           isNaN(parseFloat(sharedPaymentAssetEstimate))
//         ) {
//           console.error(
//             "Invalid sharedPaymentAssetEstimate:",
//             sharedPaymentAssetEstimate
//           );
//           setLoading(false);
//           addChatMessages([
//             {
//               type: "incoming",
//               content:
//                 "There was an error calculating the payment amount. Please try again.",
//               timestamp: new Date(),
//             },
//           ]);
//           setLoading(false);
//           return;
//         }

//         const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
//           .toFixed(8)
//           .toString()} ${sharedCrypto} `;
//         const date = getFormattedDateTime();
//         // React.useMemo(()=>getFormattedDateTime(), []);

//         displaySendPayment(
//           addChatMessages,
//           nextStep,
//           activeWallet ?? "",
//           sharedCrypto,
//           sharedPaymentAssetEstimate,
//           sharedPaymentNairaEstimate,
//           transactionID,
//           sharedNetwork,
//           sharedPaymentMode,
//           0,
//           ethConnect,
//           lastAssignedTime
//         );

//         setLoading(false);
//         // let's save the transaction details to db
//         const userDate = {
//           crypto: sharedCrypto,
//           network: sharedNetwork,
//           estimation: sharedEstimateAsset,
//           Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
//           charges: sharedChargeForDB,
//           mode_of_payment: sharedPaymentMode,
//           acct_number: bankData.acct_number,
//           bank_name: bankData.bank_name,
//           receiver_name: bankData.receiver_name,
//           receiver_amount: formatCurrency(
//             sharedPaymentNairaEstimate,
//             "NGN",
//             "en-NG"
//           ),
//           crypto_sent: paymentAsset,
//           wallet_address: activeWallet,
//           Date: date,
//           status: "Processing",
//           customer_phoneNumber: formatPhoneNumber(phoneNumber),
//           transac_id: transactionID.toString(),
//           settle_walletLink: "",
//           chat_id: chatId,
//           current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//           merchant_rate: merchantRate,
//           profit_rate: profitRate,
//           name: "",
//           asset_price:
//             sharedCrypto.toLowerCase() != "usdt"
//               ? formatCurrency(sharedAssetPrice, "USD")
//               : formatCurrency(sharedRate, "NGN", "en-NG"),
//         };
//         await createTransaction(userDate).then(() => {
//           // clear the ref code from the cleint

//           localStorage.removeItem("referralCode");
//           localStorage.removeItem("referralCategory");
//         });

//         console.log("User data created", userDate);
//       }
//     } catch (error) {
//       console.error("Error during transaction", error);
//     }
//   }

// Process a gift claim transaction

// export async function processGiftTransaction({
//   phoneNumber,
//   sharedGiftId,
//   bankData,
//   sharedPaymentMode,
//   addChatMessages,
//   setLoading,
//   goToStep,
//   nextStep,
// }: ProcessGiftTransactionParams) {
//   // UPDATE THE USER GIFT PAYMENT DATA
//   console.log("USER WANTS TO CLAIM GIFT");

//   const giftStatus = (await isGiftValid(sharedGiftId)).user?.gift_status;
//   const transactionStatus = (await isGiftValid(sharedGiftId)).user?.status;

//   try {
//     const giftNotClaimed =
//       giftStatus?.toLocaleLowerCase() === "not claimed" &&
//       transactionStatus?.toLocaleLowerCase() === "successful";

//     const giftClaimed =
//       giftStatus?.toLocaleLowerCase() === "claimed" &&
//       transactionStatus?.toLocaleLowerCase() === "successful";

//     const paymentPending =
//       giftStatus?.toLocaleLowerCase() === "not claimed" &&
//       transactionStatus?.toLocaleLowerCase() === "processing";

//     const giftNotPaid =
//       giftStatus?.toLocaleLowerCase() === "cancel" &&
//       transactionStatus?.toLocaleLowerCase() === "unsuccessful";

//     if (giftNotClaimed) {
//       const giftUpdateDate = {
//         gift_chatID: sharedGiftId,
//         acct_number: bankData.acct_number,
//         bank_name: bankData.bank_name,
//         receiver_name: bankData.receiver_name,
//         receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//         gift_status: "Processing",
//       };

//       // Only update the status to "Claimed" if payoutMoney is successful
//       // update the status to "Processing" and for the user to claim his gift
//       await updateGiftTransaction(sharedGiftId, giftUpdateDate);

//       setLoading(false);
//       displayGiftFeedbackMessage(addChatMessages, nextStep);
//       // helloMenu("hi");
//     } else if (giftClaimed) {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "This gift is already claimed",
//           timestamp: new Date(),
//         },
//       ]);
//       // helloMenu("hi");
//       goToStep("start");
//     } else if (paymentPending) {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               We are yet to confirm the crypto payment <br />
//               Please check again later.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content:
//             "If it persists, it could be that the gifter has not sent the asset yet.",
//           timestamp: new Date(),
//         },
//       ]);
//       // helloMenu("hi");
//       goToStep("start");
//     } else if (giftNotPaid) {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               This gift has been canceled. <br />
//               You have to contact your gifter to do the transaction again.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       // helloMenu("hi");
//       goToStep("start");
//     } else {
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               We have an issue determining this gift status.
//               <br />
//               You have to reach our customer support.
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       // helloMenu("hi");
//       goToStep("start");
//     }
//   } catch (error) {
//     console.error("Error during gift claim process:", error);

//     // Rollback or retain the transaction status in case of failure
//     await updateGiftTransaction(sharedGiftId, {
//       gift_status: giftStatus,
//     });

//     setLoading(false);
//     addChatMessages([
//       {
//         type: "incoming",
//         content: <span>Sorry, the transaction failed. Please try again.</span>,
//         timestamp: new Date(),
//       },
//     ]);
//     displayEnterId(addChatMessages, nextStep, sharedPaymentMode);
//   }
// }
// // Process sending a gift transaction
// export async function processGiftSendTransaction({
//   phoneNumber,
//   activeWallet,
//   lastAssignedTime,
//   sharedPaymentAssetEstimate,
//   sharedCrypto,
//   sharedPaymentMode,
//   sharedPaymentNairaEstimate,
//   sharedNetwork,
//   sharedPaymentMode,
//   ethConnect,
//   sharedEstimateAsset,
//   sharedChargeForDB,
//   chatId,
//   sharedRate,
//   merchantRate,
//   profitRate,
//   sharedAssetPrice,
//   setSharedTransactionId,
//   setSharedGiftId,
//   addChatMessages,
//   setLoading,
//   nextStep,
// }: ProcessGiftSendTransactionParams) {
//   {
//     console.log("USER WANTS TO SEND GIFT");
//     const transactionID = generateTransactionId();
//     setSharedTransactionId(transactionID.toString());
//     window.localStorage.setItem("transactionID", transactionID.toString());
//     const giftID = generateGiftId();
//     setSharedGiftId(giftID.toString());
//     window.localStorage.setItem("giftID", giftID.toString());
//     // Add validation
//     if (
//       !sharedPaymentAssetEstimate ||
//       isNaN(parseFloat(sharedPaymentAssetEstimate))
//     ) {
//       console.error(
//         "Invalid sharedPaymentAssetEstimate:",
//         sharedPaymentAssetEstimate
//       );
//       setLoading(false);
//       addChatMessages([
//         {
//           type: "incoming",
//           content:
//             "There was an error calculating the payment amount. Please try again.",
//           timestamp: new Date(),
//         },
//       ]);
//       setLoading(false);
//       return;
//     }
//     const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
//       .toFixed(8)
//       .toString()} ${sharedCrypto} `;
//     const date = getFormattedDateTime();
//     console.log("sharedPaymentNairaEstimate", sharedPaymentNairaEstimate);
//     displaySendPayment(
//       addChatMessages,
//       nextStep,
//       activeWallet ?? "",
//       sharedCrypto,
//       sharedPaymentAssetEstimate,
//       sharedPaymentNairaEstimate,
//       transactionID,
//       sharedNetwork,
//       sharedPaymentMode,
//       giftID,
//       ethConnect,
//       lastAssignedTime
//     );
//     console.log("User data created", activeWallet);
//     setLoading(false);
//     console.log("testing for gift:", sharedPaymentNairaEstimate);
//     // let's save the transaction details to db
//     const userDate = {
//       crypto: sharedCrypto,
//       network: sharedNetwork,
//       estimation: sharedEstimateAsset,
//       Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
//       charges: sharedChargeForDB,
//       mode_of_payment: sharedPaymentMode,
//       acct_number: null,
//       bank_name: null,
//       receiver_name: null,
//       receiver_amount: formatCurrency(
//         sharedPaymentNairaEstimate,
//         "NGN",
//         "en-NG"
//       ),
//       crypto_sent: paymentAsset,
//       wallet_address: activeWallet,
//       Date: date,
//       status: "Processing",
//       customer_phoneNumber: formatPhoneNumber(phoneNumber),
//       transac_id: transactionID.toString(),
//       gift_chatID: giftID.toString(),
//       settle_walletLink: null,
//       chat_id: chatId,
//       current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//       merchant_rate: merchantRate,
//       profit_rate: profitRate,
//       name: null,
//       gift_status: "Not Claimed",
//       asset_price:
//         sharedCrypto.toLowerCase() != "usdt"
//           ? formatCurrency(sharedAssetPrice, "USD")
//           : formatCurrency(sharedRate, "NGN", "en-NG"),
//     };
//     await createTransaction(userDate).then(() => {
//       // clear the ref code from the cleint
//       localStorage.removeItem("referralCode");
//       localStorage.removeItem("referralCategory");
//     });
//     console.log("User gift data created", userDate);
//   }
// }

// Process a request payment transaction
export async function processRequestPayment({
  phoneNumber,
  activeWallet,
}: BaseTransactionParams) {
  console.log("Processing request payment for:", phoneNumber, activeWallet);
  // Insert your request payment logic here...
}

// Process a regular transaction
export async function processRegularTransaction({
  phoneNumber,
  activeWallet,
}: BaseTransactionParams) {
  console.log("Processing regular transaction for:", phoneNumber, activeWallet);
  // Insert your regular transaction logic here...
}
