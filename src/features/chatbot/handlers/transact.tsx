import { MessageType } from "@/types/general_types";
import {
  displayCharge,
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
import { WalletAddress } from "@/types/wallet_types";
import { checkRequestExists } from "@/helpers/api_calls";
import { SetStateAction } from "react";

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
  setLoading: React.Dispatch<SetStateAction<boolean>>
) => {
  setSharedWallet("");
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
  } else if (sharedPaymentMode.toLowerCase() === "request") {
    console.log("Lets see what is sent", chatInput);
    try {
      // check if request exist and proceed accordingly
      setLoading(true);
      const request = await checkRequestExists(chatInput);
      const requestExists = request.exists;
      if (requestExists) {
        // populate the userData with available data
        console.log("request is", request.user?.acct_number);
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
    displayHowToEstimation(addChatMessages, "Bitcoin (BTC)", sharedPaymentMode);
    setSharedTicker("BTCUSDT");
    setSharedCrypto("BTC");
    setSharedNetwork("BTC");
    // if request skip to enter phone
    nextStep("payOptions");
  } else if (chatInput === "2") {
    const parsedInput = "Ethereum (ETH)";

    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: `How would you like to estimate your ${parsedInput}?`,
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            <br />
            1. Naira
            <br />
            2. Dollar
            <br />
            3. Crypto
            <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ];

    addChatMessages(newMessages);

    setSharedTicker("ETHUSDT");
    setSharedCrypto("ETH");
    setSharedNetwork("ERC20");
    nextStep("payOptions");
  } else if (chatInput === "3") {
    const parsedInput = "BINANCE (BNB)";

    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: `How would you like to estimate your ${parsedInput}?`,
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            <br />
            1. Naira
            <br />
            2. Dollar
            <br />
            3. Crypto
            <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ];

    addChatMessages(newMessages);

    setSharedTicker("BNBUSDT");
    setSharedCrypto("BNB");
    setSharedNetwork("BEP20");
    nextStep("payOptions");
  } else if (chatInput === "4") {
    const parsedInput = "TRON (TRX)";

    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: `How would you like to estimate your ${parsedInput}?`,
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            <br />
            1. Naira
            <br />
            2. Dollar
            <br />
            3. Crypto
            <br />
            00. Exit
          </span>
        ),
        timestamp: new Date(),
      },
    ];

    console.log("Next is estimationAmount");

    addChatMessages(newMessages);

    setSharedTicker("TRXUSDT");
    setSharedCrypto("TRX");
    setSharedNetwork("TRC20");
    nextStep("payOptions");
  } else if (chatInput === "5") {
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
    displayHowToEstimation(addChatMessages, "USDT (ERC20)", sharedPaymentMode);

    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    setSharedNetwork("ERC20");
    nextStep("payOptions");
  } else if (chatInput === "2") {
    displayHowToEstimation(addChatMessages, "USDT (TRC20)", sharedPaymentMode);
    setSharedTicker("USDT");
    setSharedCrypto("USDT");
    setSharedNetwork("TRC20");
    nextStep("payOptions");
  } else if (chatInput === "3") {
    // sharedGiftId

    console.log("This is the requestID:", sharedGiftId);
    sharedPaymentMode.toLowerCase() === "request"
      ? displayRequestPaymentSummary(
          addChatMessages,
          "",
          sharedPaymentMode,
          "738920"
        )
      : (displayHowToEstimation(
          addChatMessages,
          "USDT (BEP20)",
          sharedPaymentMode
        ),
        nextStep("payOptions"));
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
