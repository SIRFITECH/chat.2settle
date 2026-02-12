import { Button } from "@/components/ui/button";
import { processTransaction } from "@/core/process_transaction/process_transction_helpers";
import ConfirmDialog from "@/features/transact/confirmButton/ConfirmDialog";
import WalletInfo from "@/features/transact/confirmButton/WalletInfo";
import { CountdownTimer } from "@/helpers/format_date";
import { getAvaialableWallet } from "@/services/crypto/wallet";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useRef } from "react";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useConfirmDialogStore } from "stores/useConfirmDialogStore";
import { useAccount } from "wagmi";

export interface ConfirmAndProceedButtonProps {
  phoneNumber: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sharedPaymentMode: string;
  processTransaction: (
    phoneNumber: string,
    isRetry: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet: string,
    assignedTime?: Date,
  ) => Promise<void>;
  network: string;
  connectedWallet: boolean;
  amount: string;
}
const ConfirmAndProceedButton = () => {
  const loading = useChatStore((s) => s.loading);
  const setLoading = useChatStore((s) => s.setLoading);
  const currentStep = useChatStore((s) => s.currentStep);

  const { network } = usePaymentStore();
  const activeWallet = usePaymentStore((s) => s.activeWallet);
  const walletLastAssignedTime = usePaymentStore(
    (s) => s.walletLastAssignedTime,
  );

  const hasCopyButtonBeenClicked = useConfirmDialogStore(
    (s) => s.hasCopyButtonBeenClicked,
  );
  const setHasCopyButtonBeenClicked = useConfirmDialogStore(
    (s) => s.setHasCopyButtonBeenClicked,
  );
  const openConfirmDialog = useConfirmDialogStore((s) => s.open);
  const closeConfirmDialog = useConfirmDialogStore((s) => s.close);
  const walletIsExpired = useConfirmDialogStore((s) => s.walletIsExpired);
  const walletFetchError = useConfirmDialogStore((s) => s.walletFetchError);

  const hasOpenedRef = useRef(false);
  const account = useAccount();
  const SHOULD_OPEN_STEP = "sendPayment";
  const connectedWallet = account.isConnected;

  const handleConfirm = async () => {
    console.log("Just confirmed");
    try {
      setLoading(true);
      if (!network) throw new Error("Network is not set");

      await getAvaialableWallet(network.toLowerCase());
      setHasCopyButtonBeenClicked(false);
      
      await processTransaction();
    } catch (err) {
      console.log("Ther is an erro", err);
    } finally {
      setLoading(false);
    }
    // connectedWallet ? handleBlockchainPayment() : handleConfirmCallback()
  };

  const isExpired = walletIsExpired;

  const isCopyButtonDisabled = hasCopyButtonBeenClicked || isExpired;

  useEffect(() => {
    // do not run if the user is not have already copied wallet
    if (hasCopyButtonBeenClicked) return;
    // dont run if the user is not going to make payment in the next step
    if (currentStep.stepId !== SHOULD_OPEN_STEP) return; // make sure we pop up only when we have not send payment
    // do not open the dialog if the dialog is already opened
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    openConfirmDialog({
      title: "Please Note",
      description: (
        <span>
          Make sure you complete the transfer within <b>5 mins</b>
        </span>
      ),
      onConfirm: async () => {
        handleConfirm();
      },
    });
  }, [openConfirmDialog, closeConfirmDialog]);

  const handleCopyWallet = async (wallet: string) => {
    try {
      await navigator.clipboard.writeText(wallet);

      // global state (business logic)
      setHasCopyButtonBeenClicked(true);
    } catch (err) {
      console.error("Failed to copy wallet:", err);
    }
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const showCountdown = !!activeWallet && !isExpired;

  const showExpired = isExpired;
  const expiryTime = new Date(
    new Date(walletLastAssignedTime).getTime() + 5 * 60 * 1000,
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <ConfirmDialog />
      <Button
        disabled={hasCopyButtonBeenClicked || Boolean(activeWallet)}
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700 hover:text-white"
        variant="outline"
        onClick={() =>
          openConfirmDialog({
            title: "Please Note",
            description: "Please confirm to proceed.",
            onConfirm: async () => {
              handleConfirm();
            },
          })
        }
      >
        {loading ? (
          "Generating wallet for you..."
        ) : hasCopyButtonBeenClicked ? (
          <span>
            Completed <CheckCircle className="ml-2 h-4 w-4" />{" "}
          </span>
        ) : (
          "Confirm & Proceed"
        )}
      </Button>

      {/* error state */}
      {walletFetchError && <p className="text-red-500">{walletFetchError}</p>}

      {/* copiable wallet */}
      {activeWallet && (
        <WalletInfo
          wallet={activeWallet}
          network={network!}
          isCopyDisabled={isCopyButtonDisabled}
          onCopy={() => handleCopyWallet(activeWallet ?? "")}
          truncateWallet={truncateWallet}
        />
      )}
      {/* count down */}
      {showCountdown && (
        <p role="status" className="text-sm text-muted-foreground">
          This wallet expires in <CountdownTimer expiryTime={expiryTime} />
          {showExpired && "This wallet has expired"}
        </p>
      )}
    </div>
  );
};

export default ConfirmAndProceedButton;

// export interface ConfirmAndProceedButtonProps {
//   phoneNumber: string;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   sharedPaymentMode: string;
//   processTransaction: (
//     phoneNumber: string,
//     isRetry: boolean,
//     isGiftTrx: boolean,
//     requestPayment: boolean,
//     activeWallet: string,
//     assignedTime?: Date,
//   ) => Promise<void>;
//   network: string;
//   connectedWallet: boolean;
//   amount: string;
// }

// const ConfirmAndProceedButton: React.FC<ConfirmAndProceedButtonProps> = (
//   {
//     // phoneNumber,
//     // // setLoading,
//     // sharedPaymentMode,
//     // processTransaction,
//     // network,
//     // connectedWallet,
//     // amount,
//   },
// ) => {
//   const { setLoading } = useChatStore.getState();
//   // const {
//   //   state,
//   //   setState,
//   //   handleBlockchainPayment,
//   //   handleCopyWallet,
//   //   truncateWallet,
//   // } = useConfirmAndProceedState({
//   //   phoneNumber,
//   //   setLoading,
//   //   sharedPaymentMode,
//   //   processTransaction,
//   //   network,
//   //   connectedWallet,
//   //   amount,
//   // });

//   // const handleConfirmCallback = useCallback(() => {
//   //   handleConfirm({
//   //     setState,
//   //     phoneNumber,
//   //     setLoading,
//   //     sharedPaymentMode,
//   //     processTransaction,
//   //     network,
//   //   });
//   // }, [
//   //   setState,
//   //   phoneNumber,
//   //   setLoading,
//   //   sharedPaymentMode,
//   //   processTransaction,
//   //   network,
//   // ]);

//   // const isCopyButtonDisabled =
//   //   state.hasCopyButtonBeenClicked || state.isExpired;
//   console.log("render call");

//   return (
//     <div className=" flex flex-col items-center space-y-4">
//       {/* dialog  */}
//       <ConfirmDialog
//       // isOpen={true}
//       // // {state.isDialogOpen}
//       // title={"Please Note"}
//       // description={
//       //   // connectedWallet ? (
//       //   //   `You are paying directly from your ${network.toUpperCase()} wallet`
//       //   // ) : (
//       //   <span>
//       //     Make sure you complete the transfer within <b>5 mins</b>
//       //   </span>
//       //   // )
//       // }
//       // onClose={
//       //   () => console.log("Closing dialog")
//       //   // setState((prev) => ({ ...prev, isDialogOpen: false }))
//       // }
//       // onConfirm={
//       //   () => console.log("Button clicked")
//       //   // connectedWallet ? handleBlockchainPayment() : handleConfirmCallback()
//       // }
//       />

//       {/* button  */}
//       <Button
//         className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
//         // disabled={state.isButtonClicked}
//         // aria-busy={state.isProcessing}
//         // onClick={() => {
//         //   if (!state.isDialogOpen) {
//         //     setState((prev) => ({ ...prev, isDialogOpen: true }));
//         //   }
//         // }}
//       >
//         {
//           //   state.isProcessing ? (
//           //   "Generating wallet for you..."
//           // ) : state.isButtonClicked ? (
//           //   <span>
//           //     Completed <CheckCircle className="ml-2 h-4 w-4" />{" "}
//           //   </span>
//           // ) : (
//           "Confirm & Proceed"
//           // )
//         }
//       </Button>

//       {/* error state */}
//       {/* {state.error && <p className="text-red-500">{state.error}</p>} */}

//       {/* copiable wallet */}
//       {/* {state.activeWallet && (
//         <WalletInfo
//           wallet={state.activeWallet}
//           network={network}
//           isCopyDisabled={isCopyButtonDisabled}
//           onCopy={() => handleCopyWallet(state.activeWallet ?? "")}
//           truncateWallet={truncateWallet}
//         />
//       )} */}

//       {/* count down */}
//       {/* <p role="status" className="text-sm text-muted-foreground">
//         {state.isButtonClicked &&
//           state.lastAssignedTime &&
//           !state.isExpired && (
//             <>
//               This wallet Expires in{" "}
//               <CountdownTimer
//                 expiryTime={
//                   new Date(state.lastAssignedTime.getTime() + 5 * 60 * 1000)
//                 }
//               />{" "}
//             </>
//           )}
//         {state.isExpired && "This wallet has expired"}
//       </p> */}
//     </div>
//   );
// };

// export default ConfirmAndProceedButton;
