import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { CountdownTimer } from "@/helpers/format_date";
import { handleConfirm } from "@/features/transact/confirmButton/handleConfirm";
import useConfirmAndProceedState from "./useConfirmAndProceedState";
import ConfirmDialog from "@/features/transact/confirmButton/confirmDialog";
import WalletInfo from "@/features/transact/confirmButton/WalletInfo";

export interface ConfirmAndProceedButtonProps {
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
  connectedWallet: boolean;
  amount: string;
}

const ConfirmAndProceedButton: React.FC<ConfirmAndProceedButtonProps> = ({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
  connectedWallet,
  amount,
}) => {
  const {
    state,
    setState,
    handleBlockchainPayment,
    handleCopyWallet,
    truncateWallet,
  } = useConfirmAndProceedState({
    phoneNumber,
    setLoading,
    sharedPaymentMode,
    processTransaction,
    network,
    connectedWallet,
    amount,
  });

  const isCopyButtonDisabled =
    state.hasCopyButtonBeenClicked || state.isExpired;

  return (
    <div className=" flex flex-col items-center space-y-4">
      {/* dialog  */}
      <ConfirmDialog
        isOpen={state.isDialogOpen}
        title={"Please Note"}
        description={
          connectedWallet ? (
            `You are paying directly from your ${network} wallet`
          ) : (
            <span>
              Make sure you complete the transfer within <b>5 mins</b>
            </span>
          )
        }
        onClose={() => setState((prev) => ({ ...prev, isDialogOpen: false }))}
        onConfirm={() =>
          connectedWallet
            ? handleBlockchainPayment()
            : handleConfirm({
                setState,
                phoneNumber,
                setLoading,
                sharedPaymentMode,
                processTransaction,
                network,
              })
        }
      />
      {/* button  */}
      <Button
        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
        disabled={state.isButtonClicked}
        aria-busy={state.isProcessing}
        onClick={() => setState((prev) => ({ ...prev, isDialogOpen: true }))}
      >
        {state.isProcessing ? (
          "Generating wallet for you..."
        ) : state.isButtonClicked ? (
          <span>
            {" "}
            Completed <CheckCircle className="ml-2 h-4 w-4" />{" "}
          </span>
        ) : (
          "Confirm & Proceed"
        )}
      </Button>

      {/* error state */}
      {state.error && <p className="text-red-500">{state.error}</p>}

      {/* copiable wallet */}
      {state.activeWallet && (
        <WalletInfo
          wallet={state.activeWallet}
          network={network}
          isCopyDisabled={isCopyButtonDisabled}
          onCopy={() => handleCopyWallet(state.activeWallet ?? "")}
          truncateWallet={truncateWallet}
        />
      )}

      {/* count down */}
      <p role="status" className="text-sm text-muted-foreground">
        {state.isButtonClicked &&
          state.lastAssignedTime &&
          !state.isExpired && (
            <>
              This wallet Expires in{" "}
              <CountdownTimer
                expiryTime={
                  new Date(state.lastAssignedTime.getTime() + 5 * 60 * 1000)
                }
              />{" "}
            </>
          )}
        {state.isExpired && "This wallet has expired"}
      </p>
    </div>
  );
};

export default ConfirmAndProceedButton;
// connectedWallet ? (
//   <div className="flex flex-col items-center space-y-4">
//     <Dialog
//       open={state.isDialogOpen}
//       onOpenChange={(open) =>
//         setState((prev) => ({ ...prev, isDialogOpen: open }))
//       }
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Please Note</DialogTitle>
//           <DialogDescription>
//             <span>You are paying directly from your {network} wallet</span>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() =>
//               setState((prev) => ({ ...prev, isDialogOpen: false }))
//             }
//           >
//             Cancel
//           </Button>
//           <Button
//             className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
//             onClick={handleBlockchainPayment}
//           >
//             Okay
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//     <Button
//       className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
//       disabled={state.isButtonClicked}
//       aria-busy={state.isProcessing}
//       onClick={() => setState((prev) => ({ ...prev, isDialogOpen: true }))}
//     >
//       {state.isProcessing ? (
//         "Generating wallet for you..."
//       ) : state.isButtonClicked ? (
//         <span className="flex items-center">
//           Completed <CheckCircle className="ml-2 h-4 w-4" />
//         </span>
//       ) : (
//         "Confirm & Proceed"
//       )}
//     </Button>
//     {state.error && <p className="text-red-500">{state.error}</p>}
//     {state.activeWallet && (
//       <div className="flex flex-col items-center justify-center space-y-2">
//         <p className="text-sm text-center">
//           Here is a {network.toUpperCase()} wallet for your transaction:{" "}
//           {truncateWallet(state.activeWallet)}
//         </p>
//         <Button
//           onClick={() => handleCopyWallet(state.activeWallet!)}
//           disabled={isCopyButtonDisabled}
//           variant="outline"
//           size="sm"
//         >
//           {!isCopyButtonDisabled ? (
//             <>
//               <Copy className="w-4 h-4 mr-2" />
//               <span>Copy Wallet</span>
//             </>
//           ) : (
//             <>
//               <Check className="w-4 h-4 mr-2" />
//               <span>Wallet Copied</span>
//             </>
//           )}
//         </Button>
//       </div>
//     )}
//     <p role="status" className="text-sm text-muted-foreground">
//       {state.isButtonClicked &&
//         state.lastAssignedTime &&
//         !state.isExpired && (
//           <>
//             This wallet expires in{" "}
//             <CountdownTimer
//               expiryTime={
//                 new Date(state.lastAssignedTime.getTime() + 5 * 60 * 1000)
//               }
//             />
//           </>
//         )}
//       {state.isExpired && "This wallet has expired."}
//     </p>
//   </div>
// ) : (
//   <div className="flex flex-col items-center space-y-4">
//     <Dialog
//       open={state.isDialogOpen}
//       onOpenChange={(open) =>
//         setState((prev) => ({ ...prev, isDialogOpen: open }))
//       }
//     >
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Please Note</DialogTitle>
//           <DialogDescription>
//             <span>
//               Make sure you complete the transaction within <b>5 mins</b>
//             </span>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <Button
//             variant="outline"
//             onClick={() =>
//               setState((prev) => ({ ...prev, isDialogOpen: false }))
//             }
//           >
//             Cancel
//           </Button>
//           <Button
//             className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
//             onClick={() =>
//               handleConfirm({
//                 setState,
//                 phoneNumber,
//                 setLoading,
//                 sharedPaymentMode,
//                 processTransaction,
//                 network,
//               })
//             }
//           >
//             Okay
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//     <Button
//       className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
//       disabled={state.isButtonClicked}
//       aria-busy={state.isProcessing}
//       onClick={() => setState((prev) => ({ ...prev, isDialogOpen: true }))}
//     >
//       {state.isProcessing ? (
//         "Generating wallet for you..."
//       ) : state.isButtonClicked ? (
//         <span className="flex items-center">
//           Completed <CheckCircle className="ml-2 h-4 w-4" />
//         </span>
//       ) : (
//         "Confirm & Proceed"
//       )}
//     </Button>
//     {state.error && <p className="text-red-500">{state.error}</p>}
//     {state.activeWallet && !connectedWallet && (
//       <div className="flex flex-col items-center justify-center space-y-2">
//         <p className="text-sm text-center">
//           Here is a {network.toUpperCase()} wallet for your transaction:{" "}
//           {truncateWallet(state.activeWallet)}
//         </p>
//         <Button
//           onClick={() => handleCopyWallet(state.activeWallet!)}
//           disabled={isCopyButtonDisabled}
//           variant="outline"
//           size="sm"
//         >
//           {!isCopyButtonDisabled ? (
//             <>
//               <Copy className="w-4 h-4 mr-2" />
//               <span>Copy Wallet</span>
//             </>
//           ) : (
//             <>
//               <Check className="w-4 h-4 mr-2" />
//               <span>Wallet Copied</span>
//             </>
//           )}
//         </Button>
//       </div>
//     )}
//     {!connectedWallet && (
//       <p role="status" className="text-sm text-muted-foreground">
//         {state.isButtonClicked &&
//           state.lastAssignedTime &&
//           !state.isExpired && (
//             <>
//               This wallet expires in{" "}
//               <CountdownTimer
//                 expiryTime={
//                   new Date(state.lastAssignedTime.getTime() + 5 * 60 * 1000)
//                 }
//               />
//             </>
//           )}
//         {state.isExpired && "This wallet has expired."}
//       </p>
//     )}
//   </div>
// );
