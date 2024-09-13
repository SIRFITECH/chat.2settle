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
          <SharedStateProvider>
            <Component {...pageProps} />
          </SharedStateProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;

// import "../../globals.css";
// import "@rainbow-me/rainbowkit/styles.css";
// import type { AppProps } from "next/app";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { WagmiConfig } from "wagmi";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

// import { wagmiClient, chains } from "../wagmi";
// import { SharedStateProvider } from "../context/SharedStateContext";

// const client = new QueryClient();

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <WagmiConfig client={wagmiClient}>
//       <QueryClientProvider client={client}>
//         <RainbowKitProvider chains={chains}>
//           <SharedStateProvider>
//             <Component {...pageProps} />
//           </SharedStateProvider>
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiConfig>
//   );
// }

// export default MyApp;


