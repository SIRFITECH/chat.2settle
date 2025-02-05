"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ChatBot from "./transactions/ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
import SpendMoney from "./SpendMoney";
import SendMoney from "./SendMoney";
import { fetchRate, fetchTotalVolume } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "./TelegramError";

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
      return "https://gbo1qdj0roz2nqut.public.blob.vercel-storage.com/home-bg-sm-x1K8H1Woi3WMjoEJnhjLGpt6gugM9z.png";
    } else {
      return "https://gbo1qdj0roz2nqut.public.blob.vercel-storage.com/home-bg-lg-GWkkBEQz6PnxsepRxg7sVChWtC4M1x.png";
    }
  };
  const getWale = () => {
    return "https://gbo1qdj0roz2nqut.public.blob.vercel-storage.com/wale-mTGuRn8gew59IpHaWYW1PrlfiZ2NxQ.png";
  };
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error("Image loading error:", event);
    setImageError(
      "Failed to load the background image. Please check your internet connection and try again."
    );
  };
  // const renderChatBot = () => {
  //   try {
  //     return (
  //       <ErrorBoundary>
  //         <ChatBot isMobile={isMobile} onClose={() => setIsOpen(false)} />
  //       </ErrorBoundary>
  //     );
  //   } catch (error) {
  //     console.error("Error rendering ChatBot:", error);
  //     return <div>Error loading ChatBot. Please try again.</div>;
  //   }
  // };

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
        <div className="flex justify-center mb-20">
          <h3 className=" text-4xl font-Poppins font-bold ">
            <span className="flex justify-center">A New Way </span>
            To <span className="font-thin">Spend </span>Money
          </h3>
        </div>
        <div
          // className="absolute -top-12 right-0 bg-blue-500 text-white text-sm text-nowrap font-Poppins px-5 py-2 rounded-full w-28 h-9 transform -rotate-12 translate-x-1/4"
          className="absolute bg-blue-500 text-white text-sm text-nowrap font-Poppins px-5 py-2 rounded-full w-28 h-9"
          style={{
            transform: "rotate(-12.75deg)",
            top: "33%", // adjust the top
            right: "36%", // adjust the vertical z
            zIndex: "10",
          }}
        >
          with crypto
        </div>
        <div className="text-center font-Poppins  text-black bg-gradient-to-tr from-purple-200 via-grey-300 to-white bg-opacity-90 px-8 py-3 rounded-full shadow-lg mb-6 border-2 border-white ">
          {loading ? (
            <h2 className="font-Poppins text-xl ">
              {/* animate-pulse */}
              Loading Exchange rate...
            </h2>
          ) : (
            <span className="text-blue-700 font-Poppins text-small md:text-lg ">
              {/* animate-pulse */}
              Todays rate is {formattedRate}/$1
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4">
          {/* <Button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto hover:bg-blue-500"
            onClick={() => setIsOpen(true)}
          >
            {isClient ? <SpendMoney /> : "Spend Money"}
          </Button> */}
          <Button
            className="px-4 py-2 bg-blue-500 text-white rounded-full w-full sm:w-auto hover:bg-blue-500"
            onClick={() => setIsOpen(true)}
          >
            {isClient ? <SendMoney /> : "Send Money"}
          </Button>
        </div>
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
      <div
        className={`absolute left-0 top-[45%] transform-y-1/4 ${
          isOpen ? "z-0" : "z-20"
        } `}
      >
        <Image
          src={getWale()}
          alt="Wale"
          width={500}
          height={500}
          className="w-full max-w-[500px] mx-0"
          priority
          onError={handleImageError}
        />
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
