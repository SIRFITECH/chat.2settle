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
}
