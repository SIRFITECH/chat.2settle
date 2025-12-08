import { StepId } from "@/core/transation_state_machine/steps";
import { WalletAddress } from "@/lib/wallets/types";
import { MessageType, UserBankData } from "@/types/general_types";
import { SetStateAction } from "react";
import { choiceMenu, helloMenu } from "./general";
import {
  handleCharge,
  handleEstimateAsset,
  handleMakeAChoice,
  handleNetwork,
  handlePayOptions,
  handleTransferMoney,
} from "./transact";
import {
  handleBankAccountNumber,
  handleSearchBank,
  handleSelectBank,
} from "./banking";
import {
  handleConfirmTransaction,
  handleContinueToPay,
  handleCryptoPayment,
  handlePhoneNumber,
  handleTransactionProcessing,
} from "./transactionClosing";
import {
  handleCustomerSupportAssurance,
  handleKYCInfo,
  handleMakeComplain,
  handleThankForKYCReg,
  handleTransactionId,
} from "./support";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import {
  handleCompleteTransactionId,
  handleGiftRequestId,
} from "./completeTransaction";
import {
  handleEnterFraudsterWalletAddress,
  handleEnterReporterPhoneNumber,
  handleEnterReporterWalletAddress,
  handleReporterFarwell,
  handleReporterName,
  handleReportlyNote,
  handleReportlyWelcome,
} from "./reportly";

type HandlerProps = {
  currentStep: StepId;
  chatInput: string;
  addChatMessages: (messages: MessageType[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: StepId) => void;

  // details to be eliminated later
  walletIsConnected: boolean;
  wallet: WalletAddress;
  sharedGiftId: string;
  telFirstName: string;
  sharedPaymentMode: string;
  sharedRate: string;
  sharedCrypto: string;
  sharedTicker: string;
  sharedAssetPrice: string;
  sharedEstimateAsset: string;
  sharedNetwork: string;
  sharedCharge: string;
  sharedPaymentAssetEstimate: string;
  sharedPaymentNairaEstimate: string;
  sharedNairaCharge: string;
  sharedSelectedBankCode: string;
  sharedSelectedBankName: string;
  sharedAmount: string;
  sharedBankCodes: string[];
  sharedBankNames: string[];
  ethConnect: boolean;
  sharedTransactionId: string;
  procesingStatus: string;
  cancelledStatus: string;
  reporterName: string;
  reporterPhoneNumber: string;
  reporterWalletAddress: string;
  fraudsterWalletAddress: string;
  sharedReportlyReportType: string;
  reportId: string;
  formattedRate: string;
  displayReportlyPhoneNumber: DisplayReportlyPhoneNumber;
  setSharedAmount: (sharedAmount: string) => void;
  setSharedCharge: React.Dispatch<SetStateAction<string>>;
  setSharedPaymentAssetEstimate: React.Dispatch<SetStateAction<string>>;
  setSharedPaymentNairaEstimate: React.Dispatch<SetStateAction<string>>;
  setSharedNairaCharge: React.Dispatch<SetStateAction<string>>;
  setSharedChargeForDB: React.Dispatch<SetStateAction<string>>;
  updateBankData: (newData: Partial<UserBankData>) => void;
  setChatInput: (input: string) => void;
  setSharedPaymentMode: (mode: string) => void;
  setSharedTicker: (ticker: string) => void;
  setSharedCrypto: (crypto: string) => void;
  setSharedNetwork: (network: string) => void;
  setSharedWallet: (wallet: string) => void;
  setSharedEstimateAsset: (network: string) => void;
  setSharedGiftId: React.Dispatch<React.SetStateAction<string>>;
  setSharedBankNames: React.Dispatch<React.SetStateAction<string[]>>;
  setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>;
  setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>;
  setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  setSharedPhone: React.Dispatch<React.SetStateAction<string>>;
  setSharedTransactionId: React.Dispatch<React.SetStateAction<string>>;
  setSharedReportlyReportType: React.Dispatch<React.SetStateAction<string>>;
  setReporterName: React.Dispatch<React.SetStateAction<string>>;
  setReporterPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setReportId: React.Dispatch<React.SetStateAction<string>>;
  setReporterWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  setFraudsterWalletAddress: React.Dispatch<React.SetStateAction<string>>;
  setDescriptionNote: React.Dispatch<React.SetStateAction<string>>;
  onError: ((error: Error) => void) | undefined;
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) => Promise<void>;
};

export const stepHandlers: Record<
  StepId,
  (p: HandlerProps) => Promise<void> | void
> = {
  start: (p) => {
    helloMenu(
      p.addChatMessages,
      p.chatInput,
      p.nextStep,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  chooseAction: (p) => {
    choiceMenu(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.sharedRate,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },

  transactCrypto: (p) => {
    handleMakeAChoice(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },

  transferMoney: (p) => {
    handleTransferMoney(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.sharedPaymentMode,
      p.sharedRate,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode,
      p.setSharedWallet,
      p.setSharedEstimateAsset,
      p.setSharedGiftId,
      p.setLoading
    );
    p.setChatInput("");
  },

  estimateAsset: (p) => {
    handleEstimateAsset(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.sharedPaymentMode,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode,
      p.setSharedTicker,
      p.setSharedCrypto,
      p.setSharedNetwork
    );
    p.setChatInput("");
  },
  network: (p) => {
    handleNetwork(
      p.addChatMessages,
      p.chatInput,
      p.sharedPaymentMode,
      p.sharedGiftId,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedTicker,
      p.setSharedCrypto,
      p.setSharedNetwork,
      p.setSharedTicker
    );
    p.setChatInput("");
  },
  payOptions: (p) => {
    handlePayOptions(
      p.addChatMessages,
      p.chatInput,
      p.sharedPaymentMode,
      p.sharedCrypto,
      p.sharedNetwork,
      p.sharedRate,
      p.sharedTicker,
      p.sharedAssetPrice,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedEstimateAsset,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  charge: (p) => {
    handleCharge(
      p.addChatMessages,
      p.chatInput,
      p.sharedPaymentMode,
      p.sharedEstimateAsset,
      p.sharedCrypto,
      p.sharedNetwork,
      p.sharedRate,
      p.sharedAssetPrice,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedAmount,
      p.setSharedCharge,
      p.setSharedPaymentAssetEstimate,
      p.setSharedPaymentNairaEstimate,
      p.setSharedNairaCharge,
      p.setSharedChargeForDB,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  enterBankSearchWord: (p) => {
    // TODO: move paymentMode into global state
    // handle user bank search - using first 3 letters of the user bank
    let wantsToClaimGift = sharedPaymentMode.toLowerCase() === "claim gift";
    let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
    let wantsToRequestPayment = sharedPaymentMode.toLowerCase() === "request";
    let wnatsToTransactCrypto =
      sharedPaymentMode.toLowerCase() === "transfermoney";

    wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
      ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
        handleSearchBank(
          p.addChatMessages,
          p.chatInput,
          p.sharedCharge,
          p.sharedPaymentMode,
          p.sharedCrypto,
          p.sharedPaymentAssetEstimate,
          p.sharedRate,
          p.sharedPaymentNairaEstimate,
          p.sharedAssetPrice,
          p.sharedEstimateAsset,
          p.sharedNairaCharge,
          p.walletIsConnected,
          p.wallet,
          p.telFirstName || "",
          p.nextStep,
          p.prevStep,
          p.goToStep,
          p.setSharedGiftId,
          p.setSharedPaymentAssetEstimate,
          p.setSharedPaymentNairaEstimate,
          p.setSharedChargeForDB,
          p.setSharedPaymentMode,
          p.setLoading
        ))
      : (console.log("CURRENT STEP IS continueToPay IN enterBankSearchWord "),
        handleContinueToPay(
          p.addChatMessages,
          p.chatInput,
          p.sharedSelectedBankCode,
          p.sharedSelectedBankName,
          p.sharedPaymentMode,
          p.walletIsConnected,
          p.wallet,
          p.telFirstName,
          p.nextStep,
          p.prevStep,
          p.goToStep,
          p.updateBankData,
          p.setLoading,
          p.setSharedPaymentMode
        ));
    p.setChatInput("");
  },
  selectBank: (p) => {
    handleSelectBank(
      p.addChatMessages,
      p.chatInput,
      p.sharedPaymentMode,
      p.sharedCrypto,
      p.sharedAmount,
      p.sharedRate,
      p.sharedAssetPrice,
      p.sharedEstimateAsset,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedBankNames,
      p.setSharedPaymentAssetEstimate,
      p.setSharedPaymentNairaEstimate,
      p.setSharedChargeForDB,
      p.setSharedCharge,
      p.setSharedNairaCharge,
      p.setSharedBankCodes,
      p.setSharedPaymentMode,
      p.setLoading
    );
    p.setChatInput("");
  },
  enterAccountNumber: (p) => {
    handleBankAccountNumber(
      p.addChatMessages,
      p.chatInput,
      p.sharedBankCodes,
      p.sharedBankNames,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedBankCodes,
      p.setSharedSelectedBankCode,
      p.setSharedSelectedBankName,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  continueToPay: (p) => {
    handleContinueToPay(
      p.addChatMessages,
      p.chatInput,
      p.sharedSelectedBankCode,
      p.sharedSelectedBankName,
      p.sharedPaymentMode,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.updateBankData,
      p.setLoading,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  enterPhone: (p) => {
    handlePhoneNumber(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  sendPayment: async (p) => {
    await handleCryptoPayment(
      p.addChatMessages,
      p.chatInput,
      p.sharedCrypto,
      p.sharedNetwork,
      p.sharedPaymentMode,
      p.ethConnect,
      p.sharedPaymentAssetEstimate,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.setSharedPhone,
      p.processTransaction,
      p.nextStep,
      p.goToStep,
      p.setLoading,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  confirmTransaction: (p) => {
    handleConfirmTransaction(
      p.addChatMessages,
      p.chatInput,
      p.sharedTransactionId,
      p.procesingStatus,
      p.cancelledStatus,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.setSharedTransactionId,
      p.setLoading,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  paymentProcessing: (p) => {
    handleTransactionProcessing(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  kycInfo: (p) => {
    handleKYCInfo(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  kycReg: (p) => {},
  thankForKYCReg: (p) => {
    handleThankForKYCReg(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  supportWelcome: (p) => {
    displayCustomerSupportWelcome(p.addChatMessages, p.nextStep);
    p.setChatInput("");
  },
  assurance: (p) => {
    handleCustomerSupportAssurance(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.prevStep,
      p.goToStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  entreTrxId: (p) => {
    handleTransactionId(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.setSharedTransactionId,
      p.setLoading,
      p.setSharedPaymentMode
    );

    p.setChatInput("");
  },
  makeComplain: (p) => {
    handleMakeComplain(
      p.addChatMessages,
      p.chatInput,
      p.sharedTransactionId,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setLoading,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  completeTransactionId: (p) => {
    handleCompleteTransactionId(
      p.addChatMessages,
      p.chatInput,
      p.formattedRate,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName,
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  giftFeedBack: (p) => {
    handleGiftRequestId(
      p.addChatMessages,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.sharedPaymentMode,
      p.chatInput,
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setSharedPaymentMode,
      p.setSharedGiftId,
      p.setLoading
    );
    p.setChatInput("");
  },
  makeReport: (p) => {
    handleReportlyWelcome(
      p.addChatMessages,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.sharedRate,
      p.chatInput,
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setSharedReportlyReportType,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  reporterName: (p) => {
    handleReporterName(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.setSharedReportlyReportType,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  reporterPhoneNumber: (p) => {
    handleEnterReporterPhoneNumber(
      p.addChatMessages,
      p.chatInput,
      p.reporterName,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.setReporterName,
      p.displayReportlyPhoneNumber,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  reporterWallet: (p) => {
    handleEnterReporterWalletAddress(
      p.addChatMessages,
      p.chatInput,
      p.reporterPhoneNumber,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setReporterPhoneNumber,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  fraudsterWallet: (p) => {
    handleEnterFraudsterWalletAddress(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setReportId,
      p.setReporterWalletAddress,
      p.displayReportlyPhoneNumber,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  reportlyNote: (p) => {
    handleReportlyNote(
      p.addChatMessages,
      p.chatInput,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setFraudsterWalletAddress,
      p.displayReportlyNote,
      p.setSharedPaymentMode
    );
    p.setChatInput("");
  },
  reporterFarwell: (p) => {
    handleReporterFarwell(
      p.addChatMessages,
      p.chatInput,
      p.reporterName,
      p.reporterPhoneNumber,
      p.reporterWalletAddress,
      p.fraudsterWalletAddress,
      p.sharedReportlyReportType,
      p.reportId,
      p.walletIsConnected,
      p.wallet,
      p.telFirstName || "",
      p.nextStep,
      p.goToStep,
      p.prevStep,
      p.setDescriptionNote,
      p.setReporterPhoneNumber,
      p.setReporterWalletAddress,
      p.setFraudsterWalletAddress,
      p.setReporterName,
      p.setLoading,
      p.setSharedPaymentMode
    );

    p.setChatInput("");
  },
};
