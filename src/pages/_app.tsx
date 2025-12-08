import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { config } from "../wagmi";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { SharedStateProvider } from "../context/SharedStateContext";
import ErrorBoundary from "@/components/social/telegram/TelegramError";
import { SessionProvider } from "next-auth/react";
import "@rainbow-me/rainbowkit/styles.css";
import "../../globals.css";

const client = new QueryClient();
//  session;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionProvider session={pageProps.session}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={client}>
            <RainbowKitProvider>
              <SharedStateProvider>
                <ErrorBoundary>
                  <Component {...pageProps} />
                  <ReactQueryDevtools />
                </ErrorBoundary>
              </SharedStateProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
