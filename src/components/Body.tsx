// import React, { useEffect, useState } from "react";
// import ChatBot from "./ChatBot";
// import CloseIcon from "@mui/icons-material/Close";
// import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
// import SpendMoney from "./SpendMoney";
// import SendMoney from "./SendMoney";
// import { useAccount } from "wagmi";
// import { fetchRate } from "../helpers/api_calls";
// import { formatCurrency } from "../helpers/format_currency";

// import { Button } from "@/components/ui/button";

// const useMediaQuery = (query: string) => {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia(query);
//     if (media.matches !== matches) {
//       setMatches(media.matches);
//     }
//     const listener = () => setMatches(media.matches);
//     window.addEventListener("resize", listener);
//     return () => window.removeEventListener("resize", listener);
//   }, [matches, query]);

//   return matches;
// };

// export default function Component() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formattedRate, setFormattedRate] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const { address: wallet } = useAccount();
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   useEffect(() => {
//     setIsClient(true);
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const fetchedRate = await fetchRate();
//       const formattedRate = formatCurrency(
//         fetchedRate.toString(),
//         "NGN",
//         "en-NG"
//       );
//       setFormattedRate(formattedRate);
//     } catch (error) {
//       console.error("Failed to fetch rate:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full flex flex-col">
//       <div
//         className={`absolute inset-0 bg-cover bg-center ${
//           isOpen ? "z-0" : "z-10"
//         }`}
//         style={{
//           backgroundImage: `url('${
//             isMobile
//               ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone%20view%20(1)-UxzU0McUQGK7DL2jHh5ybwl9fir4Uv.jpg"
//               : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg"
//           }')`,
//           height: "calc(100vh - var(--header-height))",
//         }}
//       ></div>

//       <div
//         className={`relative flex-grow flex flex-col items-center justify-center p-4 md:p-8 ${
//           isOpen ? "z-0" : "z-20"
//         }`}
//       >
//         <div className="text-center text-black">
//           {loading ? (
//             <h2 className="font-Poppins text-2xl animate-pulse">
//               Loading Exchange rate...
//             </h2>
//           ) : (
//             <div>
//               <h2 className="font-bold font-Poppins text-2xl md:text-3xl mb-4">
//                 Today's Rate: <br />
//                 <span className="text-blue-300 text-4xl md:text-5xl">
//                   <b>{formattedRate}/$1</b>
//                 </span>
//               </h2>

//               <div className="flex justify-center mt-4 space-x-4">
//                 <Button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SpendMoney /> : null}
//                 </Button>
//                 <Button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SendMoney /> : null}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Button
//         className={`fixed bottom-8 right-8 h-16 w-16 rounded-full bg-blue-500 transition-transform transform ${
//           isOpen ? "rotate-90" : ""
//         } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-white relative">
//           {isOpen ? (
//             <CloseIcon className="h-8 w-8" />
//           ) : (
//             <>
//               <ChatBubbleOutlineIcon className="h-8 w-8" />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 transform rotate-45 translate-x-1/2 translate-y-1/2"></span>
//             </>
//           )}
//         </span>
//       </Button>

//       {isOpen && (
//         <div className="fixed inset-0 z-40">
//           <ChatBot />
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";

import SpendMoney from "./SpendMoney";
import SendMoney from "./SendMoney";
import { useAccount } from "wagmi";
import { fetchRate } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";

import { Button } from "@/components/ui/button";

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

export default function Component() {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { address: wallet } = useAccount();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1365px)");
  const isDesktop = useMediaQuery("(min-width: 1366px)");

  useEffect(() => {
    setIsClient(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedRate = await fetchRate();
      const formattedRate = formatCurrency(
        fetchedRate.toString(),
        "NGN",
        "en-NG"
      );
      setFormattedRate(formattedRate);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    }
  };

  const getBackgroundImage = () => {
    if (isMobile) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone%20view%20(1)-UxzU0McUQGK7DL2jHh5ybwl9fir4Uv.jpg";
    } else if (isTablet) {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tab-aAggeZYF4LHclKlRPxmRfvkKXr3fED.jpg";
    } else {
      return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg";
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      <div
        className={`absolute inset-0 ${isOpen ? "z-0" : "z-10"}`}
        style={{
          backgroundImage: `url('${getBackgroundImage()}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: isMobile ? "cover" : "100% auto",
          height: "calc(100vh - var(--header-height))",
          width: isMobile ? "100%" : isTablet ? "110%" : "100%",
          left: isMobile ? "0" : isTablet ? "-5%" : "0",
        }}
      ></div>

      <div
        className={`relative flex-grow flex flex-col items-center justify-center p-4 md:p-8 ${
          isOpen ? "z-0" : "z-20"
        }`}
      >
        <div className="text-center text-black bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          {loading ? (
            <h2 className="font-Poppins text-2xl animate-pulse">
              Loading Exchange rate...
            </h2>
          ) : (
            <div>
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
          )}
        </div>
      </div>

      <Button
        className={`fixed bottom-8 right-8 h-16 w-16 rounded-full bg-blue-500 transition-transform transform ${
          isOpen ? "rotate-90" : ""
        } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden`}
        onClick={() => setIsOpen(!isOpen)}
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
          <ChatBot />
        </div>
      )}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import ChatBot from "./ChatBot";
// import CloseIcon from "@mui/icons-material/Close";
// import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
// import SpendMoney from "./SpendMoney";
// import SendMoney from "./SendMoney";
// import { useAccount } from "wagmi";
// import { fetchRate } from "../helpers/api_calls";
// import { formatCurrency } from "../helpers/format_currency";

// import { Button } from "@/components/ui/button";

// const useMediaQuery = (query: string) => {
//   const [matches, setMatches] = useState(false);

//   useEffect(() => {
//     const media = window.matchMedia(query);
//     if (media.matches !== matches) {
//       setMatches(media.matches);
//     }
//     const listener = () => setMatches(media.matches);
//     window.addEventListener("resize", listener);
//     return () => window.removeEventListener("resize", listener);
//   }, [matches, query]);

//   return matches;
// };

// export default function Component() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formattedRate, setFormattedRate] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [isClient, setIsClient] = useState(false);
//   const { address: wallet } = useAccount();
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const isTab = useMediaQuery("(max-width: 1px)");

//   useEffect(() => {
//     setIsClient(true);
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const fetchedRate = await fetchRate();
//       const formattedRate = formatCurrency(
//         fetchedRate.toString(),
//         "NGN",
//         "en-NG"
//       );
//       setFormattedRate(formattedRate);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch rate:", error);
//     }
//   };

//   return (
//     <div className="relative min-h-screen w-full flex flex-col">
//       <div
//         className={`absolute inset-0 bg-cover bg-center ${
//           isOpen ? "z-0" : "z-10"
//         }`}
//         style={{
//           backgroundImage: `url('${
//             isMobile
//               ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone%20view%20(1)-UxzU0McUQGK7DL2jHh5ybwl9fir4Uv.jpg"
//               : isTab
//               ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg"
//               : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg"
//           }')`,
//           // backgroundSize: "container",
//           // backgroundPosition: "center",
//           // width: "110vw",
//           height: "calc(100vh - var(--header-height))",
//         }}
//       ></div>

//       <div
//         className={`relative flex-grow flex flex-col items-center justify-center p-4 md:p-8 ${
//           isOpen ? "z-0" : "z-20"
//         }`}
//       >
//         <div className="text-center text-black">
//           {loading ? (
//             <h2 className="font-Poppins text-2xl animate-pulse">
//               Loading Exchange rate...
//             </h2>
//           ) : (
//             <div>
//               <h2 className="font-bold font-Poppins text-2xl md:text-3xl mb-4">
//                 Today's Rate: <br />
//                 <span className="text-blue-300 text-4xl md:text-5xl">
//                   <b>{formattedRate}/$1</b>
//                 </span>
//               </h2>

//               <div className="flex justify-center mt-4 space-x-4">
//                 <Button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SpendMoney /> : null}
//                 </Button>
//                 <Button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SendMoney /> : null}
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Button
//         className={`fixed bottom-8 right-8 h-16 w-16 rounded-full bg-blue-500 transition-transform transform ${
//           isOpen ? "rotate-90" : ""
//         } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-white relative">
//           {isOpen ? (
//             <CloseIcon className="h-8 w-8" />
//           ) : (
//             <>
//               <ChatBubbleOutlineIcon className="h-8 w-8" />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 transform rotate-45 translate-x-1/2 translate-y-1/2"></span>
//             </>
//           )}
//         </span>
//       </Button>

//       {isOpen && (
//         <div className="fixed inset-0 z-40">
//           <ChatBot />
//         </div>
//       )}
//     </div>
//   );
// }
