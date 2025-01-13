import { EthereumAddress } from "@/types/general_types";
import { Web3 } from "web3";
import dotenv from "dotenv";
dotenv.config();

// SETUP
// Contract address and ABI
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI: any[] = [
  {
    type: "constructor",
    inputs: [
      { name: "_receiver", type: "address", internalType: "address payable" },
    ],
    stateMutability: "nonpayable",
  },
  { type: "receive", stateMutability: "payable" },
  {
    type: "function",
    name: "addAllowedRecipient",
    inputs: [
      { name: "newAllowedRecipient", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "allowedRecipients",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "recipient",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setNewOwner",
    inputs: [{ name: "_newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferBNB",
    inputs: [{ name: "_amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateRecipient",
    inputs: [
      {
        name: "_newRecipient",
        type: "address",
        internalType: "address payable",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "BNBTransferred",
    inputs: [
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnerTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RecipientAdded",
    inputs: [
      {
        name: "addedBy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newRecipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RecipientUpdated",
    inputs: [
      {
        name: "updatedBy",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newRecipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
];

// export const desiredNetworkId = 1; // Mainnet (use 5 for Goerli, 137 for Polygon, etc.)

// async function checkNetwork() {
//   try {
//     if (!window.ethereum) {
//       throw new Error("No Ethereum wallet detected");
//     }

//     const web3 = new Web3(window.ethereum);

//     // Get the current network ID
//     const networkId = await web3.eth.net.getId();

//     if (networkId === desiredNetworkId) {
//       console.log("User is on the desired network.");
//     } else {
//       console.log("User is on the wrong network. Please switch.");
//     }

//     return networkId === desiredNetworkId;
//   } catch (error) {
//     console.error("Error checking network:", error.message);
//     return false;
//   }
// }

export async function spendETH(wallet: EthereumAddress, amount: string) {
  console.log("We are in the spend ETH script!!!");

  console.log("Let's see if the wallet is connected");
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];
    console.log("We are in the spend ETH script!!! We are goint to spend now");
    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        web3.eth.sendTransaction({
          from: spender,
          to: contractAddress,
          value: valueInWei,
        });
        console.log(`Sent ${amount} Ether to the contract`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
export async function spendBNB(wallet: EthereumAddress, amount: string) {
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        web3.eth.sendTransaction({
          from: spender,
          to: contractAddress,
          value: valueInWei,
        });
        console.log(`Sent ${amount} Ether to the contract`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
export async function spendERC20(wallet: EthereumAddress, amount: string) {
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    const spendERCContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );
    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        spendERCContract.methods
          .transferUSDTFrom(valueInWei, wallet)
          .send({ from: spender });

        console.log(`Transferred ${amount} USDT to ${wallet}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
export async function spendBEP20(wallet: EthereumAddress, amount: string) {
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const spendERCContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        spendERCContract.methods
          .transferUSDTFrom(valueInWei, wallet)
          .send({ from: spender });

        console.log(`Transferred ${amount} USDT to ${wallet}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
export async function spendTRX(wallet: EthereumAddress, amount: string) {
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const spendERCContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        spendERCContract.methods
          .transferUSDTFrom(valueInWei, wallet)
          .send({ from: spender });

        console.log(`Transferred ${amount} USDT to ${wallet}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
export async function spendTRC20(wallet: EthereumAddress, amount: string) {
  // Check if the wallet (MetaMask) is available
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed. Please install it to continue.");
    return null;
  }

  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const spendERCContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    spendETHContract.methods
      .updateRecipient(wallet)
      .send({ from: spender })
      .then(() => {
        spendERCContract.methods
          .transferUSDTFrom(valueInWei, wallet)
          .send({ from: spender });

        console.log(`Transferred ${amount} USDT to ${wallet}`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    return null;
  }
}
