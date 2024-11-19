import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import PageBody from "../components/Body";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { ref, category } = router.query;
    if (ref && category) {
      // Store the referral information in localStorage or send it to your backend
      localStorage.setItem("referralCode", ref as string);
      localStorage.setItem("referralCategory", category as string);

      // Remove the referral parameters from the URL
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

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
