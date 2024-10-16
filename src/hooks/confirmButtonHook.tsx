"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { proceedWithTransaction } from "@/utils/transactCryptoUtils";
import { CountdownTimer } from "@/helpers/format_date";

interface ConfirmAndProceedButtonProps {
  phoneNumber: string;
  setLoading: (isLoading: boolean) => void;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean
  ) => Promise<void>;
}

export default function ConfirmAndProceedButton({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
}: ConfirmAndProceedButtonProps) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isButtonClicked) return;

    setIsButtonClicked(true);
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(`Transaction processed for phone number: ${phoneNumber}`);

      const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
      const requestPayment = sharedPaymentMode.toLowerCase() === "request";

      setLoading(true);
      await processTransaction(phoneNumber, false, isGiftTrx, requestPayment);
    } catch (error) {
      console.error("Error processing transaction:", error);
      setIsButtonClicked(false);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={handleClick}
        disabled={isButtonClicked}
        aria-busy={isProcessing}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
      >
        {isProcessing ? (
          "Generating wallet for you..."
        ) : isButtonClicked ? (
          <span className="flex items-center">
            Completed <CheckCircle className="ml-2 h-4 w-4" />
          </span>
        ) : (
          "Confirm & Proceed"
        )}
      </Button>
      <p role="status" className="text-sm text-muted-foreground">
        {/* {isButtonClicked ? "This wallet expires in " + <CountdownTimer /> : ``} */}
        {isButtonClicked ? (
          <>
            This wallet expires in <CountdownTimer />
          </>
        ) : null}
      </p>
    </div>
  );
}

