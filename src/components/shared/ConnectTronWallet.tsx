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
//   const [showWalletNotReady, setShowWalletNotReady] = useState(false);
//   const [walletConnected, setWalletConnected] = useState(false);

//   const [address, setAddress] = useState("");
//   const [network, setNetwork] = useState("");
//   const [balance, setBalance] = useState("");

//   useEffect(() => {
//     const checkWallet = async () => {
//       if (typeof window === "undefined") return;

//       const tronWeb = window.tronWeb;

//       if (!tronWeb) {
//         console.log("Wallet not found: Tron wallet is not installed.");
//         setShowInitializing(true);
//         setTimeout(() => {
//           window.open("https://www.tronlink.org", "_blank");
//         }, 2000);
//         return;
//       }

//       if (tronWeb.ready) {
//         try {
//           const userAddress = tronWeb.defaultAddress.base58;
//           setAddress(userAddress);

//           const networkType = tronWeb.fullNode.host.includes("shasta")
//             ? "Shasta Testnet"
//             : tronWeb.fullNode.host.includes("nile")
//             ? "Nile Testnet"
//             : "Mainnet";
//           setNetwork(networkType);

//           const balanceSun = await tronWeb.trx.getBalance(userAddress);
//           const balanceTRX = tronWeb.fromSun(balanceSun).toString();
//           setBalance(balanceTRX);

//           setWalletConnected(true);
//           console.log("Tron wallet connected:", userAddress);
//         } catch (error) {
//           console.error("Error retrieving wallet info:", error);
//         }
//       } else {
//         console.log(
//           "Wallet found but not connected (locked or no wallet created)."
//         );

//         // TronLink will use default empty address when locked or no wallet created
//         const fallbackAddress = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";
//         if (
//           !tronWeb.defaultAddress.base58 ||
//           tronWeb.defaultAddress.base58 === fallbackAddress
//         ) {
//           setShowWalletNotReady(true);
//           // Poll for readiness
//           const interval = setInterval(async () => {
//             if (
//               window.tronWeb?.ready &&
//               window.tronWeb.defaultAddress.base58 !== fallbackAddress
//             ) {
//               clearInterval(interval);
//               console.log("Wallet is now connected after unlock.");
//               setShowWalletNotReady(false);
//               await checkWallet(); // Retry wallet check
//             }
//           }, 1000);
//         }
//       }
//     };

//     checkWallet();
//   }, []);

//   return (
//     <>
//       {/* Dialog for Wallet Not Installed */}
//       <Dialog open={showInitializing}>
//         <DialogContent className="text-center">
//           <DialogHeader>
//             <DialogTitle>Tron Wallet Required</DialogTitle>
//             <DialogDescription>
//               <div className="flex flex-col items-center justify-center space-y-4 mt-4">
//                 <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
//                 <p>
//                   Please install{" "}
//                   <a
//                     href="https://www.tronlink.org"
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 underline"
//                   >
//                     TronLink wallet
//                   </a>{" "}
//                   to continue.
//                 </p>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>

//       {/* Dialog for Wallet Not Ready */}
//       <Dialog open={showWalletNotReady}>
//         <DialogContent className="text-center">
//           <DialogHeader>
//             <DialogTitle>Unlock or Create Wallet</DialogTitle>
//             <DialogDescription>
//               <div className="flex flex-col items-center justify-center space-y-4 mt-4">
//                 <img
//                   src="/wallet-not-ready.png" // Replace with actual image path
//                   alt="Wallet Not Ready"
//                   className="w-24 h-24"
//                 />
//                 <p>
//                   You haven&apos;t created or unlocked your wallet yet. Please
//                   open TronLink and complete setup.
//                 </p>
//               </div>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>

//       {/* Main App or Wallet Info */}
//       {walletConnected && (
//         <div className="p-4 text-sm">
//           <p>
//             <strong>Address:</strong> {address}
//           </p>
//           <p>
//             <strong>Network:</strong> {network}
//           </p>
//           <p>
//             <strong>Balance:</strong> {balance} TRX
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default ConnectTronWallet;

"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

const ConnectTronWallet = () => {
  const [showInitializing, setShowInitializing] = useState(false);
  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== "undefined") {
        const tronWeb = window.tronWeb;

        if (!tronWeb) {
          console.log("Wallet not found: Tron wallet is not installed.");
          setShowInitializing(true);
          setTimeout(() => {
            window.open("https://www.tronlink.org", "_blank");
          }, 2000);
        } else if (tronWeb.ready) {
          console.log("Tron wallet found and connected.");
          try {
            const userAddress = window.tronWeb.defaultAddress.base58;
            setAddress(userAddress);

            // Determine network
            const networkType = window.tronWeb.fullNode.host.includes("shasta")
              ? "Shasta Testnet"
              : window.tronWeb.fullNode.host.includes("nile")
              ? "Nile Testnet"
              : "Mainnet";
            setNetwork(networkType);

            // Get balance
            const balanceSun = await window.tronWeb.trx.getBalance(userAddress);
            const balanceTRX = window.tronWeb.fromSun(balanceSun).toString();
            setBalance(balanceTRX);

            console.log("TronLink is connected:", userAddress);
            // setIsModalOpen(false);
          } catch (error) {
            console.error("Error connecting to Tron wallet:", error);
          }
        } else {
          console.log("Wallet found: Tron wallet is not connected.");

          // 🔁 Try forcing user interaction to prompt login
          try {
            const address = tronWeb.defaultAddress.base58;
            if (!address || address === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
              alert("Please unlock your TronLink wallet to continue.");
              // Optionally poll for readiness
              const interval = setInterval(() => {
                if (window.tronWeb.ready) {
                  console.log("Wallet now connected.");
                  clearInterval(interval);
                }
              }, 1000);
            }
          } catch (err) {
            console.error("Failed to access TronLink wallet address", err);
          }
        }
      }
    };

    checkWallet();
  }, []);

  return (
    <>
      <Dialog open={showInitializing}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Initializing...</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500" />
                <p>
                  Please login to your{" "}
                  <a
                    href="https://www.tronlink.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    TronLink wallet
                  </a>{" "}
                  to connect.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div>ConnectTronWallet</div>
    </>
  );
};

export default ConnectTronWallet;
