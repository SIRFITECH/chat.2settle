import { getDirectDebitWallet } from "@/helpers/api_calls";
import {
  sendBTC,
  spendETH,
  spendTRC20,
  spendTRX,
} from "@/helpers/ethereum_script/spend_crypto";
import { WalletAddress } from "@/lib/wallets/types";
import { useSpendNative } from "@/services/transactionService/cryptoService/useSpendBepToken";
import { EthereumAddress } from "@/types/general_types";
import { parseUnits } from "ethers/utils";
import { useEffect, useState } from "react";
import { request, RpcErrorCode } from "sats-connect";
import { useSpendEVMUSDT } from "../services/transactionService/cryptoService/useSpendEVMUSDT";
import { ConfirmAndProceedButtonProps } from "./confirmButtonHook";
import { useBTCWallet } from "./stores/btcWalletStore";
import { TransactionReceipt } from "viem";
import { useSpendTRC20 } from "@/services/transactionService/cryptoService/useSpendTRC20";
import { useSpendEVMToken } from "@/services/transactionService/cryptoService/useSpendEVMToken";

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

  const { spendEVMUSDT } = useSpendEVMUSDT();
  const { spendNative } = useSpendNative();
  const { spendTRC20 } = useSpendTRC20();
  const { spend } = useSpendEVMToken();

  const { paymentAddress } = useBTCWallet();

  const handleBlockchainPayment = async () => {
    console.log("handleBlockchainPayment called with network:", network);
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
        isDialogOpen: true,
        isButtonClicked: false,
        isProcessing: false,
        error: null,
      };
    });
    try {
      const wallet = await getDirectDebitWallet(network.toLowerCase());
      let reciept: TransactionReceipt | null = null;
      let btcSent = false;
      let trxSent = false;

      if (wallet) {
        console.log("Wallet is available and network is:", network);
        switch (network.toLowerCase()) {
          case "eth":
            console.log("We are doing a ETH trx", amount);
            reciept = await spendNative(wallet as `0x${string}`, amount);
            console.log("The trx was successfull", reciept);
            break;
          case "bnb":
            console.log("We are doing a BNB trx", amount);
            reciept = await spendNative(wallet as `0x${string}`, amount);
            console.log("The trx was successfull", reciept);
            break;
          case "erc20":
            console.log("We are doing a ERC20 trx");
            reciept = await spendEVMUSDT(
              wallet as `0x${string}`,
              parseUnits(amount, 6),
              true
            );
            console.log("The trx was successfull", reciept);
            break;
          case "bep20":
            console.log("We are doing a BEP20 trx");
            reciept = await spendEVMUSDT(
              wallet as `0x${string}`,
              parseUnits(amount, 18)
            );

            console.log("The trx was successfull", reciept);
            break;
          case "trc20":
            // const usdtTrnsaction = await spendTRC20(
            //   wallet as EthereumAddress,
            //   amount
            // );

            const trx = await spendTRC20(wallet, parseInt(amount));
            console.log("TRC20 trx", trx);
            trxSent = !!trx?.result;
            break;
          case "btc":
            const txid = await sendBTC({
              senderAddress: paymentAddress as WalletAddress,
              recipient: wallet as WalletAddress,
              amount: parseFloat(amount),
              signPsbtFn: async (psbt: string) => {
                try {
                  if (!paymentAddress) {
                    throw new Error("Payment address is undefined.");
                  }

                  const response = await request("signPsbt", {
                    psbt: psbt,
                    signInputs: {
                      [paymentAddress!]: [0],
                    },
                  });

                  // if the transaction is ready to broadcast and you want to broadcast
                  // it yourself at this point, then remember to finalize the inputs in
                  // the returned PSBT before broadcasting

                  if (response.status === "success") {
                    // handle success response
                    return response.result.psbt;
                  } else {
                    if (response.error.code === RpcErrorCode.USER_REJECTION) {
                      console.log("User cancelled the signing process");
                      throw new Error("User cancelled the signing process.");
                      // handle user request cancelation
                    } else {
                      throw new Error(
                        `Error signing PSBT: ${response.error.message}`
                      );
                      // handle error
                    }
                  }
                } catch (err) {
                  console.log(err);
                  throw new Error("Failed to sign PSBT.");
                }
              },
            });
            btcSent = !!txid;
            break;
          case "trx":
            console.log("TRX network is not supported yet.");
            const transaction = await spendTRX(
              wallet as EthereumAddress,
              amount
            );
            trxSent = !!transaction.txid;
            break;
          default:
            break;
        }
      }
      // if (wallet) {
      //   console.log("Wallet is available and network is:", network);
      //   switch (network.toLowerCase()) {
      //     case "eth":
      //       console.log("We are doing a ETH trx", amount);
      //       reciept = await spend({
      //         network: "ethereum",
      //         receiver: wallet as `0x${string}`,
      //         token: "native",
      //         amount: parseUnits(amount, 18),
      //       });
      //       // await spendNative(wallet as `0x${string}`, amount);
      //       console.log("The trx was successfull", reciept);
      //       break;
      //     case "bnb":
      //       console.log("We are doing a BNB trx", amount);
      //       // reciept = await spendNative(wallet as `0x${string}`, amount);
      //       reciept = await spend({
      //         network: "bsc",
      //         receiver: wallet as `0x${string}`,
      //         token: "native",
      //         amount: parseUnits(amount, 18),
      //       });
      //       console.log("The trx was successfull", reciept);
      //       break;
      //     case "erc20":
      //       console.log("We are doing a ERC20 trx");

      //       // reciept = await spendEVMUSDT(
      //       //   wallet as `0x${string}`,
      //       //   parseUnits(amount, 6),
      //       //   true
      //       // );
      //       reciept = await spend({
      //         network: "ethereum",
      //         receiver: wallet as `0x${string}`,
      //         token: "usdt",
      //         amount: parseUnits(amount, 6),
      //       });
      //       console.log("The trx was successfull", reciept);
      //       break;
      //     case "bep20":
      //       console.log("We are doing a BEP20 trx");
      //       // reciept = await spendEVMUSDT(
      //       //   wallet as `0x${string}`,
      //       //   parseUnits(amount, 18)
      //       // );
      //       reciept = await spend({
      //         network: "bsc",
      //         receiver: wallet as `0x${string}`,
      //         token: "usdt",
      //         amount: parseUnits(amount, 18),
      //       });
      //       console.log("The trx was successfull", reciept);
      //       break;
      //     case "trc20":
      //       // const usdtTrnsaction = await spendTRC20(
      //       //   wallet as EthereumAddress,
      //       //   amount
      //       // );

      //       const trx = await spendTRC20(wallet, parseInt(amount));
      //       console.log("TRC20 trx", trx);
      //       trxSent = !!trx?.result;
      //       break;
      //     case "btc":
      //       const txid = await sendBTC({
      //         senderAddress: paymentAddress as WalletAddress,
      //         recipient: wallet as WalletAddress,
      //         amount: parseFloat(amount),
      //         signPsbtFn: async (psbt: string) => {
      //           try {
      //             if (!paymentAddress) {
      //               throw new Error("Payment address is undefined.");
      //             }

      //             const response = await request("signPsbt", {
      //               psbt: psbt,
      //               signInputs: {
      //                 [paymentAddress!]: [0],
      //               },
      //             });

      //             // if the transaction is ready to broadcast and you want to broadcast
      //             // it yourself at this point, then remember to finalize the inputs in
      //             // the returned PSBT before broadcasting

      //             if (response.status === "success") {
      //               // handle success response
      //               return response.result.psbt;
      //             } else {
      //               if (response.error.code === RpcErrorCode.USER_REJECTION) {
      //                 console.log("User cancelled the signing process");
      //                 throw new Error("User cancelled the signing process.");
      //                 // handle user request cancelation
      //               } else {
      //                 throw new Error(
      //                   `Error signing PSBT: ${response.error.message}`
      //                 );
      //                 // handle error
      //               }
      //             }
      //           } catch (err) {
      //             console.log(err);
      //             throw new Error("Failed to sign PSBT.");
      //           }
      //         },
      //       });
      //       btcSent = !!txid;
      //       break;
      //     case "trx":
      //       console.log("TRX network is not supported yet.");
      //       const transaction = await spendTRX(
      //         wallet as EthereumAddress,
      //         amount
      //       );
      //       trxSent = !!transaction.txid;
      //       break;
      //     default:
      //       break;
      //   }
      // }

      if (reciept && reciept.transactionHash && reciept.status === "success") {
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

      if (btcSent) {
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

      if (trxSent) {
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
