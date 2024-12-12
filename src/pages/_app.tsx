import "../../globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "../wagmi";
import { SharedStateProvider } from "../context/SharedStateContext";

import ErrorBoundary from "@/components/TelegramError";


const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/payment-sw.js").then(
        function (registration) {
          console.log(
            "Payment Service Worker registered successfully:",
            registration.scope
          );
        },
        function (err) {
          console.error("Payment Service Worker registration failed:", err);
        }
      );
    }
  }, []);
  return (

    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <SharedStateProvider>
              <ErrorBoundary>
                <Component {...pageProps} />
              </ErrorBoundary>
            </SharedStateProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;

// import "../../globals.css";
// import "@rainbow-me/rainbowkit/styles.css";
// import type { AppProps } from "next/app";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { WagmiConfig } from "wagmi";
// import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

// import { config } from "../wagmi";
// import { SharedStateProvider } from "../context/SharedStateContext";

// const client = new QueryClient();

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <WagmiConfig config={config}>
//       <QueryClientProvider client={client}>
//         <RainbowKitProvider chains={config.chains} theme={darkTheme()}>
//           <SharedStateProvider>
//             <Component {...pageProps} />
//           </SharedStateProvider>
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiConfig>
//   );
// }

// export default MyApp;

