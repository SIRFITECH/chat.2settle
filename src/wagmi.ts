import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  mainnet,
  bsc,
  arbitrum,
  base,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "2settle Livechat",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,

    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});
