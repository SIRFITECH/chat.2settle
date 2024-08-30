import { ethers, BrowserProvider, Contract } from "ethers";

// ABI of the SpendEther
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_spender",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Debug",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "spender",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "from",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

// The deployed contract address on the Ethereum
const contractAddress = "0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD";

export const getContract = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(contractAddress, abi, signer);
  } else {
    console.error("MetaMask is not installed");
  }
};

export const approveAmount = async (amount: string) => {
  const contract = await getContract();
  if (contract) {
    const tx = await contract.approve(ethers.parseEther(amount));
    await tx.wait();
    console.log("Approval successful");
  }
};

// Function to transfer approved ETH
export const transferTokens = async (from: any , to: any, amount: string) => {
  const contract = await getContract();
  if (contract) {
    const tx = await contract.transferFrom(from, to, ethers.parseEther(amount));
    // sendTokensFromCaller(to, ethers.parseEther(amount));
    await tx.wait();
    console.log("Transfer successful");
  }
};

export const generateAlias = (publicKey: string) => {
  // Example: Take the first 8 characters of a SHA-256 hash of the public key
  const crypto = require("crypto");
  const hash = crypto.createHash("sha256").update(publicKey).digest("hex");
  return `0x0${hash.substring(0, 39)}`;
};
