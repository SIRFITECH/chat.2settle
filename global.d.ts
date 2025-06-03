import { TronWeb } from "tronweb";

export {};
declare global {
  interface Window {
    tronLink?: any;
    tronWeb: TronWeb & {
      ready: boolean;
      isTronLink: boolean;
      defaultAddress: {
        base58: string;
        hex: string;
      };
      toSun: (amount: number | string) => number;
      fromSun: (amount: number | string) => number;
      trx: {
        getBalance: (address: string) => Promise<number>;
        sendTransaction: (
          to: String,
          amount: number
        ) => Promise<{ result: boolean; txid: string }>;
      };
    };
  }
}
