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
