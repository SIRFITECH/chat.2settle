// import {
//   choiceMenu,
//   helloMenu,
// } from "@/features/chatbot/handlers/genConversationHandlers";

// type StepHandlerFn = (chatInput: any) => void;
// const StepHandler: Record<string, StepHandlerFn> = {
//   start: helloMenu,
//   chooseAction: choiceMenu,
//   // transactCrypto: handleMakeAChoice,
//   // transferMoney: handleTransferMoney,
//   // estimateAsset: handleEstimateAsset,
//   // network: handleNetwork,
//   // payOptions: handlePayOptions,
//   // charge: handleCharge,
//   // enterBankSearchWord: (input) => {
//   //   let wantsToClaimGift = sharedPaymentMode.toLowerCase() === "claim gift";
//   //   let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
//   //   let wantsToRequestPayment = sharedPaymentMode.toLowerCase() === "request";
//   //   let wantsToTransactCrypto =
//   //     sharedPaymentMode.toLowerCase() === "transfermoney";

//   //   wantsToClaimGift || wantsToSendGift || wantsToRequestPayment
//   //     ? handleSearchBank(input)
//   //     : handleContinueToPay(input);
//   // },
//   // selectBank: handleSelectBank,
//   // enterAccountNumber: handleBankAccountNumber,
//   // continueToPay: handleContinueToPay,
//   // enterPhone: handlePhoneNumber,
//   // sendPayment: async (input) => await handleCryptoPayment(input),
//   // confirmTransaction: handleConfirmTransaction,
//   // paymentProcessing: handleTransactionProcessing,
//   // kycInfo: handleKYCInfo,
//   // kycReg: handleRegKYC,
//   // thankForKYCReg: handleThankForKYCReg,
//   // supportWelcome: () =>
//   //   displayCustomerSupportWelcome(addChatMessages, nextStep),
//   // assurance: handleCustomerSupportAssurance,
//   // entreTrxId: handleTransactionId,
//   // makeComplain: handleMakeComplain,
//   // completeTransactionId: handleCompleteTransactionId,
//   // giftFeedBack: handleGiftRequestId,
//   // makeReport: handleReportlyWelcome,
//   // reporterName: handleReporterName,
//   // reporterPhoneNumber: handleEnterReporterPhoneNumber,
//   // reporterWallet: handleEnterReporterWalletAddress,
//   // fraudsterWallet: handleEnterFraudsterWalletAddress,
//   // reportlyNote: handleReportlyNote,
//   // reporterFarwell: handleReporterFarwell,
// };

// export default StepHandler;
