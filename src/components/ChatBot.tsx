"use client";
import React, { useState, useEffect, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import Image from "next/image";
import Loader from "./Loader";
import parse from "html-react-parser";
import elementToJSXString from "react-element-to-jsx-string";
import { useAccount } from "wagmi";
import ShortenedAddress from "./ShortenAddress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MessageType } from "../types/types";
import {
  checkUserExists,
  createTransaction,
  fetchBankDetails,
  fetchBankNames,
  fetchCoinPrice,
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
  updateUser,
} from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import {
  formatPhoneNumber,
  generateChatId,
  generateTransactionId,
  getChatId,
  saveChatId,
} from "../utils/utilities";
import { useSharedState } from "../context/SharedStateContext";
import {
  displayCharge,
  displayContinueToPay,
  displayEnterAccountNumber,
  displayEnterPhone,
  displayHowToEstimation,
  displayPayIn,
  displaySearchBank,
  displaySelectBank,
  displaySendPayment,
  displayTransactCrypto,
  displayTransactionProcessing,
  displayTransferMoney,
} from "../menus/transact_crypto";
import { getFormattedDateTime } from "../helpers/format_date";
import { asignWallet } from "../helpers/user_functions";

const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far 👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        How may I help you?
        <br />
        Say "Hi" let us start
      </span>
    ),
  },
];

const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const serializeMessage = (message: {
  type: string;
  content: React.ReactNode;
}) => {
  return {
    ...message,
    content: sanitizeSerializedContent(elementToJSXString(message.content)),
  };
};
const deserializeMessage = (message: { type: string; content: string }) => {
  return {
    ...message,
    content: parse(message.content),
  };
};

const ChatBot = () => {
  // CONST VARIABLES
  const account = useAccount();
  const wallet = account.address;
  const greetings = ["hi", "hello", "hey", "howdy"];
  let walletIsConnected = account.isConnected;

  const {
    sharedRate,
    setSharedRate,
    sharedChatId,
    setSharedChatId,
    sharedPaymentMode,
    setSharedPaymentMode,
    sharedCrypto,
    setSharedCrypto,
    sharedTicker,
    setSharedTicker,
    sharedNetwork,
    setSharedNetwork,
    sharedWallet,
    setSharedWallet,
    sharedAssetPrice,
    setSharedAssetPrice,
    sharedEstimateAsset,
    setSharedEstimateAsset,
    sharedAmount,
    setSharedAmount,
    sharedCharge,
    setSharedCharge,
    sharedPaymentAssetEstimate,
    setSharedPaymentAssetEstimate,
    sharedPaymentNairaEstimate,
    setSharedPaymentNairaEstimate,
    sharedNairaCharge,
    setSharedNairaCharge,
    sharedChargeForDB,
    setSharedChargeForDB,
    sharedBankCodes,
    setSharedBankCodes,
    sharedBankNames,
    setSharedBankNames,
    sharedSelectedBankCode,
    setSharedSelectedBankCode,
    sharedSelectedBankName,
    setSharedSelectedBankName,
    bankData,
    updateBankData,
    sharedPhone,
    setSharedPhone,
  } = useSharedState();

  // STATE HOOKS
  const [isOpen, setIsOpen] = useState(true);
  // hook to collect user input from the chat input form
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState("");
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [chatId, setChatId] = useState("");
  const [merchantRate, setMerchantRate] = useState("");
  const [profitRate, setProfitRate] = useState("");
  // REF HOOKS
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = React.useState<{
    messages: { type: string; content: React.ReactNode }[];
    serializedMessages: { type: string; content: string }[];
    step: string;
    stepHistory: string[];
  }>(() => {
    if (typeof window !== "undefined") {
      const fromLocalStorage = window.localStorage.getItem("chat_data");
      if (fromLocalStorage) {
        const parsedData = JSON.parse(fromLocalStorage);
        const deserializedMessages =
          parsedData.messages.map(deserializeMessage);
        const { currentStep, stepHistory = ["start"] } = parsedData;
        return {
          messages: deserializedMessages,
          serializedMessages: parsedData.messages,
          step: currentStep,
          stepHistory: parsedData.stepHistory || ["start"],
        };
      }
    }
    const serializedInitialMessages = initialMessages.map(serializeMessage);
    return {
      messages: initialMessages,
      serializedMessages: serializedInitialMessages,
      step: "start",
      stepHistory: ["start"],
    };
  });

  const [chatMessages, setChatMessages] = useState<MessageType[]>(
    local.messages
  );
  const [serializedMessages, setSerializedMessages] = React.useState(
    local.serializedMessages
  );
  const [currentStep, setCurrentStep] = useState<string>(local.step);
  const [stepHistory, setStepHistory] = useState<string[]>(local.stepHistory);

  React.useEffect(() => {
    const chatData = {
      messages: serializedMessages,
      currentStep,
      stepHistory,
    };
    window.localStorage.setItem("chat_data", JSON.stringify(chatData));
  }, [serializedMessages, currentStep, stepHistory]);

  useEffect(() => {
    console.log("Crypto ticker", sharedTicker);
    if (sharedCrypto != "") {
      if (sharedCrypto.toLowerCase() === "usdt") {
        setSharedAssetPrice(`${rate}`);
        console.log(
          `form fetchCoinPrice The price of ${sharedTicker} in USDT is: ${sharedAssetPrice}`
        );
      } else {
        fetchCoinPrice(`${sharedTicker}`).then((price) => {
          if (price !== null) {
            setSharedAssetPrice(`${price}`);
            console.log(
              `form fetchCoinPrice The price of ${sharedTicker} in USDT is: ${price}`
            );
          } else {
            console.log("form fetchCoinPrice Failed to fetch the price.");
          }
        });
      }
    }
  }, [sharedCrypto]);

  const addChatMessages = (messages: MessageType[]) => {
    const serializedMessages = messages.map(serializeMessage);
    setChatMessages((prevMessages) => [...prevMessages, ...messages]);
    setSerializedMessages((prevMessages) => [
      ...prevMessages,
      ...serializedMessages,
    ]);
    scrollToBottom();
  };

  const nextStep = (nextStep: string) => {
    setStepHistory((prevHistory) => {
      // Avoid adding "start" twice
      const newHistory = [...prevHistory, currentStep];
      // Ensure "start" is not duplicated if it's already the last step
      if (
        newHistory[newHistory.length - 2] === "start" &&
        currentStep === "start"
      ) {
        return prevHistory;
      }
      return newHistory;
    });
    setCurrentStep(nextStep);
    // console.log("stepHistory from INSIDE nextStep:", stepHistory);
    // console.log("currentStep from INSIDE prevStep:", currentStep);
  };

  const prevStep = () => {
    setStepHistory((prevHistory) => prevHistory.slice(0, -1));
    setCurrentStep(stepHistory[stepHistory.length - 1] || "start");
    // console.log("stepHistory from INSIDE prevStep:", stepHistory);
    // console.log("currentStep from INSIDE prevStep:", currentStep);
  };

  const goToStep = (step: string) => {
    setStepHistory((prevHistory) => [...prevHistory, currentStep]);
    setCurrentStep(step);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    () => setIsOpen(isOpen);
  });

  const initializeChatId = () => {
    const existingChatId = getChatId();
    setSharedChatId(`${existingChatId}`);
    // console.log("Existing chat ID:", existingChatId);

    if (!existingChatId) {
      const newChatId = generateChatId();
      // console.log("Generated new chat ID:", newChatId);

      saveChatId(newChatId);
      setChatId(newChatId.toString());
      // setSession(newChatId.toString(), {});
    } else {
      if (existingChatId !== chatId) {
        setChatId(existingChatId);
        // getSession(existingChatId);
      }
    }
  };
  useEffect(() => {
    // initialize chatId
    initializeChatId();
  }, [chatId]);

  const fetchData = async () => {
    try {
      const fetchedRate = await fetchRate();
      const fetchedMerchantRate = await fetchMerchantRate();
      const fetchedProfitRate = await fetchProfitRate();
      setRate(fetchedRate.toString());
      const formattedRate = formatCurrency(
        fetchedRate.toString(),
        "NGN",
        "en-NG"
      );
      const formattedMerchantRate = formatCurrency(
        fetchedMerchantRate.toString(),
        "NGN",
        "en-NG"
      );
      const formattedProfitRate = formatCurrency(
        fetchedProfitRate.toString(),
        "NGN",
        "en-NG"
      );
      // console.log("formattedRate is :", formattedRate);
      setFormattedRate(formattedRate);
      setMerchantRate(formattedMerchantRate);
      setProfitRate(formattedProfitRate);
      setSharedRate(fetchedRate.toString());
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });

  // // SET STATE TO THE START ON WALLET CONNECT
  // useEffect(() => {
  //   if (chatInput.trim()) {
  //     const newMessage: MessageType = {
  //       type: "outgoing",
  //       content: <span>{chatInput}</span>,
  //     };
  //     addChatMessages([newMessage]);
  //     setChatInput("");
  //   }
  //   helloMenu("hi");
  // }, [walletIsConnected]);
  // OPERATINAL FUNCTIONS
  // ON HI | HELLO | HOWDY | HEY PROMPT
  const helloMenu = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      if (walletIsConnected) {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                How far 👋
                <br />
                <br />
                You are connected as{" "}
                <b>
                  <ShortenedAddress wallet={wallet} />
                </b>
                <br />
                <br />
                1. To disconnect wallet <br />
                2. Continue to transact
              </span>
            ),
          },
        ]);
        nextStep("chooseAction");
        console.log("Wallet connected");
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                How far 👋
                <br />
                <br />
                Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual
                assistance, <br />
                <b>Your wallet is not connected,</b> reply with:
                <br />
                <br />
                1. To connect wallet <br />
                2. To just continue
              </span>
            ),
          },
        ]);
        console.log("Wallet not connected");
      }
      nextStep("chooseAction");
    }
  };

  // WELCOME USER DEPENDING ON IF THEY CONNECT WALLET OR NOT
  const welcomeMenu = () => {
    if (walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              How far 👋
              <br />
              <br />
              You are connected as
              <b>
                <ShortenedAddress wallet={wallet} />
              </b>
              <br />
              <br />
              Your wallet is connected. The current rate is
              <b> {formattedRate}/$1</b>
            </span>
          ),
        },
        {
          type: "incoming",
          content: (
            <span>
              1. Transact Crypto
              <br />
              2. Request for paycard
              <br />
              3. Customer support
              <br />
              4. Transaction ID
              <br />
              5. Reportly,
            </span>
          ),
        },
      ] as unknown as MessageType[]);
      // console.log("Wallet connected");
    } else {
      {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                You continued <b>without connecting your wallet</b>
                <br />
                <br />
                Today Rate: <b>{formattedRate}/$1</b> <br />
                <br />
                Welcome to 2SettleHQ, how can I help you today?
              </span>
            ),
          },
          {
            type: "incoming",
            content: (
              <span>
                1. Transact Crypto
                <br />
                2. Request for paycard
                <br />
                3. Customer support
                <br />
                4. Transaction ID
                <br />
                5. Reportly
                <br />
                0. Back
              </span>
            ),
          },
        ]);
      }
    }
  };

  // TRANSACT CRYPTO SEQUENCE FUNCTIONS
  const choiceMenu = (chatInput: string) => {
    /* conversations handled here
        1. Transact
        2. Request Paycard
        3. Customer support
        4. Transaction Id
        5. Reportly
    */
    const choice = chatInput.trim();
    if (greetings.includes(choice.toLowerCase())) {
      helloMenu(choice);
      goToStep("start");
    } else if (choice === "0") {
      prevStep();
      helloMenu("hi");
    } else if (choice.toLowerCase() === "1") {
      // connect wallet to the bot
      if (!walletIsConnected) {
        {
          addChatMessages([
            {
              type: "incoming",
              content: <ConnectButton />,
            },
            {
              type: "incoming",
              content: (
                <span>
                  Type to go back:
                  <br />
                  0. Go Back
                  <br />
                </span>
              ),
            },
          ]);
          nextStep("transactCrypto");
        }
      } else {
        {
          addChatMessages([
            {
              type: "incoming",
              content: <ConnectButton />,
            },
            {
              type: "incoming",
              content: (
                <span>
                  Type to go back:
                  <br />
                  0. Go Back
                  <br />
                </span>
              ),
            },
          ]);
          nextStep("transactCrypto");
        }
      }
    } else if (choice.toLowerCase() === "2") {
      // user continue without connecting wallet
      if (!walletIsConnected) {
        {
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>
                  You continued <b>without connecting your wallet</b>
                  <br />
                  <br />
                  Today Rate: <b>{formattedRate}/$1</b> <br />
                  <br />
                  Welcome to 2SettleHQ, how can I help you today?
                </span>
              ),
            },
            {
              type: "incoming",
              content: (
                <span>
                  1. Transact Crypto
                  <br />
                  2. Request for paycard
                  <br />
                  3. Customer support
                  <br />
                  4. Transaction ID
                  <br />
                  5. Reportly
                  <br />
                  0. Back
                </span>
              ),
            },
          ]);
          nextStep("transactCrypto");
        }
      } else {
        {
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>
                  You continued as{" "}
                  <b>
                    <ShortenedAddress wallet={wallet} />
                  </b>
                  <br />
                  <br />
                  Today Rate: <b>{formattedRate}/$1</b> <br />
                  <br />
                  Welcome to 2SettleHQ, how can I help you today?
                </span>
              ),
            },
            {
              type: "incoming",
              content: (
                <span>
                  1. Transact Crypto
                  <br />
                  2. Request for paycard
                  <br />
                  3. Customer support
                  <br />
                  4. Transaction ID
                  <br />
                  5. Reportly
                  <br />
                  0. Back
                </span>
              ),
            },
          ]);
          nextStep("transactCrypto");
        }
      }
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              You need to make a valid choice
              <br />
              <br />
              Please Try again, or say 'Hi' or 'Hello' to start over
            </span>
          ),
        },
      ]);
    }
    setChatInput("");
  };

  // HANDLE THE CHOICE FROM ABOVE
  const handleMakeAChoice = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("THIS ACTUALLY GOES BACK");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
      helloMenu("hi");
    } else if (chatInput === "1") {
      // console.log("The choice is ONE, TRANSACT CRYPTO");
      displayTransactCrypto(addChatMessages);
      nextStep("transferMoney");
    } else if (chatInput === "2") {
      // console.log("The choice is TWO, REQUEST PAY CARD");
      displayTransactCrypto(addChatMessages);

      // nextStep("transferMoney");
    } else if (chatInput === "3") {
      // console.log("The choice is THREE, CUSTOMER SUPPORT");
      // displayTransferMoney(addChatMessages, nextStep);
      // nextStep("transferMoney");
    } else if (chatInput === "4") {
      // console.log("The choice is FOUR, TRANSACTION ID");
      // displayTransferMoney(addChatMessages, nextStep);
      // nextStep("transferMoney");
    } else if (chatInput === "5") {
      // console.log("The choice is FIVE, REPORTLY");
      // displayTransferMoney(addChatMessages, nextStep);
      // nextStep("transferMoney");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. You need to choose an action from the options",
        },
      ]);
    }
  };

  // HANDLE TRANSFER MONEY MENU
  const handleTransferMoney = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
      welcomeMenu();
    } else if (chatInput === "1") {
      setSharedPaymentMode("transferMoney");
      displayTransferMoney(addChatMessages);
      console.log("Next is howToEstimate");
      nextStep("estimateAsset");
      // addChatMessages(newMessages);
    } else if (chatInput === "2") {
      console.log("The choice is TWO, SEND GIFT ");
      displayTransferMoney(addChatMessages);
      setSharedPaymentMode("gift");
    } else if (chatInput === "3") {
      displayTransferMoney(addChatMessages);
      setSharedPaymentMode("request");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        },
      ]);
    }
  };

  // HANDLE ESTIMATE PAYMENT IN ASSET MENU
  const handleEstimateAsset = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      (() => {
        prevStep();
        // displayTransactCrypto(addChatMessages, nextStep);
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
          },
        ];
        console.log("Next is howToEstimate");
        // nextStep("estimateAsset");
        addChatMessages(newMessages);
      })();
    } else if (chatInput === "00") {
      console.log("Going back from handleHowToEstimate");
      goToStep("chooseAction");
      helloMenu("hi");
    } else if (chatInput === "1") {
      // console.log("How to display estimation, NOW PAY OPTIONS");
      displayHowToEstimation(
        addChatMessages,
        "Bitcoin (BTC)",
        sharedChatId,
        sharedNetwork,
        setSharedWallet
      );
      setSharedTicker("BTCUSDT");
      setSharedCrypto("BTC");
      setSharedNetwork("BTC");
      nextStep("payOptions");
    } else if (chatInput === "2") {
      // displayHowToEstimation(addChatMessages, "Ethereum (ETH)");
      const parsedInput = "Ethereum (ETH)";

      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: `How would you like to estimate your ${parsedInput}?`,
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
        },
      ];

      console.log("Next is estimationAmount");

      addChatMessages(newMessages);

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;

      if (userExists) {
        console.log("User exists", chatId);
      } else {
        console.log("User doesn't exists", chatId);
      }
      setSharedTicker("ETHUSDT");
      setSharedCrypto("ETH");
      setSharedNetwork("ERC20");
      nextStep("payOptions");
    } else if (chatInput === "3") {
      // displayHowToEstimation(addChatMessages, "BINANCE (BNB)");
      const parsedInput = "BINANCE (BNB)";

      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: `How would you like to estimate your ${parsedInput}?`,
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
        },
      ];

      console.log("Next is estimationAmount");

      addChatMessages(newMessages);

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;

      if (userExists) {
        console.log("User exists", chatId);
      } else {
        console.log("User doesn't exists", chatId);
      }
      setSharedTicker("BNBUSDT");
      setSharedCrypto("BNB");
      setSharedNetwork("BEP20");
      nextStep("payOptions");
    } else if (chatInput === "4") {
      // displayHowToEstimation(addChatMessages, "TRON (TRX)");
      const parsedInput = "TRON (TRX)";

      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: `How would you like to estimate your ${parsedInput}?`,
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
        },
      ];

      console.log("Next is estimationAmount");

      addChatMessages(newMessages);

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;

      if (userExists) {
        console.log("User exists", chatId);
      } else {
        console.log("User doesn't exists", chatId);
      }
      setSharedTicker("TRXUSDT");
      setSharedCrypto("TRX");
      setSharedNetwork("TRC20");
      nextStep("payOptions");
    } else if (chatInput === "5") {
      // displayNetwork(addChatMessages, nextStep, "USDT");
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
        },
      ];

      console.log("Next is payOptions");
      addChatMessages(newMessages);
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      nextStep("network");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Choose a valid estimate asset",
        },
      ]);
    }
  };

  // HANDLE NETWORK FOR DOLLAR TRANSFER
  const handleNetwork = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        console.log("Going back from handlePayOptions");
        prevStep();
        displayTransferMoney(addChatMessages);
      })();
    } else if (chatInput === "1") {
      displayHowToEstimation(
        addChatMessages,
        "USDT (ERC20)",
        sharedChatId,
        sharedNetwork,
        setSharedWallet
      );

      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }

      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("ERC20");
      nextStep("payOptions");
    } else if (chatInput === "2") {
      displayHowToEstimation(
        addChatMessages,
        "USDT (TRC20)",
        sharedChatId,
        sharedNetwork,
        setSharedWallet
      );
      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("TRC20");
      nextStep("payOptions");
    } else if (chatInput === "3") {
      displayHowToEstimation(
        addChatMessages,
        "USDT (BEP20)",
        sharedChatId,
        sharedNetwork,
        setSharedWallet
      );
      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("BEP20");
      nextStep("payOptions");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. Choose your prefered network or say Hi if you are stock.",
        },
      ]);
    }
  };

  // HANDLE THE ASSETS FOR ESTIMATION
  const handlePayOptions = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        // console.log("Going back from handlePayOptions");
        prevStep();
        // displayCharge(
        //   addChatMessages,
        //   nextStep,
        //   chatInput,
        //   sharedEstimateAsset,
        //   sharedRate,
        //   sharedAssetPrice,
        //   sharedCrypto,
        //   setSharedCharge,
        //   setSharedPaymentAssetEstimate,
        //   setSharedPaymentNairaEstimate,
        //   setSharedNairaCharge,
        //   setSharedChargeForDB
        // );
        displayHowToEstimation(
          addChatMessages,
          `${sharedCrypto} (${sharedNetwork})`,
          sharedChatId,
          sharedNetwork,
          setSharedWallet
        );
      })();
    } else if (chatInput === "1") {
      displayPayIn(
        addChatMessages,
        "Naira",
        sharedRate,
        sharedTicker,
        sharedAssetPrice,
        sharedCrypto
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
        sharedCrypto
      );
      setSharedEstimateAsset("Dollar");
      nextStep("charge");
    } else if (chatInput === "3") {
      displayPayIn(
        addChatMessages,
        sharedCrypto,
        sharedRate,
        sharedTicker,
        sharedAssetPrice,
        sharedCrypto
      );
      setSharedEstimateAsset(sharedCrypto);
      nextStep("charge");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Choose your prefered estimate asset.",
        },
      ]);
    }
  };

  // HANDLE ESTIMATE IN SELECTED ASSET
  const handleCharge = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        // console.log("Going back from handlePayOptions");
        prevStep();
        displayHowToEstimation(
          addChatMessages,
          `${sharedCrypto} (${sharedNetwork})`,
          sharedChatId,
          sharedNetwork,
          setSharedWallet
        );
      })();
    } else if (chatInput != "0") {
      setSharedAmount(chatInput.trim());
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
        setSharedChargeForDB
      );
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. Do you want to include charge in your estimate or not?.",
        },
      ]);
    }
  };

  // GET USER BANK DETAILS FROM NUBAN
  const handleSearchBank = (chatInput: string) => {
    const chargeFixed = parseFloat(sharedCharge);
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        prevStep();
        displayPayIn(
          addChatMessages,
          sharedEstimateAsset,
          sharedRate,
          sharedCrypto,
          sharedAssetPrice,
          sharedCrypto
        );
      })();
    } else if (chatInput === "1") {
      const finalAssetPayment = parseFloat(sharedPaymentAssetEstimate);
      const finalNairaPayment =
        parseFloat(sharedPaymentNairaEstimate) - parseFloat(sharedNairaCharge);

      setSharedPaymentAssetEstimate(finalAssetPayment.toString());
      setSharedPaymentNairaEstimate(finalNairaPayment.toString());
      setSharedChargeForDB(
        `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
      ),
        displaySearchBank(
          addChatMessages,
          nextStep,
          chatInput,
          sharedEstimateAsset,
          sharedRate,
          sharedAssetPrice,
          sharedCrypto
        );
    } else if (chatInput === "2") {
      const finalAssetPayment =
        parseFloat(sharedPaymentAssetEstimate) + parseFloat(sharedCharge);
      const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

      setSharedPaymentAssetEstimate(finalAssetPayment.toString());
      setSharedPaymentNairaEstimate(finalNairaPayment.toString());
      setSharedChargeForDB(
        `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
      );
      displaySearchBank(
        addChatMessages,
        nextStep,
        chatInput,
        sharedEstimateAsset,
        sharedRate,
        sharedAssetPrice,
        sharedCrypto
      );
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. Please choose with the options or say 'Hi' to start over.",
        },
      ]);
    }
  };

  // HELP USER SELECT BANK FROM LIST
  const handleSelectBank = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        prevStep();
        displayCharge(
          addChatMessages,
          nextStep,
          sharedAmount,
          sharedEstimateAsset,
          sharedRate,
          sharedAssetPrice,
          sharedCrypto,
          setSharedCharge,
          setSharedPaymentAssetEstimate,
          setSharedPaymentNairaEstimate,
          setSharedNairaCharge,
          setSharedChargeForDB
        );
      })();
    } else if (chatInput != "0") {
      console.log(chatInput.trim());
      let bankList: [] = [];
      setLoading(true);

      try {
        const bankNames = await fetchBankNames(chatInput.trim());
        bankList = bankNames["message"];

        if (Array.isArray(bankList)) {
          const bankNameList = bankList.map((bank: string) =>
            bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, "")
          );

          setSharedBankNames(bankNameList);
          // Loop through the bank list
          // bankList.forEach((bank) => {
          //   console.log(bank);
          // });
        } else {
          bankList = [];
          console.error(
            "The fetched bank names are not in the expected format."
          );
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch bank names:", error);
      }

      displaySelectBank(
        addChatMessages,
        nextStep,
        bankList,
        setSharedBankCodes
      );
    }
    console.log("I want to search for bankNames of", chatInput.trim());
  };

  //GET USER BANK DATA AFTER COLLECTING ACCOUNT NUMBER
  const handleBankAccountNumber = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        console.log("THIS IS WHERE WE ARE");
        prevStep();
        displaySelectBank(
          addChatMessages,
          nextStep,
          sharedBankNames,
          setSharedBankCodes
        );
      })();
    } else if (chatInput != "0") {
      console.log(chatInput.trim());

      displayEnterAccountNumber(
        addChatMessages,
        nextStep,
        chatInput,
        sharedBankCodes,
        setSharedSelectedBankCode,
        sharedBankNames,
        setSharedSelectedBankName
      );
    }
  };

  // VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME
  const handleContinueToPay = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        console.log("THIS IS WHERE WE ARE");
        prevStep();
        displaySearchBank(
          addChatMessages,
          nextStep,
          chatInput,
          sharedEstimateAsset,
          sharedRate,
          sharedAssetPrice,
          sharedCrypto
        );
      })();
    } else if (chatInput !== "0") {
      console.log(chatInput.trim());

      let bank_name = "";
      let account_name = "";
      let account_number = "";

      setLoading(true);

      try {
        const bankData = await fetchBankDetails(
          sharedSelectedBankCode,
          chatInput.trim()
        );
        console.log(
          "Bank data: account number is  ",
          bankData[0].account_number
        );

        bank_name = bankData[0].bank_name;
        account_name = bankData[0].account_name;
        account_number = bankData[0].account_number;

        if (!account_number) {
          const newMessages: MessageType[] = [
            {
              type: "incoming",
              content: <span>Invalid account number. Please try again.</span>,
            },
          ];
          addChatMessages(newMessages);
          setLoading(false);
          return; // Exit the function to let the user try again
        }

        setLoading(false);
        updateBankData({
          acct_number: account_number,
          bank_name: sharedSelectedBankName,
          receiver_name: account_name,
        });
        displayContinueToPay(
          addChatMessages,
          nextStep,
          account_name,
          sharedSelectedBankName,
          account_number
        );
      } catch (error) {
        console.error("Failed to fetch bank data:", error);
        const errorMessage: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Failed to fetch bank data. Please check your accouunt number and
                try again.
              </span>
            ),
          },
        ];
        addChatMessages(errorMessage);
        setLoading(false);
      }
    }
  };

  // MISSING HANDLE FUNCTION< HANDLE PHONE NUMBER
  const handlePhoneNumber = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        console.log("THIS IS WHERE WE ARE");
        prevStep();
        displaySearchBank(
          addChatMessages,
          nextStep,
          chatInput,
          sharedEstimateAsset,
          sharedRate,
          sharedAssetPrice,
          sharedCrypto
        );
      })();
    } else if (chatInput !== "0") {
      displayEnterPhone(addChatMessages, nextStep);
      // const user = {
      //   agent_id: chatId,
      //   vendor_phoneNumber: formatPhoneNumber(phoneNumber),
      //   bitcoin_wallet: sharedWallet,
      //   bitcoin_privateKey: "sharedPKey",
      //   eth_bnb_wallet: sharedWallet,
      //   eth_bnb_privateKey: "sharedPKey",
      //   tron_wallet: sharedWallet,
      //   tron_privateKey: "sharedPKey",
      // };

      // await createUser(user);
      // const isUserAvailable = await checkUserExists(chatId);
      // console.log("Status of the user", user.exists);

      // updateUser("497506", {
      //   agent_id: "497506",
      //   vendor_phoneNumber: "+2348063862295",
      //   bitcoin_wallet: null,
      //   bitcoin_privateKey: null,
      //   eth_bnb_wallet: null,
      //   eth_bnb_privateKey: null,
      //   tron_wallet: "12p4KeZrxhsXVynsJfCrN7iyPkYV8hf4y4",
      //   tron_privateKey: "L1tgdRy6dRJCexGQSPZdhKutNVz31ZQ5nLKYuDEAxR5mnRBjD4ui",
      // });

      // const getERC = await getERCWalletAddress();
      // console.log("Get ERC :", getERC);
      // const getTRX = await getTronWalletAddress();
      // console.log("Get TRX:", getTRX);

      // if (sharedNetwork.toLowerCase() === "btc") {
      //   // network is BTC
      //   if (isUserAvailable.exists) {
      //     // user already exists
      //     if (isUserAvailable.user?.bitcoin_wallet === null) {
      //       // user exists but no BTC wallet
      //       const getBTC = await getBTCWalletAddress();
      //       setSharedWallet(getBTC.bitcoin_wallet);
      //       await updateUser(chatId, {
      //         bitcoin_wallet: getBTC.bitcoin_wallet,
      //         bitcoin_privateKey: getBTC.bitcoin_privateKey,
      //       });
      //       console.log("Get BTC:", getBTC);
      //     } else {
      //       const btcWallet = await fetchBitcoinWallet(chatId);
      //       setSharedWallet(btcWallet);
      //     }
      //   } else {
      //     const getBTC = await getBTCWalletAddress();
      //     await createUser({
      //       agent_id: chatId,
      //       bitcoin_wallet: getBTC.bitcoin_wallet,
      //       bitcoin_privateKey: getBTC.bitcoin_privateKey,
      //     });
      //   }
      // } else if (
      //   sharedNetwork.toLowerCase() === "erc20" ||
      //   sharedNetwork.toLowerCase() === "bep20"
      // ) {
      //   // network is ERC
      //   if (isUserAvailable.exists) {
      //     // user already exists
      //     if (isUserAvailable.user?.eth_bnb_wallet === null) {
      //       // user exists but no BTC wallet
      //       const getERC = await getERCWalletAddress();
      //       setSharedWallet(getERC.eth_bnb_wallet);
      //       await updateUser(chatId, {
      //         bitcoin_wallet: getERC.eth_bnb_wallet,
      //         bitcoin_privateKey: getERC.eth_bnb_privateKey,
      //       });
      //       console.log("Get ERC:", getERC);
      //     } else {
      //       const ercWallet = await fetchERCPrivateKey(chatId);
      //       setSharedWallet(ercWallet);
      //     }
      //   } else {
      //     const getERC = await getERCWalletAddress();
      //     await createUser({
      //       agent_id: chatId,
      //       eth_bnb_wallet: getERC.eth_bnb_wallet,
      //       eth_bnb_privateKey: getERC.eth_bnb_privateKey,
      //     });
      //   }
      // } else if (sharedNetwork.toLowerCase() === "trc20") {
      //   // network is TRC
      //   if (isUserAvailable.exists) {
      //     // user already exists
      //     if (isUserAvailable.user?.tron_wallet === null) {
      //       // user exists but no BTC wallet
      //       const getTRC = await getTronWalletAddress();
      //       setSharedWallet(getTRC.tron_wallet);
      //       await updateUser(chatId, {
      //         tron_wallet: getTRC.tron_wallet,
      //         tron_privateKey: getTRC.tron_privateKey,
      //       });
      //       console.log("Get TRC:", getTRC);
      //     } else {
      //       const trcWallet = await fetchTronPrivateKey(chatId);
      //       setSharedWallet(trcWallet);
      //     }
      //   } else {
      //     const getTRC = await getTronWalletAddress();
      //     await createUser({
      //       agent_id: chatId,
      //       tron_wallet: getTRC.tron_wallet,
      //       tron_privateKey: getTRC.tron_privateKey,
      //     });
      //   }
      // }
    }
  };

  // CREATE USER, UPDATE TRANSACTION
  const handleCryptoPayment = async (chatInput: string) => {
    const phoneNumber = chatInput.trim();
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput != "0") {
      const phoneNumberPattern = /^[0-9]{11}$/;

      if (!phoneNumberPattern.test(phoneNumber)) {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Please enter a valid phone number, <b>{phoneNumber}</b> is not a
                valid phone number.
              </span>
            ),
          },
        ];
        setLoading(false);
        addChatMessages(newMessages);
        return;
      }

      setSharedPhone(phoneNumber);

      const transactionID = generateTransactionId();
      const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
        .toFixed(8)
        .toString()} ${sharedCrypto} `;
      const date = getFormattedDateTime();

      displaySendPayment(
        addChatMessages,
        nextStep,
        sharedWallet,
        sharedCrypto,
        sharedPaymentAssetEstimate,
        sharedPaymentNairaEstimate,
        transactionID
      );
      // const user = {
      //   agent_id: chatId,
      //   vendor_phoneNumber: formatPhoneNumber(phoneNumber),
      //   bitcoin_wallet: sharedWallet,
      //   bitcoin_privateKey: sharedWallet,
      //   eth_bnb_wallet: sharedWallet,
      //   eth_bnb_privateKey: "sharedPKey",
      //   tron_wallet: sharedWallet,
      //   tron_privateKey: "sharedPKey",
      // };
      // await createUser(user);

      const isUserAvailable = await checkUserExists(chatId);
      if (isUserAvailable.user?.vendor_phoneNumber === null) {
        updateUser(chatId, {
          vendor_phoneNumber: formatPhoneNumber(phoneNumber),
        });
      }

      // let's save the transaction details to db
      const userDate = {
        crypto: sharedCrypto,
        network: sharedNetwork,
        estimation: sharedEstimateAsset,
        Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
        charges: sharedChargeForDB,
        mode_of_payment: sharedPaymentMode,
        acct_number: bankData.acct_number,
        bank_name: bankData.bank_name,
        receiver_name: bankData.receiver_name,
        receiver_amount: formatCurrency(
          sharedPaymentNairaEstimate,
          "NGN",
          "en-NG"
        ),
        crypto_sent: paymentAsset,
        wallet_address: sharedWallet,
        Date: date,
        status: "Processing",
        customer_phoneNumber: formatPhoneNumber(phoneNumber),
        transac_id: transactionID.toString(),
        settle_walletLink: "",
        chat_id: chatId,
        current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
        merchant_rate: merchantRate,
        profit_rate: profitRate,
        name: "",
      };
      // await createTransaction(userDate);
      setLoading(false);

      console.log("User data created", userDate);
    } else {
      setLoading(false);
      console.log("User input not recognized");
    }
  };

  // VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME
  const handleTransactionProcessing = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displaySearchBank(
          addChatMessages,
          nextStep,
          chatInput,
          sharedEstimateAsset,
          sharedRate,
          sharedAssetPrice,
          sharedCrypto
        );
      })();
    } else if (chatInput.trim() === "1") {
      console.log("Do another transaction", chatInput.trim());
      helloMenu("hi");
    } else if (chatInput.trim() === "2") {
      console.log("Contact support", chatInput.trim());
    }
  };

  // REQUEST PAYCARD SEQUENCE FUNCTIONS

  // CUSTOMER SUPPORT SEQUENCE FUNCTIONS

  // CUSTOMER TRANSACTION ID SEQUENCE FUNCTIONS

  // CUSTOMER REPORTLY SEQUENCE FUNCTIONS

  // THE ROOT FUNCTION

  const handleConversation = async (chatInput: any) => {
    if (chatInput.trim()) {
      const newMessage: MessageType = {
        type: "outgoing",
        content: <span>{chatInput}</span>,
      };
      addChatMessages([newMessage]);
      setChatInput("");
    }

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
    }

    switch (currentStep) {
      case "start":
        console.log("current step is start");
        helloMenu(chatInput);

        setChatInput("");
        break;

      case "chooseAction":
        console.log("current step is chooseAction");
        choiceMenu(chatInput);
        setChatInput("");
        break;

      case "transactCrypto":
        console.log("current step is transactCrypto");
        handleMakeAChoice(chatInput);
        setChatInput("");
        break;

      case "transferMoney":
        console.log("Current step is transferMoney ");
        handleTransferMoney(chatInput);
        setChatInput("");
        break;

      case "estimateAsset":
        console.log("Current step is estimateAsset ");
        handleEstimateAsset(chatInput);
        setChatInput("");
        break;

      case "network":
        console.log("Current step is network ");
        handleNetwork(chatInput);
        setChatInput("");
        break;

      case "payOptions":
        console.log("Current step is payOptions ");
        console.log("Let's see the sharedNetwork", sharedNetwork);
        handlePayOptions(chatInput);
        await asignWallet(sharedChatId, sharedNetwork, setSharedWallet);
        setChatInput("");
        break;

      case "charge":
        console.log("Current step is charge ");
        console.log("Let's see the sharedNetwork too", sharedNetwork);
        handleCharge(chatInput);
        setChatInput("");
        break;

      case "enterBankSearchWord":
        console.log("Current step is enterBankSearchWord ");
        handleSearchBank(chatInput);
        setChatInput("");
        break;

      case "selectBank":
        console.log("Current step is selectBank ");
        handleSelectBank(chatInput);
        setChatInput("");
        break;

      case "enterAccountNumber":
        console.log("Current step is enterAccountNumber ");
        handleBankAccountNumber(chatInput);
        setChatInput("");
        break;

      case "continueToPay":
        console.log("Current step is continueToPay ");
        handleContinueToPay(chatInput);
        setChatInput("");
        break;

      case "enterPhone":
        console.log("Current step is enterPhone ");
        handlePhoneNumber(chatInput);
        setChatInput("");
        break;

      case "sendPayment":
        console.log("Current step is sendPayment ");
        await handleCryptoPayment(chatInput);

        setChatInput("");
        break;

      case "paymentProcessing":
        console.log("Current step is paymentProcessing ");
        handleTransactionProcessing(chatInput);
        setChatInput("");
        break;

      default:
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
          },
        ]);
        setChatInput("");
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConversation(chatInput);
    }
  };

  // CHATBOT
  return (
    <div className="fixed right-8 bottom-24 w-80 md:w-96 bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform scale-100 opacity-100 pointer-events-auto">
      <header className="py-4 text-center text-white bg-blue-500 shadow">
        <div className="flex items-center justify-between">
          <span className="flex-shrink-0 w-8 h-8 ml-8 bg-white rounded justify-start">
            <Image
              src={"/waaa.png"}
              alt={"Avatar"}
              width={500}
              height={100}
              className="w-full h-full rounded"
            />
          </span>
          <h2 className="text-lg font-bold justify-start pr-36">2SettleHQ</h2>
        </div>
      </header>
      {isOpen && (
        <ul className="max-h-80 p-4 md:p-8 space-y-4 overflow-y-auto">
          {chatMessages.map((msg, index) => (
            <li
              key={index}
              className={`flex ${
                msg.type === "incoming" ? "items-start" : "justify-end"
              }`}
            >
              {msg.type === "incoming" && (
                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-white rounded self-end">
                  <Image
                    src={"/waaa.png"}
                    alt={"Avatar"}
                    width={500}
                    height={100}
                    className="w-full h-full rounded"
                  />
                </span>
              )}
              <div
                className={`p-2 md:p-3 rounded-lg ${
                  msg.type === "incoming"
                    ? "bg-gray-200 text-black rounded-bl-none"
                    : "bg-blue-500 text-white rounded-br-none"
                }`}
              >
                <p className="text-xs md:text-sm">{msg.content}</p>
              </div>

              <div ref={messagesEndRef} />
            </li>
          ))}
          {loading ? (
            <div className="flex items-center">
              <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 mt-2 bg-white rounded">
                <Image
                  src="/waaa.png"
                  alt="Avatar"
                  width={200}
                  height={100}
                  className="w-full h-full rounded"
                />
              </span>
              <div className="bg-gray-200 relative left-1 top-1 rounded-bl-none pr-2 pt-2 pl-2 pb-1 md:pr-4 md:pt-4 md:pl-3 md:pb-2 rounded-lg mr-12 md:mr-48">
                <div className="flex justify-start">
                  <Loader />
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </ul>
      )}

      {isOpen && (
        <div className="flex items-center p-3 border-t border-gray-200 bg-white">
          <textarea
            ref={textareaRef}
            className="flex-1 pl-2 border-none outline-none resize-none h-5"
            placeholder="Enter a message..."
            spellCheck="false"
            required
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <span
            className="ml-4 text-blue-500 cursor-pointer material-symbols-rounded"
            onClick={() => handleConversation(chatInput)}
          >
            <SendIcon />
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
