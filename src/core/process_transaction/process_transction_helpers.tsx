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
} from "../../helpers/api_calls";
import { formatCurrency } from "../../helpers/format_currency";
import { getFormattedDateTime } from "../../helpers/format_date";
import { MessageType } from "@/types/general_types";

// async function processTransaction(
//     phoneNumber: string,
//     isGift: boolean,
//     isGiftTrx: boolean,
//     requestPayment: boolean,
//     activeWallet?: string,
//     lastAssignedTime?: Date
//   ) {
//     // Add a transaction lock to prevent multiple calls
//     const transactionLockKey = `transaction_in_progress_${Date.now()}`;

//     // Check if there's already a transaction in progress
//     if (localStorage.getItem("transaction_in_progress")) {
//       console.log("Transaction already in progress, ignoring request");
//       return;
//     }

//     // Set the lock
//     localStorage.setItem("transaction_in_progress", transactionLockKey);

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
//             helloMenu(
//               addChatMessages,
//               "hi",
//               nextStep,
//               walletIsConnected,
//               wallet,
//               telFirstName,
//               setSharedPaymentMode
//             );
//           } else if (giftClaimed) {
//             setLoading(false);
//             addChatMessages([
//               {
//                 type: "incoming",
//                 content: "This gift is already claimed",
//                 timestamp: new Date(),
//               },
//             ]);
//             helloMenu(
//               addChatMessages,
//               "hi",
//               nextStep,
//               walletIsConnected,
//               wallet,
//               telFirstName,
//               setSharedPaymentMode
//             );
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
//             helloMenu(
//               addChatMessages,
//               "hi",
//               nextStep,
//               walletIsConnected,
//               wallet,
//               telFirstName,
//               setSharedPaymentMode
//             );
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
//             helloMenu(
//               addChatMessages,
//               "hi",
//               nextStep,
//               walletIsConnected,
//               wallet,
//               telFirstName,
//               setSharedPaymentMode
//             );
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
//             // helloMenu("hi");
//             helloMenu(
//               addChatMessages,
//               "hi",
//               nextStep,
//               walletIsConnected,
//               wallet,
//               telFirstName,
//               setSharedPaymentMode
//             );
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
//           isNaN(Number.parseFloat(sharedPaymentAssetEstimate))
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
//         const paymentAsset = ` ${Number.parseFloat(sharedPaymentAssetEstimate)
//           .toFixed(8)
//           .toString()} ${sharedCrypto} `;
//         const date = getFormattedDateTime();

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
//           ethConnect,
//           giftID,
//           0,
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
//           Amount: Number.parseFloat(sharedPaymentAssetEstimate)
//             .toFixed(8)
//             .toString(),
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
//         const request =
//           sharedGiftId !== "" ? await checkRequestExists(sharedGiftId) : null;
//         const requestExists = request?.exists;
//         console.log("request exists", requestExists);
//         if (request && requestExists) {
//           console.log("we are fulfilling request!!!");
//           const user = request.user;

//           const recieverAmount = Number.parseInt(
//             user?.receiver_amount?.replace(/[^\d.]/g, "") || "0"
//           );
//           const dollar = recieverAmount / Number.parseInt(sharedRate);
//           const assetPrice =
//             sharedCrypto.toLowerCase() != "usdt"
//               ? sharedAssetPrice
//               : sharedRate;
//           // naira converted to asset
//           const charge = calculateCharge(
//             user?.receiver_amount || "0",
//             sharedPaymentMode,
//             sharedRate,
//             assetPrice
//           );

//           console.log("Before we continue, charge is:", charge);
//           const finalPayable = dollar / Number.parseFloat(assetPrice);
//           const paymentAssetEstimate = (finalPayable + charge).toString();

//           setSharedPaymentAssetEstimate(paymentAssetEstimate);
//           setSharedPaymentNairaEstimate(user?.receiver_amount || "0");
//           const paymentAsset = `${Number.parseFloat(paymentAssetEstimate)
//             .toFixed(8)
//             .toString()} ${sharedCrypto}`;

//           const userDate = {
//             crypto: sharedCrypto,
//             network: sharedNetwork,
//             estimation: sharedEstimateAsset,
//             Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8),
//             charges: charge,
//             mode_of_payment: user?.mode_of_payment,
//             acct_number: user?.acct_number,
//             bank_name: user?.bank_name,
//             receiver_name: user?.receiver_name,
//             receiver_amount: user?.receiver_amount,
//             crypto_sent: paymentAsset,
//             wallet_address: activeWallet,
//             Date: user?.Date,
//             status: "Processing",
//             receiver_phoneNumber: user?.receiver_phoneNumber,
//             customer_phoneNumber: formatPhoneNumber(phoneNumber),
//             transac_id: user?.transac_id,
//             request_id: user?.request_id,
//             settle_walletLink: null,
//             chat_id: user?.chat_id,
//             current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//             merchant_rate: user?.merchant_rate,
//             profit_rate: user?.profit_rate,
//             name: null,
//             asset_price:
//               sharedCrypto.toLowerCase() != "usdt"
//                 ? formatCurrency(sharedAssetPrice, "USD")
//                 : formatCurrency(sharedRate, "NGN", "en-NG"),
//           };

//           console.log("UserData", userDate);
//           await updateRequest(sharedGiftId, userDate);
//           const transactionID = Number.parseInt(user?.transac_id || "0");
//           const requestID = Number.parseInt(user?.request_id || "0");

//           console.log(
//             "Lets see sharedPaymentAssetEstimate ",
//             paymentAssetEstimate
//           );

//           console.log(
//             "Lets see sharedPaymentNairaEstimate ",
//             user?.receiver_amount ?? "0"
//           );

//           displaySendPayment(
//             addChatMessages,
//             nextStep,
//             activeWallet ?? "",
//             sharedCrypto,
//             paymentAssetEstimate,
//             (user?.receiver_amount ?? "0").replace(/[^\d.]/g, ""),
//             transactionID,
//             sharedNetwork,
//             sharedPaymentMode,
//             ethConnect,
//             0,
//             requestID,
//             lastAssignedTime
//           );
//           setLoading(false);
//           nextStep("start");
//           helloMenu(
//             addChatMessages,
//             "hi",
//             nextStep,
//             walletIsConnected,
//             wallet,
//             telFirstName,
//             setSharedPaymentMode
//           );
//         } else {
//           // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
//           console.log("we are creating a requests!!!");
//           const transactionID = generateTransactionId();
//           const requestID = generateTransactionId();
//           setSharedTransactionId(transactionID.toString());
//           window.localStorage.setItem(
//             "transactionID",
//             transactionID.toString()
//           );
//           const date = getFormattedDateTime();

//           setLoading(false);
//           // let's save the transaction details to db
//           const userDate = {
//             crypto: null,
//             network: null,
//             estimation: sharedEstimateAsset,
//             Amount: null,
//             charges: null,
//             mode_of_payment: sharedPaymentMode,
//             acct_number: bankData.acct_number,
//             bank_name: bankData.bank_name,
//             receiver_name: bankData.receiver_name,
//             receiver_amount: formatCurrency(
//               sharedPaymentNairaEstimate,
//               "NGN",
//               "en-NG"
//             ),
//             crypto_sent: null,
//             wallet_address: null,
//             Date: date,
//             status: "Processing",
//             receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//             customer_phoneNumber: null,
//             transac_id: transactionID.toString(),
//             request_id: requestID.toString(),
//             settle_walletLink: null,
//             chat_id: chatId,
//             current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
//             merchant_rate: merchantRate,
//             profit_rate: profitRate,
//             name: null,
//             asset_price: null,
//           };

//           await createTransaction(userDate).then(() => {
//             // clear the ref code from the cleint
//             localStorage.removeItem("referralCode");
//             localStorage.removeItem("referralCategory");
//           });

//           displaySendPayment(
//             addChatMessages,
//             nextStep,
//             activeWallet ?? "",
//             sharedCrypto,
//             sharedPaymentAssetEstimate,
//             sharedPaymentNairaEstimate,
//             transactionID,
//             sharedNetwork,
//             sharedPaymentMode,
//             ethConnect,
//             0,
//             requestID,
//             lastAssignedTime
//           );
//           setLoading(false);
//           nextStep("start");
//           helloMenu(
//             addChatMessages,
//             "hi",
//             nextStep,
//             walletIsConnected,
//             wallet,
//             telFirstName,
//             setSharedPaymentMode
//           );
//         }
//       } else {
//         console.log("USER WANTS TO MAKE A REGULAR TRX");
//         const transactionID = generateTransactionId();
//         setSharedTransactionId(transactionID.toString());
//         window.localStorage.setItem("transactionID", transactionID.toString());
//         if (
//           !sharedPaymentAssetEstimate ||
//           isNaN(Number.parseFloat(sharedPaymentAssetEstimate))
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

//         const paymentAsset = ` ${Number.parseFloat(sharedPaymentAssetEstimate)
//           .toFixed(8)
//           .toString()} ${sharedCrypto} `;
//         const date = getFormattedDateTime();

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
//           ethConnect,
//           0,
//           0,
//           lastAssignedTime
//         );

//         setLoading(false);
//         // let's save the transaction details to db
//         const userDate = {
//           crypto: sharedCrypto,
//           network: sharedNetwork,
//           estimation: sharedEstimateAsset,
//           Amount: Number.parseFloat(sharedPaymentAssetEstimate)
//             .toFixed(8)
//             .toString(),
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
//     } finally {
//       // Clear the lock only if it's our lock (in case another transaction started)
//       if (
//         localStorage.getItem("transaction_in_progress") === transactionLockKey
//       ) {
//         localStorage.removeItem("transaction_in_progress");
//       }
//     }
//   }

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
