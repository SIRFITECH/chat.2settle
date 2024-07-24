import { RowDataPacket } from "mysql2/promise";
import React from "react";

// MESSAGE TYPE FOR CHAT
export type MessageType = {
  type: string;
  content: React.ReactNode;
};

// RATES FROM THE VENDOR TABLE
export interface ExchangeRate {
  rate: number;
  merchant_rate: string;
  profit_rate: string;
}

// AXIOS SERVER RESPONSE TYPE
export interface ServerResponse {
  data: ServerData;
}

// AXIOS SERVERDATA TYPE
export interface ServerData {
  rate: string;
  merchantRate: string;
  profitRate: string;
}

// USER FROM THE VENDOR TABLE
export interface vendorData {
  agent_id?: string | null;
  vendor_phoneNumber?: string | null;
  bitcoin_wallet?: string | null;
  bitcoin_privateKey?: string | null;
  eth_bnb_wallet?: string | null;
  eth_bnb_privateKey?: string | null;
  tron_wallet?: string | null;
  tron_privateKey?: string | null;
}

// BTC WALLET FORM VENDOR TABLE WALLET DATA
export interface btcWalletData {
  // address: string;
  // private_key: string;
  bitcoin_wallet: string;
  bitcoin_privateKey: string;
}

// TRC20 WALLET FORM VENDOR TABLE WALLET DATA
export interface trcWalletData {
  tron_wallet: string;
  tron_privateKey: string;
}

// ERC20 WALLET FORM VENDOR TABLE WALLET DATA
export interface ercWalletData {
  eth_bnb_wallet: string;
  eth_bnb_privateKey: string;
}

// BANK DATA FROM NUBAN
export interface BankData {
  bank_name: string;
  account_name: string;
  account_number: string;
}

// BANK DATA FROM THE DB
export interface BankName extends RowDataPacket {
  bank_name: string;
  bank_code: string;
}

// STILL BANK DETAILS
export interface Result {
  name: string;
  code: string;
}

// USER BANK DATA TO BE PUSHED TO TRANSACTION DB
export interface UserBankData {
  acct_number?: string;
  bank_name?: string;
  receiver_name?: string;
}

// SHARED STATE VARIABLE FROM SHARED CONTEXT
export interface SharedStateContextProps {
  sharedState: string;
  setSharedState: React.Dispatch<React.SetStateAction<string>>;
  sharedRate: string;
  setSharedRate: React.Dispatch<React.SetStateAction<string>>;
  sharedChatId: string;
  setSharedChatId: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentMode: string;
  setSharedPaymentMode: React.Dispatch<React.SetStateAction<string>>;
  sharedCrypto: string;
  setSharedCrypto: React.Dispatch<React.SetStateAction<string>>;
  sharedTicker: string;
  setSharedTicker: React.Dispatch<React.SetStateAction<string>>;
  sharedNetwork: string;
  setSharedNetwork: React.Dispatch<React.SetStateAction<string>>;
  sharedWallet: string;
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>;
  sharedAssetPrice: string;
  setSharedAssetPrice: React.Dispatch<React.SetStateAction<string>>;
  sharedEstimateAsset: string;
  setSharedEstimateAsset: React.Dispatch<React.SetStateAction<string>>;
  sharedAmount: string;
  setSharedAmount: React.Dispatch<React.SetStateAction<string>>;
  sharedCharge: string;
  setSharedCharge: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentAssetEstimate: string;
  setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>;
  sharedPaymentNairaEstimate: string;
  setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>;
  sharedNairaCharge: string;
  setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>;
  sharedChargeForDB: string;
  setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>;
  sharedBankCodes: string[];
  setSharedBankCodes: React.Dispatch<React.SetStateAction<string[]>>;
  sharedBankNames: string[];
  setSharedBankNames: React.Dispatch<React.SetStateAction<string[]>>;
  sharedSelectedBankCode: string;
  setSharedSelectedBankCode: React.Dispatch<React.SetStateAction<string>>;
  sharedSelectedBankName: string;
  setSharedSelectedBankName: React.Dispatch<React.SetStateAction<string>>;
  bankData: UserBankData;
  updateBankData: (newData: Partial<UserBankData>) => void;
  sharedPhone: string;
  setSharedPhone: React.Dispatch<React.SetStateAction<string>>;
}
