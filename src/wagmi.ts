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
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
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

// import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { configureChains, createClient, WagmiConfig } from "wagmi";
// import {
//   mainnet,
//   bsc,
//   arbitrum,
//   base,
//   optimism,
//   polygon,
//   sepolia,
// } from "wagmi/chains";
// import { publicProvider } from "wagmi/providers/public";

// const { chains, provider } = configureChains(
//   [
//     mainnet,
//     bsc,
//     polygon,
//     optimism,
//     arbitrum,
//     base,
//     ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
//   ],
//   [publicProvider()]
// );

// const { connectors } = getDefaultWallets({
//   appName: "2settle Livechat",
//   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID, // Ensure this is correct
//   chains,
// });

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors,
//   provider,
// });

// export { wagmiClient, chains };
