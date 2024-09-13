// import React, { useEffect, useRef, useState } from "react";
// import ChatBot from "./ChatBot";
// import CloseIcon from "@mui/icons-material/Close";
// import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
// import Junk from "../junks/junk";
// import { fetchRate } from "../helpers/api_calls";
// import { formatCurrency } from "../helpers/format_currency";
// import SpendMoney from "./SpendMoney";
// import SendMoney from "./SendMoney";
// import {
//   approveAmount,
//   generateAlias,
//   setSpender,
//   transferTokens,
// } from "../helpers/spende_ether";
// import { useAccount } from "wagmi";
// import Loader from "./Loader";

// const PageBody: React.FC = () => {
//   // my state hooks
//   // hook to show if chat is open or not
//   const [isOpen, setIsOpen] = useState(false);
//   const [formattedRate, setFormattedRate] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [rate, setRate] = useState("");
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const [loading, setLoading] = useState(false);
//   const [approveLoading, setApproveLoading] = useState(false);
//   const [spendloading, setSpendLoading] = useState(false);
//   useEffect(() => {
//     if (isOpen && textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, [isOpen]);
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const fetchedRate = await fetchRate();
//       setRate(fetchedRate.toString());
//       const formattedRate = formatCurrency(
//         fetchedRate.toString(),
//         "NGN",
//         "en-NG"
//       );
//       setFormattedRate(formattedRate);
//       // setSharedRate(fetchedRate.toString());
//       setError(null);
//       setLoading(false);
//     } catch (error) {
//       console.error("Failed to fetch rate:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     // console.log(
//     //   "cleaned price is",
//     //   // cleanPrice
//     //   Math.round(parseFloat(cleanPrice))
//     // );
//   }, []);
//   const account = useAccount();
//   const wallet = account.address;

//   const handleApprove = async () => {
//     try {
//       setApproveLoading(true);
//       await setSpender(wallet);
//       await approveAmount("0.001");

//       setApproveLoading(false);
//       alert("Approval successful!");
//     } catch (error) {
//       setApproveLoading(false);
//       alert("Error Approving");
//       console.error("Error approving amount:", error);
//     }
//   };

//   const handleTransfer = async () => {
//     try {
//       setSpendLoading(true);
//       await transferTokens(
//         wallet,
//         "0x77Af2C6Da8c16E3825f1185589E8cbc1710a7639",
//         "0.001"
//       );
//       setSpendLoading(false);
//       alert("Transfer successful!");
//     } catch (error) {
//       setSpendLoading(false);
//       alert("There was error completing the Transfer");
//       console.error("Error transferring amount:", error);
//     }
//   };

//   return (
//     <div className="relative h-dvh w-full flex flex-col items-center justify-center">
//       {loading ? (
//         <h2 className="font-Poppins text-black ">Loading Exchange rate...</h2>
//       ) : (
//         <div className="text-center">
//           <h2 className="font-bold font-Poppins text-black text-2xl">
//             Today Rate: <br />
//             <span className="animate-pulse text-blue-500 text-5xl">
//               <b>{formattedRate}/$1</b>
//             </span>
//           </h2>
//           <div className="flex justify-center mt-4 space-x-4">
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//               onClick={() => setIsOpen(true)}
//             >
//               {isClient ? <SpendMoney /> : null}
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//               onClick={() => setIsOpen(true)}
//             >
//               {isClient ? <SendMoney /> : null}
//             </button>
//           </div>
//         </div>
//       )}

// <button
//   className={`fixed bottom-8 right-8 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 transition-transform transform ${
//     isOpen ? "rotate-90" : ""
//   }`}
//   onClick={() => setIsOpen(!isOpen)}
// >
//   <span className="text-white material-symbols-outlined">
//     {isOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
//   </span>
// </button>
// {isOpen && <ChatBot />}
//     </div>
//   );
// };

// export default PageBody;

// //  {
// //    !approveLoading ? (
// //      <button
// //        className="bg-green-700 mt-4 p-2 rounded text-white"
// //        type="button"
// //        onClick={handleApprove}
// //      >
// //        Approve transfer
// //      </button>
// //    ) : (
// //      <div className="text-white mt-4 p-2">
// //        <Loader />
// //      </div>
// //    );
// //  }

// //  {
// //    !spendloading ? (
// //      <button
// //        className="bg-green-700 mt-4 p-2 rounded text-white"
// //        type="button"
// //        onClick={handleTransfer}
// //      >
// //        Test transfer
// //      </button>
// //    ) : (
// //      <div className="text-white mt-4 p-2">
// //        <Loader />
// //      </div>
// //    );
// //  }

import React, { useEffect, useState } from "react";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
import SpendMoney from "./SpendMoney";
import SendMoney from "./SendMoney";
import { useAccount } from "wagmi";
import { fetchRate } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col">
      <div
        className={`absolute inset-0 bg-cover bg-center h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] ${
          isOpen ? "z-0" : "z-10"
        }`}
        style={{
          backgroundImage: `url('${
            isMobile
              ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone%20view%20(1)-UxzU0McUQGK7DL2jHh5ybwl9fir4Uv.jpg"
              : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg"
          }')`,
        }}
      ></div>

      <div
        className={`relative flex-grow flex flex-col items-center justify-center p-4 md:p-8 ${
          isOpen ? "z-0" : "z-20"
        }`}
      >
        <div className="text-center text-black">
          {loading ? (
            <h2 className="font-Poppins text-2xl animate-pulse">
              Loading Exchange rate...
            </h2>
          ) : (
            <div>
              <h2 className="font-bold font-Poppins text-2xl md:text-3xl mb-4">
                Today's Rate: <br />
                <span className="text-blue-300 text-4xl md:text-5xl">
                  <b>{formattedRate}/$1</b>
                </span>
              </h2>

              <div className="flex justify-center mt-4 space-x-4">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setIsOpen(true)}
                >
                  {isClient ? <SpendMoney /> : null}
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setIsOpen(true)}
                >
                  {isClient ? <SendMoney /> : null}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        className={`fixed bottom-10 right-14 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 transition-transform transform ${
          isOpen ? "rotate-90" : ""
        } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 z-50 shadow-[0_0_20px_rgba(0,0,0,0.4)] overflow-hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white relative">
          {isOpen ? (
            <CloseIcon />
          ) : (
            <>
              <ChatBubbleOutlineIcon />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 transform rotate-45 translate-x-1/2 translate-y-1/2"></span>
            </>
          )}
        </span>
      </button>

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
//         className={`absolute inset-0 bg-cover bg-center h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] ${
//           isOpen ? "z-0" : "z-10"
//         }`}
//         style={{
//           backgroundImage: `url('${
//             isMobile
//               ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/phone%20view%20(1)-UxzU0McUQGK7DL2jHh5ybwl9fir4Uv.jpg"
//               : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/web%20-wDYUWpXeHCSrDTcspSGKQiLTi5cKfy.jpg"
//           }')`,
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
//                 <button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SpendMoney /> : null}
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//                   onClick={() => setIsOpen(true)}
//                 >
//                   {isClient ? <SendMoney /> : null}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//     <button
//         className={`fixed bottom-8 right-5 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 transition-transform transform ${
//           isOpen ? "rotate-90" : ""
//         } hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 z-50`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-white">
//           {isOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
//         </span>
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 z-40">
//           <ChatBot />
//         </div>
//       )}
//     </div>
//   );
// }
