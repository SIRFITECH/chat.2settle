
// export interface WalletQueueWithLock {
//   wallets: string[]; // An array to hold wallet IDs
//   assignWallet: () => string | undefined; // Method to assign a wallet
//   completeTransaction: (wallet: string) => void; // Method to mark a transaction as complete
//   isEmpty: () => boolean; // Method to check if the queue is empty
//   printQueue: () => void; // Method to print the current queue for debugging
// }

export interface WalletQueueWithLock {
  assignWallet(): Promise<string | undefined>;
  completeTransaction(wallet: string): Promise<void>;
  isEmpty(): boolean;
  size(): number;
  printQueue(): void;
}