import { TronWeb } from "tronweb";

export {};
declare global {
  interface Window {
    tronWeb: TronWeb & {
      ready: boolean;
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
