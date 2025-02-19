"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ChatBot from "./transactions/ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
import SendMoney from "./SendMoney";
import { formatCurrency } from "../helpers/format_currency";
import { Button } from "@/components/ui/button";
import ErrorBoundary from "./TelegramError";
import useRate from "@/hooks/useRate";
import useTotalVolume from "@/hooks/useTotalVolume";

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
  const [isClient, setIsClient] = useState(false);
  const isMobile = useMediaQuery("(max-width: 425px)");
  const isTab = useMediaQuery("(max-width: 768px)");
  const isDeskTop = useMediaQuery("(max-width: 1440px)");

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCategory, setReferralCategory] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const { data: rate, isLoading: rateLoading, error: rateError } = useRate();
  const {
    data: tvt,
    isLoading: TvtLoading,
    error: tvtError,
  } = useTotalVolume();

  useEffect(() => {
    setIsClient(true);
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
  const renderWale = () => {
    return isMobile ? (
      <Image
        src={getWale()}
        alt="Wale Image"
        width={200}
        height={500}
        // className="w-full max-w-[500px] mx-0"
        priority
        onError={handleImageError}
      />
    ) : isTab ? (
      <Image
        src={getWale()}
        alt="Wale Image"
        width={300}
        height={500}
        // className="w-full max-w-[500px] mx-0"
        priority
        onError={handleImageError}
      />
    ) : isDeskTop ? (
      <Image
        src={getWale()}
        alt="Wale Image"
        width={500}
        height={500}
        // className="w-full max-w-[500px] mx-0"
        priority
        onError={handleImageError}
      />
    ) : (
      <Image
        src={getWale()}
        alt="Wale Image"
        width={700}
        height={700}
        className="w-full"
        priority
        onError={handleImageError}
      />
    );
  };
  const renderChat = () => {
    return isMobile ? (
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
    ) : isTab ? (
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
    ) : isDeskTop ? (
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
            <CloseIcon className="h-7 w-7" />
          ) : (
            <>
              <ChatBubbleOutlineIcon className="h-7 w-7" />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 transform rotate-45 translate-x-1/2 translate-y-1/2"></span>
            </>
          )}
        </span>
      </Button>
    ) : (
      <Button
        className={`fixed bottom-8 right-8 h-20 w-20 rounded-full bg-blue-500 transition-transform transform ${
          isOpen ? "rotate-90" : ""
        } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden ${
          isMobile && isOpen ? "hidden" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <span className="text-white relative">
          {isOpen ? (
            <CloseIcon className="h-10 w-10" />
          ) : (
            <>
              <ChatBubbleOutlineIcon className="h-10 w-10" />
            </>
          )}
        </span>
      </Button>
    );
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
        <div className="flex justify-center mb-20">
          <h3 className=" text-4xl font-Poppins font-bold ">
            <span className="flex justify-center">A New Way </span>
            To <span className="font-grand">Spend </span>Money
          </h3>
        </div>

        <div className="text-center font-Poppins  text-black bg-gradient-to-tr from-purple-300 via-grey-400 to-white bg-opacity-90 px-8 py-3 rounded-full shadow-lg mb-6 border-2 border-white ">
          {rateLoading ? (
            <h2 className="font-Poppins text-sm md:text-xl ">
              {/* animate-pulse */}
              Loading Exchange rate...
            </h2>
          ) : rateError ? (
            <h2 className="font-Poppins text-sm md:text-xl ">
              {/* animate-pulse */}
              {rateError.message}
            </h2>
          ) : (
            <span className="text-blue-700 font-Poppins text-xl md:text-2xl font-bold animate-pulse">
              <b>
                {" "}
                {formatCurrency(rate?.toString() ?? "0", "NGN", "en-NG")}/$1
              </b>
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-4 space-y-4 sm:space-y-0 sm:space-x-4 mb-5">
          <Button
            className="px-4 py-2 bg-blue-500 text-white rounded-full w-full sm:w-auto hover:bg-blue-500"
            onClick={() => setIsOpen(true)}
          >
            {isClient ? <SendMoney /> : "Spend Money"}
          </Button>
        </div>

        <div className="text-center bg-white font-Poppins  text-black  px-8 py-2 rounded-full shadow-lg mb-6 border-2 border-white">
          {TvtLoading ? (
            <h2 className="font-Poppins text-xs md:text-sm animate-pulse">
              Loading Total Volume Traded YTD...
            </h2>
          ) : tvtError ? (
            <h2 className="font-Poppins text-xs md:text-sm animate-pulse">
              {tvtError.message}
            </h2>
          ) : (
            <h3 className="font-bold font-Poppins text-sm md:text-lg text-black">
              Volume(YTD):
              <span className="text-green-600 text-sm md:text-lg animate-pulse">
                <b> {formatCurrency(tvt?.toString() ?? "0", "USD")}</b>
              </span>
            </h3>
          )}
        </div>

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
        className={`absolute left-0 bottom-0 transform-y-1/4 ${
          isOpen ? "z-0" : "z-10"
        } `}
      >
        {renderWale()}
      </div>

      {renderChat()}

      {isOpen && (
        <div className="fixed inset-0 z-40">
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

{
  /* <div
          className="absolute bg-blue-500 text-white text-sm text-nowrap font-Poppins px-5 py-2 rounded-full w-28 h-9"
          style={{
            transform: "rotate(-12.75deg)",
            top: "33%",
            right: "36%",
            zIndex: "10",
          }}
        >
          with crypto
        </div> */
}

{
  /* <h3 className="font-bold font-Poppins text-sm md:text-lg text-black">
          Todays rate is:
        </h3>
        <div className="text-center font-Poppins  text-black bg-gradient-to-tr from-purple-300 via-grey-400 to-white bg-opacity-90 px-8 py-3 rounded-full shadow-lg mb-6 border-2 border-white ">
          {loading ? (
            <h2 className="font-Poppins text-sm md:text-xl ">
           
              Loading Exchange rate...
            </h2>
          ) : (
            <span className="text-blue-700 font-Poppins text-xl md:text-2xl font-bold animate-pulse">
              <b> {formattedRate}/$1</b>
            </span>
          )}
        </div> */
}

//  <div className="text-center bg-white font-Poppins  text-black  px-8 py-2 rounded-full shadow-lg mb-6 border-2 border-white">
//    {tvtLoading ? (
//      <h2 className="font-Poppins text-xs md:text-sm animate-pulse">
//        Loading Total Volume Traded YTD...
//      </h2>
//    ) : (
//      <h3 className="font-bold font-Poppins text-sm md:text-lg text-black">
//        Volume(YTD):
//        <span className="text-green-600 text-sm md:text-lg animate-pulse">
//          <b> {formattedTotalVolume}</b>
//        </span>
//      </h3>
//    )}
//  </div>;

{
  /* <Button
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
      </Button> */
}

// const fetchData = async () => {
//   setLoading(true);
//   try {
//     const fetchedRate = await fetchRate();
//     const rateFormated = formatCurrency(
//       fetchedRate.toString(),
//       "NGN",
//       "en-NG"
//     );
//     setFormattedRate(rateFormated);
//     setLoading(false);
//   } catch (error) {
//     console.error("Failed to fetch rate:", error);
//   }
// };

// const fetchTVT = async () => {
//   setTVTLoading(true);
//   try {
//     const totalVolume = await fetchTotalVolume();
//     const formattedTotalVolume = formatCurrency(
//       totalVolume.toString(),
//       "USD"
//     );
//     setFormattedTotalVolume(formattedTotalVolume);
//     setTVTLoading(false);
//   } catch (error) {}
// };
