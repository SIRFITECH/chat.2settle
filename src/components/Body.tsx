import React, { useEffect, useRef, useState } from "react";
import ChatBot from "./ChatBot";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/Chat";
import Junk from "../junks/junk";
import { fetchRate } from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import SpendMoney from "./SpendMoney";
import SendMoney from "./SendMoney";
import {
  approveAmount,
  generateAlias,
  setSpender,
  transferTokens,
} from "../helpers/spende_ether";
import { useAccount } from "wagmi";
import Loader from "./Loader";

const PageBody: React.FC = () => {
  // my state hooks
  // hook to show if chat is open or not
  const [isOpen, setIsOpen] = useState(false);
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [spendloading, setSpendLoading] = useState(false);
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    // console.log(
    //   "cleaned price is",
    //   // cleanPrice
    //   Math.round(parseFloat(cleanPrice))
    // );
  }, []);
  const account = useAccount();
  const wallet = account.address;

  const handleApprove = async () => {
    try {
      setApproveLoading(true);
      await setSpender(wallet);
      await approveAmount("0.001");

      setApproveLoading(false);
      alert("Approval successful!");
    } catch (error) {
      setApproveLoading(false);
      alert("Error Approving");
      console.error("Error approving amount:", error);
    }
  };

  const handleTransfer = async () => {
    try {
      setSpendLoading(true);
      await transferTokens(
        wallet,
        "0x77Af2C6Da8c16E3825f1185589E8cbc1710a7639",
        "0.001"
      );
      setSpendLoading(false);
      alert("Transfer successful!");
    } catch (error) {
      setSpendLoading(false);
      alert("There was error completing the Transfer");
      console.error("Error transferring amount:", error);
    }
  };

  return (
    <div className="relative h-dvh w-full flex flex-col items-center justify-center">
      {loading ? (
        <h2 className="font-Poppins text-black ">Loading Exchange rate...</h2>
      ) : (
        <div className="text-center">
          <h2 className="font-bold font-Poppins text-black text-2xl">
            Today Rate: <br />
            <span className="animate-pulse text-blue-500 text-5xl">
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

//  {
//    !approveLoading ? (
//      <button
//        className="bg-green-700 mt-4 p-2 rounded text-white"
//        type="button"
//        onClick={handleApprove}
//      >
//        Approve transfer
//      </button>
//    ) : (
//      <div className="text-white mt-4 p-2">
//        <Loader />
//      </div>
//    );
//  }

//  {
//    !spendloading ? (
//      <button
//        className="bg-green-700 mt-4 p-2 rounded text-white"
//        type="button"
//        onClick={handleTransfer}
//      >
//        Test transfer
//      </button>
//    ) : (
//      <div className="text-white mt-4 p-2">
//        <Loader />
//      </div>
//    );
//  }
