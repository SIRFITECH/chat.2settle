// import TronWeb from "tronweb";
// import { TRC20_CONTRACT } from "./cryptoService/cryptoConstants";

// export async function spendTRC20(
//   caller,
//   receiverWallet,
//   amount,
// ) {
//   try {
//     if (typeof window === "undefined" || !window.tronWeb) {
//       throw new Error("TronLink not installed");
//     }

//     const tronWeb = window.tronWeb;
//     const contract = await tronWeb.contract().at(TRC20_CONTRACT);

//     const tx = await contract.transfer(receiverWallet, amount).send({
//       from: caller,
//     });

//     console.log("TRC20 transfer successful:", tx);
//     return tx;
//   } catch (err) {
//     console.error("TRC20 transfer error:", err);
//     return null;
//   }
// }
