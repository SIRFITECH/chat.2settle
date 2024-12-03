import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Check } from "lucide-react";
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

// interface ConfirmAndProceedButtonProps {
//   phoneNumber: string;
//   setLoading: (isLoading: boolean) => void;
//   sharedPaymentMode: string;
//   processTransaction: (
//     phoneNumber: string,
//     isGift: boolean,
//     isGiftTrx: boolean,
//     requestPayment: boolean,
//     activeWallet: string,
//     lastAssignedTime: Date
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
//   const [activeWallet, setActiveWallet] = useState<string | null>(null);
//   const [lastAssignedTime, setLastAssignedTime] = useState<Date | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [isExpired, setIsExpired] = useState(false);
//   const [hasCopyButtonBeenClicked, setHasCopyButtonBeenClicked] =
//     useState(false);
//   const timerRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     setIsDialogOpen(true);
//   }, []);

//   useEffect(() => {
//     if (lastAssignedTime) {
//       timerRef.current = setTimeout(() => {
//         setIsExpired(true);
//       }, 5 * 60 * 1000);

//       return () => {
//         if (timerRef.current) {
//           clearTimeout(timerRef.current);
//         }
//       };
//     }
//   }, [lastAssignedTime]);

//   const handleConfirm = async () => {
//     setIsDialogOpen(false);
//     setIsButtonClicked(true);
//     setIsProcessing(true);
//     setError(null);

//     try {
//       const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
//         network
//       );
//       const assignedTime = new Date(lastAssignedTime);
//       setActiveWallet(activeWallet);
//       setLastAssignedTime(assignedTime);

//       const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
//       const requestPayment = sharedPaymentMode.toLowerCase() === "request";

//       setLoading(true);
//       await processTransaction(
//         phoneNumber,
//         false,
//         isGiftTrx,
//         requestPayment,
//         activeWallet,
//         assignedTime
//       );

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
//   };

//   const handleCopyWallet = (wallet: string) => {
//     navigator.clipboard.writeText(wallet).then(() => {
//       setIsCopied(true);
//       setHasCopyButtonBeenClicked(true);
//       setTimeout(() => setIsCopied(false), 3000);
//     });
//   };

//   const truncateWallet = (wallet: string) => {
//     return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
//   };

//   const isCopyButtonDisabled = hasCopyButtonBeenClicked || isExpired;

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Please Note</DialogTitle>
//             <DialogDescription>
//               <span>
//                 Make sure you complete the transaction within <b>5 mins</b>
//               </span>
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
//               onClick={handleConfirm}
//             >
//               Okay
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//       <Button
//         className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
//         disabled={isButtonClicked}
//         aria-busy={isProcessing}
//         onClick={() => setIsDialogOpen(true)}
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
//       {activeWallet && (
//         <div className="flex flex-col items-center justify-center space-y-2">
//           <p className="text-sm text-center">
//             Here is a {network.toUpperCase()} wallet for your transaction:{" "}
//             {truncateWallet(activeWallet)}
//           </p>
//           <Button
//             onClick={() => handleCopyWallet(activeWallet)}
//             disabled={isCopyButtonDisabled}
//             variant="outline"
//             size="sm"
//           >
//             {!isCopyButtonDisabled ? (
//               <>
//                 <Copy className="w-4 h-4 mr-2" />
//                 <span>Copy Wallet</span>
//               </>
//             ) : (
//               <>
//                 <Check className="w-4 h-4 mr-2" />
//                 <span>Wallet Copied</span>
//               </>
//             )}
//           </Button>
//         </div>
//       )}
//       <p role="status" className="text-sm text-muted-foreground">
//         {isButtonClicked && lastAssignedTime && !isExpired && (
//           <>
//             This wallet expires in{" "}
//             <CountdownTimer
//               expiryTime={new Date(lastAssignedTime.getTime() + 5 * 60 * 1000)}
//             />
//           </>
//         )}
//         {isExpired && "This wallet has expired."}
//       </p>
//     </div>
//   );
// }
interface ConfirmAndProceedButtonProps {
  phoneNumber: string;
  setLoading: (loading: boolean) => void;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isRetry: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet: string,
    assignedTime: Date
  ) => Promise<void>;
  network: string;
}

interface WalletState {
  activeWallet: string | null;
  lastAssignedTime: Date | null;
  isExpired: boolean;
}

function ConfirmAndProceedButton({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
}: ConfirmAndProceedButtonProps) {
  const [buttonState, setButtonState] = useState({
    isClicked: false,
    isProcessing: false,
    error: null as string | null,
  });

  const [dialogState, setDialogState] = useState({
    isOpen: true,
    isCopied: false,
    hasCopyButtonBeenClicked: false,
  });

  const [walletState, setWalletState] = useState<WalletState>({
    activeWallet: null,
    lastAssignedTime: null,
    isExpired: false,
  });

  useEffect(() => {
    if (walletState.lastAssignedTime) {
      const timer = setTimeout(() => {
        setWalletState((prev) => ({ ...prev, isExpired: true }));
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [walletState.lastAssignedTime]);

  const handleConfirm = useCallback(async () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    setButtonState({ isClicked: true, isProcessing: true, error: null });

    try {
      const { activeWallet, lastAssignedTime } = await getAvaialableWallet(
        network
      );
      const assignedTime = new Date(lastAssignedTime);
      setWalletState({
        activeWallet,
        lastAssignedTime: assignedTime,
        isExpired: false,
      });

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
      setButtonState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isClicked: false,
      }));
    } finally {
      setButtonState((prev) => ({ ...prev, isProcessing: false }));
      setLoading(false);
    }
  }, [phoneNumber, setLoading, sharedPaymentMode, processTransaction, network]);

  const handleCopyWallet = useCallback((wallet: string) => {
    navigator.clipboard.writeText(wallet).then(() => {
      setDialogState((prev) => ({
        ...prev,
        isCopied: true,
        hasCopyButtonBeenClicked: true,
      }));
      setTimeout(
        () => setDialogState((prev) => ({ ...prev, isCopied: false })),
        3000
      );
    });
  }, []);

  const truncateWallet = useMemo(
    () => (wallet: string) => {
      return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
    },
    []
  );

  const isCopyButtonDisabled =
    dialogState.hasCopyButtonBeenClicked || walletState.isExpired;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Dialog
        open={dialogState.isOpen}
        onOpenChange={(open) =>
          setDialogState((prev) => ({ ...prev, isOpen: open }))
        }
      >
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
            <Button
              variant="outline"
              onClick={() =>
                setDialogState((prev) => ({ ...prev, isOpen: false }))
              }
            >
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
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
        disabled={buttonState.isClicked}
        aria-busy={buttonState.isProcessing}
        onClick={() => setDialogState((prev) => ({ ...prev, isOpen: true }))}
      >
        {buttonState.isProcessing ? (
          "Generating wallet for you..."
        ) : buttonState.isClicked ? (
          <span className="flex items-center">
            Completed <CheckCircle className="ml-2 h-4 w-4" />
          </span>
        ) : (
          "Confirm & Proceed"
        )}
      </Button>
      {buttonState.error && <p className="text-red-500">{buttonState.error}</p>}
      {walletState.activeWallet && (
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-sm text-center">
            Here is a {network.toUpperCase()} wallet for your transaction:{" "}
            {truncateWallet(walletState.activeWallet)}
          </p>
          <Button
            onClick={() => handleCopyWallet(walletState.activeWallet!)}
            disabled={isCopyButtonDisabled}
            variant="outline"
            size="sm"
          >
            {!isCopyButtonDisabled ? (
              <>
                <Copy className="w-4 h-4 mr-2" />
                <span>Copy Wallet</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                <span>Wallet Copied</span>
              </>
            )}
          </Button>
        </div>
      )}
      <p role="status" className="text-sm text-muted-foreground">
        {buttonState.isClicked &&
          walletState.lastAssignedTime &&
          !walletState.isExpired && (
            <>
              This wallet expires in{" "}
              <CountdownTimer
                expiryTime={
                  new Date(
                    walletState.lastAssignedTime.getTime() + 5 * 60 * 1000
                  )
                }
              />
            </>
          )}
        {walletState.isExpired && "This wallet has expired."}
      </p>
    </div>
  );
}

export default React.memo(ConfirmAndProceedButton);
