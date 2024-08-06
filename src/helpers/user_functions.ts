import { ethers } from "ethers";
import { formatEther } from "@ethersproject/units";
import {
  BscScanResponse,
  BscTransaction,
  erc20TrxData,
  EtherscanResponse,
} from "../types/types";
import {
  checkUserExists,
  createUser,
  generateBTCWalletAddress,
  generateERCWalletAddress,
  generateTronWalletAddress,
  updateUser,
} from "./api_calls";
import axios from "axios";

export async function asignWallet(
  sharedChatId: string,
  phone: string,
  sharedNetwork: string,
  setSharedWallet: React.Dispatch<React.SetStateAction<string>>
) {
  const btcAddressPattern = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;

  const erc20AddressPattern = /^0x[a-fA-F0-9]{40}$/;

  const trc20AddressPattern = /^T[a-zA-Z0-9]{33}$/;

  const erc20 = ["erc20", "bep20"];

  const userData = await checkUserExists(phone);
  let userExists = userData.exists;
  let hasBTCWallet = btcAddressPattern.test(
    userData.user?.bitcoin_wallet || ""
  );
  let hasERCWallet = erc20AddressPattern.test(
    userData.user?.eth_bnb_wallet || ""
  );
  let hasTRCWallet = trc20AddressPattern.test(userData.user?.tron_wallet || "");

  const tronWallet = await generateTronWalletAddress();

  if (userExists) {
    console.log("This user exists");
    if (sharedNetwork.toLocaleLowerCase() === "btc") {
      if (hasBTCWallet) {
        setSharedWallet(userData.user?.bitcoin_wallet || "");
      } else {
        const btcWallet = await generateBTCWalletAddress();
        setSharedWallet(btcWallet.bitcoin_wallet);
        // update the db
        updateUser(phone, {
          bitcoin_wallet: btcWallet.bitcoin_wallet,
          bitcoin_privateKey: btcWallet.bitcoin_privateKey,
        });
        console.log("User exist, new BTC wallet is:", btcWallet.bitcoin_wallet);
      }
    } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
      if (hasERCWallet) {
        setSharedWallet(userData.user?.eth_bnb_wallet || "");
      } else {
        const ercWallet = await generateERCWalletAddress();
        setSharedWallet(ercWallet.eth_bnb_wallet);
        // update the db
        updateUser(phone, {
          eth_bnb_wallet: ercWallet.eth_bnb_wallet,
          bitcoin_privateKey: ercWallet.eth_bnb_privateKey,
        });
        console.log("User exist, new ERC wallet is:", ercWallet.eth_bnb_wallet);
      }
    } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
      if (hasTRCWallet) {
        setSharedWallet(tronWallet.tron_wallet);
      } else {
        setSharedWallet(tronWallet.tron_wallet);
        updateUser(phone, {
          tron_wallet: tronWallet.tron_wallet,
          tron_privateKey: tronWallet.tron_privateKey,
        });
        console.log(
          "User exist and new tron wallet is:",
          tronWallet.tron_wallet
        );
      }
    }
  } else {
    if (sharedNetwork.toLocaleLowerCase() === "btc") {
      const btcWallet = await generateBTCWalletAddress();
      setSharedWallet(btcWallet.bitcoin_wallet);
      await createUser({
        agent_id: sharedChatId,
        bitcoin_wallet: btcWallet.bitcoin_wallet,
        bitcoin_privateKey: btcWallet.bitcoin_privateKey,
      });
      console.log("BTC wallet is:", btcWallet.bitcoin_wallet);
    } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
      const ercWallet = await generateERCWalletAddress();
      setSharedWallet(ercWallet.eth_bnb_wallet);
      await createUser({
        agent_id: sharedChatId,
        eth_bnb_wallet: ercWallet.eth_bnb_wallet,
        eth_bnb_privateKey: ercWallet.eth_bnb_privateKey,
      });
      console.log("ERC wallet is:", ercWallet.eth_bnb_wallet);
    } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
      setSharedWallet(tronWallet.tron_wallet);
      await createUser({
        agent_id: sharedChatId,
        tron_wallet: tronWallet.tron_wallet,
        tron_privateKey: tronWallet.tron_privateKey,
      });
      console.log("Tron wallet is:", tronWallet.tron_wallet);
    }
  }
}

export async function createTransaction() {
  // create a transaction in the db
}

const gweiToEth = (gwei: string): string => {
  const gweiInNumber = parseFloat(gwei);

  const eth = gweiInNumber / 1000000000;
  return eth.toString();
};

// CHECK A SUPPLIED WALLET ADDRESS FOR INCOMING TRANSACTION
export const checkERC20Transaction = async (walletAddress: string) => {
  const apiKey = "7Y7G56Q5K1ARWM9FF4CTKKD5MB42YTIT6Z";

  // process.env.ETHERSCAN_API_KEY;
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=desc&apikey=${apiKey}`;
  // const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&sort=desc&apikey=${apiKey}`;
  //https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2&address=0x4e83362442b8d1bec281594cea3050c8eb01311c&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=YourApiKeyToken

  try {
    const response = await axios.get<EtherscanResponse>(url);
    const transactions: erc20TrxData[] = response.data.result;

    if (transactions.length > 0) {
      const lastTransaction = transactions[transactions.length - 1];
      const valueInWei = lastTransaction.value;
      const ethValue = formatEther(valueInWei);

      // console.log("The last transaction index is:", transactions.length - 1);
      // console.log("The last transaction is:", lastTransaction);
      // console.log("Transaction value:", lastTransaction.value);
      console.log("Transaction value in ETH:", ethValue);
    } else {
      console.log("No transactions found.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};

export const checkBEP20Transaction = async (walletAddress: string) => {
  const apiKey = "VDRM3F5F51KDCREB1F25QGAQUK3I3ERRSP";
  //  process.env.BSCSCAN_API_KEY;
  const url = `https://api-testnet.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&sort=desc&apikey=${apiKey}`;
  // const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${walletAddress}&sort=desc&apikey=${apiKey}`;

  try {
    const response = await axios.get<BscScanResponse>(url);
    const transactions: BscTransaction[] = response.data.result;

    if (transactions.length > 0) {
      const lastTransaction = transactions[transactions.length - 1];
      // console.log(
      //   "The last BRC20 transaction index is:",
      //   transactions.length - 1
      // );
      // console.log("The last BRC20 transaction is:", lastTransaction);

      // Convert from Wei to Ether equivalent (or BEP20 token's equivalent)
      const valueInWei = lastTransaction.value;
      const valueInToken = formatEther(valueInWei);
      console.log("Transaction value in BNB Token:", valueInToken);
    } else {
      console.log("No transactions found.");
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
};
