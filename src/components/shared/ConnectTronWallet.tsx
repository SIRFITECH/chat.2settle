// const ConnectBTCButton = () => {
//   const { paymentAddress, isConnected, disconnect } = useBTCWallet();

//   const handleConnectXverse = async () => {
//     try {
//       await connectXverseWallet();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleCopy = async () => {
//     if (paymentAddress) {
//       await navigator.clipboard.writeText(paymentAddress);
//       alert("Copied");
//     }
//   };

//   return (
//     <div className="relative">
//       {isConnected ? (
//         <div className="flex items-center gap-2">
//           <span className="flex items-center bg-white px-6 py-1 rounded-xl text-base font-bold border-gray-100 border-2">
//             <img
//               src="https://img.icons8.com/color/20/000000/bitcoin--v1.png"
//               alt="BTC"
//               className="h-5 w-5 mr-4"
//             />
//             Bitcoin
//           </span>
//           <Dialog>
//             <DialogTrigger asChild>
//               <button className="bg-gray-100 px-4 py-1 rounded-xl text-base font-bold border-white border-2">
//                 <div className="flex items-center gap-1">
//                   <ShortenedAddress wallet={paymentAddress} />
//                   <MdKeyboardArrowDown />
//                 </div>
//               </button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[400px]">
//               <DialogHeader>
//                 <DialogTitle>
//                   <div className="flex items-center text-xl font-bold">
//                     BTC Wallet
//                   </div>
//                 </DialogTitle>

//                 <DialogDescription>
//                   <div className="text-center mb-4">
//                     <div className="text-sm mt-1 font-bold text-black">
//                       <ShortenedAddress wallet={paymentAddress} />
//                     </div>
//                   </div>
//                   <div className="flex justify-around mt-6">
//                     <button
//                       onClick={handleCopy}
//                       className="flex items-center gap-2 text-blue-600 hover:underline"
//                     >
//                       <MdContentCopy />
//                       Copy
//                     </button>
//                     <button
//                       onClick={disconnect}
//                       className="flex items-center gap-2 text-red-600 hover:underline"
//                     >
//                       <MdLogout />
//                       Disconnect
//                     </button>
//                   </div>
//                 </DialogDescription>
//               </DialogHeader>
//             </DialogContent>
//           </Dialog>
//         </div>
//       ) : (
//         <button
//           onClick={handleConnectXverse}
//           className="bg-transparent text-white"
//         >
//           Connect Xverse
//         </button>
//       )}
//     </div>
//   );
// };

// export default ConnectBTCButton;

"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "../ui/dialog";
import ShortenedAddress from "./ShortenAddress";
import { MdContentCopy, MdKeyboardArrowDown, MdLogout } from "react-icons/md";
import useTronWallet from "@/hooks/stores/tronWalletStore";
import { useRouter } from "next/navigation";

const ConnectTronWallet = () => {
  // Local state for modal/UI logic
  const [showInitializing, setShowInitializing] = useState(false); // Track initializing state
  const router = useRouter();

  // Zustand store actions/state
  const {
    setWalletAddress,
    setTrxBalance,
    setUSDTBalance,
    setConnected,
    clearWallet,
    connected,
    walletAddress,
    trxBalance,
    usdtBalance,
  } = useTronWallet();
  // async function getUSDTBalance() {
  //   // Ensure tronWeb is injected
  //   if (!window.tronWeb || !window.tronWeb.ready) {
  //     throw new Error("Tron wallet not connected");
  //   }

  //   const tronWeb = window.tronWeb;
  //   const address = tronWeb.defaultAddress.base58;
  //   const usdtContractAddress = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";

  //   try {
  //     // Load USDT contract
  //     const contract = await tronWeb.contract().at(usdtContractAddress);

  //     // Call balanceOf with your wallet address
  //     const balance = await contract.methods.balanceOf(address).call();

  //     // USDT has 6 decimals, so divide by 1e6
  //     const usdtBalance = tronWeb.toDecimal(balance) / 1e6;

  //     console.log(`USDT Balance: ${usdtBalance}`);
  //     return usdtBalance;
  //   } catch (err) {
  //     console.error("Failed to fetch USDT balance", err);
  //   }
  // }

  async function getUSDTBalance() {
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("Tron wallet not connected");
    }

    const tronWeb = window.tronWeb;
    const address = tronWeb.defaultAddress.base58;
    // const usdtContractAddress =  "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf";
    //  "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";

    const usdtContractAddress = process.env.NEXT_PUBLIC_USDT_TRC20_CONTRACT;

    if (!usdtContractAddress) {
      throw new Error("USDT contract address is not defined");
    }

    try {
      const contract = await tronWeb.contract().at(usdtContractAddress);
      const balance = await contract.methods.balanceOf(address).call();

      // Safely convert balance to number
      const usdtBalance = parseFloat(balance.toString()) / 1e6;

      console.log(`USDT Balance: ${usdtBalance}`);
      return usdtBalance;
    } catch (err) {
      console.error("Failed to fetch USDT balance", err);
    }
  }

  // Function to fetch balances (TRX + USDT)
  const fetchBalances = async (address: string) => {
    // Fetch TRX balance
    const trxBalance = await window.tronWeb.trx.getBalance(address);
    setTrxBalance(window.tronWeb.fromSun(trxBalance));
    const usdtBalance = await getUSDTBalance();

    // // USDT contract address on TRON mainnet
    // const USDT_CONTRACT = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";

    // // Get USDT contract instance
    // const contract = await window.tronWeb.contract().at(USDT_CONTRACT);
    // // Call balanceOf method
    // const usdtRaw = await contract.balanceOf(address).call();
    setUSDTBalance(usdtBalance ?? 0);
  };

  // Connect wallet logic
  const handleConnectWallet = async () => {
    console.log("Connecting to TronLink...");
    if (!window.tronLink) {
      // TronLink is not installed
      setShowInitializing(true);
      setTimeout(() => {
        window.open("https://www.tronlink.org/", "_blank");
        setShowInitializing(false);
      }, 2000);
      return;
    }
    // Request account access
    try {
      console.log("Requesting TronLink accounts...");
      // Try to request accounts (will trigger popup if locked)
      await window.tronLink.request({ method: "tron_requestAccounts" });
      // After user logs in/unlocks, get address
      const userAddress = window.tronWeb.defaultAddress.base58;
      setWalletAddress(userAddress);
      const walletBal = await fetchBalances(userAddress); // Fetch and save balances
      setConnected(true);
      console.log("Wallet balance", walletBal);
    } catch (err) {
      // User rejected or not logged in, try to prompt login
      setShowInitializing(true);
      setTimeout(() => {
        setShowInitializing(false);
      }, 2000);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    clearWallet();
    router.refresh();
  };

  const handleCopy = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      alert("Copied");
    }
  };

  // On mount, check connection or try auto-connect
  useEffect(() => {
    if (window.tronWeb && window.tronWeb.ready) {
      const address = window.tronWeb.defaultAddress.base58;
      setWalletAddress(address);
      fetchBalances(address);
      setConnected(true);
    }
  }, []);

  // UI rendering
  // return (
  //   <div>
  //     {connected ? (
  //       <div>
  //         {/* <p>Connected: {walletAddress}</p>
  //         <p>TRX Balance: {trxBalance.toString()}</p>
  //         <p>USDT Balance: {usdtBalance}</p> */}
  //         <button onClick={disconnectWallet}>Disconnect</button>
  //       </div>
  //     ) : (
  //       <button onClick={connectWallet}>Connect Tron Wallet</button>
  //     )}
  //     {showInitializing && (
  //       <Dialog>
  //         <p>
  //           {window.tronLink
  //             ? "Please unlock/login to TronLink and approve connection."
  //             : "TronLink not installed. Redirecting..."}
  //         </p>
  //       </Dialog>
  //     )}
  //   </div>
  // );

  return (
    <div className="relative">
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center bg-white px-6 py-1 rounded-xl text-base font-bold border-gray-100 border-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/12114/12114250.png"
              alt="tron"
              className="h-5 w-5 mr-4"
            />
            TRC20
          </span>
          <Dialog>
            <DialogTrigger asChild>
              <button className="bg-gray-100 px-4 py-1 rounded-xl text-base font-bold border-white border-2">
                <div className="flex items-center gap-1">
                  <ShortenedAddress wallet={walletAddress} />
                  <MdKeyboardArrowDown />
                </div>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center text-xl font-bold">
                    Tron Wallet
                  </div>
                </DialogTitle>

                <DialogDescription>
                  <div className="text-center mb-4">
                    <div className="text-sm mt-1 font-bold text-black">
                      <ShortenedAddress wallet={walletAddress} />
                      <ul>
                        <li>
                          <p>TRX Balance: {trxBalance.toString()}</p>
                        </li>
                        <li>
                          <p>USDT Balance: {usdtBalance}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex justify-around mt-6">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <MdContentCopy />
                      Copy
                    </button>
                    <button
                      onClick={disconnect}
                      className="flex items-center gap-2 text-red-600 hover:underline"
                    >
                      <MdLogout />
                      Disconnect
                    </button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="bg-transparent text-white"
        >
          Connect Tron Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectTronWallet;

// "use client";
// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../ui/dialog";

// const ConnectTronWallet = () => {
//   const [showInitializing, setShowInitializing] = useState(false);
//   const [address, setAddress] = useState("");
//   const [network, setNetwork] = useState("");
//   const [balance, setBalance] = useState("");

//   useEffect(() => {
//     const checkWallet = async () => {
//       if (typeof window !== "undefined") {
//         const tronWeb = window.tronWeb;

//         if (!tronWeb) {
//           console.log("Wallet not found: Tron wallet is not installed.");
//           setShowInitializing(true);
//           setTimeout(() => {
//             window.open("https://www.tronlink.org", "_blank");
//           }, 2000);
//         } else if (tronWeb.ready) {
//           console.log("Tron wallet found and connected.");
//           try {
//             const userAddress = window.tronWeb.defaultAddress.base58;
//             setAddress(userAddress);

//             // Determine network
//             const networkType = window.tronWeb.fullNode.host.includes("shasta")
//               ? "Shasta Testnet"
//               : window.tronWeb.fullNode.host.includes("nile")
//               ? "Nile Testnet"
//               : "Mainnet";
//             setNetwork(networkType);

//             // Get balance
//             const balanceSun = await window.tronWeb.trx.getBalance(userAddress);
//             const balanceTRX = window.tronWeb.fromSun(balanceSun).toString();
//             setBalance(balanceTRX);

//             console.log("TronLink is connected:", userAddress);
//             // setIsModalOpen(false);
//           } catch (error) {
//             console.error("Error connecting to Tron wallet:", error);
//           }
//         } else {
//           console.log("Wallet found: Tron wallet is not connected.");

//           // 🔁 Try forcing user interaction to prompt login
//           try {
//             const address = tronWeb.defaultAddress.base58;
//             if (!address || address === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
//               alert("Please unlock your TronLink wallet and try again to continue.");
//               // Optionally poll for readiness
//               // const interval = setInterval(() => {
//               //   if (window.tronWeb.ready) {
//               //     console.log("Wallet now connected.");
//               //     clearInterval(interval);
//               //   }
//               // }, 1000);
//             }
//           } catch (err) {
//             console.error("Failed to access TronLink wallet address", err);
//           }
//         }
//       }
//     };

//     checkWallet();
//   }, []);

//   return (
//     <>
//       <Dialog open={showInitializing}>
//         <DialogContent className="text-center">
//           <DialogHeader>
//             <DialogTitle>Initializing...</DialogTitle>
//             <DialogDescription>
//               <div className="flex flex-col items-center justify-center space-y-4 mt-4">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
//                 <p>
//                   Please login to your{" "}
//                   <a
//                     href="https://www.tronlink.org"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 underline"
//                   >
//                     TronLink wallet
//                   </a>{" "}
//                   to connect.
//                 </p>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>

//       <div>ConnectTronWallet</div>
//     </>
//   );
// };

// export default ConnectTronWallet;
