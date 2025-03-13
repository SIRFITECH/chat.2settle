export interface WalletQueueWithLock {
  assignWallet(): Promise<string | undefined>;
  completeTransaction(wallet: string): Promise<void>;
  isEmpty(): boolean;
  size(): number;
  printQueue(): void;
}

export type WalletAddress = `0x${string}` | undefined