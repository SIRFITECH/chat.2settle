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

const ConfirmAndProceedButton = () => {
  const openConfirmDialog = useConfirmDialogStore((s) => s.open);
  const closeConfirmDialog = useConfirmDialogStore((s) => s.close);
  const hasOpenedRef = useRef(false);
  const account = useAccount();
  const connectedWallet = account.isConnected;

  const handleConfirm = () => {
    console.log("Just confirmed");
  };

  useEffect(() => {
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
              // connectedWallet ? handleBlockchainPayment() : handleConfirmCallback()
            },
          })
        }
      >
        {
          //   state.isProcessing ? (
          //   "Generating wallet for you..."
          // ) : state.isButtonClicked ?
          // <span>
          //   Completed <CheckCircle className="ml-2 h-4 w-4" />{" "}
          // </span>
          // : (
          "Confirm & Proceed"
          // )
        }
        {/* {"Confirm & Proceed"} */}
      </Button>
      {/* <Button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700">
        {"Confirm & Proceed"}
      </Button> */}
    </div>
  );
};

export default ConfirmAndProceedButton;
