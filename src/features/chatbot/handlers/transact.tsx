import { MessageType } from "@/types/general_types";
import {
  displayCharge,
  displayEnterPhone,
  displayHowToEstimation,
  displayPayIn,
  displayRequestPaymentSummary,
  displayTransactCrypto,
  displayTransferMoney,
} from "@/menus/transact_crypto";
import { displayKYCInfo } from "@/menus/request_paycard";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import { displayReportlyWelcome } from "@/menus/reportly";
import { displayTransactIDWelcome } from "@/menus/transaction_id";
import { helloMenu } from "./general";
import { greetings } from "../helpers/ChatbotConsts";
import { welcomeMenu } from "./menus";
import { checkRequestExists } from "@/helpers/api_calls";
import { SetStateAction } from "react";
import { getWalletType } from "@/helpers/transaction/transact_crypto";
import { WalletAddress } from "@/lib/wallets/types";
import { add } from "lodash";

/**
 * handle crypto transaction, payment request and gifts
 */

/**
   Allow user to choose what action they want to perform - 
    1. Transact Crypto
    2. Request for paycard
    3. Customer support
    4. Transaction ID
    5. Reportly
    *  */

export const handleMakeAChoice = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "00") {
    goToStep("start");
    helloMenu(
      addChatMessages,
      "hi",
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "0") {
    prevStep();
    helloMenu(
      addChatMessages,
      "hi",
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "1") {
    // console.log("The choice is ONE, TRANSACT CRYPTO");
    displayTransactCrypto(addChatMessages);

    nextStep("transferMoney");
  } else if (chatInput === "2") {
    // console.log("The choice is TWO, REQUEST PAY CARD");
    displayKYCInfo(addChatMessages, nextStep);
  } else if (chatInput === "3") {
    displayCustomerSupportWelcome(addChatMessages, nextStep);
  } else if (chatInput === "4") {
    // console.log("The choice is FOUR, TRANSACTION ID");
    displayTransactIDWelcome(addChatMessages, nextStep);
  } else if (chatInput === "5") {
    // console.log("The choice is FIVE, REPORTLY");
    displayReportlyWelcome(addChatMessages, nextStep);
    // nextStep("transferMoney");
  } else {
    addChatMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. You need to choose an action from the options",
        timestamp: new Date(),
      },
    ]);
  }
};

// HANDLE TRANSFER MONEY MENU
export const handleTransferMoney = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  sharedPaymentMode: string,
  sharedRate: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void,
  setSharedWallet: (ticker: string) => void,
  setSharedEstimateAsset: (crypto: string) => void,
  setSharedGiftId: (giftId: string) => void,
  setLoading: React.Dispatch<SetStateAction<boolean>>
) => {
  setSharedWallet("");
  console.log("Shared payment mode", sharedPaymentMode.toLowerCase().trim());
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "0") {
    prevStep();
    // I am supposed to parse formattedRate instead of sharedRate
    welcomeMenu(
      addChatMessages,
      walletIsConnected,
      wallet,
      telFirstName,
      sharedRate
    );
  } else if (chatInput === "1") {
    setSharedPaymentMode("transferMoney");
    displayTransferMoney(addChatMessages);
    nextStep("estimateAsset");
  } else if (chatInput === "2") {
    displayTransferMoney(addChatMessages);
    setSharedPaymentMode("Gift");

    nextStep("estimateAsset");
  } else if (chatInput === "3") {
    displayPayIn(
      addChatMessages,
      "Naira",
      sharedRate,
      "",
      "",
      sharedPaymentMode
    );
    setSharedEstimateAsset("Naira");
    nextStep("enterBankSearchWord");

    setSharedPaymentMode("request");
  } else if (sharedPaymentMode.toLowerCase().trim() === "payrequest") {
    console.log("Lets see what is sent", chatInput);
    try {
      // check if request exist and proceed accordingly
      setLoading(true);
      const request = await checkRequestExists(chatInput.trim());
      const requestExists = request.exists;
      //  const userDateToUse = {
      //    crypto: sharedCrypto,
      //    network: sharedNetwork,
      //    estimation: sharedEstimateAsset,
      //    Amount: parseFloat(sharedPaymentAssetEstimate)
      //      .toFixed(8)
      //      .toString(),
      //    charges: sharedChargeForDB,
      //    mode_of_payment: sharedPaymentMode,
      //    acct_number: bankData.acct_number,
      //    bank_name: bankData.bank_name,
      //    receiver_name: bankData.receiver_name,
      //    receiver_amount: formatCurrency(
      //      sharedPaymentNairaEstimate,
      //      "NGN",
      //      "en-NG"
      //    ),
      //    crypto_sent: paymentAsset,
      //    wallet_address: activeWallet,
      //    Date: date,
      //    status: "Processing",
      //    customer_phoneNumber: formatPhoneNumber(phoneNumber),
      //    transac_id: transactionID.toString(),
      //    settle_walletLink: "",
      //    chat_id: chatId,
      //    current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
      //    merchant_rate: merchantRate,
      //    profit_rate: profitRate,
      //    name: "",
      //    asset_price:
      //      sharedCrypto.toLowerCase() != "usdt"
      //        ? formatCurrency(sharedAssetPrice, "USD")
      //        : formatCurrency(sharedRate, "NGN", "en-NG"),
      //  };
      if (requestExists) {
        // populate the userData with available data
        setSharedGiftId(chatInput.trim());
        setLoading(false);
        displayTransferMoney(addChatMessages);
        nextStep("estimateAsset");
      } else {
        setLoading(false);
        addChatMessages([
          {
            type: "incoming",
            content: `Invalid request_id. Try again`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      setLoading(false);
      addChatMessages([
        {
          type: "incoming",
          content: "Error fetching request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  } else {
    addChatMessages([
      {
        type: "incoming",
        content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        timestamp: new Date(),
      },
    ]);
  }
};

// HANDLE ESTIMATE PAYMENT IN ASSET MENU

export const handleEstimateAsset = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  sharedPaymentMode: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void,
  setSharedTicker: (ticker: string) => void,
  setSharedCrypto: (crypto: string) => void,
  setSharedNetwork: (network: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "0") {
    (() => {
      prevStep();
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: (
            <span>
              Here is your menu:
              <br />
              <br />
              1. Transfer money
              <br />
              2. Send Gift
              <br />
              3. Request for payment
              <br />
              0. Go back
            </span>
          ),
          timestamp: new Date(),
        },
      ];
      console.log("Next is howToEstimate");
      addChatMessages(newMessages);
    })();
  } else if (chatInput === "00") {
    goToStep("chooseAction");
    helloMenu(
      addChatMessages,
      "hi",
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "1") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "BTC") {
      addChatMessages([
        {
          type: "incoming",
          content: `BTC is only supported when BTC wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      displayHowToEstimation(
        addChatMessages,
        "Bitcoin (BTC)",
        sharedPaymentMode
      );
      nextStep("payOptions");
    }
    setSharedTicker("BTCUSDT");
    setSharedCrypto("BTC");
    setSharedNetwork("BTC");
  } else if (chatInput === "2") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "EVM") {
      addChatMessages([
        {
          type: "incoming",
          content: `ETH is only supported when ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      displayHowToEstimation(
        addChatMessages,
        "Ethereum (ETH)",
        sharedPaymentMode
      );
      nextStep("payOptions");
    }
    setSharedTicker("ETHUSDT");
    setSharedCrypto("ETH");
    setSharedNetwork("ERC20");
  } else if (chatInput === "3") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "EVM") {
      addChatMessages([
        {
          type: "incoming",
          content: `BNB is only supported when BNB/ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      displayHowToEstimation(
        addChatMessages,
        "BINANCE (BNB)",
        sharedPaymentMode
      );
      nextStep("payOptions");
    }
    setSharedTicker("BNBUSDT");
    setSharedCrypto("BNB");
    setSharedNetwork("BEP20");
  } else if (chatInput === "4") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "TRX") {
      addChatMessages([
        {
          type: "incoming",
          content: `TRX is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      displayHowToEstimation(addChatMessages, "TRON (TRX)", sharedPaymentMode);
      nextStep("payOptions");
    }
    setSharedTicker("TRXUSDT");
    setSharedCrypto("TRX");
    setSharedNetwork("TRC20");
  } else if (chatInput === "5") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "EVM" && walletType !== "TRX") {
      addChatMessages([
        {
          type: "incoming",
          content: `USDT is only supported when ETH or TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: (
          <span>
            select Network: <br />
            <br />
            1. ERC20 <br />
            2. TRC20 <br />
            3. BEP20
            <br /> <br />
            0. Go back <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ];

    addChatMessages(newMessages);
    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    nextStep("network");
  } else {
    addChatMessages([
      {
        type: "incoming",
        content: "Invalid choice. Choose a valid estimate asset",
        timestamp: new Date(),
      },
    ]);
  }
};

// export const handleEstimateAsset = async (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   sharedPaymentMode: string,
//   nextStep: (step: string) => void,
//   prevStep: () => void,
//   goToStep: (step: string) => void,
//   setSharedPaymentMode: (mode: string) => void,
//   setSharedTicker: (ticker: string) => void,
//   setSharedCrypto: (crypto: string) => void,
//   setSharedNetwork: (network: string) => void
// ) => {
//   const walletType = getWalletType(wallet);
//   const lowerInput = chatInput.trim().toLowerCase();

//   const assetConfig: Record<
//     string,
//     {
//       name: string;
//       ticker: string;
//       crypto: string;
//       network: string;
//       requiredWalletType: "BTC" | "EVM" | "TRX" | "EVM|TRX";
//     }
//   > = {
//     "1": {
//       name: "Bitcoin (BTC)",
//       ticker: "BTCUSDT",
//       crypto: "BTC",
//       network: "BTC",
//       requiredWalletType: "BTC",
//     },
//     "2": {
//       name: "Ethereum (ETH)",
//       ticker: "ETHUSDT",
//       crypto: "ETH",
//       network: "ERC20",
//       requiredWalletType: "EVM",
//     },
//     "3": {
//       name: "Binance (BNB)",
//       ticker: "BNBUSDT",
//       crypto: "BNB",
//       network: "BEP20",
//       requiredWalletType: "EVM",
//     },
//     "4": {
//       name: "Tron (TRX)",
//       ticker: "TRXUSDT",
//       crypto: "TRX",
//       network: "TRC20",
//       requiredWalletType: "TRX",
//     },
//     "5": {
//       name: "USDT",
//       ticker: "USDT",
//       crypto: "USDT",
//       network: "",
//       requiredWalletType: "EVM|TRX",
//     },
//   };

//   const showError = (msg: string) =>
//     addChatMessages([
//       { type: "incoming", content: msg, timestamp: new Date() },
//     ]);

//   const handleEstimation = (assetKey: string) => {
//     const config = assetConfig[assetKey];

//     const isUSDTWallet = config.requiredWalletType.split("|");

//     const isValidWallet = isUSDTWallet
//       ? config.requiredWalletType.split("|").includes(walletType)
//       : walletType !== config.requiredWalletType;

//     if (walletIsConnected && !isValidWallet) {
//       return showError(
//         `${
//           config.name
//         } is only supported when ${config.requiredWalletType.replace(
//           "|",
//           " or "
//         )} wallet is connected. \n Please select the asset of the connected wallet. \n Try again`
//       );
//     }

//     if (sharedPaymentMode.toLowerCase() === "payrequest") {
//       displayEnterPhone(addChatMessages, nextStep);
//     } else if (assetKey === "5") {
//       // THAT WOULD BE USDT
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               select Network: <br />
//               <br />
//               1. ERC20 <br />
//               2. TRC20 <br />
//               3. BEP20 <br />
//               <br />
//               0. Go back <br />
//               00. Exit
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep("network");
//     } else {
//       displayHowToEstimation(addChatMessages, config.crypto, sharedPaymentMode);
//     }

//     setSharedTicker(config.ticker);
//     setSharedCrypto(config.crypto);
//     if (config.network) setSharedNetwork(config.network);
//   };

//   // ===== Chat input routing logic =====
//   if (greetings.includes(lowerInput)) {
//     goToStep("start");
//     helloMenu(
//       addChatMessages,
//       chatInput,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (chatInput === "0") {
//     prevStep();
//     addChatMessages([
//       {
//         type: "incoming",
//         content: (
//           <span>
//             Here is your menu:
//             <br />
//             <br />
//             1. Transfer money
//             <br />
//             2. Send Gift
//             <br />
//             3. Request for payment
//             <br />
//             0. Go back
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//   } else if (chatInput === "00") {
//     goToStep("chooseAction");
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (assetConfig[chatInput]) {
//     handleEstimation(chatInput);
//   } else {
//     showError("Invalid choice. Choose a valid estimate asset");
//   }
// };

// HANDLE NETWORK FOR DOLLAR TRANSFER
export const handleNetwork = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedPaymentMode: string,
  sharedGiftId: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedTicker: (ticker: string) => void,
  setSharedCrypto: (crypto: string) => void,
  setSharedNetwork: (network: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  const walletType = getWalletType(wallet);
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "00") {
    (() => {
      goToStep("start");
      helloMenu(
        addChatMessages,
        "hi",
        nextStep,
        walletIsConnected,
        wallet,
        telFirstName,
        setSharedPaymentMode
      );
    })();
  } else if (chatInput === "0") {
    (() => {
      prevStep();
      displayTransferMoney(addChatMessages);
    })();
  } else if (chatInput === "1") {
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      if (walletIsConnected && walletType !== "EVM") {
        addChatMessages([
          {
            type: "incoming",
            content: `USDT (ERC20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
            timestamp: new Date(),
          },
        ]);
        return;
      } else {
        displayHowToEstimation(
          addChatMessages,
          "USDT (ERC20)",
          sharedPaymentMode
        );
        nextStep("payOptions");
      }
    }

    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    setSharedNetwork("ERC20");
  } else if (chatInput === "2") {
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      if (walletIsConnected && walletType !== "TRX") {
        addChatMessages([
          {
            type: "incoming",
            content: `TRC20 is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
            timestamp: new Date(),
          },
        ]);
        return;
      } else {
        displayHowToEstimation(
          addChatMessages,
          "USDT (TRC20)",
          sharedPaymentMode
        );

        nextStep("payOptions");
      }
    }
    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    setSharedNetwork("TRC20");
  } else if (chatInput === "3") {
    // sharedGiftId
    if (sharedPaymentMode.toLowerCase() === "payrequest") {
      displayEnterPhone(addChatMessages, nextStep);
    } else {
      if (walletIsConnected && walletType !== "EVM") {
        addChatMessages([
          {
            type: "incoming",
            content: `USDT (BEP20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
            timestamp: new Date(),
          },
        ]);
        return;
      } else {
        displayHowToEstimation(
          addChatMessages,
          "USDT (BEP20)",
          sharedPaymentMode
        );
        nextStep("payOptions");
      }
    }
    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    setSharedNetwork("BEP20");
  } else {
    addChatMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Choose your prefered network or say Hi if you are stock.",
        timestamp: new Date(),
      },
    ]);
  }
};

// HANDLE THE ASSETS FOR ESTIMATION
export const handlePayOptions = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedPaymentMode: string,
  sharedCrypto: string,
  sharedNetwork: string,
  sharedRate: string,
  sharedTicker: string,
  sharedAssetPrice: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedEstimateAsset: (estimateAsset: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "00") {
    (() => {
      goToStep("start");
      helloMenu(
        addChatMessages,
        "hi",
        nextStep,
        walletIsConnected,
        wallet,
        telFirstName,
        setSharedPaymentMode
      );
    })();
  } else if (chatInput === "0") {
    (() => {
      prevStep();
      displayHowToEstimation(
        addChatMessages,
        `${sharedCrypto} (${sharedNetwork})`,
        sharedPaymentMode
      );
    })();
  } else if (chatInput === "1") {
    displayPayIn(
      addChatMessages,
      "Naira",
      sharedRate,
      sharedTicker,
      sharedAssetPrice,
      sharedPaymentMode
    );
    setSharedEstimateAsset("Naira");
    nextStep("charge");
  } else if (chatInput === "2") {
    displayPayIn(
      addChatMessages,
      "Dollar",
      sharedRate,
      sharedTicker,
      chatInput,
      sharedPaymentMode
    );
    setSharedEstimateAsset("Dollar");
    nextStep("charge");
  } else if (chatInput === "3") {
    console.log("We are paying with crypto");
    displayPayIn(
      addChatMessages,
      sharedCrypto,
      sharedRate,
      sharedTicker,
      sharedAssetPrice,
      sharedPaymentMode
    );
    setSharedEstimateAsset(sharedCrypto);
    nextStep("charge");
  } else if (sharedPaymentMode.trim().toLowerCase() === "request") {
    displayPayIn(
      addChatMessages,
      "Naira",
      sharedRate,
      "",
      "",
      sharedPaymentMode
    );
    setSharedEstimateAsset("Naira");
    nextStep("charge");
  } else {
    addChatMessages([
      {
        type: "incoming",
        content: "Invalid choice. Please choose a valid pay option.",

        timestamp: new Date(),
      },
    ]);
  }
};

// HANDLE ESTIMATE IN SELECTED ASSET
export const handleCharge = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedPaymentMode: string,
  sharedEstimateAsset: string,
  sharedCrypto: string,
  sharedNetwork: string,
  sharedRate: string,
  sharedAssetPrice: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedAmount: (sharedAmount: string) => void,
  setSharedCharge: React.Dispatch<React.SetStateAction<string>>,
  setSharedPaymentAssetEstimate: React.Dispatch<React.SetStateAction<string>>,
  setSharedPaymentNairaEstimate: React.Dispatch<React.SetStateAction<string>>,
  setSharedNairaCharge: React.Dispatch<React.SetStateAction<string>>,
  setSharedChargeForDB: React.Dispatch<React.SetStateAction<string>>,
  setSharedPaymentMode: (mode: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput === "00") {
    (() => {
      // console.log("Going back from handlePayOptions");
      goToStep("start");
      helloMenu(
        addChatMessages,
        "hi",
        nextStep,
        walletIsConnected,
        wallet,
        telFirstName,
        setSharedPaymentMode
      );
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("Going back from handlePayOptions");
      prevStep();
      displayHowToEstimation(
        addChatMessages,
        `${sharedCrypto} (${sharedNetwork})`,
        sharedPaymentMode
      );
    })();
  } else if (chatInput != "0") {
    setSharedAmount(chatInput.trim());
    console.log("Lets see what comes in", chatInput.trim());
    displayCharge(
      addChatMessages,
      nextStep,
      chatInput,
      sharedEstimateAsset,
      sharedRate,
      sharedAssetPrice,
      sharedCrypto,
      setSharedCharge,
      setSharedPaymentAssetEstimate,
      setSharedPaymentNairaEstimate,
      setSharedNairaCharge,
      setSharedChargeForDB,
      sharedPaymentMode
    );
  } else {
    addChatMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Do you want to include charge in your estimate or not?.",

        timestamp: new Date(),
      },
    ]);
  }
};
