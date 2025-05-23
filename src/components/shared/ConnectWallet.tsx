// "use client";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogClose,
//   DialogContent,
//   DialogHeader,
//   DialogFooter,
//   DialogTitle,
//   DialogDescription,
// } from "../ui/dialog";
// import { Button } from "../ui/button";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { useAccount } from "wagmi";
// import Logo from "./Logo";
// import ConnectBTCButton from "./ConnectBTCButton";
// import { useBTCWallet } from "@/hooks/stores/btcWalletStore";
// import ConnectTronWallet from "./ConnectTronWallet";;

// const ConnectWallet = () => {
//   const { isConnected } = useAccount();
//   const { isConnected: isBTCConnected } = useBTCWallet();

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {isConnected ? (
//           <ConnectButton />
//         ) : isBTCConnected ? (
//           <ConnectBTCButton />
//         ) : (
//           <Button
//             className="bg-blue-500 hover:bg-blue-400 hover:text-white-4 text-white rounded-full"
//             variant="outline"
//           >
//             {"Connect Wallet"}
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="w-screen">
//         <DialogHeader>
//           <DialogTitle className="flex justify-center mb-4">
//             <Logo />
//           </DialogTitle>
//           <DialogDescription className="flex justify-center">
//             {isConnected
//               ? "Your Connected Wallet"
//               : "Choose Your Preferred Wallet"}
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter className="flex justify-center w-full">
//           <DialogClose asChild>
//             <div className="flex justify-center flex-col w-full">
//               {isConnected ? (
//                 <ConnectButton />
//               ) : (
//                 <>
//                   <Button
//                     className="mb-3 bg-blue-500 hover:bg-blue-400"
//                     type="button"
//                   >
//                     <div className="pt-4 pb-3 border-t border-gray-200">
//                       <div className="flex justify-center px-4">
//                         <img
//                           src="https://img.icons8.com/color/20/000000/bitcoin--v1.png"
//                           alt="BTC"
//                           className="h-5 w-5 mr-4"
//                         />
//                         <ConnectBTCButton />
//                       </div>
//                     </div>
//                   </Button>
//                   <Button className="mb-3 hover:bg-stone-600" type="button">
//                     <div className="flex justify-center px-4">
//                       <img
//                         src="https://img.icons8.com/color/20/000000/ethereum.png"
//                         alt="Ethereum"
//                         className="h-5 w-5 mr-4"
//                       />
//                       <ConnectButton />
//                     </div>
//                   </Button>
//                   <Button
//                     className="mb-3 bg-red-700 hover:bg-red-400"
//                     type="button"
//                   >
//                     <div className="pt-4 pb-3 border-t border-gray-200">
//                       <div className="flex justify-center px-4">
//                         <img
//                           src="https://img.icons8.com/?size=20&id=7NCvsu15urpd&format=png&color=000000"
//                           alt="Tron"
//                           className="h-5 w-5 mr-4"
//                         />
//                         <ConnectTronWallet />
//                       </div>
//                     </div>
//                   </Button>
//                 </>
//               )}
//             </div>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
// export default ConnectWallet;

"use client";

import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Logo from "./Logo";
import ConnectBTCButton from "./ConnectBTCButton";
import { useBTCWallet } from "@/hooks/stores/btcWalletStore";
import ConnectTronWallet from "./ConnectTronWallet";
import { useState } from "react";

const ConnectWallet = () => {
  const { isConnected } = useAccount();
  const { isConnected: isBTCConnected } = useBTCWallet();
  const [showTronConnect, setShowTronConnect] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isConnected ? (
          <ConnectButton />
        ) : isBTCConnected ? (
          <ConnectBTCButton />
        ) : (
          <Button
            className="bg-blue-500 hover:bg-blue-400 hover:text-white-4 text-white rounded-full"
            variant="outline"
          >
            {"Connect Wallet"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-screen">
        <DialogHeader>
          <DialogTitle className="flex justify-center mb-4">
            <Logo />
          </DialogTitle>
          <DialogDescription className="flex justify-center">
            {isConnected
              ? "Your Connected Wallet"
              : "Choose Your Preferred Wallet"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center w-full">
          <DialogClose asChild>
            <div className="flex justify-center flex-col w-full">
              {isConnected ? (
                <ConnectButton />
              ) : (
                <>
                  <Button
                    className="mb-3 bg-blue-500 hover:bg-blue-400"
                    type="button"
                  >
                    <div className="pt-4 pb-3 border-t border-gray-200">
                      <div className="flex justify-center px-4">
                        <img
                          src="https://img.icons8.com/color/20/000000/bitcoin--v1.png"
                          alt="BTC"
                          className="h-5 w-5 mr-4"
                        />
                        <ConnectBTCButton />
                      </div>
                    </div>
                  </Button>
                  <Button className="mb-3 hover:bg-stone-600" type="button">
                    <div className="flex justify-center px-4">
                      <img
                        src="https://img.icons8.com/color/20/000000/ethereum.png"
                        alt="Ethereum"
                        className="h-5 w-5 mr-4"
                      />
                      <ConnectButton />
                    </div>
                  </Button>
                  <Button
                    className="mb-3 bg-red-700 hover:bg-red-400"
                    type="button"
                  >
                    <div className="pt-4 pb-3 border-t border-gray-200">
                      <div className="flex justify-center px-4">
                        <img
                          src="https://img.icons8.com/?size=20&id=7NCvsu15urpd&format=png&color=000000"
                          alt="Tron"
                          className="h-5 w-5 mr-4"
                        />
                        <ConnectTronWallet />
                      </div>
                    </div>
                  </Button>
            
                </>
              )}
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWallet;
