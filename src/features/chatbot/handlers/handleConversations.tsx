import { MessageType, UserBankData } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";
import {
  displayReportlyPhoneNumber,
  displayReportlyNote,
} from "@/menus/reportly";

import { SetStateAction } from "react";
import { WalletAddress } from "@/lib/wallets/types";
import { stepHandlers } from "./transactionHandlers";
import { StepId } from "@/core/machines/steps";
import { aiChat } from "./general";

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
  const isAIChat = true
    // !greetings.includes(chatInput.trim());
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

    // // channel user to the ai chatbot
    if (isAIChat) {
      await aiChat(addChatMessages, chatInput, setSharedPaymentMode);
      return;
    }

    // channel user to the manual chatbot
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      // goToStep("start");
      if (currentStep !== "start") {
        goToStep("start");
        return;
      }
    }

    console.log({ currentStep });
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
      displayReportlyPhoneNumber,
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
