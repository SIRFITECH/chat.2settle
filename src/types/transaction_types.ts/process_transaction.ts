// import { MessageType, UserBankData } from "../general_types";

// export interface TransactionParams {
//   phoneNumber: string;
//   isGift: boolean;
//   isGiftTrx: boolean;
//   requestPayment: boolean;
//   sharedPaymentMode: string;
//   sharedGiftId: string;
//   activeWallet?: string;
//   lastAssignedTime?: Date;
//   bankData: UserBankData;
//   addChatMessages: (messages: MessageType[]) => void;
//   setLoading: (loading: boolean) => void;
//   goToStep: (step: string) => void;
//   nextStep: (step: string) => void;
// }

// export interface BaseTransactionParams {
//   phoneNumber: string;
//   activeWallet?: string;
// }

export interface TransactionType {
  /** Identity */
  transfer_id?: string | null;
  request_id?: string | null;
  gift_id?: string | null;

  /** Status */
  status?: string | null;
  request_status?: string | null;
  gift_status?: string | null;

  /** Asset details */
  crypto?: string | null;
  network?: string | null;
  estimate_asset?: string | null;

  /** Amounts */
  estimate_amount?: string | null;
  amount_payable?: string | null;
  crypto_amount?: string | null;
  charges?: string | null;

  /** Rates */
  current_rate?: string | null;
  merchant_rate?: string | null;
  profit_rate?: string | null;

  /** Participants */
  receiver_id?: number | null;
  payer_id?: number | null;

  /** Wallet */
  wallet_address?: string | null;

  /** Time */
  date?: string | null;
}


