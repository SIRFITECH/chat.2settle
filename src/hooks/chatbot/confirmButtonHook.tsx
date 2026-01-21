import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/features/transact/confirmButton/ConfirmDialog";
import { handleConfirm } from "@/features/transact/confirmButton/handleConfirm";
import WalletInfo from "@/features/transact/confirmButton/WalletInfo";
import { CountdownTimer } from "@/helpers/format_date";
import { CheckCircle } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import useConfirmAndProceedState from "./useConfirmAndProceedState";
import useChatStore from "stores/chatStore";
import { useConfirmDialogStore } from "stores/useConfirmDialogStore";
import { useAccount } from "wagmi";
import { usePaymentStore } from "stores/paymentStore";
import TruncatedText from "@/helpers/TruncatedText";
import { getAvaialableWallet } from "@/services/crypto/wallet";
import { getBaseSymbol } from "@/utils/utilities";

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

  const { network } = usePaymentStore();
  const activeWallet = usePaymentStore((s) => s.activeWallet);
  const currentStep = useChatStore((s) => s.currentStep);
  const walletLastAssignedTime = usePaymentStore(
    (s) => s.walletLastAssignedTime,
  );

  const hasCopyButtonBeenClicked =
    useConfirmDialogStore.getState().hasCopyButtonBeenClicked;
  const setHasCopyButtonBeenClicked =
    useConfirmDialogStore.getState().setHasCopyButtonBeenClicked;
  const openConfirmDialog = useConfirmDialogStore((s) => s.open);
  const closeConfirmDialog = useConfirmDialogStore((s) => s.close);

  // const hasCopyButtonBeenClicked = true;

  const hasOpenedRef = useRef(false);
  const account = useAccount();
  const SHOULD_OPEN_STEP = "sendPayment";
  const connectedWallet = account.isConnected;

  const handleConfirm = async () => {
    console.log("Just confirmed");
    try {
      setLoading(true);

      await getAvaialableWallet(network.toLowerCase());
    } catch (err) {
      console.log("Ther is an erro", err);
    } finally {
      setLoading(false);
    }
    // connectedWallet ? handleBlockchainPayment() : handleConfirmCallback()
  };
  const isExpired = false;

  const isCopyButtonDisabled = hasCopyButtonBeenClicked || isExpired;

  useEffect(() => {
    if (currentStep.stepId !== SHOULD_OPEN_STEP) return;
    // make sure the dialog open only once
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

  const handleCopyWallet = (wallet: string) => {
    // navigator.clipboard.writeText(wallet).then(() => {
    //   setState((prev) => ({
    //     ...prev,
    //     isCopied: true,
    //     hasCopyButtonBeenClicked: true,
    //   }));
    //   setTimeout(
    //     () =>
    //       setState((prev) => {
    //         if (prev.isCopied === false) return prev;
    //         return { ...prev, isCopied: false };
    //       }),
    //     3000, // 3 sec
    //   );
    // });
    console.log("Copy pressed");
    setHasCopyButtonBeenClicked();
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <ConfirmDialog />
      <Button
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
        {loading
          ? "Generating wallet for you..."
          : // : state.isButtonClicked ? (
            // <span>
            //   Completed <CheckCircle className="ml-2 h-4 w-4" />{" "}
            // </span>
            // )
            "Confirm & Proceed"}
        {/* {"Confirm & Proceed"} */}
      </Button>

      {/* error state */}
      {/* {state.error && <p className="text-red-500">{state.error}</p>} */}
      {/* copiable wallet */}
      {activeWallet && (
        <WalletInfo
          wallet={activeWallet}
          network={network}
          isCopyDisabled={isCopyButtonDisabled}
          onCopy={() => handleCopyWallet(activeWallet ?? "")}
          truncateWallet={truncateWallet}
        />
      )}
      {/* count down */}
      <p role="status" className="text-sm text-muted-foreground">
        {/* {isButtonClicked &&
          lastAssignedTime &&
          !isExpired && ( */}
        {hasCopyButtonBeenClicked && walletLastAssignedTime && !isExpired && (
          <>
            This wallet Expires in
            <CountdownTimer
              expiryTime={
                new Date(
                  new Date(walletLastAssignedTime).getTime() + 5 * 60 * 1000,
                )
              }
              // expiryTime={new Date(lastAssignedTime).getTime() + 5 * 60 * 1000}
            />
          </>
        )}
        {isExpired && "This wallet has expired"}
      </p>
    </div>
  );
};

export default ConfirmAndProceedButton;

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
