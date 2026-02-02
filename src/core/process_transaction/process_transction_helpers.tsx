import { helloMenu } from "@/features/chatbot/handlers/chatHandlers/hello.menu";
import { displayGiftFeedbackMessage } from "@/features/chatbot/handlers/chatHandlers/menus/display.gift.transaction.confirmation";
import {
  createGift,
  updateGiftTransaction,
} from "@/services/transactionService/giftService/giftService";
import {
  createRequest,
  updateRequest,
} from "@/services/transactionService/requestService/requestService";
import { createTransfer } from "@/services/transactionService/transferService/transfer.service";
import { generateTransactionId } from "@/utils/utilities";
import { useBankStore } from "stores/bankStore";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";
import { useUserStore } from "stores/userStore";

export async function processTransaction() {
  const currentStep = useChatStore.getState().currentStep;
  const { next } = useChatStore.getState();
  const { paymentMode } = usePaymentStore.getState();

  const paymentStore = usePaymentStore.getState();
  const { user } = useUserStore.getState();
  const { bankData } = useBankStore.getState();
  const { giftId } = useTransactionStore.getState();

  const { acct_number, bank_name, receiver_name } = bankData;
  const receiver_phoneNumber = user?.phone!;
  const status = "Processing";
  const effort = paymentStore.paymentNairaEstimate ? parseFloat(paymentStore.paymentNairaEstimate) * 0.1: null;
  const transferId = generateTransactionId().toString();

  function cleanCurrency(currencyStr: string): string {
    return currencyStr.replace(/[^0-9.]/g, "");
  }

  const payer = {
    customer_phoneNumber: receiver_phoneNumber,
    chat_id: user?.chatId!.toString(),
  };

  const receiver = {
    acct_number: acct_number,
    bank_name: bank_name,
    receiver_name: receiver_name,
    receiver_phoneNumber: receiver_phoneNumber,
  };

  const summary = {
    transaction_type: currentStep.transactionType?.toLowerCase(),
    total_dollar: paymentStore.paymentAssetEstimate,
    total_naira: paymentStore.paymentNairaEstimate,
    effort: effort?.toString() ,
    asset_price: cleanCurrency(paymentStore.assetPrice),
    status,
  };

  const isTransfer = currentStep.transactionType?.toLowerCase() === "transfer";
  const isRequest = currentStep.transactionType?.toLowerCase() === "request";
  const isGift = currentStep.transactionType?.toLowerCase() === "gift";
  const isClaimGift = paymentMode.toLowerCase() === "claim gift";

  const transferData = {
    // TRANSFER
    // crypto
    // network
    // estimate_asset
    // amount_payable
    // crypto_amount
    // charges
    // date
    // transfer_id
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // estimate_amount
    // wallet_address
    // status

    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    amount_payable: paymentStore.paymentNairaEstimate,
    crypto_amount: paymentStore.paymentAssetEstimate,
    charges: cleanCurrency(paymentStore.nairaCharge),
    date: new Date(),
    transfer_id: transferId,
    current_rate: cleanCurrency(paymentStore.rate),
    merchant_rate: paymentStore.merchantRate,
    profit_rate: paymentStore.profitRate,
    estimate_amount: paymentStore.paymentNairaEstimate,
    wallet_address: paymentStore.activeWallet,
    status,

    payer,
    receiver,
    summary,
  };

  const giftData = {
    // GIFT
    // gift_id
    // crypto
    // network
    // estimate_asset
    // estimate_amount
    // amount_payable
    // charges
    // crypto_amount
    // date
    // receiver_id
    // gift_status
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // wallet_address
    // status
    gift_id: generateTransactionId().toString(),
    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    estimate_amount: paymentStore.paymentNairaEstimate,
    amount_payable: paymentStore.paymentNairaEstimate,
    charges: cleanCurrency(paymentStore.nairaCharge),
    crypto_amount: paymentStore.paymentAssetEstimate,
    date: new Date(),
    gift_status: "Not claimed",
    current_rate: cleanCurrency(paymentStore.rate),
    merchant_rate: paymentStore.merchantRate,
    profit_rate: paymentStore.profitRate,
    wallet_address: paymentStore.activeWallet,
    status,

    payer,
    summary,
  };

  const requestData = {
    // REQUEST
    // request_id
    // request_status
    // crypto
    // network
    // estimate_asset
    // estimate_amount
    // amount_payable
    // charges
    // crypto_amount
    // date
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // wallet_address
    // status

    request_id: generateTransactionId().toString(),
    request_status: "Not paid",
    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    estimate_amount: paymentStore.paymentNairaEstimate,
    amount_payable: paymentStore.paymentNairaEstimate,
    charges: cleanCurrency(paymentStore.nairaCharge),
    crypto_amount: paymentStore.paymentAssetEstimate,
    date: new Date(),
    current_rate: cleanCurrency(paymentStore.rate),
    merchant_rate: paymentStore.merchantRate,
    profit_rate: paymentStore.profitRate,
    wallet_address: paymentStore.activeWallet,
    status,

    receiver,
    summary,
  };

  const updateRequestData = {};

  if (isTransfer) {
    // call the endpoint that saves transfer transaction
    console.log("Processing transfer transaction...", transferData);
    await createTransfer(transferData);
  } else if (isGift) {
    // call the endpoint that saves gift transaction
    console.log("Processing gift transaction...");
    await createGift(giftData);
  } else if (isRequest) {
    // call the endpoint that saves request transaction
    console.log("Processing request transaction...");
    await createRequest(requestData);
  } else if (isClaimGift) {
    // call the endpoint that saves gift transaction
    console.log("Processing claim gift transaction...");
    await updateGiftTransaction(giftId, {
      acct_number,
      bank_name,
      receiver_name,
      receiver_phoneNumber,
    });
    displayGiftFeedbackMessage();
    helloMenu("hi");
    next({ stepId: "chooseAction" });
  } else {
    // call the endpoint that saves request transaction
    console.log("Paying request transaction...");
    await updateRequest(updateRequestData);
  }

  // const {
  //   activeWallet,
  //   assetPrice,
  //   crypto,
  //   dollarCharge,
  //   estimateAsset,
  //   merchantRate,
  //   rate,
  //   profitRate,
  //   network,
  //   nairaCharge,
  //   paymentMode,
  //   paymentAssetEstimate,
  //   paymentNairaEstimate,
  // } = usePaymentStore.getState();

  // save payer, get the payer_id
  // save reciever, get reciever_id
  // generate gift_id
  // then save gift.

  //GIFT

  /**
   * gift_id
   * status
   * crypto # ETH, BTC
   * network # ERC20
   * estimate_asset # Naira, Dollar, BTC
   * estimate_amount # amount estimated in estimate asset
   * amount_payable # amount we pay the user in naira
   * charges #
   * crypto_amount # estimate_amount in crypto
   * date
   * reciever_id
   * gift_status
   * payer_id
   * current_rate
   * merchant_rate
   * profit_rate
   * wallet_address # recieving wallet address
   */

  //SUMMARY

  /**
   * transaction_type
   * total_dollar
   * settle_date
   * transaction_id
   * total_naira
   * effort
   * merchant_id
   * status
   * ref_code
   * asset_price
   * */
}

// import { helloMenu } from "@/features/chatbot/handlers/chatHandlers/hello.menu";
// import { displaySendPayment } from "@/features/chatbot/handlers/chatHandlers/menus/display.send.payment";
// import { formatCurrency } from "@/helpers/format_currency";
// import { getFormattedDateTime } from "@/helpers/format_date";
// import {
//   isGiftValid,
//   updateGiftTransaction,
// } from "@/services/transactionService/giftService/giftService";
// import { createTransaction } from "@/services/transactionService/transferService/transfer.service";
// import { BaseTransactionParams } from "@/types/transaction_types.ts/process_transaction";
// import {
//   formatPhoneNumber,
//   generateGiftId,
//   generateTransactionId,
//   getBaseSymbol,
// } from "@/utils/utilities";
// import useChatStore from "stores/chatStore";
// import { usePaymentStore } from "stores/paymentStore";
// import { useTransactionStore } from "stores/transactionStore";
// import { useUserStore } from "stores/userStore";

// async function processTransaction() {
// // phoneNumber: string,
// // isGift: boolean,
// // isGiftTrx: boolean,
// // requestPayment: boolean,
// // activeWallet?: string,
// // lastAssignedTime?: Date
//   const { addMessages, setLoading, currentStep } = useChatStore.getState();

//   const { user: appUser } = useUserStore.getState()!;

//   const { updateTransaction, transaction, setGiftId, giftId } =
//     useTransactionStore.getState();
//   transaction?.acct_number;
//   const {
//     ticker,
//     rate,
//     paymentMode,
//     crypto,
//     network,
//     wallet,
//     assetPrice: priceOfAsset,
//     nairaCharge,
//     dollarCharge,
//     estimateAsset,
//     paymentAssetEstimate,
//     paymentNairaEstimate,
//     profitRate,
//     merchantRate,
//   } = usePaymentStore.getState();

//   transaction?.transac_id;
//   const isGift = currentStep.transactionType == "gift";
//   const isGiftTrx = currentStep.transactionType == "gift";
//   const requestPayment = currentStep.transactionType == "request";

//   const phoneNumber = appUser?.phone;

//   // Add a transaction lock to prevent multiple calls
//   const transactionLockKey = `transaction_in_progress_${Date.now()}`;

//   // Check if there's already a transaction in progress
//   if (localStorage.getItem("transaction_in_progress")) {
//     console.log("Transaction already in progress, ignoring request");
//     return;
//   }

//   // Set the lock
//   localStorage.setItem("transaction_in_progress", transactionLockKey);

//   try {
//     // if (isGift) {
//     //   // UPDATE THE USER GIFT PAYMENT DATA
//     //   console.log("USER WANTS TO CLAIM GIFT");

//     //   const giftStatus = (await isGiftValid(giftId)).user?.gift_status;
//     //   const transactionStatus = (await isGiftValid(giftId)).user?.status;

//     //   try {
//     //     const giftNotClaimed =
//     //       giftStatus?.toLocaleLowerCase() === "not claimed" &&
//     //       transactionStatus?.toLocaleLowerCase() === "successful";

//     //     const giftClaimed =
//     //       giftStatus?.toLocaleLowerCase() === "claimed" &&
//     //       transactionStatus?.toLocaleLowerCase() === "successful";

//     //     const paymentPending =
//     //       giftStatus?.toLocaleLowerCase() === "not claimed" &&
//     //       transactionStatus?.toLocaleLowerCase() === "processing";

//     //     const giftNotPaid =
//     //       giftStatus?.toLocaleLowerCase() === "cancel" &&
//     //       transactionStatus?.toLocaleLowerCase() === "unsuccessful";

//     //     if (giftNotClaimed) {
//     //       const giftUpdateDate = {
//     //         gift_chatID: sharedGiftId,
//     //         acct_number: bankData.acct_number,
//     //         bank_name: bankData.bank_name,
//     //         receiver_name: bankData.receiver_name,
//     //         receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//     //         gift_status: "Processing",
//     //         settled_on: getFormattedDateTime(),
//     //       };

//     //       // Only update the status to "Claimed" if payoutMoney is successful
//     //       // update the status to "Processing" and for the user to claim his gift
//     //       await updateGiftTransaction(sharedGiftId, giftUpdateDate);

//     //       setLoading(false);
//     //       displayGiftFeedbackMessage(addChatMessages, nextStep);
//     //       helloMenu(
//     //         addChatMessages,
//     //         "hi",
//     //         nextStep,
//     //         walletIsConnected,
//     //         wallet,
//     //         telFirstName,
//     //         setSharedPaymentMode
//     //       );
//     //     } else if (giftClaimed) {
//     //       setLoading(false);
//     //       addChatMessages([
//     //         {
//     //           type: "incoming",
//     //           content: "This gift is already claimed",
//     //           timestamp: new Date(),
//     //         },
//     //       ]);
//     //       helloMenu(
//     //         addChatMessages,
//     //         "hi",
//     //         nextStep,
//     //         walletIsConnected,
//     //         wallet,
//     //         telFirstName,
//     //         setSharedPaymentMode
//     //       );
//     //       goToStep("start");
//     //     } else if (paymentPending) {
//     //       setLoading(false);
//     //       addChatMessages([
//     //         {
//     //           type: "incoming",
//     //           content: (
//     //             <span>
//     //               We are yet to confirm the crypto payment <br />
//     //               Please check again later.
//     //             </span>
//     //           ),
//     //           timestamp: new Date(),
//     //         },
//     //         {
//     //           type: "incoming",
//     //           content:
//     //             "If it persists, it could be that the gifter has not sent the asset yet.",
//     //           timestamp: new Date(),
//     //         },
//     //       ]);
//     //       helloMenu(
//     //         addChatMessages,
//     //         "hi",
//     //         nextStep,
//     //         walletIsConnected,
//     //         wallet,
//     //         telFirstName,
//     //         setSharedPaymentMode
//     //       );
//     //       goToStep("start");
//     //     } else if (giftNotPaid) {
//     //       setLoading(false);
//     //       addChatMessages([
//     //         {
//     //           type: "incoming",
//     //           content: (
//     //             <span>
//     //               This gift has been canceled. <br />
//     //               You have to contact your gifter to do the transaction again.
//     //             </span>
//     //           ),
//     //           timestamp: new Date(),
//     //         },
//     //       ]);
//     //       helloMenu(
//     //         addChatMessages,
//     //         "hi",
//     //         nextStep,
//     //         walletIsConnected,
//     //         wallet,
//     //         telFirstName,
//     //         setSharedPaymentMode
//     //       );
//     //       goToStep("start");
//     //     } else {
//     //       setLoading(false);
//     //       addChatMessages([
//     //         {
//     //           type: "incoming",
//     //           content: (
//     //             <span>
//     //               We have an issue determining this gift status.
//     //               <br />
//     //               You have to reach our customer support.
//     //             </span>
//     //           ),
//     //           timestamp: new Date(),
//     //         },
//     //       ]);
//     //       // helloMenu("hi");
//     //       helloMenu(
//     //         addChatMessages,
//     //         "hi",
//     //         nextStep,
//     //         walletIsConnected,
//     //         wallet,
//     //         telFirstName,
//     //         setSharedPaymentMode
//     //       );
//     //       goToStep("start");
//     //     }
//     //   } catch (error) {
//     //     console.error("Error during gift claim process:", error);

//     //     // Rollback or retain the transaction status in case of failure
//     //     await updateGiftTransaction(sharedGiftId, {
//     //       gift_status: giftStatus,
//     //     });

//     //     setLoading(false);
//     //     addMessages([
//     //       {
//     //         type: "incoming",
//     //         content: (
//     //           <span>Sorry, the transaction failed. Please try again.</span>
//     //         ),
//     //         timestamp: new Date(),
//     //       },
//     //     ]);
//     //     displayEnterId(addChatMessages, nextStep, sharedPaymentMode);
//     //   }
//     // } else
//     if (isGiftTrx) {
//       console.log("USER WANTS TO SEND GIFT");
//       const transactionID = generateTransactionId();
//       updateTransaction({ transac_id: transactionID.toString() });
//       window.localStorage.setItem("transactionID", transactionID.toString());
//       const giftID = generateGiftId();
//       setGiftId(giftID.toString());
//       window.localStorage.setItem("giftID", giftID.toString());

//       // Add validation
//       if (
//         !paymentAssetEstimate ||
//         isNaN(Number.parseFloat(paymentAssetEstimate))
//       ) {
//         console.error(
//           "Invalid sharedPaymentAssetEstimate:",
//           paymentAssetEstimate
//         );
//         setLoading(false);
//         addMessages([
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
//       const paymentAsset = ` ${Number.parseFloat(paymentAssetEstimate)
//         .toFixed(8)
//         .toString()} ${getBaseSymbol(ticker)} `;
//       const date = getFormattedDateTime();

//       displaySendPayment();
//       // addChatMessages,
//       // nextStep,
//       // activeWallet ?? "",
//       // sharedCrypto,
//       // sharedPaymentAssetEstimate,
//       // sharedPaymentNairaEstimate,
//       // transactionID,
//       // sharedNetwork,
//       // sharedPaymentMode,
//       // ethConnect,
//       // giftID,
//       // 0,
//       // lastAssignedTime

//       // console.log("User data created", activeWallet);

//       setLoading(false);
//       console.log("testing for gift:", paymentNairaEstimate);
//       // let's save the transaction details to db
//       const userDate = {
//         crypto: getBaseSymbol(ticker),
//         network: network,
//         estimation: estimateAsset,
//         Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8).toString(),
//         charges: transaction?.charges,
//         mode_of_payment: currentStep.transactionType,
//         acct_number: null,
//         bank_name: null,
//         receiver_name: null,
//         receiver_amount: formatCurrency(paymentNairaEstimate, "NGN", "en-NG"),
//         crypto_sent: paymentAsset,
//         // wallet_address: activeWallet,
//         Date: date,
//         status: "Processing",
//         customer_phoneNumber: formatPhoneNumber(phoneNumber!),
//         transac_id: transactionID.toString(),
//         gift_chatID: giftID.toString(),
//         settle_walletLink: null,
//         chat_id: appUser?.chatId,
//         current_rate: formatCurrency(rate, "NGN", "en-NG"),
//         merchant_rate: merchantRate,
//         profit_rate: profitRate,
//         name: null,
//         gift_status: "Not Claimed",
//         asset_price:
//           crypto.toLowerCase() != "usdt"
//             ? formatCurrency(priceOfAsset, "USD")
//             : formatCurrency(rate, "NGN", "en-NG"),
//       };

//       // const userDate = {
//       //   crypto: getBaseSymbol(ticker),
//       //   network: network,
//       //   estimation: estimateAsset,
//       //   Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8).toString(),
//       //   charges: transaction?.charges,
//       //   mode_of_payment: currentStep.transactionType,
//       //   acct_number: transaction?.acct_number,
//       //   bank_name: transaction?.bank_name,
//       //   receiver_name: transaction?.receiver_name,
//       //   receiver_amount: formatCurrency(paymentNairaEstimate, "NGN", "en-NG"),
//       //   crypto_sent: paymentAsset,
//       //   wallet_address: activeWallet,
//       //   Date: date,
//       //   status: "Processing",
//       //   customer_phoneNumber: formatPhoneNumber(phoneNumber),
//       //   transac_id: transactionID.toString(),
//       //   settle_walletLink: "",
//       //   chat_id: user?.chatId,
//       //   current_rate: formatCurrency(rate, "NGN", "en-NG"),
//       //   merchant_rate: merchantRate,
//       //   profit_rate: profitRate,
//       //   name: "",
//       //   asset_price:
//       //     crypto.toLowerCase() != "usdt"
//       //       ? formatCurrency(assetPrice, "USD")
//       //       : formatCurrency(rate, "NGN", "en-NG"),
//       // };

//       await createTransaction(userDate).then(() => {
//         // clear the ref code from the cleint

//         localStorage.removeItem("referralCode");
//         localStorage.removeItem("referralCategory");
//       });

//       console.log("User gift data created", userDate);
//     }
//     // else if (requestPayment) {
//     //   console.log("USER WANTS TO DO A REQUEST TRANSACTION");
//     //   const request =
//     //     sharedGiftId !== "" ? await checkRequestExists(sharedGiftId) : null;
//     //   const requestExists = request?.exists;
//     //   console.log("request exists", requestExists);
//     //   if (request && requestExists) {
//     //     console.log("we are fulfilling request!!!");
//     //     const user = request.user;

//     //     const recieverAmount = Number.parseInt(
//     //       user?.receiver_amount?.replace(/[^\d.]/g, "") || "0"
//     //     );
//     //     const dollar = recieverAmount / Number.parseInt(sharedRate);
//     //     const assetPrice =
//     //       getBaseSymbol(ticker).toLowerCase() != "usdt" ? priceOfAsset : rate;
//     //     // naira converted to asset
//     //     const charge = calculateCharge(
//     //       user?.receiver_amount || "0",
//     //       currentStep.transactionType,
//     //       rate,
//     //       assetPrice
//     //     );

//     //     console.log("Before we continue, charge is:", charge);
//     //     const finalPayable = dollar / Number.parseFloat(assetPrice);
//     //     const paymentAssetEstimate = (finalPayable + charge).toString();

//     //     setPaymentAssetEstimate(paymentAssetEstimate);
//     //     setPaymentNairaEstimate(user?.receiver_amount || "0");
//     //     // const paymentAsset = `${Number.parseFloat(paymentAssetEstimate)
//     //     //   .toFixed(8)
//     //     //   .toString()} ${sharedCrypto}`;

//     //     const userDate = {
//     //       crypto: getBaseSymbol(ticker),
//     //       network: network,
//     //       estimation: estimateAsset,
//     //       Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8),
//     //       charges: charge,
//     //       mode_of_payment: user?.mode_of_payment,
//     //       acct_number: user?.acct_number,
//     //       bank_name: user?.bank_name,
//     //       receiver_name: user?.receiver_name,
//     //       receiver_amount: user?.receiver_amount,
//     //       crypto_sent: paymentAsset,
//     //       wallet_address: activeWallet,
//     //       Date: user?.Date,
//     //       status: "Processing",
//     //       receiver_phoneNumber: user?.receiver_phoneNumber,
//     //       customer_phoneNumber: formatPhoneNumber(phoneNumber),
//     //       transac_id: user?.transac_id,
//     //       request_id: user?.request_id,
//     //       settle_walletLink: null,
//     //       chat_id: user?.chat_id,
//     //       current_rate: formatCurrency(rate, "NGN", "en-NG"),
//     //       merchant_rate: user?.merchant_rate,
//     //       profit_rate: user?.profit_rate,
//     //       name: null,
//     //       asset_price:
//     //         crypto.toLowerCase() != "usdt"
//     //           ? formatCurrency(assetPrice, "USD")
//     //           : formatCurrency(rate, "NGN", "en-NG"),
//     //     };

//     //     console.log("UserData", userDate);
//     //     await updateRequest(sharedGiftId, userDate);
//     //     const transactionID = Number.parseInt(user?.transac_id || "0");
//     //     const requestID = Number.parseInt(user?.request_id || "0");

//     //     console.log(
//     //       "Lets see sharedPaymentAssetEstimate ",
//     //       paymentAssetEstimate
//     //     );

//     //     console.log(
//     //       "Lets see sharedPaymentNairaEstimate ",
//     //       user?.receiver_amount ?? "0"
//     //     );

//     //     displaySendPayment();
//     //     // addChatMessages,
//     //     // nextStep,
//     //     // activeWallet ?? "",
//     //     // sharedCrypto,
//     //     // paymentAssetEstimate,
//     //     // (user?.receiver_amount ?? "0").replace(/[^\d.]/g, ""),
//     //     // transactionID,
//     //     // sharedNetwork,
//     //     // sharedPaymentMode,
//     //     // ethConnect,
//     //     // 0,
//     //     // requestID,
//     //     // lastAssignedTime
//     //     setLoading(false);
//     //     // nextStep();
//     //     helloMenu("hi");
//     //   } else {
//     //     // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
//     //     console.log("we are creating a requests!!!");
//     //     const transactionID = generateTransactionId();
//     //     const requestID = generateTransactionId();
//     //     setSharedTransactionId(transactionID.toString());
//     //     window.localStorage.setItem("transactionID", transactionID.toString());
//     //     const date = getFormattedDateTime();

//     //     setLoading(false);
//     //     // let's save the transaction details to db
//     //     const userDate = {
//     //       crypto: null,
//     //       network: null,
//     //       estimation: estimateAsset,
//     //       Amount: null,
//     //       charges: null,
//     //       mode_of_payment: currentStep.transactionType,
//     //       acct_number: transaction?.acct_number,
//     //       bank_name: transaction?.bank_name,
//     //       receiver_name: transaction?.receiver_name,
//     //       receiver_amount: formatCurrency(paymentNairaEstimate, "NGN", "en-NG"),
//     //       crypto_sent: null,
//     //       wallet_address: null,
//     //       Date: date,
//     //       status: "Processing",
//     //       receiver_phoneNumber: formatPhoneNumber(phoneNumber),
//     //       customer_phoneNumber: null,
//     //       transac_id: transactionID.toString(),
//     //       request_id: requestID.toString(),
//     //       settle_walletLink: null,
//     //       chat_id: user?.chatId,
//     //       current_rate: formatCurrency(rate, "NGN", "en-NG"),
//     //       merchant_rate: merchantRate,
//     //       profit_rate: profitRate,
//     //       name: null,
//     //       asset_price: null,
//     //     };

//     //     await createTransaction(userDate).then(() => {
//     //       // clear the ref code from the cleint
//     //       localStorage.removeItem("referralCode");
//     //       localStorage.removeItem("referralCategory");
//     //     });

//     //     displaySendPayment();
//     //     // addChatMessages,
//     //     // nextStep,
//     //     // activeWallet ?? "",
//     //     // sharedCrypto,
//     //     // sharedPaymentAssetEstimate,
//     //     // sharedPaymentNairaEstimate,
//     //     // transactionID,
//     //     // sharedNetwork,
//     //     // sharedPaymentMode,
//     //     // ethConnect,
//     //     // 0,
//     //     // requestID,
//     //     // lastAssignedTime
//     //     setLoading(false);
//     //     helloMenu("hi");
//     //   }
//     // }
//     else {
//       console.log("USER WANTS TO MAKE A REGULAR TRX");
//       const transactionID = generateTransactionId();

//       updateTransaction({ transac_id: transactionID.toString() });
//       window.localStorage.setItem("transactionID", transactionID.toString());
//       if (
//         !paymentAssetEstimate ||
//         isNaN(Number.parseFloat(paymentAssetEstimate))
//       ) {
//         console.error("Invalid paymentAssetEstimate:", paymentAssetEstimate);
//         setLoading(false);
//         addMessages([
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

//       const paymentAsset = ` ${Number.parseFloat(paymentAssetEstimate)
//         .toFixed(8)
//         .toString()} ${crypto} `;
//       const date = getFormattedDateTime();

//       // displaySendPayment(
//       //   addChatMessages,
//       //   nextStep,
//       //   activeWallet ?? "",
//       //   sharedCrypto,
//       //   sharedPaymentAssetEstimate,
//       //   sharedPaymentNairaEstimate,
//       //   transactionID,
//       //   sharedNetwork,
//       //   sharedPaymentMode,
//       //   ethConnect,
//       //   0,
//       //   0,
//       //   lastAssignedTime
//       // );

//       setLoading(false);
//       // let's save the transaction details to db
//       const userDate = {
//         crypto: getBaseSymbol(ticker),
//         network: network,
//         estimation: estimateAsset,
//         Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8).toString(),
//         charges: transaction?.charges,
//         mode_of_payment: currentStep.transactionType,
//         acct_number: transaction?.acct_number,
//         bank_name: transaction?.bank_name,
//         receiver_name: transaction?.receiver_name,
//         receiver_amount: formatCurrency(paymentNairaEstimate, "NGN", "en-NG"),
//         crypto_sent: paymentAsset,
//         // wallet_address: activeWallet,
//         Date: date,
//         status: "Processing",
//         customer_phoneNumber: formatPhoneNumber(phoneNumber!),
//         transac_id: transactionID.toString(),
//         settle_walletLink: "",
//         chat_id: appUser?.chatId,
//         current_rate: formatCurrency(rate, "NGN", "en-NG"),
//         merchant_rate: merchantRate,
//         profit_rate: profitRate,
//         name: "",
//         asset_price:
//           crypto.toLowerCase() != "usdt"
//             ? formatCurrency(priceOfAsset, "USD")
//             : formatCurrency(rate, "NGN", "en-NG"),
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
//   } finally {
//     // Clear the lock only if it's our lock (in case another transaction started)
//     if (
//       localStorage.getItem("transaction_in_progress") === transactionLockKey
//     ) {
//       localStorage.removeItem("transaction_in_progress");
//     }
//   }
// }

// export async function processRequestPayment({
//   phoneNumber,
//   activeWallet,
// }: BaseTransactionParams) {
//   console.log("Processing request payment for:", phoneNumber, activeWallet);
//   // Insert your request payment logic here...
// }

// // Process a regular transaction
// export async function processTransfer({
//   phoneNumber,
//   activeWallet,
// }: BaseTransactionParams) {
//   console.log("Processing transfer for:", phoneNumber, activeWallet);
//   // Insert your regular transaction logic here...
// }
// export async function processGift({
//   phoneNumber,
//   activeWallet,
// }: BaseTransactionParams) {
//   console.log("Processing gift for:", phoneNumber, activeWallet);
//   // Insert your regular transaction logic here...
// }
