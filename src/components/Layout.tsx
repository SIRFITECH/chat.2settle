import React, { ReactNode } from "react";
import Script from "next/script";
import Footer from "./Footer";
import Navbar from "./NavBar";

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
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
