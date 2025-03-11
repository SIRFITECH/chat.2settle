import { MessageType, UserBankData } from "../general_types";

export interface TransactionParams {
  phoneNumber: string;
  isGift: boolean;
  isGiftTrx: boolean;
  requestPayment: boolean;
  sharedPaymentMode: string;
  sharedGiftId: string;
  activeWallet?: string;
  lastAssignedTime?: Date;
  bankData: UserBankData;
  addChatMessages: (messages: MessageType[]) => void;
  setLoading: (loading: boolean) => void;
  goToStep: (step: string) => void;
  nextStep: (step: string) => void;
}

export interface BaseTransactionParams {
  phoneNumber: string;
  activeWallet?: string;
}

// export interface ProcessGiftTransactionParams extends BaseTransactionParams {
//   sharedGiftId: string;
//   sharedPaymentMode: string;
//   bankData: UserBankData;
//   addChatMessages: (messages: MessageType[]) => void;
//   setLoading: (loading: boolean) => void;
//   goToStep: (step: string) => void;
//   nextStep: (step: string) => void;
// }
// export interface ProcessGiftSendTransactionParams extends BaseTransactionParams {
//   sharedGiftId: string;
//   sharedPaymentMode: string;
//   bankData: UserBankData;
//   setSharedTransactionId;
//   setSharedGiftId;
//   addChatMessages: (messages: MessageType[]) => void;
//   setLoading: (loading: boolean) => void;
//   goToStep: (step: string) => void;
//   nextStep: (step: string) => void;
//   lastAssignedTime;
//   sharedPaymentAssetEstimate;
//   sharedCrypto;
//   sharedPaymentMode;
//   sharedPaymentNairaEstimate;
//   sharedNetwork;
//   sharedPaymentMode;
//   ethConnect;
//   sharedEstimateAsset;
//   sharedChargeForDB;
//   chatId;
//   sharedRate;
//   merchantRate;
//   profitRate;
//   sharedAssetPrice;
// }
