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
  createUser,
  fetchRate,
  generateBTCWalletAddress,
  generateERCWalletAddress,
  generateTronWalletAddress,
  updateUser,
} from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import { generateChatId, getChatId, saveChatId } from "../utils/utilities";
import { useSharedState } from "../context/SharedStateContext";

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
  } = useSharedState();

  // STATE HOOKS
  const [isOpen, setIsOpen] = useState(true);
  // hook to collect user input from the chat input form
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState("");
  const [formattedRate, setFormattedRate] = useState<string>("");
  const [chatId, setChatId] = useState("");

  // REF HOOKS
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const [local, setLocal] = React.useState<{
  //   messages: { type: string; content: React.ReactNode }[];
  //   serializedMessages: { type: string; content: string }[];
  //   step: string;
  // }>(() => {
  //   if (typeof window !== "undefined") {
  //     const fromLocalStorage = window.localStorage.getItem("chat_data");
  //     if (fromLocalStorage) {
  //       const parsedData = JSON.parse(fromLocalStorage);
  //       const deserializedMessages =
  //         parsedData.messages.map(deserializeMessage);
  //       console.log(
  //         "We want to see the current step after refresh",
  //         parsedData.step
  //       );
  //       return {
  //         messages: deserializedMessages,
  //         serializedMessages: parsedData.messages,
  //         step: parsedData.step,
  //       };
  //     }
  //   }
  //   const serializedInitialMessages = initialMessages.map(serializeMessage);
  //   return {
  //     messages: initialMessages,
  //     serializedMessages: serializedInitialMessages,
  //     step: "start",
  //   };
  // });

  // const [chatMessages, setChatMessages] = useState<MessageType[]>(
  //   local.messages
  // );
  // const [serializedMessages, setSerializedMessages] = React.useState(
  //   local.serializedMessages
  // );
  // const [currentStep, setCurrentStep] = useState<string>(local.step);
  // const [stepHistory, setStepHistory] = useState<string[]>(["start"]);

  // React.useEffect(() => {
  //   const chatData = {
  //     messages: serializedMessages,
  //     currentStep,
  //   };
  //   window.localStorage.setItem("chat_data", JSON.stringify(chatData));
  // }, [serializedMessages, currentStep]);

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
    console.log("stepHistory from INSIDE nextStep:", stepHistory);
    console.log("currentStep from INSIDE prevStep:", currentStep);
  };

  const prevStep = () => {
    setStepHistory((prevHistory) => prevHistory.slice(0, -1));
    setCurrentStep(stepHistory[stepHistory.length - 1] || "start");
    console.log("stepHistory from INSIDE prevStep:", stepHistory);
    console.log("currentStep from INSIDE prevStep:", currentStep);
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
      // const fetchedMerchantRate = await fetchMerchantRate();
      // const fetchedProfitRate = await fetchProfitRate();
      setRate(fetchedRate.toString());
      const formattedRate = formatCurrency(
        fetchedRate.toString(),
        "NGN",
        "en-NG"
      );
      // const formattedMerchantRate = formatCurrency(
      //   fetchedMerchantRate.toString(),
      //   "NGN",
      //   "en-NG"
      // );
      // const formattedProfitRate = formatCurrency(
      //   fetchedProfitRate.toString(),
      //   "NGN",
      //   "en-NG"
      // );
      // console.log("formattedRate is :", formattedRate);
      setFormattedRate(formattedRate);
      // setMerchantRate(formattedMerchantRate);
      // setProfitRate(formattedProfitRate);
      setSharedRate(fetchedRate.toString());
    } catch (error) {
      console.error("Failed to fetch rate:", error);
    }
  };

  useEffect(() => {
    fetchData();
  });
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
      console.log("BACKWARD MOVMENT!!");
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
              content: <ConnectButton /> ?? (
                <span>
                  You can disconnect your wallet from the nav bar above
                </span>
              ),
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
      // displayTransactCrypto(addChatMessages, nextStep);
      // export const displayTransactCrypto = (
      //   addChatMessages: (messages: MessageType[]) => void,
      //   nextStep: (step: string) => void
      // ) =>
      {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Here is your menu:
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
        nextStep("transferMoney");
        addChatMessages(newMessages);
      }
    } else if (chatInput === "2") {
      // console.log("The choice is TWO, REQUEST PAY CARD");
      // displayTransferMoney(addChatMessages, nextStep);
    } else if (chatInput === "3") {
      // console.log("The choice is THREE, CUSTOMER SUPPORT");
      // displayTransferMoney(addChatMessages, nextStep);
    } else if (chatInput === "4") {
      // console.log("The choice is FOUR, TRANSACTION ID");
      // displayTransferMoney(addChatMessages, nextStep);
    } else if (chatInput === "5") {
      // console.log("The choice is FIVE, REPORTLY");
      // displayTransferMoney(addChatMessages, nextStep);
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
      console.log("THIS IS TO SEE IF IT GOES BACK");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
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
    } else if (chatInput === "1") {
      console.log("The choice is ONE, TRANSFER MONEY ");
      setSharedPaymentMode("transferMoney");
      // displayTransferMoney(addChatMessages, nextStep);
      console.log("Let's start with selecting an actions");
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: (
            <span>
              Pay with:
              <br />
              <br />
              1. Bitcoin (BTC)
              <br />
              2. Ethereum (ETH)
              <br />
              3. BINANCE (BNB)
              <br />
              4. TRON (TRX)
              <br />
              5. USDT
              <br />
              0. Go back
              <br />
              00. Exit
            </span>
          ),
        },
      ];
      console.log("Next is howToEstimate");
      nextStep("estimateAsset");
      addChatMessages(newMessages);
    } else if (chatInput === "2") {
      console.log("The choice is TWO, SEND GIFT ");
      // displayTransferMoney(addChatMessages, nextStep);
      setSharedPaymentMode("gift");
    } else if (chatInput === "3") {
      console.log("The choice is THREE, REQUEST FOR PAYMENT ");
      // displayTransferMoney(addChatMessages, nextStep);
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
      // displayHowToEstimation(addChatMessages, "Bitcoin (BTC)");
      const parsedInput = "Bitcoin (BTC)";

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

      const addressPattern = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;
      let hasWallet = addressPattern.test(userData.user?.bitcoin_wallet || "");

      const btcWallet = await generateBTCWalletAddress();
      const ercWallet = await generateERCWalletAddress();
      const tronWallet = await generateTronWalletAddress();

      // console.log("BTC wallet:", btcWallet.bitcoin_wallet);
      // console.log("ERC wallet:", ercWallet);
      // console.log("TRON wallet:", tronWallet);
      // console.log("Shared ChatId:", sharedChatId);

      if (userExists) {
        if (hasWallet) {
          console.log("His wallet address is:", userData.user?.bitcoin_wallet);
          // fetch the wallet and set it to the sharedWallet
          setSharedWallet(userData.user?.bitcoin_wallet || "");
        } else {
          const btcWallet = await generateBTCWalletAddress();
          console.log("BTC wallet:", btcWallet.bitcoin_wallet);
          setSharedWallet(btcWallet.bitcoin_wallet);
          // await updateUser("497506", {
          //   bitcoin_wallet: btcWallet.bitcoin_wallet,
          //   bitcoin_privateKey: btcWallet.bitcoin_privateKey,
          // });
        }
      } else {
        // eth_bnb_wallet,
        // eth_bnb_privateKey,
        // tron_wallet,
        // tron_privateKey,
        const btcWallet = await generateBTCWalletAddress();
        console.log("BTC wallet:", btcWallet.bitcoin_wallet);
        setSharedWallet(btcWallet.bitcoin_wallet);
        await createUser({
          agent_id: sharedChatId,
          bitcoin_wallet: btcWallet.bitcoin_wallet,
          bitcoin_privateKey: btcWallet.bitcoin_privateKey,
        });
        console.log(
          "User doesn't exists and does he have wallet address?",
          hasWallet
        );
      }

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
      // (() => {
      //   console.log("Going back from handlePayOptions");
      //   prevStep();
      //   displayCharge(
      //     addChatMessages,
      //     nextStep,
      //     input,
      //     sharedEstimateAsset,
      //     sharedRate,
      //     sharedAssetPrice,
      //     sharedCrypto,
      //     setSharedCharge,
      //     setSharedPaymentAssetEstimate,
      //     setSharedPaymentNairaEstimate,
      //     setSharedNairaCharge,
      //     setSharedChargeForDB
      //   );
      // })();
    } else if (chatInput === "1") {
      // displayHowToEstimation(addChatMessages, "USDT (ERC20)");
      const parsedInput = "USDT (ERC20)";

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

      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("ERC20");
      nextStep("payOptions");
    } else if (chatInput === "2") {
      // displayHowToEstimation(addChatMessages, "USDT (TRC20)");
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

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;

      if (userExists) {
        console.log("User exists", chatId);
      } else {
        console.log("User doesn't exists", chatId);
      }
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("TRC20");
      nextStep("payOptions");
    } else if (chatInput === "3") {
      // displayHowToEstimation(addChatMessages, "USDT (BEP20)");
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

      const userData = await checkUserExists(sharedChatId);
      let userExists = userData.exists;

      if (userExists) {
        console.log("User exists", chatId);
      } else {
        console.log("User doesn't exists", chatId);
      }
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
        handleTransferMoney(chatInput);
        setChatInput("");
        break;

      case "estimateAsset":
        handleEstimateAsset(chatInput);
        setChatInput("");
        break;

      case "network":
        handleNetwork(chatInput);
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
