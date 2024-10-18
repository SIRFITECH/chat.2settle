"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { CountdownTimer } from "@/helpers/format_date";
import { getAvaialableWallet } from "@/helpers/api_calls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmAndProceedButtonProps {
  phoneNumber: string;
  setLoading: (isLoading: boolean) => void;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet: string,
    lastAssignedTime: Date
  ) => Promise<void>;
  network: string;
}

export default function ConfirmAndProceedButton({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
}: ConfirmAndProceedButtonProps) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [lastAssignedTime, setLastAssignedTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsDialogOpen(true);
  }, []);

  const handleConfirm = async () => {
    setIsDialogOpen(false);
    setIsButtonClicked(true);
    setIsProcessing(true);
    setError(null);

    try {
      const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
        network
      );
      const assignedTime = new Date(lastAssignedTime);
      setActiveWallet(activeWallet);
      setLastAssignedTime(assignedTime);

      const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
      const requestPayment = sharedPaymentMode.toLowerCase() === "request";

      setLoading(true);
      await processTransaction(
        phoneNumber,
        false,
        isGiftTrx,
        requestPayment,
        activeWallet,
        assignedTime
      );

      console.log(`Transaction processed for phone number: ${phoneNumber}`);
    } catch (error) {
      console.error("Error processing transaction:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsButtonClicked(false);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please Note</DialogTitle>
            <DialogDescription>
              <span>
                Make sure you complete the transaction within <b>5 mins</b>
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
              onClick={handleConfirm}
            >
              Okay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        disabled={isButtonClicked}
        aria-busy={isProcessing}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
        onClick={() => setIsDialogOpen(true)}
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
      {error && <p className="text-red-500">{error}</p>}
      {activeWallet && (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-center">
            Here is a {network.toUpperCase()} wallet for your transaction:{" "}
            {activeWallet}
          </p>
        </div>
      )}
      <p role="status" className="text-sm text-muted-foreground">
        {isButtonClicked && lastAssignedTime && (
          <>
            This wallet expires in{" "}
            <CountdownTimer
              expiryTime={new Date(lastAssignedTime.getTime() + 5 * 60 * 1000)}
            />
          </>
        )}
      </p>
    </div>
  );
}
