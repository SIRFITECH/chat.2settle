import { bscTestnet } from "viem/chains";

export const CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_KEY",
    nativeSymbol: "ETH",
    usdtContract: "0xdAC17F958D2ee523a2206206994597C13D831ec7", 
  },
  bsc: {
    id: 56,
    name: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    nativeSymbol: "BNB",
    usdtContract: "0x55d398326f99059fF775485246999027B3197955", 
  }
//   bscTestnet: {
//     id: 57,
//     name: "Binance Smart Chain Testnet",
//     rpcUrl: "https://bsc-dataseed.binance.org/",
//     nativeSymbol: "tBNB",
//     usdtContract: "0x55d398326f99059fF775485246999027B3197955", 
//   },
} as const;
