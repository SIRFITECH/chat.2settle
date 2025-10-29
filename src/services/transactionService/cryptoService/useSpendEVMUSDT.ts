"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Address, TransactionReceipt } from "viem";
import {
  BEP20_ABI,
  BEP20_CONTRACT,
  ERC20_ABI,
  ERC20_CONTRACT,
} from "@/services/transactionService/cryptoService/cryptoConstants";
import { config } from "../../../wagmi";
// import { TransactionReceipt } from "web3";

/**
 * Hook to send BEP20 tokens using Wagmi.
 *
 * @returns { spendBEP20 } - a function to send BEP20 tokens
 * @returns { isPending, isLoading, isSuccess, hash, receipt, error }
 */
export function useSpendEVMUSDT() {
  const { address: caller } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [error, setError] = useState<Error | null>(null);

  /**
   * Sends BEP20 tokens and waits for transaction confirmation.
   * @param receiver - Recipient wallet address
   * @param amount - Amount in token units (already adjusted for decimals)
   * @returns {Promise<TransactionReceipt | null>}
   */
  const spendEVMUSDT = async (
    receiver: Address,
    amount: bigint,
    isERC20 = false
  ): Promise<TransactionReceipt | null> => {
    if (!caller) {
      setError(new Error("Wallet not connected"));
      return null;
    }

    try {
      // Send the transaction (returns tx hash)
      const hash = await writeContractAsync({
        address: isERC20 ? ERC20_CONTRACT : BEP20_CONTRACT,
        abi: isERC20 ? ERC20_ABI : BEP20_ABI,
        functionName: "transfer",
        args: [receiver, amount],
      });

      // Wait for transaction to be mined
      const { waitForTransactionReceipt } = await import("wagmi/actions");
      const receipt = await waitForTransactionReceipt(config, { hash });

      return receipt;
    } catch (err: any) {
      console.error("Error during EVM USDT transfer:", err);
      setError(err);
      return null;
    }
  };

  return { spendEVMUSDT, error };
}
