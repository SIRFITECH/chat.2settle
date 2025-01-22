import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  spendBEP20,
  spendBNB,
  spendERC20,
  spendETH,
  spendTRC20,
  spendTRX,
} from "@/helpers/ethereum_script/spend_crypto";
import { EthereumAddress } from "@/types/general_types";
import { TransactionReceipt } from "web3";

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
  connectedWallet: boolean;
  amount: string;
}

const ConfirmAndProceedButton: React.FC<ConfirmAndProceedButtonProps> =
  React.memo(
    ({
      phoneNumber,
      setLoading,
      sharedPaymentMode,
      processTransaction,
      network,
      connectedWallet,
      amount,
    }) => {
      const [state, setState] = useState({
        isButtonClicked: false,
        isProcessing: false,
        error: null as string | null,
        activeWallet: null as string | null,
        lastAssignedTime: null as Date | null,
        isExpired: false,
        isDialogOpen: true,
        isCopied: false,
        hasCopyButtonBeenClicked: false,
      });

      const handleBlockchainPayment = useCallback(async () => {
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
          const wallet = "0x0EC67B0de231E3CBcbDb3DF75C8ff315D40F8048";
          let reciept: TransactionReceipt | null = null;
          if (activeWallet) {
            switch (network.toLowerCase()) {
              case "eth":
                console.log("We are calling the ETH payout...", amount);
                reciept = await spendETH(wallet as EthereumAddress, amount);
                break;
              case "bnb":
                console.log("We are calling the BNB payout...");
                reciept = await spendBNB(wallet as EthereumAddress, amount);
                break;
              case "trx":
                // reciept = await spendTRX(
                //   activeWallet as EthereumAddress,
                //   amount
                // );
                break;
              case "erc20":
                console.log("We are calling the USDT payout...", amount);
                reciept = await spendERC20(
                  activeWallet as EthereumAddress,
                  amount
                );
                break;
              case "bep20":
                console.log("Spending USDT BEP20");
                reciept = await spendBEP20(
                  activeWallet as EthereumAddress,
                  amount
                );
                break;
              case "trc20":
                // reciept = await spendTRC20(
                //   activeWallet as EthereumAddress,
                //   "amount"
                // );
                break;
              default:
                break;
            }
          }

          if (reciept && reciept.status === 1) {
            const assignedTime = new Date(lastAssignedTime);
            setState((prev) => ({
              ...prev,
              activeWallet,
              lastAssignedTime: assignedTime,
            }));

            const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
            const requestPayment =
              sharedPaymentMode.toLowerCase() === "request";

            setLoading(true);
            await processTransaction(
              phoneNumber,
              false,
              isGiftTrx,
              requestPayment,
              activeWallet,
              assignedTime
            );

            console.log(
              `Transaction processed for phone number: ${phoneNumber}`
            );
          }
        } catch (error) {
          console.error("Error processing transaction:", error);
          setState((prev) => ({
            ...prev,
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            isButtonClicked: false,
          }));
        } finally {
          setState((prev) => ({ ...prev, isProcessing: false }));
          setLoading(false);
        }
      }, [
        phoneNumber,
        setLoading,
        sharedPaymentMode,
        processTransaction,
        network,
      ]);

      const handleConfirm = useCallback(async () => {
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
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
            isButtonClicked: false,
          }));
        } finally {
          setState((prev) => ({ ...prev, isProcessing: false }));
          setLoading(false);
        }
      }, [
        phoneNumber,
        setLoading,
        sharedPaymentMode,
        processTransaction,
        network,
      ]);

      const handleCopyWallet = useCallback((wallet: string) => {
        navigator.clipboard.writeText(wallet).then(() => {
          setState((prev) => ({
            ...prev,
            isCopied: true,
            hasCopyButtonBeenClicked: true,
          }));
          setTimeout(
            () => setState((prev) => ({ ...prev, isCopied: false })),
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

      useEffect(() => {
        if (state.lastAssignedTime) {
          const timer = setTimeout(() => {
            setState((prev) => ({ ...prev, isExpired: true }));
          }, 5 * 60 * 1000);

          return () => clearTimeout(timer);
        }
      }, [state.lastAssignedTime]);

      const isCopyButtonDisabled =
        state.hasCopyButtonBeenClicked || state.isExpired;

      return connectedWallet ? (
        <div className="flex flex-col items-center space-y-4">
          <Dialog
            open={state.isDialogOpen}
            onOpenChange={(open) =>
              setState((prev) => ({ ...prev, isDialogOpen: open }))
            }
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Please Note</DialogTitle>
                <DialogDescription>
                  <span>
                    You are paying directly from your {network} wallet
                  </span>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() =>
                    setState((prev) => ({ ...prev, isDialogOpen: false }))
                  }
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-700"
                  onClick={handleBlockchainPayment}
                >
                  Okay
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out min-w-[200px] hover:bg-blue-700"
            disabled={state.isButtonClicked}
            aria-busy={state.isProcessing}
            onClick={() =>
              setState((prev) => ({ ...prev, isDialogOpen: true }))
            }
          >
            {state.isProcessing ? (
              "Generating wallet for you..."
            ) : state.isButtonClicked ? (
              <span className="flex items-center">
                Completed <CheckCircle className="ml-2 h-4 w-4" />
              </span>
            ) : (
              "Confirm & Proceed"
            )}
          </Button>
          {state.error && <p className="text-red-500">{state.error}</p>}
          {state.activeWallet && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-center">
                Here is a {network.toUpperCase()} wallet for your transaction:{" "}
                {truncateWallet(state.activeWallet)}
              </p>
              <Button
                onClick={() => handleCopyWallet(state.activeWallet!)}
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
            {state.isButtonClicked &&
              state.lastAssignedTime &&
              !state.isExpired && (
                <>
                  This wallet expires in{" "}
                  <CountdownTimer
                    expiryTime={
                      new Date(state.lastAssignedTime.getTime() + 5 * 60 * 1000)
                    }
                  />
                </>
              )}
            {state.isExpired && "This wallet has expired."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <Dialog
            open={state.isDialogOpen}
            onOpenChange={(open) =>
              setState((prev) => ({ ...prev, isDialogOpen: open }))
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
                    setState((prev) => ({ ...prev, isDialogOpen: false }))
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
            disabled={state.isButtonClicked}
            aria-busy={state.isProcessing}
            onClick={() =>
              setState((prev) => ({ ...prev, isDialogOpen: true }))
            }
          >
            {state.isProcessing ? (
              "Generating wallet for you..."
            ) : state.isButtonClicked ? (
              <span className="flex items-center">
                Completed <CheckCircle className="ml-2 h-4 w-4" />
              </span>
            ) : (
              "Confirm & Proceed"
            )}
          </Button>
          {state.error && <p className="text-red-500">{state.error}</p>}
          {state.activeWallet && !connectedWallet && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="text-sm text-center">
                Here is a {network.toUpperCase()} wallet for your transaction:{" "}
                {truncateWallet(state.activeWallet)}
              </p>
              <Button
                onClick={() => handleCopyWallet(state.activeWallet!)}
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
          {!connectedWallet && (
            <p role="status" className="text-sm text-muted-foreground">
              {state.isButtonClicked &&
                state.lastAssignedTime &&
                !state.isExpired && (
                  <>
                    This wallet expires in{" "}
                    <CountdownTimer
                      expiryTime={
                        new Date(
                          state.lastAssignedTime.getTime() + 5 * 60 * 1000
                        )
                      }
                    />
                  </>
                )}
              {state.isExpired && "This wallet has expired."}
            </p>
          )}
        </div>
      );
    }
  );

export default ConfirmAndProceedButton;
