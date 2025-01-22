import { EthereumAddress } from "@/types/general_types";
import { Web3 } from "web3";
import dotenv from "dotenv";
dotenv.config();

// SETUP
// Contract address and ABI
const contractAddress = "0x0a16ae0366114a7a430fc50939a9deb985caf844";
const contractABI: any[] = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_initialOwner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenTransfered",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "recipient",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "transferUSDTFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddressUSDTERC20 = "0x90183c95c363aff91939fd88e35f7074d44e6fe1";
const contractABIUSDTERC20: any[] = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokenTransfered",
    type: "event",
  },
  {
    inputs: [],
    name: "recipient",
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
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
    ],
    name: "transferUSDTFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export async function spendETH(wallet: EthereumAddress, amount: string) {
  try {
    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);
    const expectedChainID = 11155111;
    // 1;
    // sopelia - 11155111;
    // Request wallet connection
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          chainId: expectedChainID,
        },
      ],
    });

    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );
      return null;
    }

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    // sending plain ETH with no transaction data
    const reciept = await web3.eth.sendTransaction({
      from: spender,
      to: wallet,
      value: valueInWei,
    });
    if (reciept.status) {
      console.log(`Sent ${amount} Ether to the contract`, reciept);
    } else {
      console.error("Transaction failed");
    }
    return reciept;
  } catch (error) {
    console.error("Errorsending the transaction", error);
    return null;
  }
}

export async function spendBNB(wallet: EthereumAddress, amount: string) {
  try {
    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);
    const expectedChainID = 67;
    // 1;
    // sopelia - 11155111;
    // Request wallet connection
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          chainId: expectedChainID,
        },
      ],
    });

    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );
      return null;
    }

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    const methodSignature = web3.eth.abi.encodeFunctionSignature(
      "transferBNB(unit256)"
    );

    const encodedParameter = web3.eth.abi.encodeParameters(
      ["uint256"],
      [valueInWei]
    );

    const spendETHContract = new web3.eth.Contract(
      contractABI,
      contractAddress
    );

    const callData = methodSignature + encodedParameter.slice(2);

    console.log(`Sent ${amount} Ether to the contract`, wallet);
    const reciept = await web3.eth
      .sendTransaction({
        from: spender,
        to: wallet,
        value: valueInWei,
        data: callData,
      })
      .on("receipt", (reciept) => console.log("The reciept is:", reciept))
      .on("error", (error) => console.error("Transaction faild", error));

    console.log(`We have sent ${amount} BNB`, reciept);
    return reciept;
  } catch (error) {
    console.error("Errorsending the transaction", error);
    return null;
  }
}
export async function spendERC20(wallet: EthereumAddress, amount: string) {
  try {
    // Request wallet connection
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Check if the wallet (MetaMask) is available
    if (typeof window.ethereum === "undefined") {
      console.error(
        "MetaMask is not installed. Please install it to continue."
      );
      return null;
    }
    // Create a Web3 instance with the injected provider
    const web3 = new Web3(window.ethereum);

    // Get the list of accounts
    const accounts = await web3.eth.getAccounts();

    const spendUSDTERC20Contract = new web3.eth.Contract(
      contractABIUSDTERC20,
      contractAddressUSDTERC20
    );
    const valueInWei = web3.utils.toWei(amount, "ether");

    if (accounts.length === 0) {
      console.log("No accounts found. Please connect a wallet.");
      return null;
    }

    // Get the first connected account (primary wallet address)
    const spender = accounts[0];

    // spendUSDTERC20Contract.methods.send({ from: spender })
    //   .then(() => {
    //     spendERCContract.methods
    //       .transferUSDTFrom(valueInWei, wallet)
    //       .send({ from: spender });

    //     console.log(`Transferred ${amount} USDT to ${wallet}`);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
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
