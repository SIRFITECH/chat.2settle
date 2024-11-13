// import { MessageType } from "@/types/general_types";

//   export const handleConversation = async (chatInput: any,
//     //  chatInput: string,
//   {
//     currentStep,
//     nextStep,
//     prevStep,
//     goToStep,
//     addChatMessages,
//     setLoading,
//     sharedState,
//     setSharedState,
//   }: {
//     currentStep: string;
//     nextStep: (step: string) => void;
//     prevStep: () => void;
//     goToStep: (step: string) => void;
//     addChatMessages: (messages: MessageType[]) => void;
//     setLoading: (loading: boolean) => void;
//     sharedState: any;
//     setSharedState: (state: any) => void;
//   }
//   ) => {
//     if (chatInput.trim()) {
//       const newMessage: MessageType = {
//         type: "outgoing",
//         content: <span>{chatInput}</span>,
//         timestamp: new Date(),
//       };
//       addChatMessages([newMessage]);
//       setChatInput("");
//     }

//     if (greetings.includes(chatInput.trim().toLowerCase())) {
//       goToStep("start");
//     }

//     switch (currentStep) {
//       case "start":
//         console.log("current step is start");
//         helloMenu(chatInput);
//         setChatInput("");
//         break;

//       case "chooseAction":
//         console.log("current step is chooseAction");
//         choiceMenu(chatInput);
//         setChatInput("");
//         break;

//       case "transactCrypto":
//         console.log("current step is transactCrypto");
//         handleMakeAChoice(chatInput);
//         setChatInput("");
//         break;

//       case "transferMoney":
//         console.log("Current step is transferMoney ");
//         handleTransferMoney(chatInput);
//         setChatInput("");
//         break;

//       case "estimateAsset":
//         console.log("Current step is estimateAsset ");
//         handleEstimateAsset(chatInput);
//         setChatInput("");
//         break;

//       case "network":
//         console.log("Current step is network ");
//         handleNetwork(chatInput);
//         setChatInput("");
//         break;

//       case "payOptions":
//         console.log("Current step is payOptions ");
//         handlePayOptions(chatInput);
//         setChatInput("");
//         break;

//       case "charge":
//         console.log("Current step is charge ");
//         handleCharge(chatInput);
//         setChatInput("");
//         break;

//       case "enterBankSearchWord":
//         console.log("Current step is enterBankSearchWord");
//         let wantsToClaimGift = sharedPaymentMode.toLowerCase() === "claim gift";
//         let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
//         let wantsToRequestPayment =
//           sharedPaymentMode.toLowerCase() === "request";
//         let wnatsToTransactCrypto =
//           sharedPaymentMode.toLowerCase() === "transfermoney";

//         wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
//           ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
//             console.log("PAYMENT MODE IS:", sharedPaymentMode),
//             handleSearchBank(chatInput))
//           : (console.log(
//               "CURRENT STEP IS continueToPay IN enterBankSearchWord "
//             ),
//             console.log("PAYMENT MODE IS:", sharedPaymentMode),
//             handleContinueToPay(chatInput));
//         setChatInput("");
//         break;

//       case "selectBank":
//         console.log("Current step is selectBank ");
//         handleSelectBank(chatInput);
//         setChatInput("");
//         break;

//       case "enterAccountNumber":
//         console.log("Current step is enterAccountNumber ");
//         handleBankAccountNumber(chatInput);
//         setChatInput("");
//         break;

//       case "continueToPay":
//         console.log("Current step is continueToPay ");
//         handleContinueToPay(chatInput);
//         setChatInput("");
//         break;

//       case "enterPhone":
//         console.log("Current step is enterPhone ");
//         handlePhoneNumber(chatInput);
//         setChatInput("");
//         break;

//       case "sendPayment":
//         console.log("Current step is sendPayment ");
//         await handleCryptoPayment(chatInput);
//         setChatInput("");
//         break;

//       case "confirmTransaction":
//         console.log("Current step is confirmTransaction ");
//         handleConfirmTransaction(chatInput);
//         setChatInput("");

//         break;

//       case "paymentProcessing":
//         console.log("Current step is paymentProcessing ");
//         handleTransactionProcessing(chatInput);
//         setChatInput("");
//         break;

//       case "kycInfo":
//         console.log("Current step is kycInfo ");
//         handleKYCInfo(chatInput);
//         setChatInput("");
//         break;

//       case "kycReg":
//         console.log("Current step is kycReg ");
//         handleRegKYC(chatInput);
//         setChatInput("");
//         break;

//       case "thankForKYCReg":
//         console.log("Current step is thankForKYCReg ");
//         handleThankForKYCReg(chatInput);
//         setChatInput("");
//         break;

//       case "supportWelcome":
//         console.log("Current step is supportWelcome ");
//         displayCustomerSupportWelcome(addChatMessages, nextStep);
//         setChatInput("");
//         break;

//       case "assurance":
//         console.log("Current step is assurance ");
//         handleCustomerSupportAssurance(chatInput);
//         setChatInput("");
//         break;

//       case "entreTrxId":
//         console.log("Current step is entreTrxId ");
//         handleTransactionId(chatInput);
//         setChatInput("");
//         break;

//       case "makeComplain":
//         console.log("Current step is makeComplain ");
//         handleMakeComplain(chatInput);
//         setChatInput("");
//         break;

//       case "completeTransactionId":
//         console.log("Current step is completeTransactionId ");
//         handleCompleteTransactionId(chatInput);
//         setChatInput("");
//         break;

//       case "giftFeedBack":
//         console.log("Current step is giftFeedBack ");
//         handleGiftId(chatInput);
//         setChatInput("");
//         break;

//       case "completetrxWithID":
//         console.log("Current step is trxIDFeedback ");
//         // handleReportlyWelcome(chatInput);
//         setChatInput("");
//         break;

//       case "makeReport":
//         console.log("Current step is makeReport ");
//         handleReportlyWelcome(chatInput);
//         setChatInput("");
//         break;

//       case "reporterName":
//         console.log("Current step is reporterName ");
//         handleReporterName(chatInput);
//         setChatInput("");
//         break;

//       case "reporterPhoneNumber":
//         console.log("Current step is reporterPhoneNumber ");
//         handleEnterReporterPhoneNumber(chatInput);
//         setChatInput("");
//         break;

//       case "reporterWallet":
//         console.log("Current step is reporterWallet");
//         handleEnterReporterWalletAddress(chatInput);
//         setChatInput("");
//         break;

//       case "fraudsterWallet":
//         console.log("Current step is fraudsterWallet");
//         handleEnterFraudsterWalletAddress(chatInput);
//         setChatInput("");
//         break;

//       case "reportlyNote":
//         console.log("Current step is reportlyNote");
//         handleReportlyNote(chatInput);
//         setChatInput("");
//         break;

//       case "reporterFarwell":
//         console.log("Current step is reporterFarwell");
//         handleReporterFarwell(chatInput);

//         setChatInput("");
//         break;

//       default:
//         addChatMessages([
//           {
//             type: "incoming",
//             content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
//             timestamp: new Date(),
//           },
//         ]);
//         setChatInput("");
//         break;
//     }
//   };