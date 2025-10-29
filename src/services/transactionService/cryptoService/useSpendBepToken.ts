import { useState } from "react";
import { waitForTransactionReceipt, sendTransaction } from "wagmi/actions";
import { Address, parseEther } from "viem";
import type { TransactionReceipt } from "viem";
import { config } from "../../../wagmi";

export function useSpendNative() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function spendNative(
    recipient: Address,
    amountInEther: string,
  ): Promise<TransactionReceipt | null> {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await sendTransaction(config, {
        to: recipient,
        value: parseEther(amountInEther),
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash,
      });

      return receipt;
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { spendNative, isLoading, error };
}
