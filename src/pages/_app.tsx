import "../../globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { SharedStateProvider } from "../context/SharedStateContext";

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
          <SharedStateProvider>
            <Component {...pageProps} />
          </SharedStateProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

// import "../styles/globals.css";
// import "@rainbow-me/rainbowkit/styles.css";
// import type { AppProps } from "next/app";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { WagmiProvider } from "wagmi";
// import {
//   arbitrum,
//   base,
//   mainnet,
//   optimism,
//   polygon,
//   sepolia,
// } from "wagmi/chains";
// import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { SharedStateProvider } from "context/SharedStateContext";
// import { ChatbotProvider } from "context/ChatbotContext";

// const config = getDefaultConfig({
//   appName: "RainbowKit App",
//   projectId: "YOUR_PROJECT_ID",
//   chains: [
//     mainnet,
//     polygon,
//     optimism,
//     arbitrum,
//     base,
//     ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
//   ],
//   ssr: true,
// });

// const client = new QueryClient();

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={client}>
//         <RainbowKitProvider>
//           <ChatbotProvider>
//             <SharedStateProvider>
//               <Component {...pageProps} />
//             </SharedStateProvider>
//           </ChatbotProvider>
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }

// export default MyApp;
