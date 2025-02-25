import { getAvaialableWallet } from "@/helpers/api_calls";
import React from "react";

export const handleConfirm = async ({
  setState,
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
}: {
  setState: React.Dispatch<
    React.SetStateAction<{
      isButtonClicked: boolean;
      isProcessing: boolean;
      error: string | null;
      activeWallet: string | null;
      lastAssignedTime: Date | null;
      isExpired: boolean;
      isDialogOpen: boolean;
      isCopied: boolean;
      hasCopyButtonBeenClicked: boolean;
    }>
  >;
  phoneNumber: string;
  setLoading: (loading: boolean) => void;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isRetry: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet: string,
    assignedTime?: Date
  ) => Promise<void>;
  network: string;
}) => {
  
  setState((prev) => ({
    ...prev,
    isDialogOpen: false,
    isButtonClicked: true,
    isProcessing: true,
    error: null,
  }));

  try {
    const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
      network
    );
    const assignedTime = new Date(lastAssignedTime);
    setState((prev) => ({
      ...prev,
      activeWallet,
      lastAssignedTime: assignedTime,
    }));

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
    setState((prev) => ({
      ...prev,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      isButtonClicked: false,
    }));
  } finally {
    setState((prev) => ({ ...prev, isProcessing: false }));
    setLoading(false);
  }
};
// useCallback( [
//     phoneNumber,
//     setLoading,
//     sharedPaymentMode,
//     processTransaction,
//     network,
//   ]);
