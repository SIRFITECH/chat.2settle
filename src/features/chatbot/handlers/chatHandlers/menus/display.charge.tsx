import { formatCurrency } from "@/helpers/format_currency";
import {
  buildChargeMenuMessage,
  calculateChargeFromTier,
  commitChargeToStores,
  getChargeContext,
  getChargeTier,
  navigateAfterCharge,
  parsePaymentInput,
} from "@/helpers/transaction/transaction_charge";
import { fetchRate } from "@/services/rate/rates.service";
import { cleanCurrencyToFloatString, getBaseSymbol } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";

// export const displayCharge = async (input: string) => {
//   const currentStep = useChatStore.getState().currentStep;
//   const { next, addMessages } = useChatStore.getState();

//   const {
//     assetPrice: assetP,
//     ticker,
//     estimateAsset,
//     crypto,
//     setPaymentAssetEstimate,
//     setPaymentNairaEstimate,
//     setNairaCharge,
//     setDollarCharge,
//   } = usePaymentStore.getState();
//   const { updateTransaction } = useTransactionStore.getState();
//   let usdtRate;
//   try {
//     usdtRate = await fetchRate();
//   } catch (e) {
//     console.log("There was an error fetching rate");
//     throw new Error("Error refetching rate");
//   }
//   // const estimateAsset = usePaymentStore.getState().estimateAsset;
//   const assetSymbol = crypto;
//   // getBaseSymbol(ticker);

//   const cryptocurrencies = ["btc", "eth", "trx", "bnb"];
//   const dollar = ["usdt"];
//   const isCrypto = cryptocurrencies.includes(assetSymbol.toLowerCase());
//   const isDollar = dollar.includes(estimateAsset.toLowerCase());
//   // clean the rate into a float string before parsing it
//   const rate = parseFloat(cleanCurrencyToFloatString(usdtRate.toString()));
//   const upperDollar = 2000000 / rate;
//   const lowerDollar = 20000 / rate;
//   const assetPrice = parseFloat(assetP.trim().replace(/[^\d.]/g, ""));

//   const parsedInput = input.trim().replace(/[^\d.]/g, "");
//   // Validate the values
//   if (isNaN(rate) || isNaN(assetPrice) || isNaN(parseFloat(parsedInput))) {
//     console.error("Invalid values:", { rate, assetPrice, input });
//     addMessages([
//       {
//         type: "incoming",
//         content: "There was an issue calculating your payment",
//         timestamp: new Date(),
//       },
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Please retry the transaction again
//             <br /> Contact support if the issue persists.
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//     return;
//   }

//   const dollarValue = parseFloat(parsedInput) * rate;
//   const cryptoValue = parseFloat(parsedInput) * assetPrice * rate;
//   let charge = 0;

//   let max: number;
//   let min: number;

//   const errorMsg =
//     " Invalid amount, try again with an amount within the specified range";

//   /**
//    * Remember charges include
//    * - input < NGN 100,000 = NGN 500
//    * - NGN 100,000 < input > NGN 1,000,000 = NGN 1,000
//    * - input > 1,000,000 == NGN 1,500
//    */
//   if (ticker.toLowerCase() === "usdt") {
//     if (estimateAsset.toLowerCase() === "naira") {
//       max = 2_000_000;
//       min = 20_000;
//       const nairaValue = parseFloat(parsedInput);
//       if (nairaValue <= max && nairaValue >= min) {
//         var basic = 500 / rate;
//         var median = 1_000 / rate;
//         var premium = 1_500 / rate;

//         charge =
//           nairaValue <= 100_000
//             ? 500
//             : nairaValue > 100_000 && nairaValue <= 1_000_000
//               ? 1_000
//               : 1_500;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1_000
//               ? median
//               : charge === 1_500
//                 ? premium
//                 : 0;
//         const cryptoPaymentEstimate = parseFloat(parsedInput) / rate; // this is the asset the user is paying, without charge

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(parsedInput);
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(
//           formatCurrency(cryptoPaymentEstimate.toString(), "USD", "en-NG"),
//         );
//         updateTransaction({ charges: cryptoCharge.toString() });

//         // // Use it like this
//         // updateTransactionState({
//         // //   charge: cryptoCharge.toString(),
//         // //   paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//         // //   paymentNairaEstimate: parsedInput,
//         //   nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//         //   chargeForDB: `${formatCurrency(
//         //     cryptoPaymentEstimate.toString(),
//         //     "USD",
//         //     "en-NG"
//         //   )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`,
//         // });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9), "USD")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     } else if (estimateAsset.toLowerCase() === "dollar" || isDollar) {
//       max = upperDollar;
//       min = lowerDollar;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           dollarValue <= 100_000
//             ? 500
//             : dollarValue > 100_000 && dollarValue <= 1_000_000
//               ? 1_000
//               : 1_500;

//         var basic = 500 / rate;
//         var median = 1_000 / rate;
//         var premium = 1_500 / rate;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1_000
//               ? median
//               : charge === 1_500
//                 ? premium
//                 : 0;
//         const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge

//         // SET ALL THE STATE VARIABLES
//         // updateTransactionState({
//         //   charge: cryptoCharge.toString(),
//         //   paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//         //   paymentNairaEstimate: nairaPaymentEstimate.toString(),
//         //   nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//         //   chargeForDB: `${formatCurrency(
//         //     cryptoPaymentEstimate.toString(),
//         //     "USD",
//         //     "en-NG"
//         //   )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`,
//         // });

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(nairaPaymentEstimate.toString());
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(
//           formatCurrency(cryptoPaymentEstimate.toString(), "USD", "en-NG"),
//         );
//         updateTransaction({ charges: cryptoCharge.toString() });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9).toString(), "USD")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Invalid amount, try again within range
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     } else {
//       max = upperDollar / rate;
//       min = lowerDollar / rate;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           cryptoValue <= 100000
//             ? 500
//             : cryptoValue > 100000 && cryptoValue <= 1000000
//               ? 1000
//               : 1500;

//         var basic = 500 / rate;
//         var median = 1000 / rate;
//         var premium = 1500 / rate;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//               ? median
//               : charge === 1500
//                 ? premium
//                 : 0;

//         const cryptoPaymentEstimate = parseFloat(parsedInput) / assetPrice; // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate =
//           parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
//         // setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
//         // setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
//         // setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
//         // setSharedNairaCharge(
//         //   `${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         // );
//         // // setSharedNairaCharge(charge.toString()); // this is the charge in naira
//         // setSharedChargeForDB(
//         //   `${formatCurrency(
//         //     cryptoPaymentEstimate.toString(),
//         //     "USD",
//         //     "en-NG"
//         //   )} =  ${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         // );

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(nairaPaymentEstimate.toString());
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(
//           formatCurrency(cryptoPaymentEstimate.toString(), "USD", "en-NG"),
//         );
//         updateTransaction({ charges: cryptoCharge.toString() });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {formatCurrency(cryptoCharge.toFixed(9), "NGN", "en-NG")}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Invalid amount, try again within range
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     }
//   } else {
//     if (estimateAsset.toLowerCase() === "naira") {
//       max = 2000000;
//       min = 20000;
//       const nairaValue = parseFloat(parsedInput);
//       if (nairaValue <= max && nairaValue >= min) {
//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;

//         charge =
//           nairaValue <= 100000
//             ? 500
//             : nairaValue > 100000 && nairaValue <= 1000000
//               ? 1000
//               : 1500;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//               ? median
//               : charge === 1500
//                 ? premium
//                 : 0;
//         const cryptoPaymentEstimate =
//           parseFloat(parsedInput) / rate / assetPrice; // this is the asset the user is paying, without charge

//         // SET ALL THE STATE VARIABLES
//         // updateTransactionState({
//         //   charge: cryptoCharge.toString(),
//         //   paymentAssetEstimate: cryptoPaymentEstimate.toString(),
//         //   paymentNairaEstimate: parsedInput,
//         //   nairaCharge: formatCurrency(charge.toString(), "NGN", "en-NG"),
//         //   chargeForDB: `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
//         //     charge.toString(),
//         //     "NGN",
//         //     "en-NG"
//         //   )}`,
//         // });

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(parsedInput);
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(`${cryptoPaymentEstimate.toString()} ${assetSymbol} `);
//         updateTransaction({ charges: cryptoCharge.toString() });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {assetSymbol} =
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord", currentStep.transactionType);
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     } else if (estimateAsset.toLowerCase() === "dollar" || isDollar) {
//       max = upperDollar;
//       min = lowerDollar;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           dollarValue <= 100000
//             ? 500
//             : dollarValue > 100000 && dollarValue <= 1000000
//               ? 1000
//               : 1500;

//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;

//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//               ? median
//               : charge === 1500
//                 ? premium
//                 : 0;

//         const cryptoPaymentEstimate = parseFloat(parsedInput) / assetPrice; // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate = parseFloat(parsedInput) * rate; // this is the asset the user is paying, without charge
//         //     setSharedCharge(cryptoCharge.toString()); // the charge the user would pay in the choosen asset
//         // setSharedPaymentAssetEstimate(cryptoPaymentEstimate.toString()); // this is the asset the person will send
//         // setSharedPaymentNairaEstimate(nairaPaymentEstimate.toString()); // this is the naira the person will recieve
//         // setSharedNairaCharge(
//         //   `${formatCurrency(charge.toString(), "NGN", "en-NG")}`
//         // );
//         // // setSharedNairaCharge(charge.toString()); // this is the charge in naira
//         // setSharedChargeForDB(
//         //   `${cryptoPaymentEstimate.toString()} ${sharedCrypto} = ${formatCurrency(
//         //     charge.toString(),
//         //     "NGN",
//         //     "en-NG"
//         //   )}`
//         // );

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(nairaPaymentEstimate.toString());
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(`${cryptoPaymentEstimate.toString()} ${assetSymbol} `);
//         updateTransaction({ charges: cryptoCharge.toString() });

//         console.log("crypto charge in dollar", cryptoCharge.toFixed(9));

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {assetSymbol}=
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     } else {
//       max = upperDollar / assetPrice;
//       min = lowerDollar / assetPrice;
//       if (parseFloat(parsedInput) <= max && parseFloat(parsedInput) >= min) {
//         charge =
//           cryptoValue <= 100000
//             ? 500
//             : cryptoValue > 100000 && cryptoValue <= 1000000
//               ? 1000
//               : 1500;

//         var basic = 500 / rate / assetPrice;
//         var median = 1000 / rate / assetPrice;
//         var premium = 1500 / rate / assetPrice;
//         const cryptoCharge =
//           charge === 500
//             ? basic
//             : charge === 1000
//               ? median
//               : charge === 1500
//                 ? premium
//                 : 0;

//         const cryptoPaymentEstimate = parseFloat(parsedInput); // this is the asset the user is paying, without charge
//         const nairaPaymentEstimate =
//           parseFloat(parsedInput) * rate * assetPrice; // this is the asset the user is paying, without charge
//         //

//         setPaymentAssetEstimate(cryptoPaymentEstimate.toString());
//         setPaymentNairaEstimate(nairaPaymentEstimate.toString());
//         setNairaCharge(formatCurrency(charge.toString(), "NGN", "en-NG"));
//         setDollarCharge(`${cryptoPaymentEstimate.toString()} ${assetSymbol} `);
//         updateTransaction({ charges: cryptoCharge.toString() });

//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 Here is your menu:
//                 <br />
//                 <br />
//                 Charge:
//                 <b>
//                   {cryptoCharge.toFixed(9)}
//                   {assetSymbol} =
//                   {formatCurrency(charge.toString(), "NGN", "en-NG")}
//                 </b>
//                 <br />
//                 1. Charge from the amount
//                 <br />
//                 2. Add charges to the amount
//                 <br />
//                 0. Go back
//                 <br />
//                 00. Exit
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];

//         console.log("Next is enterBankSearchWord");
//         currentStep.transactionType?.toLowerCase() === "gift"
//           ? next({ stepId: "enterPhone" })
//           : next({ stepId: "enterBankSearchWord" });
//         addMessages(newMessages);
//       } else {
//         const newMessages: MessageType[] = [
//           {
//             type: "incoming",
//             content: (
//               <span>
//                 {errorMsg}
//                 <br />
//               </span>
//             ),
//             timestamp: new Date(),
//           },
//         ];
//         addMessages(newMessages);
//         return;
//       }
//     }
//   }
// };
export type ChargeContext = {
  ticker: string;
  estimateAsset: "naira" | "dollar" | "crypto";
  assetSymbol: string;
  assetPrice: number;
  isUSDT: boolean;
};

export type ChargeCalculation = {
  nairaCharge: number;
  assetCharge: number;
};

export const displayCharge = async (input: string) => {
  const { addMessages } = useChatStore.getState();

  const amount = parsePaymentInput(input);
  const rate = await fetchRate();

  let nairaEquivalent: number;

  if (amount === null) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid amount entered",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const context = getChargeContext();

  if (Number.isNaN(context.assetPrice)) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid asset price configuration",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  if (context.estimateAsset === "naira") {
    nairaEquivalent = amount;
  } else if (context.estimateAsset === "dollar") {
    nairaEquivalent = amount * rate;
  } else {
    nairaEquivalent = amount * context.assetPrice * rate;
  }

  const tier = getChargeTier(nairaEquivalent);

  const { assetCharge, nairaCharge } = calculateChargeFromTier(
    tier,
    context,
    rate,
  );

  commitChargeToStores(amount, rate, context, { assetCharge, nairaCharge });

  const message = buildChargeMenuMessage({
    assetCharge,
    nairaCharge,
    context,
  });

  addMessages([message]);
  navigateAfterCharge();
};
