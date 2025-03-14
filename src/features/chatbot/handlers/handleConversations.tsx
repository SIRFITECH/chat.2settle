import { MessageType, UserBankData } from "@/types/general_types";
import { WalletAddress } from "@/types/wallet_types";
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
import { handleGiftRequestId } from "./gift";
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
  handleCompleteTransactionId,
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
  setSharedAmount: (sharedAmount: string) => void,
  setSharedCharge: React.Dispatch<SetStateAction<string>>,
  setSharedPaymentAssetEstimate: React.Dispatch<SetStateAction<string>>,
  setSharedPaymentNairaEstimate: React.Dispatch<SetStateAction<string>>,
  setSharedNairaCharge: React.Dispatch<SetStateAction<string>>,
  setSharedChargeForDB: React.Dispatch<SetStateAction<string>>,
  updateBankData: (newData: Partial<UserBankData>) => void,
  setChatInput: (input: string) => void,
  goToStep: (step: string) => void,
  nextStep: (step: string) => void,
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

    switch (currentStep) {
      case "start":
        console.log("current step is start");
        helloMenu(
          addChatMessages,
          chatInput,
          nextStep,
          walletIsConnected,
          wallet,
          telFirstName,
          setSharedPaymentMode
        );
        setChatInput("");
        setSharedPaymentMode("");
        break;

      case "chooseAction":
        console.log("current step is chooseAction");

        choiceMenu(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          sharedRate,
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "transactCrypto":
        console.log("current step is transactCrypto");

        handleMakeAChoice(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "transferMoney":
        console.log("Current step is transferMoney ");

        handleTransferMoney(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          sharedPaymentMode,
          sharedRate,
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode,
          setSharedWallet,
          setSharedEstimateAsset
        );
        setChatInput("");
        break;

      case "estimateAsset":
        console.log("Current step is estimateAsset ");

        handleEstimateAsset(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          sharedPaymentMode,
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode,
          setSharedTicker,
          setSharedCrypto,
          setSharedNetwork
        );
        setChatInput("");
        break;

      case "network":
        console.log("Current step is network ");

        handleNetwork(
          addChatMessages,
          chatInput,
          sharedPaymentMode,
          sharedGiftId,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedTicker,
          setSharedCrypto,
          setSharedNetwork,
          setSharedTicker
        );
        setChatInput("");
        break;

      case "payOptions":
        console.log("Current step is payOptions ");

        handlePayOptions(
          addChatMessages,
          chatInput,
          sharedPaymentMode,
          sharedCrypto,
          sharedNetwork,
          sharedRate,
          sharedTicker,
          sharedAssetPrice,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedEstimateAsset,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "charge":
        console.log("Current step is charge ");

        handleCharge(
          addChatMessages,
          chatInput,
          sharedPaymentMode,
          sharedEstimateAsset,
          sharedCrypto,
          sharedNetwork,
          sharedRate,
          sharedAssetPrice,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedAmount,
          setSharedCharge,
          setSharedPaymentAssetEstimate,
          setSharedPaymentNairaEstimate,
          setSharedNairaCharge,
          setSharedChargeForDB,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "enterBankSearchWord":
        console.log("Current step is enterBankSearchWord");
        let wantsToClaimGift = sharedPaymentMode.toLowerCase() === "claim gift";
        let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
        let wantsToRequestPayment =
          sharedPaymentMode.toLowerCase() === "request";
        let wnatsToTransactCrypto =
          sharedPaymentMode.toLowerCase() === "transfermoney";

        wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
          ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
            handleSearchBank(
              addChatMessages,
              chatInput,
              sharedCharge,
              sharedPaymentMode,
              sharedCrypto,
              sharedPaymentAssetEstimate,
              sharedRate,
              sharedPaymentNairaEstimate,
              sharedAssetPrice,
              sharedEstimateAsset,
              sharedNairaCharge,
              walletIsConnected,
              wallet,
              telFirstName || "",
              nextStep,
              prevStep,
              goToStep,
              setSharedGiftId,
              setSharedPaymentAssetEstimate,
              setSharedPaymentNairaEstimate,
              setSharedChargeForDB,
              setSharedPaymentMode,
              setLoading
            ))
          : (console.log(
              "CURRENT STEP IS continueToPay IN enterBankSearchWord "
            ),
            handleContinueToPay(
              addChatMessages,
              chatInput,
              sharedSelectedBankCode,
              sharedSelectedBankName,
              sharedPaymentMode,
              nextStep,
              prevStep,
              goToStep,
              updateBankData,
              setLoading
            ));
        setChatInput("");
        break;

      case "selectBank":
        console.log("Current step is selectBank ");
        handleSelectBank(
          addChatMessages,
          chatInput,
          sharedPaymentMode,
          sharedCrypto,
          sharedAmount,
          sharedRate,
          sharedAssetPrice,
          sharedEstimateAsset,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedBankNames,
          setSharedPaymentAssetEstimate,
          setSharedPaymentNairaEstimate,
          setSharedChargeForDB,
          setSharedCharge,
          setSharedNairaCharge,
          setSharedBankCodes,
          setSharedPaymentMode,
          setLoading
        );
        setChatInput("");
        break;

      case "enterAccountNumber":
        console.log("Current step is enterAccountNumber ");
        handleBankAccountNumber(
          addChatMessages,
          chatInput,
          sharedBankCodes,
          sharedBankNames,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedBankCodes,
          setSharedSelectedBankCode,
          setSharedSelectedBankName,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "continueToPay":
        console.log("Current step is continueToPay ");

        handleContinueToPay(
          addChatMessages,
          chatInput,
          sharedSelectedBankCode,
          sharedSelectedBankName,
          sharedPaymentMode,
          nextStep,
          prevStep,
          goToStep,
          updateBankData,
          setLoading
        );
        setChatInput("");
        break;

      case "enterPhone":
        console.log("Current step is enterPhone ");

        handlePhoneNumber(
          addChatMessages,
          chatInput,
          nextStep,
          prevStep,
          goToStep
        );
        setChatInput("");
        break;

      case "sendPayment":
        console.log("Current step is sendPayment ");

        await handleCryptoPayment(
          addChatMessages,
          chatInput,
          sharedCrypto,
          sharedNetwork,
          sharedPaymentMode,
          ethConnect,
          sharedPaymentAssetEstimate,
          setSharedPhone,
          processTransaction,
          goToStep,
          setLoading
        );
        setChatInput("");
        break;

      case "confirmTransaction":
        console.log("Current step is confirmTransaction ");

        handleConfirmTransaction(
          addChatMessages,
          chatInput,
          sharedTransactionId,
          procesingStatus,
          cancelledStatus,
          nextStep,
          goToStep,
          setSharedTransactionId,
          setLoading
        );
        setChatInput("");

        break;

      case "paymentProcessing":
        console.log("Current step is paymentProcessing ");
        handleTransactionProcessing(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          prevStep,
          goToStep,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "kycInfo":
        console.log("Current step is kycInfo ");
        handleKYCInfo(addChatMessages, chatInput, nextStep, goToStep);
        setChatInput("");
        break;

      case "kycReg":
        console.log("Current step is kycReg ");
        handleRegKYC(addChatMessages, chatInput, nextStep, goToStep);
        setChatInput("");
        break;

      case "thankForKYCReg":
        console.log("Current step is thankForKYCReg ");
        handleThankForKYCReg(addChatMessages, chatInput, nextStep, goToStep);
        setChatInput("");
        break;

      case "supportWelcome":
        console.log("Current step is supportWelcome ");
        displayCustomerSupportWelcome(addChatMessages, nextStep);
        setChatInput("");
        break;

      case "assurance":
        console.log("Current step is assurance ");
        handleCustomerSupportAssurance(
          addChatMessages,
          chatInput,
          nextStep,
          prevStep,
          goToStep
        );
        setChatInput("");
        break;

      case "entreTrxId":
        console.log("Current step is entreTrxId ");
        handleTransactionId(
          addChatMessages,
          chatInput,
          nextStep,
          goToStep,
          setSharedTransactionId,
          setLoading
        );

        setChatInput("");
        break;

      case "makeComplain":
        console.log("Current step is makeComplain ");
        handleMakeComplain(
          addChatMessages,
          chatInput,
          sharedTransactionId,
          goToStep,
          goToStep,
          prevStep,
          setLoading
        );
        setChatInput("");
        break;

      case "completeTransactionId":
        console.log("Current step is completeTransactionId ");
        handleCompleteTransactionId(
          addChatMessages,
          chatInput,
          nextStep,
          goToStep,
          prevStep,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "giftFeedBack":
        console.log("Current step is giftFeedBack ");
        handleGiftRequestId(
          addChatMessages,
          walletIsConnected,
          wallet,
          telFirstName || "",
          sharedPaymentMode,
          chatInput,
          nextStep,
          goToStep,
          prevStep,
          setSharedPaymentMode,
          setSharedGiftId,
          setLoading
        );
        setChatInput("");
        break;

      case "makeReport":
        console.log("Current step is makeReport ");
        handleReportlyWelcome(
          addChatMessages,
          walletIsConnected,
          wallet,
          telFirstName || "",
          sharedRate,
          chatInput,
          nextStep,
          goToStep,
          prevStep,
          setSharedReportlyReportType,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "reporterName":
        console.log("Current step is reporterName ");
        handleReporterName(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          setSharedReportlyReportType,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "reporterPhoneNumber":
        console.log("Current step is reporterPhoneNumber ");
        handleEnterReporterPhoneNumber(
          addChatMessages,
          chatInput,
          reporterName,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          setReporterName,
          displayReportlyPhoneNumber,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "reporterWallet":
        console.log("Current step is reporterWallet");
        handleEnterReporterWalletAddress(
          addChatMessages,
          chatInput,
          reporterPhoneNumber,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          prevStep,
          setReporterPhoneNumber,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "fraudsterWallet":
        console.log("Current step is fraudsterWallet");
        handleEnterFraudsterWalletAddress(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          prevStep,
          setReportId,
          setReporterWalletAddress,
          displayReportlyPhoneNumber,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "reportlyNote":
        console.log("Current step is reportlyNote");
        handleReportlyNote(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          prevStep,
          setFraudsterWalletAddress,
          displayReportlyNote,
          setSharedPaymentMode
        );
        setChatInput("");
        break;

      case "reporterFarwell":
        console.log("Current step is reporterFarwell");
        handleReporterFarwell(
          addChatMessages,
          chatInput,
          reporterName,
          reporterPhoneNumber,
          reporterWalletAddress,
          fraudsterWalletAddress,
          sharedReportlyReportType,
          reportId,
          walletIsConnected,
          wallet,
          telFirstName || "",
          nextStep,
          goToStep,
          prevStep,
          setDescriptionNote,
          setReporterPhoneNumber,
          setReporterWalletAddress,
          setFraudsterWalletAddress,
          setReporterName,
          setLoading,
          setSharedPaymentMode
        );

        setChatInput("");
        break;

      default:
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
            timestamp: new Date(),
          },
        ]);
        setChatInput("");
        break;
    }
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
