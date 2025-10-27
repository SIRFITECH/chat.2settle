// TARGET: To send BNB from the caller wallet to our wallet
// confirm wallet connected
// confirm chain is bnb mainnet
// confirm connected wallet has enough bnb to cover amount + gas
// trigger the transfer and request cinfirmation
// user approve the transaction in their wallet
// sign the transaction
// await confirmation of the transfer on chain

import { EthereumAddress } from "@/types/general_types";
import { Web3 } from "web3";
import { getChainIdHex } from "./cryptoConstants";

export async function spendBNB(wallet: EthereumAddress, amount: string) {
  try {
    // Know if the user has wallet in their browser
    if (typeof window.ethereum === "undefined") {
      console.error("Metamsk not installed, Install metamsk to continue");
      throw new Error(
        "You need a provider like MetaMask to complete your transaction"
      );
    }

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    const expectedChainID = 56;
    const expectedChainIDHex = getChainIdHex(expectedChainID);

    // Request wallet connection
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found. Please connect a wallet.");
    }

    const currentChainID = await web3.eth.getChainId();
    const currentChainIDHex = getChainIdHex(currentChainID);

    if (currentChainIDHex !== expectedChainIDHex) {
      console.log("Current chain ID", currentChainID);
      try {
        console.log("Switching to BNB...");
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: expectedChainIDHex,
            },
          ],
        });
        console.log("Current chain ID", currentChainID);
        console.log("Network switched to BNB");
      } catch (error: unknown) {
        if (error instanceof Error) {
          // structure the error for proper handling
          const rpcError = error as { code?: number };
          if (rpcError.code === 4902) {
            throw new Error("Newtork not avaialable, add manually");
          } else if (rpcError.code === 4001) {
            throw new Error("User rejected network swithing");
          } else {
            console.error("An unknow error occured", rpcError.code);
            throw new Error("An unknow error occured");
          }
        }
      }
    }

    const valueInWei = web3.utils.toWei(amount, "ether");

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    const reciept = await web3.eth
      .sendTransaction({
        from: spender,
        to: wallet,
        value: valueInWei,
      })
      .on("error", (error: Error) => {
        throw new Error(error.message);
      });

    console.log(`We have sent ${amount} BNB`, reciept);
    return reciept;
  } catch (error) {
    // narrow down the error
    if (error && typeof error === "object" && "code" in error) {
      const rpcError = error as { code: number; message: string; data?: any };

      if (rpcError.data) {
        throw new Error(rpcError.data.message);
      }

      if (rpcError.code === -32000) {
        throw new Error("Insufficient balance to comeplete transaction");
      } else if (rpcError.code === -32603) {
        throw new Error("Error:", rpcError.data.message || rpcError.message);
      } else {
        throw new Error(
          "Unknown Error:",
          rpcError.data.message || rpcError.message
        );
      }
    }
    console.error("Errorsending the transaction", error);
  }
  return null;
}
