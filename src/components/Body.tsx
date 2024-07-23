// components/LiveChat.tsx
import React, { useEffect, useRef, useState } from "react";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
import Junk from "../junks/junk";
import { fetchRate } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
// import { formatCurrency } from "utils/formatCurrency";
// import { fetchRate } from "utils/ApiCalls";
// import { useSharedState } from "context/SharedStateContext";

const PageBody: React.FC = () => {
  // my state hooks
  // hook to show if chat is open or not
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);
  //   const { sharedRate, setSharedRate } = useSharedState();

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedRate = await fetchRate();
      setRate(fetchedRate.toString());
      const formattedRate = formatCurrency(
        fetchedRate.toString(),
        "NGN",
        "en-NG"
      );
      setFormattedRate(formattedRate);
      // setSharedRate(fetchedRate.toString());
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="relative h-dvh w-full flex flex-col items-center justify-center">
      {loading ? (
        <h2 className="font-Poppins text-black ">Loading Exchange rate...</h2>
      ) : (
        <h2 className="font-bold font-Poppins text-black ">
          Today Rate:{" "}
          <span className="animate-pulse text-blue-500">
            <b>{formattedRate}/$1</b>
          </span>
        </h2>
      )}
      <button
        className={`fixed bottom-8 right-8 h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 transition-transform transform ${
          isOpen ? "rotate-90" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white material-symbols-outlined">
          {isOpen ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
        </span>
      </button>
      {isOpen && <ChatBot />}
    </div>
  );
};

export default PageBody;
