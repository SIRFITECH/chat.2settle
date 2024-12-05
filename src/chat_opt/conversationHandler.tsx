// import { MessageType } from "../types/general_types";
// import { greetings } from "./chatConstants";
// import {
//   choiceMenu,
//   handleBankAccountNumber,
//   handleCharge,
//   handleCompleteTransactionId,
//   handleConfirmTransaction,
//   handleContinueToPay,
//   handleCryptoPayment,
//   handleCustomerSupportAssurance,
//   handleEnterFraudsterWalletAddress,
//   handleEnterReporterPhoneNumber,
//   handleEnterReporterWalletAddress,
//   handleEstimateAsset,
//   handleGiftRequestId,
//   handleKYCInfo,
//   handleMakeAChoice,
//   handleMakeComplain,
//   handleNetwork,
//   handlePayOptions,
//   handlePhoneNumber,
//   handleRegKYC,
//   handleReporterFarwell,
//   handleReporterName,
//   handleReportlyNote,
//   handleReportlyWelcome,
//   handleSearchBank,
//   handleSelectBank,
//   handleThankForKYCReg,
//   handleTransactionId,
//   handleTransactionProcessing,
//   handleTransferMoney,
//   helloMenu,
// } from "./conversationSteps";

// export const handleConversation = async (chatInput: string, props: any) => {
//   const {
//     addChatMessages,
//     setChatInput,
//     setLoading,
//     currentStep,
//     nextStep,
//     prevStep,
//     goToStep,
//     // ... other necessary props
//   } = props;

//   if (chatInput.trim()) {
//     const newMessage: MessageType = {
//       type: "outgoing",
//       content: <span>{chatInput}</span>,
//       timestamp: new Date(),
//     };
//     addChatMessages([newMessage]);
//     setChatInput("");
//   }

//   if (greetings.includes(chatInput.trim().toLowerCase())) {
//     goToStep("start");
//   }

//   switch (currentStep) {
//     case "start":
//       helloMenu(chatInput, addChatMessages, nextStep);
//       setChatInput("");
//       break;
//     case "chooseAction":
//       choiceMenu(chatInput, addChatMessages, prevStep, nextStep, goToStep);
//       setChatInput("");
//       break;
//     case "transactCrypto":
//       handleMakeAChoice(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "transferMoney":
//       handleTransferMoney(chatInput, addChatMessages, nextStep, prevStep);
//       setChatInput("");
//       break;
//     case "estimateAsset":
//       handleEstimateAsset(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "network":
//       handleNetwork(chatInput, addChatMessages, nextStep, prevStep, goToStep);
//       setChatInput("");
//       break;
//     case "payOptions":
//       handlePayOptions(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "charge":
//       handleCharge(chatInput, addChatMessages, nextStep, setLoading, goToStep);
//       setChatInput("");
//       break;
//     case "enterBankSearchWord":
//       handleSearchBank(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "selectBank":
//       handleSelectBank(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "enterAccountNumber":
//       handleBankAccountNumber(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "continueToPay":
//       handleContinueToPay(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "enterPhone":
//       handlePhoneNumber(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "sendPayment":
//       await handleCryptoPayment(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "confirmTransaction":
//       handleConfirmTransaction(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "paymentProcessing":
//       handleTransactionProcessing(
//         chatInput,
//         addChatMessages,
//         prevStep,
//         nextStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "kycInfo":
//       handleKYCInfo(chatInput, addChatMessages, nextStep, goToStep);
//       setChatInput("");
//       break;
//     case "kycReg":
//       handleRegKYC(chatInput, addChatMessages, nextStep, goToStep);
//       setChatInput("");
//       break;
//     case "thankForKYCReg":
//       handleThankForKYCReg(chatInput, addChatMessages, nextStep, goToStep);
//       setChatInput("");
//       break;
//     case "supportWelcome":
//       handleCustomerSupportAssurance(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "assurance":
//       handleCustomerSupportAssurance(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "entreTrxId":
//       handleTransactionId(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         setLoading,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "makeComplain":
//       handleMakeComplain(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep,
//         setLoading
//       );
//       setChatInput("");
//       break;
//     case "completeTransactionId":
//       handleCompleteTransactionId(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep
//       );
//       setChatInput("");
//       break;
//     case "giftFeedBack":
//       handleGiftRequestId(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep,
//         setLoading
//       );
//       setChatInput("");
//       break;
//     case "makeReport":
//       handleReportlyWelcome(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "reporterName":
//       handleReporterName(chatInput, addChatMessages, nextStep, goToStep);
//       setChatInput("");
//       break;
//     case "reporterPhoneNumber":
//       handleEnterReporterPhoneNumber(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "reporterWallet":
//       handleEnterReporterWalletAddress(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "fraudsterWallet":
//       handleEnterFraudsterWalletAddress(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "reportlyNote":
//       handleReportlyNote(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep
//       );
//       setChatInput("");
//       break;
//     case "reporterFarwell":
//       handleReporterFarwell(
//         chatInput,
//         addChatMessages,
//         nextStep,
//         prevStep,
//         goToStep,
//         setLoading
//       );
//       setChatInput("");
//       break;
//     default:
//       addChatMessages([
//         {
//           type: "incoming",
//           content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
//           timestamp: new Date(),
//         },
//       ]);
//       break;
//   }
// };
