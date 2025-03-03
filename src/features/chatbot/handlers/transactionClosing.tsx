import {
  fetchBankDetails,
  isGiftValid,
  updateGiftTransaction,
  createTransaction,
  checkRequestExists,
  checkTranscationExists,
  updateTransaction,
} from "@/helpers/api_calls";
import { formatCurrency } from "@/helpers/format_currency";
import { getFormattedDateTime } from "@/helpers/format_date";
import ConfirmAndProceedButton from "@/hooks/confirmButtonHook";
import {
  displaySearchBank,
  displayEnterPhone,
  displayContinueToPay,
  displaySendPayment,
  displayConfirmPayment,
} from "@/menus/transact_crypto";
import {
  displayGiftFeedbackMessage,
  displayEnterId,
} from "@/menus/transaction_id";
import { MessageType, UserBankData } from "@/types/general_types";
import {
  phoneNumberPattern,
  formatPhoneNumber,
  generateTransactionId,
  generateGiftId,
} from "@/utils/utilities";
import { useCallback } from "react";
import { greetings } from "../helpers/ChatbotConsts";
import { helloMenu } from "./general";

// VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME
export const handleContinueToPay = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedSelectedBankCode: string,
  sharedSelectedBankName: string,
  sharedPaymentMode: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  updateBankData: (newData: Partial<UserBankData>) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    // helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      goToStep("start");
      //   helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("THIS IS WHERE WE ARE");
      prevStep();
      displaySearchBank(addChatMessages, nextStep);
    })();
  } else if (chatInput !== "0") {
    if (chatInput === "1" || chatInput === "2") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      let bank_name = "";
      let account_name = "";
      let account_number = "";

      setLoading(true);

      try {
        const bankData = await fetchBankDetails(
          sharedSelectedBankCode,
          chatInput.trim()
        );

        bank_name = bankData[0].bank_name;
        account_name = bankData[0].account_name;
        account_number = bankData[0].account_number;

        if (!account_number) {
          const newMessages: MessageType[] = [
            {
              type: "incoming",
              content: <span>Invalid account number. Please try again.</span>,
              timestamp: new Date(),
            },
          ];
          addChatMessages(newMessages);
          setLoading(false);
          return; // Exit the function to let the user try again
        }

        setLoading(false);
        updateBankData({
          acct_number: account_number,
          bank_name: sharedSelectedBankName,
          receiver_name: account_name,
        });
        displayContinueToPay(
          addChatMessages,
          nextStep,
          account_name,
          sharedSelectedBankName,
          account_number,
          sharedPaymentMode
        );
      } catch (error) {
        console.error("Failed to fetch bank data:", error);
        const errorMessage: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Failed to fetch bank data. Please check your accouunt number and
                try again.
              </span>
            ),
            timestamp: new Date(),
          },
        ];
        addChatMessages(errorMessage);
        setLoading(false);
      }
    }
  }
};

// // MISSING HANDLE FUNCTION< HANDLE PHONE NUMBER
// export const handlePhoneNumber = async (chatInput: string) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi");
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

// export const MemoizedConfirmAndProceedButton = useCallback(
//   ({ phoneNumber, network }: { phoneNumber: string; network: string }) => (
//     <ConfirmAndProceedButton
//       phoneNumber={phoneNumber}
//       setLoading={setLoading}
//       sharedPaymentMode={sharedPaymentMode}
//       processTransaction={processTransaction}
//       network={network}
//       connectedWallet={ethConnect}
//       amount={sharedPaymentAssetEstimate}
//     />
//   ),
//   [
//     setLoading,
//     processTransaction,
//     sharedPaymentMode,
//     ethConnect,
//     sharedPaymentAssetEstimate,
//   ]
// );

// // final part to finish transaction
// export const handleCryptoPayment = async (chatInput: string) => {
//   const phoneNumber = chatInput.trim();

//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput);
//   } else if (chatInput === "00") {
//     (() => {
//       goToStep("start");
//       helloMenu("hi");
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
//       const assetPayment = parseFloat(sharedPaymentAssetEstimate);
//       const paymentAsset = `${assetPayment.toFixed(8)} ${sharedCrypto}`;

//       const newMessages: MessageType[] = ethConnect
//         ? [
//             {
//               type: "incoming",
//               content: (
//                 <div className="flex flex-col items-center">
//                   <p className="mb-4">
//                     You are going to be charged <b>{paymentAsset}</b> directly
//                     from your {sharedCrypto} ({sharedNetwork}) wallet.
//                   </p>
//                   <MemoizedConfirmAndProceedButton
//                     phoneNumber={phoneNumber}
//                     network={network}
//                   />
//                 </div>
//               ),
//               timestamp: new Date(),
//             },
//           ]
//         : [
//             {
//               type: "incoming",
//               content: (
//                 <div className="flex flex-col items-center">
//                   <p className="mb-4">
//                     Do you understand that you need to complete your payment
//                     within <b>5 minutes</b>, otherwise you may lose your money.
//                   </p>
//                   <MemoizedConfirmAndProceedButton
//                     phoneNumber={phoneNumber}
//                     network={network}
//                   />
//                 </div>
//               ),
//               timestamp: new Date(),
//             },
//           ];

//       setLoading(false);
//       addChatMessages(newMessages);
//     } else {
//       console.log(
//         "Calling processTransaction with:",
//         phoneNumber,
//         isGift,
//         isGiftTrx,
//         requestPayment
//       );

//       await processTransaction(phoneNumber, isGift, isGiftTrx, requestPayment);
//     }
//   } else {
//     setLoading(false);
//     console.log("User input not recognized");
//   }
// };

// async function processTransaction(
//   phoneNumber: string,
//   isGift: boolean,
//   isGiftTrx: boolean,
//   requestPayment: boolean,
//   activeWallet?: string,
//   lastAssignedTime?: Date
// ) {
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
//         ethConnect,
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

//       console.log("request payment data created", userDate);

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
//         ethConnect,
//         lastAssignedTime
//       );
//       setLoading(false);
//       nextStep("start");
//       helloMenu("hi");
//     } else {
//       console.log("USER WANTS TO MAKE A REGULAR TRX");
//       const transactionID = generateTransactionId();
//       // React.useMemo(()=>getFormattedDateTime(), []);
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
//       // React.useMemo(()=>getFormattedDateTime(), []);

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
//         ethConnect,
//         lastAssignedTime
//       );

//       setLoading(false);
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

//       console.log("User data created", userDate);
//     }
//   } catch (error) {
//     console.error("Error during transaction", error);
//   }
// }

// export const handleConfirmTransaction = async (chatInput: string) => {
//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//     helloMenu(chatInput);
//   } else if (chatInput.trim() === "00") {
//     goToStep("start");
//     helloMenu(chatInput);
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
