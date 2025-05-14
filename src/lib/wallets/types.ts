
export interface WalletStrategy {
  isConnected: boolean
  getWalletAddress(): WalletAddress;
  getBalance(): number;
  getENS(): string;
  connect(): Promise<string>;
  disconnect(): Promise<string>;
}

export type WalletAddress =
  | `0x${string}` // EVM wallet
  | `1${string}` // Legacy BTC (P2PKH)
  | `3${string}` // BTC multisig (P2SH)
  | `bc1${string}` // SegWit address
  | `T${string}` // TRON wallet address
  | undefined;

export type WalletType = "BTC" | "EVM" | "TRC20"| "TRX" | "UNKNOWN";
