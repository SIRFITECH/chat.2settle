export interface WalletQueueWithLock {
  assignWallet(): Promise<string | undefined>;
  completeTransaction(wallet: string): Promise<void>;
  isEmpty(): boolean;
  size(): number;
  printQueue(): void;
}

export type WalletAddress =
  | `0x${string}` // EVM wallet
  | `1${string}` // Legacy BTC (P2PKH)
  | `3${string}` // BTC multisig (P2SH)
  | `bc1${string}` // SegWit address
  | `T${string}` // TRON wallet address
  | undefined;

export type WalletType = "EVM" | "BTC" | "TRX" | "UNKNOWN";

