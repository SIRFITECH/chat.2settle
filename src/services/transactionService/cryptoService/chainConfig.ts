import { bscTestnet } from "viem/chains";
import {
  BEP20_ABI,
  BEP20_CONTRACT,
  ERC20_ABI,
  ERC20_CONTRACT,
} from "./cryptoConstants";

export const CHAINS = {
  eth: {
    id: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/af7468d0f18b4e4e922976ab88098c80",
    nativeSymbol: "ETH",
    usdtContract: ERC20_CONTRACT,
    abi: ERC20_ABI,
    network: "eth",
  },
  bnb: {
    id: 56,
    name: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    nativeSymbol: "BNB",
    usdtContract: BEP20_CONTRACT,
    abi: BEP20_ABI,
    network: "bnb",
  },
  bscTestnet: {
    id: 59,
    name: "Binance Smart Chain Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    nativeSymbol: "tBNB",
    usdtContract: "0x55d398326f99059fF775485246999027B3197955",
  },
} as const;
