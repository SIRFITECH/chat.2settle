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
import { persistQueryClient } from "@tanstack/query-persist-client-core";
import "@rainbow-me/rainbowkit/styles.css";
import "../../globals.css";
import { RateBootstrapper } from "@/components/dashboard/RateBootstrapper";
import UserBootstrap from "@/components/dashboard/checkTelUser";
// import { bindXStateToZustand } from "@/components/dashboard/xstateToZustand";

export const client = new QueryClient();

//  session;

function MyApp({ Component, pageProps }: AppProps) {
  // bindXStateToZustand();
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
                  {/* usefull for fetching rates in
                  intervals and saving to zustand */}
                  <RateBootstrapper />
                  <UserBootstrap />
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
