// "use client";

// import React, { useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { CheckCircle } from "lucide-react";
// import { proceedWithTransaction } from "@/utils/transactCryptoUtils";
// import { CountdownTimer } from "@/helpers/format_date";
// import { getAvaialableWallet } from "@/helpers/api_calls";
// import { useSharedState } from "@/context/SharedStateContext";

// interface ConfirmAndProceedButtonProps {
//   phoneNumber: string;
//   setLoading: (isLoading: boolean) => void;
//   sharedPaymentMode: string;
//   processTransaction: (
//     phoneNumber: string,
//     isGift: boolean,
//     isGiftTrx: boolean,
//     requestPayment: boolean
//   ) => Promise<void>;
//   network: string;
// }

// export default function ConfirmAndProceedButton({
//   phoneNumber,
//   setLoading,
//   sharedPaymentMode,
//   processTransaction,
//   network,
// }: ConfirmAndProceedButtonProps) {
//   const [isButtonClicked, setIsButtonClicked] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [lastAssignedTime, setLastAssignedTime] = useState<Date | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const { sharedWallet, setSharedWallet } = useSharedState();

//   const handleClick = useCallback(async () => {
//     if (isButtonClicked) return;

//     setIsButtonClicked(true);
//     setIsProcessing(true);
//     setError(null);

//     try {
//       // Get available wallet
//       const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
//         network
//       );

//       // Set the shared wallet immediately
//       setSharedWallet(activeWallet);
//       setLastAssignedTime(new Date(lastAssignedTime));

//       // Process the transaction
//       const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
//       const requestPayment = sharedPaymentMode.toLowerCase() === "request";

//       setLoading(true);
//       await processTransaction(phoneNumber, false, isGiftTrx, requestPayment);

//       console.log(`Transaction processed for phone number: ${phoneNumber}`);
//     } catch (error) {
//       console.error("Error processing transaction:", error);
//       setError(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//       setIsButtonClicked(false);
//     } finally {
//       setIsProcessing(false);
//       setLoading(false);
//     }
//   }, [
//     isButtonClicked,
//     network,
//     setSharedWallet,
//     sharedPaymentMode,
//     phoneNumber,
//     setLoading,
//     processTransaction,
//   ]);

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <Button
//         onClick={handleClick}
//         disabled={isButtonClicked}
//         aria-busy={isProcessing}
//         className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
//       >
//         {isProcessing ? (
//           "Generating wallet for you..."
//         ) : isButtonClicked ? (
//           <span className="flex items-center">
//             Completed <CheckCircle className="ml-2 h-4 w-4" />
//           </span>
//         ) : (
//           "Confirm & Proceed"
//         )}
//       </Button>
//       {error && <p className="text-red-500">{error}</p>}
//       {sharedWallet && (
//         <p className="text-sm">
//           Here is your {network.toUpperCase()} wallet: {sharedWallet}
//         </p>
//       )}
//       <p role="status" className="text-sm text-muted-foreground">
//         {isButtonClicked && lastAssignedTime && (
//           <>
//             This wallet expires in{" "}
//             <CountdownTimer
//               expiryTime={new Date(lastAssignedTime.getTime() + 5 * 60 * 1000)}
//             />
//           </>
//         )}
//       </p>
//     </div>
//   );
// }

"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { getAvaialableWallet } from "@/helpers/api_calls";
import { useSharedState } from "@/context/SharedStateContext";
import { CountdownTimer } from "@/helpers/format_date";

// Define the ConfirmAndProceedButtonProps interface
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
  network: string;
  onWalletUpdate?: (wallet: string) => void;
}

export default function ConfirmAndProceedButton({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
  onWalletUpdate,
}: ConfirmAndProceedButtonProps) {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAssignedTime, setLastAssignedTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { sharedWallet, setSharedWallet } = useSharedState();
  const latestWalletRef = useRef(sharedWallet);

  // Update ref whenever sharedWallet changes
  useEffect(() => {
    latestWalletRef.current = sharedWallet;
  }, [sharedWallet]);

  const handleClick = useCallback(async () => {
    if (isButtonClicked) return;

    setIsButtonClicked(true);
    setIsProcessing(true);
    setError(null);

    try {
      const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
        network
      );

      // Update context and ref
      setSharedWallet(activeWallet);
      latestWalletRef.current = activeWallet;

      // Notify parent component about the wallet update
      if (onWalletUpdate) {
        onWalletUpdate(activeWallet);
      }

      setLastAssignedTime(new Date(lastAssignedTime));

      // Process the transaction
      const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
      const requestPayment = sharedPaymentMode.toLowerCase() === "request";

      setLoading(true);
      await processTransaction(phoneNumber, false, isGiftTrx, requestPayment);

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
  }, [
    isButtonClicked,
    network,
    setSharedWallet,
    sharedPaymentMode,
    phoneNumber,
    setLoading,
    processTransaction,
    onWalletUpdate,
  ]);

  // Function to get the latest wallet value
  const getLatestWallet = useCallback(() => latestWalletRef.current, []);

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
      {error && <p className="text-red-500">{error}</p>}
      {getLatestWallet() && (
        <p className="text-sm">
          Here is your {network.toUpperCase()} wallet: {getLatestWallet()}
        </p>
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
