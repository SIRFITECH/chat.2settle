import { getDirectDebitWallet } from "@/helpers/api_calls";
import {
  spendBEP20,
  spendBNB,
  spendERC20,
  spendETH,
} from "@/helpers/ethereum_script/spend_crypto";
import { EthereumAddress } from "@/types/general_types";
import { useEffect, useState } from "react";
import { TransactionReceipt } from "web3";
import { ConfirmAndProceedButtonProps } from "./confirmButtonHook";

const useConfirmAndProceedState = ({
  phoneNumber,
  setLoading,
  sharedPaymentMode,
  processTransaction,
  network,
  amount,
}: ConfirmAndProceedButtonProps) => {
  const [state, setState] = useState({
    isButtonClicked: false,
    isProcessing: false,
    error: null as string | null,
    activeWallet: null as string | null,
    lastAssignedTime: null as Date | null,
    isDialogOpen: true,
    isExpired: false,
    isCopied: false,
    hasCopyButtonBeenClicked: false,
  });

  const handleBlockchainPayment = async () => {
    setState((prev) => {
      if (
        prev.isDialogOpen === false &&
        prev.isButtonClicked &&
        prev.isProcessing &&
        prev.error === null
      )
        return prev;
      return {
        ...prev,
        isDialogOpen: false,
        isButtonClicked: true,
        isProcessing: true,
        error: null,
      };
    });
    try {
      const wallet = await getDirectDebitWallet();
      let reciept: TransactionReceipt | null = null;
      if (wallet) {
        switch (network.toLowerCase()) {
          case "eth":
            reciept = await spendETH(wallet as EthereumAddress, amount);
            break;
          case "bnb":
            reciept = await spendBNB(wallet as EthereumAddress, amount);
            break;
          case "erc20":
            reciept = await spendERC20(wallet as EthereumAddress, amount);
            break;
          case "bep20":
            reciept = await spendBEP20(wallet as EthereumAddress, amount);
            break;
          default:
            break;
        }
      }

      if (reciept && reciept?.status === 1) {
        setState((prev) => {
          if (prev.activeWallet === wallet) return prev;
          return {
            ...prev,
            activeWallet: wallet,
          };
        });

        const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
        const requestPayment =
          sharedPaymentMode.toLowerCase() === "request" ||
          sharedPaymentMode.toLowerCase() === "payrequest";

        setLoading(true);
        await processTransaction(
          phoneNumber,
          false,
          isGiftTrx,
          requestPayment,
          wallet
        );
        console.log("requestPayment from state", requestPayment);
      }
    } catch (error) {
      console.error("Error processing the transaction:", error);
      setState((prev) => ({
        ...prev,
        error:
          error instanceof Error ? error.message : "An unknown error occured",
        isButtonClicked: false,
      }));
    } finally {
      setState((prev) => {
        if (prev.isProcessing === false) return prev;
        return { ...prev, isProcessing: false };
      });
      setLoading(false);
    }
  };

  const handleCopyWallet = (wallet: string) => {
    navigator.clipboard.writeText(wallet).then(() => {
      setState((prev) => ({
        ...prev,
        isCopied: true,
        hasCopyButtonBeenClicked: true,
      }));

      setTimeout(
        () =>
          setState((prev) => {
            if (prev.isCopied === false) return prev;

            return { ...prev, isCopied: false };
          }),
        3000 // 3 sec
      );
    });
  };

  const truncateWallet = (wallet: string) => {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  // If the wallet is in use, we count down 5 mins then set it to expired
  useEffect(() => {
    if (state.lastAssignedTime) {
      const timer = setTimeout(() => {
        setState((prev) => {
          if (prev.isExpired) return prev;
          return { ...prev, isExpired: true };
        });
      }, 5 * 60 * 1000); // set timer for 5 minutes
      return () => clearTimeout(timer);
    }
  }, [state.lastAssignedTime]);

  return {
    state,
    setState,
    handleBlockchainPayment,
    handleCopyWallet,
    truncateWallet,
  };
};

export default useConfirmAndProceedState;
