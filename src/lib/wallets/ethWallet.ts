import { WalletStrategy, WalletAddress } from "./types";

export class ETHWallet implements WalletStrategy {
  isConnected: boolean = true;
  getWalletAddress() {
    // Logic to get the balance of the wallet
    return "ethWalletAddress" as WalletAddress;
  }
  getBalance() {
    // Logic to get the balance of the wallet
    return 0;
  }
  getENS() {
    // Logic to get the balance of the wallet
    return "ethWalletENS";
  }
  connect(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  disconnect(): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
