import { MessageType } from "@/types/general_types";
import { greetings } from "./ChatbotConsts";
import {
  displayHowToEstimation,
  displayPayIn,
  displayTransactCrypto,
  displayTransferMoney,
} from "@/menus/transact_crypto";
import { displayKYCInfo } from "@/menus/request_paycard";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import { displayReportlyWelcome } from "@/menus/reportly";
import { displayTransactIDWelcome } from "@/menus/transaction_id";
import { helloMenu, welcomeMenu } from "./genConversationHandlers";

// HANDLE THE CHOICE FROM ABOVE
export const handleMakeAChoice = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
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
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (chatInput === "00") {
    goToStep("start");
    helloMenu(
      addChatMessages,
      "hi",
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (chatInput === "0") {
    prevStep();
    helloMenu(
      addChatMessages,
      "hi",
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
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
export const handleTransferMoney = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  telFirstName: string,
  sharedPaymentMode: string,
  sharedRate: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void,
  setSharedWallet: (ticker: string) => void,
  setSharedEstimateAsset: (crypto: string) => void,
) => {
  setSharedWallet("");
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
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
    displayTransferMoney(addChatMessages);
    nextStep("estimateAsset");
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
  wallet: `0x${string}` | undefined,
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
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
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
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (chatInput === "1") {
    displayHowToEstimation(addChatMessages, "Bitcoin (BTC)", sharedPaymentMode);
    setSharedTicker("BTCUSDT");
    setSharedCrypto("BTC");
    setSharedNetwork("BTC");
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

// // ... Continue extracting all other functions
