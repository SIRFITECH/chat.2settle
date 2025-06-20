import React, { ReactNode } from "react";
import Script from "next/script";
import Footer from "./shared/Footer";
import Navbar from "./shared/NavBar";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Script
        id="telegram-script"
        strategy="beforeInteractive"
        src="https://telegram.org/js/telegram-web-app.js"
      />
      <Script
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "2Settle",
          url: "https://spend.2settle.io",
          logo: "https://spend.2settle.io/logo.png",
          sameAs: [
            "https://twitter.com/2settlehq",
            "https://linkedin.com/company/2settle",
            "https://t.me/yourtelegram",
          ],
          description:
            "2Settle enables Africans to send, receive, and spend crypto easily with instant fiat conversion.",
        })}
      </Script>
      
      <header>
        <Navbar />
      </header>
      <main role="main" className="flex-grow">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
