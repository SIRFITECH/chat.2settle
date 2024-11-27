import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import PageBody from "../components/Body";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { checkReferralExists } from "@/helpers/api_calls";

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    const processReferral = async () => {
      const { ref } = router.query;

      if (typeof ref === "string") {
        try {
          const referral = await checkReferralExists(ref);

          if (referral && referral.user) {
            localStorage.setItem("referralCode", referral.user.ref_code);
            localStorage.setItem("referralCategory", referral.user.category);

            // Remove the referral parameters from the URL
            const { ref, ...restQuery } = router.query;
            await router.replace(
              {
                pathname: router.pathname,
                query: restQuery,
              },

              undefined,
              { shallow: true }
            );
          } else {
            // Remove the referral parameters from the URL either way
            const { ref, ...restQuery } = router.query;
            await router.replace(
              {
                pathname: router.pathname,
                query: restQuery,
              },

              undefined,
              { shallow: true }
            );
            console.warn("Invalid referral data received");
          }
        } catch (error) {
          console.error("Error processing referral:", error);
        }
      }
    };

    if (router.isReady) {
      processReferral();
    }
  }, [router.isReady, router.query]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-custom-blue via-custom-pink to-pink-500">
      <Head>
        <title>2Settle Livechat</title>
        <meta content="2Settle Livechat" name="spend,send,integrate" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        {/* web favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        <link rel="manifest" href="site.webmanifest" />
        <link rel="mask-icon" href="safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="browserconfig.xml" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <Layout>
        <PageBody />
      </Layout>
    </div>
  );
};

export default Home;

// import { useEffect } from "react";
// import { useRouter } from "next/router";
// import { checkReferralExists } from "../helpers/api_calls"; // Adjust the import path as needed

// export default function App({ Component, pageProps }) {

//   return <Component {...pageProps} />;
// }
