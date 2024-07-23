import { RowDataPacket } from "mysql2/promise";
import React from "react";

export type MessageType = {
  type: string;
  content: React.ReactNode;
};

export interface ExchangeRate {
  rate: number;
  merchant_rate: string;
  profit_rate: string;
}

export interface ServerResponse {
  data: ServerData;
}

export interface ServerData {
  rate: string;
  merchantRate: string;
  profitRate: string;
}
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

export interface btcWalletData {
  // address: string;
  // private_key: string;
  bitcoin_wallet: string;
  bitcoin_privateKey: string;
}
export interface trcWalletData {
  tron_wallet: string;
  tron_privateKey: string;
}
export interface ercWalletData {
  eth_bnb_wallet: string;
  eth_bnb_privateKey: string;
}

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
}
