import { StepId } from "@/core/transation_state_machine/steps";
import { WalletAddress } from "@/lib/wallets/types";
import { MessageType, UserBankData } from "@/types/general_types";
import { SetStateAction } from "react";
import { choiceMenu, helloMenu } from "./general";
import { handleMakeAChoice, handleTransferMoney } from "./transact";

type HandlerProps = {
  currentStep: StepId;
  chatInput: string;
  addChatMessages: (messages: MessageType[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (s: StepId) => void;

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
};
