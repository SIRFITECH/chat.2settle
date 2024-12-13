
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";

import SpendMoney from "./SpendMoney";
import SendMoney from "./SendMoney";
import { useAccount } from "wagmi";
import { fetchRate, fetchTotalVolume } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";

import { Button } from "@/components/ui/button";
import ErrorBoundary from "./TelegramError";
// import ChatB from "./ChatB";
import Chat from "./Chat";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export default function Body() {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [formattedTotalVolume, setFormattedTotalVolume] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [tvtLoading, setTVTLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  // const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1365px)");
  // const isDesktop = useMediaQuery("(min-width: 1366px)");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCategory, setReferralCategory] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchData();
    fetchTVT();

    const code = localStorage.getItem("referralCode");
    const category = localStorage.getItem("referralCategory");

    if (code && category) {
      setReferralCode(code);
      setReferralCategory(category);
      // Clear the referral information from localStorage
      localStorage.removeItem("referralCode");
      localStorage.removeItem("referralCategory");
    }

  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedRate = await fetchRate();
      const rateFormated = formatCurrency(
        fetchedRate.toString(),
        "NGN",
        "en-NG"
      );
      setFormattedRate(rateFormated);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    }
  };

  const fetchTVT = async () => {
    setTVTLoading(true);
    try {
      const totalVolume = await fetchTotalVolume();
      const formattedTotalVolume = formatCurrency(
        totalVolume.toString(),
        "USD"
      );
      setFormattedTotalVolume(formattedTotalVolume);
      setTVTLoading(false);
    } catch (error) {}
  };

  const getBackgroundImage = (): string => {
    if (isMobile) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone-AfU0CbbR026gFTYfYjbdG5FYYSHKRN.jpg";
    } else {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web-P134QKh1VxKd5JZdUREkUu8JeEbDQB.jpg";
    }
  };
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image loading error:", event);
    setImageError(
      "Failed to load the background image. Please check your internet connection and try again."
    );
  };
  const renderChatBot = () => {
    try {
      return (
        <ErrorBoundary>
          <ChatBot isMobile={isMobile} onClose={() => setIsOpen(false)} />
        </ErrorBoundary>
      );
    } catch (error) {
      console.error("Error rendering ChatBot:", error);
      return <div>Error loading ChatBot. Please try again.</div>;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      <div className={`absolute inset-0 ${isOpen ? "z-0" : "z-10"}`}>
        <Image
          src={getBackgroundImage()}
          alt="Background"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
          onError={handleImageError}
        />
      </div>

      {imageError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 text-center z-50">
          {imageError}
        </div>
      )}

      <div
        className={`relative flex-grow flex flex-col items-center justify-center p-4 md:p-8 ${
          isOpen ? "z-0" : "z-20"
        }`}
      >
        {loading ? (
          <h2 className="font-Poppins text-2xl animate-pulse">
            Loading Exchange rate...
          </h2>
        ) : (
          <>
            <div className="text-center text-black bg-white bg-opacity-80 p-6 rounded-lg shadow-lg mb-6">
              <h2 className="font-bold font-Poppins text-2xl md:text-3xl mb-4">
                Today's Rate: <br />
                <span className="text-blue-500 text-4xl md:text-5xl animate-pulse">
                  <b>{formattedRate}/$1</b>
                </span>
              </h2>

              <div className="flex flex-col sm:flex-row justify-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto hover:bg-blue-500"
                  onClick={() => setIsOpen(true)}
                >
                  {isClient ? <SpendMoney /> : "Spend Money"}
                </Button>
                <Button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto hover:bg-blue-500"
                  onClick={() => setIsOpen(true)}
                >
                  {isClient ? <SendMoney /> : "Send Money"}
                </Button>
              </div>
            </div>
          </>
        )}
        {tvtLoading ? (
          <h2 className="font-Poppins text-xl animate-pulse">
            Loading Total Volume Traded YTD...
          </h2>
        ) : (
          <div className="text-center bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
            <h3 className="font-bold font-Poppins text-xl md:text-2xl text-black">
              Total Volume Traded (YTD): <br />
              <span className="text-green-600 text-3xl md:text-4xl animate-pulse">
                <b>{formattedTotalVolume}</b>
              </span>
            </h3>
          </div>
        )}
        {referralCode && referralCategory && (
          <div className="mt-4 text-center bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
            <p className="text-black font-medium">
              Thank you for honoring our{" "}
              {referralCategory === "amb"
                ? "brand ambassador"
                : referralCategory === "mkt"
                ? "marketer"
                : "partner"}
              .
            </p>
          </div>
        )}

      </div>

      <Button
        className={`fixed bottom-8 right-8 h-16 w-16 rounded-full bg-blue-500 transition-transform transform ${
          isOpen ? "rotate-90" : ""
        } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden ${
          isMobile && isOpen ? "hidden" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="text-white relative">
          {isOpen ? (
            <CloseIcon className="h-8 w-8" />
          ) : (
            <>
              <ChatBubbleOutlineIcon className="h-8 w-8" />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 transform rotate-45 translate-x-1/2 translate-y-1/2"></span>
            </>
          )}
        </span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* {renderChatBot()} */}
          {/* <ChatBot isMobile={isMobile} onClose={() => setIsOpen(false)} /> */}
          <ErrorBoundary
            fallback={
              <div className="p-4 bg-white rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Chat Error</h3>
                <p>
                  Unable to load the chat interface. Please try again later.
                </p>
                <Button onClick={() => setIsOpen(false)} className="mt-4">
                  Close
                </Button>
              </div>
            }
          >
            <ChatBot isMobile={isMobile} onClose={() => setIsOpen(false)} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}
