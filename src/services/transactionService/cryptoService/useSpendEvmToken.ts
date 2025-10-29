import { useAccount, useConfig, useWriteContract } from "wagmi";
import { useEnsureNetwork } from "./useEnsureNetwork";
import { CHAINS } from "./chainConfig";
import { waitForTransactionReceipt, sendTransaction } from "wagmi/actions";
import { config } from "@/wagmi";
import { parseEther, TransactionReceipt } from "viem";
import { resolve } from "path";

export type NetworKey = "ethereum" | "bsc";
export type TokenType = "native" | "usdt";

interface SpendParam {
  network: NetworKey;
  token: TokenType;
  receiver: `0x${string}`;
  amount: bigint;
}

export function useSpendEVMToken() {
  const { writeContractAsync } = useWriteContract();
  const { ensureNetwork } = useEnsureNetwork("bsc");
  const { address } = useAccount();
  const config = useConfig();

  async function switchNetwork(chainId: number) {
    if (!window.ethereum) throw new Error("Wallet not found");
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (parseInt(currentChainId, 16) !== chainId) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  async function spend({
    network,
    token,
    receiver,
    amount,
  }: SpendParam): Promise<TransactionReceipt | null> {
    const chain = CHAINS[network];
    await switchNetwork(chain.id);
    // await ensureNetwork();

    try {
      let tx = null;
      if (token === "native") {
        const hash = await sendTransaction(config, {
          to: receiver,
          value: amount,
        });

        tx = await waitForTransactionReceipt(config, {
          hash,
        });
        console.log(`✅ ${chain.nativeSymbol} sent successfully!`);

        return tx;
      } else if (token === "usdt") {
        const hash = await writeContractAsync({
          address: chain.usdtContract,
          abi: chain.abi,
          functionName: "transfer",
          args: [receiver, amount],
        });

        // Wait for transaction to be mined
        const { waitForTransactionReceipt } = await import("wagmi/actions");
        tx = await waitForTransactionReceipt(config, { hash });
        console.log(`✅ ${network.toUpperCase()} USDT sent successfully!`);

        return tx;
      }
      return tx;
    } catch (err: any) {
      if (err?.code === 4001) {
        console.warn("❌ Transaction rejected by user");
      } else {
        console.error("❌ Transaction failed:", err);
      }
    }
    return null;
  }
  return { spend };
}
