import { MessageType, UserBankData } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";
import { choiceMenu, helloMenu } from "./general";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import {
  displayReportlyPhoneNumber,
  displayReportlyNote,
} from "@/menus/reportly";
import {
  handleSearchBank,
  handleSelectBank,
  handleBankAccountNumber,
} from "./banking";
import {
  handleCompleteTransactionId,
  handleGiftRequestId,
} from "./completeTransaction";
import {
  handleReportlyWelcome,
  handleReporterName,
  handleEnterReporterPhoneNumber,
  handleEnterReporterWalletAddress,
  handleEnterFraudsterWalletAddress,
  handleReportlyNote,
  handleReporterFarwell,
} from "./reportly";
import {
  handleKYCInfo,
  handleRegKYC,
  handleThankForKYCReg,
  handleCustomerSupportAssurance,
  handleTransactionId,
  handleMakeComplain,
} from "./support";
import {
  handleMakeAChoice,
  handleTransferMoney,
  handleEstimateAsset,
  handleNetwork,
  handlePayOptions,
  handleCharge,
} from "./transact";
import {
  handleContinueToPay,
  handlePhoneNumber,
  handleCryptoPayment,
  handleConfirmTransaction,
  handleTransactionProcessing,
} from "./transactionClosing";
import { SetStateAction } from "react";
import { WalletAddress } from "@/lib/wallets/types";
import { stepHandlers } from "./transactionHandlers";
import { StepId } from "@/core/transation_state_machine/steps";

export const handleConversation = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  currentStep: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  sharedGiftId: string,
  telFirstName: string,
  sharedPaymentMode: string,
  sharedRate: string,
  sharedCrypto: string,
  sharedTicker: string,
  sharedAssetPrice: string,
  sharedEstimateAsset: string,
  sharedNetwork: string,
  sharedCharge: string,
  sharedPaymentAssetEstimate: string,
  sharedPaymentNairaEstimate: string,
  sharedNairaCharge: string,
  sharedSelectedBankCode: string,
  sharedSelectedBankName: string,
  sharedAmount: string,
  sharedBankCodes: string[],
  sharedBankNames: string[],
  ethConnect: boolean,
  sharedTransactionId: string,
  procesingStatus: string,
  cancelledStatus: string,
  reporterName: string,
  reporterPhoneNumber: string,
  reporterWalletAddress: string,
  fraudsterWalletAddress: string,
  sharedReportlyReportType: string,
  reportId: string,
  formattedRate: string,
  setSharedAmount: (sharedAmount: string) => void,
  setSharedCharge: React.Dispatch<SetStateAction<string>>,
  setSharedPaymentAssetEstimate: React.Dispatch<SetStateAction<string>>,
  setSharedPaymentNairaEstimate: React.Dispatch<SetStateAction<string>>,
  setSharedNairaCharge: React.Dispatch<SetStateAction<string>>,
  setSharedChargeForDB: React.Dispatch<SetStateAction<string>>,
  updateBankData: (newData: Partial<UserBankData>) => void,
  setChatInput: (input: string) => void,
  goToStep: (step: StepId) => void,
  nextStep: () => void,
  prevStep: () => void,
  setSharedPaymentMode: (mode: string) => void,
  setSharedTicker: (ticker: string) => void,
  setSharedCrypto: (crypto: string) => void,
  setSharedNetwork: (network: string) => void,
  setSharedWallet: (wallet: string) => void,
  setSharedEstimateAsset: (network: string) => void,
  setSharedGiftId: React.Dispatch<React.SetStateAction<string>>,
  setSharedBankNames: React.Dispatch<React.SetStateAction<string[]>>,
  setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>,
  setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>,
  setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<SetStateAction<boolean>>,
  setSharedPhone: React.Dispatch<React.SetStateAction<string>>,
  setSharedTransactionId: React.Dispatch<React.SetStateAction<string>>,
  setSharedReportlyReportType: React.Dispatch<React.SetStateAction<string>>,
  setReporterName: React.Dispatch<React.SetStateAction<string>>,
  setReporterPhoneNumber: React.Dispatch<React.SetStateAction<string>>,
  setReportId: React.Dispatch<React.SetStateAction<string>>,
  setReporterWalletAddress: React.Dispatch<React.SetStateAction<string>>,
  setFraudsterWalletAddress: React.Dispatch<React.SetStateAction<string>>,
  setDescriptionNote: React.Dispatch<React.SetStateAction<string>>,
  onError: ((error: Error) => void) | undefined,
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) => Promise<void>
) => {
  setLoading(true);
  try {
    if (chatInput.trim()) {
      const newMessage: MessageType = {
        type: "outgoing",
        content: <span>{chatInput}</span>,
        timestamp: new Date(),
      };
      addChatMessages([newMessage]);
      setChatInput("");
    }

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
    }

    await stepHandlers[currentStep as StepId]({
      addChatMessages,
      chatInput,
      currentStep: currentStep as StepId,
      walletIsConnected,
      wallet,
      sharedGiftId,
      telFirstName,
      sharedPaymentMode,
      sharedRate,
      sharedCrypto,
      sharedTicker,
      sharedAssetPrice,
      sharedEstimateAsset,
      sharedNetwork,
      sharedCharge,
      sharedPaymentAssetEstimate,
      sharedPaymentNairaEstimate,
      sharedNairaCharge,
      sharedSelectedBankCode,
      sharedSelectedBankName,
      sharedAmount,
      sharedBankCodes,
      sharedBankNames,
      ethConnect,
      sharedTransactionId,
      procesingStatus,
      cancelledStatus,
      reporterName,
      reporterPhoneNumber,
      reporterWalletAddress,
      fraudsterWalletAddress,
      sharedReportlyReportType,
      reportId,
      formattedRate,
      setSharedAmount,
      setSharedCharge,
      setSharedPaymentAssetEstimate,
      setSharedPaymentNairaEstimate,
      setSharedNairaCharge,
      setSharedChargeForDB,
      updateBankData,
      setChatInput,
      goToStep,
      nextStep,
      prevStep,
      setSharedPaymentMode,
      setSharedTicker,
      setSharedCrypto,
      setSharedNetwork,
      setSharedWallet,
      setSharedEstimateAsset,
      setSharedGiftId,
      setSharedBankNames,
      setSharedBankCodes,
      setSharedSelectedBankCode,
      setSharedSelectedBankName,
      setLoading,
      setSharedPhone,
      setSharedTransactionId,
      setSharedReportlyReportType,
      setReporterName,
      setReporterPhoneNumber,
      setReportId,
      setReporterWalletAddress,
      setFraudsterWalletAddress,
      setDescriptionNote,
      onError,
      processTransaction,
    });

    // switch (currentStep) {
    //   case "start":
    //     console.log("current step is start");
    //     // Welcome message for the user with instruction on how to start a chat
    //     helloMenu(
    //       addChatMessages,
    //       chatInput,
    //       nextStep,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     setSharedPaymentMode("");
    //     break;

    //   case "chooseAction":
    //     console.log("current step is chooseAction");
    //     // Allow user to choose whether to use wallet or not
    //     choiceMenu(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       sharedRate,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "transactCrypto":
    //     console.log("current step is transactCrypto");
    //     /**
    //      Allow user to choose what action they want to perform -
    //       1. Transact Crypto
    //       2. Request for paycard
    //       3. Customer support
    //       4. Transaction ID
    //       5. Reportly
    //       *  */
    //     handleMakeAChoice(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "transferMoney":
    //     console.log("Current step is transferMoney ", sharedPaymentMode);
    //     // If user choose to transact crypto - transfer money, gift or request payment
    //     handleTransferMoney(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       sharedPaymentMode,
    //       sharedRate,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode,
    //       setSharedWallet,
    //       setSharedEstimateAsset,
    //       setSharedGiftId,
    //       setLoading
    //     );
    //     setChatInput("");
    //     break;

    //   case "estimateAsset":
    //     console.log("Current step is estimateAsset ");
    //     // Allow user to choose estimate asset - BTC, ETH, BNB, TRX  or USDT
    //     handleEstimateAsset(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       sharedPaymentMode,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode,
    //       setSharedTicker,
    //       setSharedCrypto,
    //       setSharedNetwork
    //     );
    //     setChatInput("");
    //     break;

    //   case "network":
    //     console.log("Current step is network ");
    //     // User chooses the usdt network they want to use
    //     handleNetwork(
    //       addChatMessages,
    //       chatInput,
    //       sharedPaymentMode,
    //       sharedGiftId,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedTicker,
    //       setSharedCrypto,
    //       setSharedNetwork,
    //       setSharedTicker
    //     );
    //     setChatInput("");
    //     break;

    //   case "payOptions":
    //     console.log("Current step is payOptions ");
    //     // Allow user to choose payment option - naira, dollar or crypto

    //     handlePayOptions(
    //       addChatMessages,
    //       chatInput,
    //       sharedPaymentMode,
    //       sharedCrypto,
    //       sharedNetwork,
    //       sharedRate,
    //       sharedTicker,
    //       sharedAssetPrice,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedEstimateAsset,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "charge":
    //     console.log("Current step is charge ");
    //     // Allow user to select how they want to pay platform fees
    //     handleCharge(
    //       addChatMessages,
    //       chatInput,
    //       sharedPaymentMode,
    //       sharedEstimateAsset,
    //       sharedCrypto,
    //       sharedNetwork,
    //       sharedRate,
    //       sharedAssetPrice,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedAmount,
    //       setSharedCharge,
    //       setSharedPaymentAssetEstimate,
    //       setSharedPaymentNairaEstimate,
    //       setSharedNairaCharge,
    //       setSharedChargeForDB,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "enterBankSearchWord":
    //     console.log("Current step is enterBankSearchWord");
    //     // handle user bank search - using first 3 letters of the user bank
    //     let wantsToClaimGift = sharedPaymentMode.toLowerCase() === "claim gift";
    //     let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
    //     let wantsToRequestPayment =
    //       sharedPaymentMode.toLowerCase() === "request";
    //     let wnatsToTransactCrypto =
    //       sharedPaymentMode.toLowerCase() === "transfermoney";

    //     wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
    //       ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
    //         handleSearchBank(
    //           addChatMessages,
    //           chatInput,
    //           sharedCharge,
    //           sharedPaymentMode,
    //           sharedCrypto,
    //           sharedPaymentAssetEstimate,
    //           sharedRate,
    //           sharedPaymentNairaEstimate,
    //           sharedAssetPrice,
    //           sharedEstimateAsset,
    //           sharedNairaCharge,
    //           walletIsConnected,
    //           wallet,
    //           telFirstName || "",
    //           nextStep,
    //           prevStep,
    //           goToStep,
    //           setSharedGiftId,
    //           setSharedPaymentAssetEstimate,
    //           setSharedPaymentNairaEstimate,
    //           setSharedChargeForDB,
    //           setSharedPaymentMode,
    //           setLoading
    //         ))
    //       : (console.log(
    //           "CURRENT STEP IS continueToPay IN enterBankSearchWord "
    //         ),
    //         handleContinueToPay(
    //           addChatMessages,
    //           chatInput,
    //           sharedSelectedBankCode,
    //           sharedSelectedBankName,
    //           sharedPaymentMode,
    //           walletIsConnected,
    //           wallet,
    //           telFirstName,
    //           nextStep,
    //           prevStep,
    //           goToStep,
    //           updateBankData,
    //           setLoading,
    //           setSharedPaymentMode
    //         ));
    //     setChatInput("");
    //     break;

    //   case "selectBank":
    //     console.log("Current step is selectBank ");
    //     // Allow user to select their bank from the populated list of banks
    //     handleSelectBank(
    //       addChatMessages,
    //       chatInput,
    //       sharedPaymentMode,
    //       sharedCrypto,
    //       sharedAmount,
    //       sharedRate,
    //       sharedAssetPrice,
    //       sharedEstimateAsset,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedBankNames,
    //       setSharedPaymentAssetEstimate,
    //       setSharedPaymentNairaEstimate,
    //       setSharedChargeForDB,
    //       setSharedCharge,
    //       setSharedNairaCharge,
    //       setSharedBankCodes,
    //       setSharedPaymentMode,
    //       setLoading
    //     );
    //     setChatInput("");
    //     break;

    //   case "enterAccountNumber":
    //     console.log("Current step is enterAccountNumber ");
    //     // Allow user to enter their bank number
    //     handleBankAccountNumber(
    //       addChatMessages,
    //       chatInput,
    //       sharedBankCodes,
    //       sharedBankNames,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedBankCodes,
    //       setSharedSelectedBankCode,
    //       setSharedSelectedBankName,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "continueToPay":
    //     console.log("Current step is continueToPay ");
    //     // Allow user to confirm their bank details
    //     handleContinueToPay(
    //       addChatMessages,
    //       chatInput,
    //       sharedSelectedBankCode,
    //       sharedSelectedBankName,
    //       sharedPaymentMode,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       updateBankData,
    //       setLoading,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "enterPhone":
    //     console.log("Current step is enterPhone ");
    //     // Ask users to provide their phone number
    //     handlePhoneNumber(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "sendPayment":
    //     console.log("Current step is sendPayment ");
    //     // Generate and display wallet for the user to make payment
    //     await handleCryptoPayment(
    //       addChatMessages,
    //       chatInput,
    //       sharedCrypto,
    //       sharedNetwork,
    //       sharedPaymentMode,
    //       ethConnect,
    //       sharedPaymentAssetEstimate,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       setSharedPhone,
    //       processTransaction,
    //       nextStep,
    //       goToStep,
    //       setLoading,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "confirmTransaction":
    //     console.log("Current step is confirmTransaction ");
    //     // Allow user to confirm that they have made the payment
    //     handleConfirmTransaction(
    //       addChatMessages,
    //       chatInput,
    //       sharedTransactionId,
    //       procesingStatus,
    //       cancelledStatus,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       setSharedTransactionId,
    //       setLoading,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");

    //     break;

    //   case "paymentProcessing":
    //     console.log("Current step is paymentProcessing ");
    //     // Allow user to confirm if they have gotten their payment or contact support otherwise
    //     handleTransactionProcessing(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;
    //   // Allow user to enter their KYC info for paycard
    //   case "kycInfo":
    //     console.log("Current step is kycInfo ");
    //     handleKYCInfo(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "kycReg":
    //     console.log("Current step is kycReg ");
    //     // Allow user to register with their KYC for paycard
    //     handleRegKYC(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "thankForKYCReg":
    //     console.log("Current step is thankForKYCReg ");
    //     // conclude for the paycard reg
    //     handleThankForKYCReg(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "supportWelcome":
    //     console.log("Current step is supportWelcome ");
    //     // Welcome user when they want reach support
    //     displayCustomerSupportWelcome(addChatMessages, nextStep);
    //     setChatInput("");
    //     break;

    //   case "assurance":
    //     console.log("Current step is assurance ");
    //     // Give user feed back after they report to suport
    //     handleCustomerSupportAssurance(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       prevStep,
    //       goToStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "entreTrxId":
    //     console.log("Current step is entreTrxId ");
    //     //
    //     handleTransactionId(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       setSharedTransactionId,
    //       setLoading,
    //       setSharedPaymentMode
    //     );

    //     setChatInput("");
    //     break;

    //   case "makeComplain":
    //     console.log("Current step is makeComplain ");
    //     handleMakeComplain(
    //       addChatMessages,
    //       chatInput,
    //       sharedTransactionId,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       goToStep,
    //       goToStep,
    //       prevStep,
    //       setLoading,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "completeTransactionId":
    //     console.log("Current step is completeTransactionId ");
    //     // Allow user to enter gift or request id to complete transaction
    //     handleCompleteTransactionId(
    //       addChatMessages,
    //       chatInput,
    //       formattedRate,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName,
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "giftFeedBack":
    //     console.log("Current step is giftFeedBack ");
    //     handleGiftRequestId(
    //       addChatMessages,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       sharedPaymentMode,
    //       chatInput,
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setSharedPaymentMode,
    //       setSharedGiftId,
    //       setLoading
    //     );
    //     setChatInput("");
    //     break;

    //   case "makeReport":
    //     console.log("Current step is makeReport ");
    //     handleReportlyWelcome(
    //       addChatMessages,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       sharedRate,
    //       chatInput,
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setSharedReportlyReportType,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "reporterName":
    //     console.log("Current step is reporterName ");
    //     handleReporterName(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       setSharedReportlyReportType,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "reporterPhoneNumber":
    //     console.log("Current step is reporterPhoneNumber ");
    //     handleEnterReporterPhoneNumber(
    //       addChatMessages,
    //       chatInput,
    //       reporterName,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       setReporterName,
    //       displayReportlyPhoneNumber,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "reporterWallet":
    //     console.log("Current step is reporterWallet");
    //     handleEnterReporterWalletAddress(
    //       addChatMessages,
    //       chatInput,
    //       reporterPhoneNumber,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setReporterPhoneNumber,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "fraudsterWallet":
    //     console.log("Current step is fraudsterWallet");
    //     handleEnterFraudsterWalletAddress(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setReportId,
    //       setReporterWalletAddress,
    //       displayReportlyPhoneNumber,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "reportlyNote":
    //     console.log("Current step is reportlyNote");
    //     handleReportlyNote(
    //       addChatMessages,
    //       chatInput,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setFraudsterWalletAddress,
    //       displayReportlyNote,
    //       setSharedPaymentMode
    //     );
    //     setChatInput("");
    //     break;

    //   case "reporterFarwell":
    //     console.log("Current step is reporterFarwell");
    //     handleReporterFarwell(
    //       addChatMessages,
    //       chatInput,
    //       reporterName,
    //       reporterPhoneNumber,
    //       reporterWalletAddress,
    //       fraudsterWalletAddress,
    //       sharedReportlyReportType,
    //       reportId,
    //       walletIsConnected,
    //       wallet,
    //       telFirstName || "",
    //       nextStep,
    //       goToStep,
    //       prevStep,
    //       setDescriptionNote,
    //       setReporterPhoneNumber,
    //       setReporterWalletAddress,
    //       setFraudsterWalletAddress,
    //       setReporterName,
    //       setLoading,
    //       setSharedPaymentMode
    //     );

    //     setChatInput("");
    //     break;

    //   default:
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     setChatInput("");
    //     break;
    // }
  } catch (error) {
    console.error("Error in conversation:", error);
    onError?.(
      error instanceof Error ? error : new Error("An unknown error occurred")
    );
    addChatMessages([
      {
        type: "incoming",
        content:
          "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setLoading(false);
  }
};
