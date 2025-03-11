import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/features/transact/confirmButton/ConfirmDialog";
import { handleConfirm } from "@/features/transact/confirmButton/handleConfirm";
import WalletInfo from "@/features/transact/confirmButton/WalletInfo";
import { CountdownTimer } from "@/helpers/format_date";
import { CheckCircle } from "lucide-react";
import React, { useCallback } from "react";
import useConfirmAndProceedState from "./useConfirmAndProceedState";

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

  const handleConfirmCallback = useCallback(() => {
    handleConfirm({
      setState,
      phoneNumber,
      setLoading,
      sharedPaymentMode,
      processTransaction,
      network,
    });
  }, [
    setState,
    phoneNumber,
    setLoading,
    sharedPaymentMode,
    processTransaction,
    network,
  ]);

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
            `You are paying directly from your ${network.toUpperCase()} wallet`
          ) : (
            <span>
              Make sure you complete the transfer within <b>5 mins</b>
            </span>
          )
        }
        onClose={() => setState((prev) => ({ ...prev, isDialogOpen: false }))}
        onConfirm={
          () =>
            connectedWallet
              ? handleBlockchainPayment()
              : handleConfirmCallback()
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
