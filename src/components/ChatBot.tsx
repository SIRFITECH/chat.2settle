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
  checkGiftExists,
  checkTranscationExists,
  checkUserExists,
  claimGiftMoney,
  createComplain,
  createTransaction,
  createUser,
  fetchBankDetails,
  fetchBankNames,
  fetchCoinPrice,
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
  generateBTCWalletAddress,
  generateERCWalletAddress,
  generateTronWalletAddress,
  getGiftNaira,
  isGiftValid,
  updateGiftTransaction,
  updateTransaction,
  updateUser,
} from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import {
  formatPhoneNumber,
  generateChatId,
  generateComplainId,
  generateGiftId,
  generateTransactionId,
  getChatId,
  saveChatId,
} from "../utils/utilities";
import { useSharedState } from "../context/SharedStateContext";
import {
  displayCharge,
  displayConfirmPayment,
  displayContinueToPay,
  displayEnterAccountNumber,
  displayEnterPhone,
  displayHowToEstimation,
  displayPayAVendor,
  displayPayIn,
  displaySearchBank,
  displaySelectBank,
  displaySendPayment,
  displayTransactCrypto,
  displayTransactionProcessing,
  displayTransferMoney,
} from "../menus/transact_crypto";
import { getFormattedDateTime } from "../helpers/format_date";
import {
  asignWallet,
  checkBEP20Transaction,
  checkERC20Transaction,
} from "../helpers/user_functions";
import {
  displayKYCInfo,
  displayRegKYC,
  displayThankForKYCReg,
} from "../menus/request_paycard";
import {
  displayCustomerSupportAssurance,
  displayCustomerSupportWelcome,
  displayEnterTransactionId,
  displayMakeComplain,
} from "../menus/customer_support";
import {
  displayCompleteTransaction,
  displayEnterCompleteTransactionId,
  displayEnterGiftId,
  displayGiftFeedbackMessage,
  displayTransactIDWelcome,
} from "../menus/transaction_id";
import { displayReportlyWelcome } from "../menus/reportly";

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
  const procesingStatus = "Processing";
  const cancelledStatus = "Cancel";
  const narration = "BwB quiz price";

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
    sharedTransactionId,
    setSharedTransactionId,
    sharedGiftId,
    setSharedGiftId,
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
    // console.log("Crypto ticker", sharedTicker);
    if (sharedCrypto != "") {
      if (sharedCrypto.toLowerCase() === "usdt") {
        setSharedAssetPrice(`${rate}`);
        // console.log(
        //   `form fetchCoinPrice The price of ${sharedTicker} in USDT is: ${sharedAssetPrice}`
        // );
      } else {
        fetchCoinPrice(`${sharedCrypto}`).then((price) => {
          if (price !== null) {
            setSharedAssetPrice(`${price}`);
            // console.log(
            //   `form fetchCoinPrice The price of ${sharedCrypto} in USDT is: ${price}`
            // );
          } else {
            console.log("form fetchCoinPrice Failed to fetch the price.");
          }
        });
      }
    }
  }, [sharedCrypto]);

  React.useEffect(() => {
    console.log(
      "Transaction ID is",
      window.localStorage.getItem("transactionID")
    );
    let trxID = window.localStorage.getItem("transactionID");
    trxID == "" ? sharedTransactionId : setSharedTransactionId(trxID || "");
  });

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
      console.log("formattedRate is :", formattedRate);
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
  }, []);

  // useEffect(() => {
  //   console.log("We want to check for the wallet");
  //   checkERC20Transaction("0x40a766fbb1af4e201fa87aa53b3ad4eb59e83343");
  //   checkBEP20Transaction("0x40a766fbb1af4e201fa87aa53b3ad4eb59e83343");
  // }, [chatMessages]);

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
      window.localStorage.setItem("transactionID", "");
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

  // HANDLE THE CHOICE OF HOW TO PAY
  const handlePayVendor = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
      helloMenu("hi");
    } else if (chatInput === "1") {
      displayPayAVendor(addChatMessages);
      nextStep("transferMoney");
    } else if (chatInput === "2") {
      displayPayAVendor(addChatMessages);
      nextStep("transferMoney");
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

  // HANDLE THE CHOICE FROM ABOVE
  const handleMakeAChoice = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      // prevStep();
      // welcomeMenu();
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      helloMenu("hi");
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
      nextStep("estimateAsset");
    } else if (chatInput === "2") {
      console.log("The choice is TWO, SEND GIFT ");
      displayTransferMoney(addChatMessages);
      setSharedPaymentMode("Gift");
      nextStep("estimateAsset");
    } else if (chatInput === "3") {
      displayTransferMoney(addChatMessages);
      setSharedPaymentMode("request");
      nextStep("estimateAsset");
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
        addChatMessages(newMessages);
      })();
    } else if (chatInput === "00") {
      goToStep("chooseAction");
      helloMenu("hi");
    } else if (chatInput === "1") {
      // console.log("How to display estimation, NOW PAY OPTIONS");
      displayHowToEstimation(addChatMessages, "Bitcoin (BTC)");
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

      addChatMessages(newMessages);

      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }
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

      addChatMessages(newMessages);

      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }
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

      // const userData = await checkUserExists(sharedChatId);
      // let userExists = userData.exists;

      // if (userExists) {
      //   console.log("User exists", chatId);
      // } else {
      //   console.log("User doesn't exists", chatId);
      // }
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
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        prevStep();
        displayTransferMoney(addChatMessages);
      })();
    } else if (chatInput === "1") {
      displayHowToEstimation(addChatMessages, "USDT (ERC20)");

      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("ERC20");
      nextStep("payOptions");
    } else if (chatInput === "2") {
      displayHowToEstimation(addChatMessages, "USDT (TRC20)");
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("TRC20");
      nextStep("payOptions");
    } else if (chatInput === "3") {
      displayHowToEstimation(addChatMessages, "USDT (BEP20)");
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
        displayHowToEstimation(
          addChatMessages,
          `${sharedCrypto} (${sharedNetwork})`
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
          `${sharedCrypto} (${sharedNetwork})`
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
  const handleSearchBank = async (chatInput: string) => {
    // IS USER TRYING TO CLAIM GIFT?
    let isGift = sharedPaymentMode.toLowerCase() === "gift";

    if (isGift) {
      if (greetings.includes(chatInput.trim().toLowerCase())) {
        goToStep("start");
        helloMenu(chatInput);
      } else if (chatInput.trim() === "00") {
        (() => {
          // console.log("Going back from handlePayOptions");
          goToStep("start");
          helloMenu("hi");
        })();
      } else if (chatInput.trim() === "0") {
        (() => {
          prevStep();
          displayTransactIDWelcome(addChatMessages, nextStep);
        })();
      } else if (chatInput !== "0") {
        const gift_id = chatInput.trim();
        setLoading(true);
        setSharedGiftId(gift_id);
        let giftExists = (await checkGiftExists(gift_id)).exists;

        setLoading(false);
        // IF GIFT_ID EXIST IN DB,
        if (giftExists) {
          displaySearchBank(addChatMessages, nextStep);
        } else {
          addChatMessages([
            {
              type: "incoming",
              content: "Invalid gift_id. Try again",
            },
          ]);
        }
      } else {
        addChatMessages([
          {
            type: "incoming",
            content:
              "Invalid choice. You need to choose an action from the options",
          },
        ]);
      }
    } else {
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
          parseFloat(sharedPaymentNairaEstimate) -
          parseFloat(sharedNairaCharge);

        setSharedPaymentAssetEstimate(finalAssetPayment.toString());
        setSharedPaymentNairaEstimate(finalNairaPayment.toString());
        setSharedChargeForDB(
          `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
        ),
          displaySearchBank(addChatMessages, nextStep);
      } else if (chatInput === "2") {
        const finalAssetPayment =
          parseFloat(sharedPaymentAssetEstimate) + parseFloat(sharedCharge);
        const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

        setSharedPaymentAssetEstimate(finalAssetPayment.toString());
        setSharedPaymentNairaEstimate(finalNairaPayment.toString());
        setSharedChargeForDB(
          `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
        );
        displaySearchBank(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content:
              "Invalid choice. Please choose with the options or say 'Hi' to start over.",
          },
        ]);
      }
    }
  };

  // HELP USER SELECT BANK FROM LIST
  const handleSelectBank = async (chatInput: string) => {
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
      // console.log(chatInput.trim());
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
    // console.log("I want to search for bankNames of", chatInput.trim());
  };

  //GET USER BANK DATA AFTER COLLECTING ACCOUNT NUMBER
  const handleBankAccountNumber = (chatInput: string) => {
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
        // console.log("THIS IS WHERE WE ARE");
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
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        // console.log("THIS IS WHERE WE ARE");
        prevStep();
        displaySearchBank(addChatMessages, nextStep);
      })();
    } else if (chatInput !== "0") {
      // console.log(chatInput.trim());

      let bank_name = "";
      let account_name = "";
      let account_number = "";

      setLoading(true);

      try {
        const bankData = await fetchBankDetails(
          sharedSelectedBankCode,
          chatInput.trim()
        );
        // console.log(
        //   "Bank data: account number is  ",
        //   bankData[0].account_number
        // );

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
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "0") {
      (() => {
        // console.log("THIS IS WHERE WE ARE");
        prevStep();
        displaySearchBank(addChatMessages, nextStep);
      })();
    } else if (chatInput !== "0") {
      displayEnterPhone(addChatMessages, nextStep);
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
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput != "0") {
      setLoading(true);
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

      let isGift = sharedPaymentMode.toLowerCase() === "gift";

      if (isGift) {
        // UPDATE THE USER GIFT PAYMENT DATA
        // - gift_status = "Not Claimed"> "Claimed"
        // - status = "Uncompleted"> "Pending" > "Processing" > "Successful"/ "Uncessfull"

        let giftStatus = (await isGiftValid(sharedGiftId)).user?.gift_status;
        try {
          let giftNotClaimed =
            giftStatus?.toLocaleLowerCase() === "not claimed";

          if (giftNotClaimed) {
            const giftUpdateDate = {
              gift_chatID: sharedGiftId,
              acct_number: bankData.acct_number,
              bank_name: bankData.bank_name,
              receiver_name: bankData.receiver_name,
              receiver_phoneNumber: formatPhoneNumber(phoneNumber),
              gift_status: "Claimed",
            };

            const nairaPayment: string = (
              await getGiftNaira(sharedGiftId)
            ).toString();
            const giftData = {
              accountNumber: bankData.acct_number,
              accountBank: sharedSelectedBankCode,
              bankName: bankData.bank_name,
              amount: nairaPayment,
              accountName: bankData.receiver_name,
              narration: narration,
            };

            // Update the transaction to "Pending" before making the payment
            await updateGiftTransaction(sharedGiftId, {
              gift_status: "Pending",
            });

            // Attempt to claim the gift money
            await claimGiftMoney(giftData);

            // If successful, update the transaction status to "Claimed"
            await updateGiftTransaction(sharedGiftId, giftUpdateDate);

            setLoading(false);
            displayGiftFeedbackMessage(addChatMessages, nextStep);
            helloMenu("hi");
            console.log("User gift data updated", giftUpdateDate);
          } else {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: "This gift is already claimed",
              },
            ]);
            helloMenu("hi");
            goToStep("start");
          }
        } catch (error) {
          console.error("Error during gift claim process:", error);

          // Rollback or update the transaction to indicate a failure
          await updateGiftTransaction(sharedGiftId, {
            gift_status: giftStatus,
          });

          setLoading(false);

          // Inform the user that the transaction failed
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>
                  Sorry, the transaction failed. Please try again
                  <br />
                  <b> NOTE:</b> We don't support microfinance banks like Opay,
                  Kuda Bank, or Moniepoint at the moment.
                </span>
              ),
            },
          ]);
          nextStep("start");
          helloMenu("hi");
        }
      } else {
        const transactionID = generateTransactionId();
        setSharedTransactionId(transactionID.toString());
        window.localStorage.setItem("transactionID", transactionID.toString());
        const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedCrypto} `;
        const date = getFormattedDateTime();

        const isUserAvailable = await checkUserExists(
          formatPhoneNumber(phoneNumber)
        );
        if (isUserAvailable.user?.phone_number === null) {
          updateUser({
            phone_number: formatPhoneNumber(phoneNumber),
          });
        }

        // await asignWallet(
        //   sharedChatId,
        //   formatPhoneNumber(phoneNumber),
        //   sharedNetwork,
        //   setSharedWallet
        // );

        const btcAddressPattern = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;

        const erc20AddressPattern = /^0x[a-fA-F0-9]{40}$/;

        const trc20AddressPattern = /^T[a-zA-Z0-9]{33}$/;

        const erc20 = ["erc20", "bep20"];

        let userWallet = "";

        const userData = await checkUserExists(formatPhoneNumber(phoneNumber));
        let userExists = userData.exists;
        let hasBTCWallet = btcAddressPattern.test(
          userData.user?.bitcoin_wallet || ""
        );
        let hasERCWallet = erc20AddressPattern.test(
          userData.user?.eth_bnb_wallet || ""
        );
        let hasTRCWallet = trc20AddressPattern.test(
          userData.user?.tron_wallet || ""
        );

        // const tronWallet = await generateTronWalletAddress();

        if (userExists) {
          console.log("This user exists");
          if (sharedNetwork.toLocaleLowerCase() === "btc") {
            if (hasBTCWallet) {
              setSharedWallet(userData.user?.bitcoin_wallet || "");
              userWallet = userData.user?.bitcoin_wallet || "";
            } else {
              const btcWallet = await generateBTCWalletAddress();
              setSharedWallet(btcWallet.bitcoin_wallet);
              userWallet = btcWallet.bitcoin_wallet;
              // update the db
              updateUser({
                phone_number: formatPhoneNumber(phoneNumber),
                bitcoin_wallet: btcWallet.bitcoin_wallet,
                bitcoin_privateKey: btcWallet.bitcoin_privateKey,
              });
              console.log(
                "User exist, new BTC wallet is:",
                btcWallet.bitcoin_wallet
              );
            }
          } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
            if (hasERCWallet) {
              setSharedWallet(userData.user?.eth_bnb_wallet || "");
              userWallet = userData.user?.eth_bnb_wallet || "";
            } else {
              const ercWallet = await generateERCWalletAddress();
              setSharedWallet(ercWallet.eth_bnb_wallet);
              userWallet = ercWallet.eth_bnb_wallet;
              // update the db
              updateUser({
                phone_number: formatPhoneNumber(phoneNumber),
                eth_bnb_wallet: ercWallet.eth_bnb_wallet,
                eth_bnb_privateKey: ercWallet.eth_bnb_privateKey,
              });
              console.log(
                "User exist, new ERC wallet is:",
                ercWallet.eth_bnb_wallet
              );
            }
          } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
            const tronWallet = await generateTronWalletAddress();
            if (hasTRCWallet) {
              setSharedWallet(userData.user?.tron_wallet || "");
              userWallet = userData.user?.tron_wallet || "";
            } else {
              setSharedWallet(tronWallet.tron_wallet);
              userWallet = tronWallet.tron_wallet;
              updateUser({
                phone_number: formatPhoneNumber(phoneNumber),
                tron_wallet: tronWallet.tron_wallet,
                tron_privateKey: tronWallet.tron_privateKey,
              });
              console.log(
                "User exist and new tron wallet is:",
                tronWallet.tron_wallet
              );
            }
          }
        } else {
          if (sharedNetwork.toLocaleLowerCase() === "btc") {
            const btcWallet = await generateBTCWalletAddress();
            setSharedWallet(btcWallet.bitcoin_wallet);
            userWallet = btcWallet.bitcoin_wallet;
            await createUser({
              agent_id: sharedChatId,
              phone_number: formatPhoneNumber(phoneNumber),
              bitcoin_wallet: btcWallet.bitcoin_wallet,
              bitcoin_privateKey: btcWallet.bitcoin_privateKey,
            });
            console.log("BTC wallet is:", btcWallet.bitcoin_wallet);
          } else if (erc20.includes(sharedNetwork.toLocaleLowerCase())) {
            const ercWallet = await generateERCWalletAddress();
            setSharedWallet(ercWallet.eth_bnb_wallet);
            userWallet = ercWallet.eth_bnb_wallet;
            await createUser({
              agent_id: sharedChatId,
              phone_number: formatPhoneNumber(phoneNumber),
              eth_bnb_wallet: ercWallet.eth_bnb_wallet,
              eth_bnb_privateKey: ercWallet.eth_bnb_privateKey,
            });
            console.log("ERC wallet is:", ercWallet.eth_bnb_wallet);
          } else if (sharedNetwork.toLocaleLowerCase() === "trc20") {
            const tronWallet = await generateTronWalletAddress();
            setSharedWallet(tronWallet.tron_wallet);
            userWallet = tronWallet.tron_wallet;
            await createUser({
              agent_id: sharedChatId,
              phone_number: formatPhoneNumber(phoneNumber),
              tron_wallet: tronWallet.tron_wallet,
              tron_privateKey: tronWallet.tron_privateKey,
            });
            console.log("Tron wallet is:", tronWallet.tron_wallet);
          }
        }

        displaySendPayment(
          addChatMessages,
          nextStep,
          userWallet,
          sharedCrypto,
          sharedPaymentAssetEstimate,
          sharedPaymentNairaEstimate,
          transactionID,
          sharedNetwork
        );
        setLoading(false);
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
          wallet_address: userWallet,
          Date: date,
          status: "Uncompleted",
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          settle_walletLink: "",
          chat_id: chatId,
          current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
          merchant_rate: merchantRate,
          profit_rate: profitRate,
          name: "",
        };
        await createTransaction(userDate);

        console.log("User data created", userDate);
      }
    } else {
      setLoading(false);
      console.log("User input not recognized");
    }
  };

  // ALLOW USER TO CONFIRM IF THEY HAVE MADE THE TRANSFER OR NOT
  const handleConfirmTransaction = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "0") {
    } else if (chatInput.trim().length > 3) {
      console.log("Input is:", chatInput.trim());
      const transaction_id = chatInput.trim();
      setLoading(true);
      setSharedTransactionId(transaction_id);
      let transactionExists = (await checkTranscationExists(transaction_id))
        .exists;

      console.log(
        "User phone:",
        (await checkTranscationExists(transaction_id)).user
          ?.customer_phoneNumber
      );

      setLoading(false);
      // IF TRANSACTION_ID EXIST IN DB,
      if (transactionExists) {
        displayConfirmPayment(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid transaction_id. Try again",
          },
        ]);
      }
    } else {
      if (chatInput.trim() === "1") {
        updateTransaction(sharedTransactionId, procesingStatus);
        displayConfirmPayment(addChatMessages, nextStep);
      } else if (chatInput.trim() === "2") {
        updateTransaction(sharedTransactionId, cancelledStatus);
        displayConfirmPayment(addChatMessages, nextStep);
      }
    }
  };
  // VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME
  const handleTransactionProcessing = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displaySearchBank(addChatMessages, nextStep);
      })();
    } else if (chatInput.trim() === "1") {
      helloMenu("hi");
    } else if (chatInput.trim() === "2") {
      goToStep("supportWelcome");
      displayCustomerSupportWelcome(addChatMessages, nextStep);
    }
  };

  // REQUEST PAYCARD SEQUENCE FUNCTIONS

  // TELL USERS ABOUT DATA NEEDED FOR PAYCARD REQUEST
  const handleKYCInfo = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "1") {
      displayKYCInfo(addChatMessages, nextStep);
    } else if (chatInput === "2") {
      helloMenu("hi");
      goToStep("start");
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

  // GIVE USERS LINK TO REG
  const handleRegKYC = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "1") {
      displayRegKYC(addChatMessages, nextStep);
    } else if (chatInput === "2") {
      helloMenu("hi");
      goToStep("start");
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
  // GIVE USERS LINK TO REG
  const handleThankForKYCReg = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "1") {
      displayThankForKYCReg(addChatMessages, nextStep);
      helloMenu("hi");
    } else if (chatInput === "2") {
      goToStep("start");
      helloMenu("hi");
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

  // CUSTOMER SUPPORT SEQUENCE FUNCTIONS

  // ALLOW USER TO USER THEIR TRANSACTION ID TO MAKE A COMPLAIN
  const handleCustomerSupportAssurance = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      (() => {
        prevStep();
        displayCustomerSupportWelcome(addChatMessages, nextStep);
      })();
    } else if (chatInput === "1") {
      displayCustomerSupportAssurance(addChatMessages, nextStep);
      helloMenu("hi");
    } else if (chatInput === "2") {
      displayEnterTransactionId(addChatMessages, nextStep);
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

  // ALLOW USERS ENTER TRANSACTION ID
  const handleTransactionId = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput !== "0") {
      const transaction_id = chatInput.trim();
      setLoading(true);
      setSharedTransactionId(transaction_id);
      let transactionExists = (await checkTranscationExists(transaction_id))
        .exists;

      console.log(
        "User phone:",
        (await checkTranscationExists(transaction_id)).user
          ?.customer_phoneNumber
      );

      setLoading(false);
      // IF TRANSACTION_ID EXIST IN DB,
      if (transactionExists) {
        displayMakeComplain(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid transaction_id. Try again",
          },
        ]);
      }
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

  // MAKE COMPLAIN
  const handleMakeComplain = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayEnterTransactionId(addChatMessages, nextStep);
      })();
    } else if (chatInput !== "0") {
      const message = chatInput.trim();
      const words = message.trim().split(/\s+/);
      let validMessage = words.length < 100 ? true : false;
      // IF TRANSACTION_ID EXIST IN DB,

      if (validMessage) {
        setLoading(true);
        const complainId = generateComplainId();
        const phone = (await checkTranscationExists(sharedTransactionId)).user
          ?.customer_phoneNumber;
        console.log("User phone number is:", phone);

        await createComplain({
          transaction_id: sharedTransactionId,
          complain: message,
          status: "pending",
          Customer_phoneNumber: phone,
          complain_id: complainId,
        });
        setLoading(false);
        addChatMessages([
          {
            type: "incoming",
            content:
              "Your complain is noted.You can also reach out to our customer care. +2349069400430 if you don't want to wait",
          },
        ]);
        helloMenu("hi");
        goToStep("start");
      } else {
        console.log("Invalid message length");
        addChatMessages([
          {
            type: "incoming",
            content:
              "Invalid entry, Please enter your message in not more that 100 words",
          },
        ]);
        return;
      }
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
  // ENTER TRANSACTION ID TO COMPLETE TRANSACTION
  const handleCompleteTransactionId = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        choiceMenu("2");
      })();
    } else if (chatInput === "1") {
      displayEnterCompleteTransactionId(addChatMessages, nextStep);
    } else if (chatInput === "2") {
      console.log("Let's see what is going on HERE!!!");
      displayEnterGiftId(addChatMessages, nextStep);
      setSharedPaymentMode("Gift");
    } else if (chatInput === "3") {
    }
  };

  // CUSTOMER TRANSACTION ID SEQUENCE FUNCTIONS

  // ALLOW USERS ENTER GIFT ID
  const handleGiftId = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayTransactIDWelcome(addChatMessages, nextStep);
      })();
    } else if (chatInput !== "0") {
      const gift_id = chatInput.trim();
      setLoading(true);
      setSharedGiftId(chatInput.trim());
      let giftExists = (await checkGiftExists(gift_id)).exists;

      console.log("gift is processing");

      // IF GIFT_ID EXIST IN DB,
      if (giftExists) {
        displayGiftFeedbackMessage(addChatMessages, nextStep);
        helloMenu("hi");
        setLoading(false);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid gift_id. Try again",
          },
        ]);
        setLoading(false);
      }
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

  // CUSTOMER REPORTLY SEQUENCE FUNCTIONS
  const handleReportlyWelcome = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        // console.log("Going back from handlePayOptions");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayTransactIDWelcome(addChatMessages, nextStep);
      })();
    } else if (chatInput === "1") {
      const gift_id = chatInput.trim();
      setLoading(true);
      // setSharedTransactionId(gift_id);
      let giftExists = true;
      // (await checkGiftExists(gift_id)).exists;

      // console.log(
      //   "User phone:",
      //   (await checkGiftExists(gift_id)).user?.customer_phoneNumber
      // );

      setLoading(false);
      // IF GIFT_ID EXIST IN DB,
      if (giftExists) {
        displayReportlyWelcome(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid transaction_id. Try again",
          },
        ]);
      }
    } else if (chatInput === "2") {
      const gift_id = chatInput.trim();
      setLoading(true);
      // setSharedTransactionId(gift_id);
      let giftExists = true;
      // (await checkGiftExists(gift_id)).exists;

      // console.log(
      //   "User phone:",
      //   (await checkGiftExists(gift_id)).user?.customer_phoneNumber
      // );

      setLoading(false);
      // IF GIFT_ID EXIST IN DB,
      if (giftExists) {
        displayReportlyWelcome(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid transaction_id. Try again",
          },
        ]);
      }
    } else if (chatInput === "3") {
      const gift_id = chatInput.trim();
      setLoading(true);
      // setSharedTransactionId(gift_id);
      let giftExists = true;
      // (await checkGiftExists(gift_id)).exists;

      // console.log(
      //   "User phone:",
      //   (await checkGiftExists(gift_id)).user?.customer_phoneNumber
      // );

      setLoading(false);
      // IF GIFT_ID EXIST IN DB,
      if (giftExists) {
        displayReportlyWelcome(addChatMessages, nextStep);
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid transaction_id. Try again",
          },
        ]);
      }
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

  // // ALLOW USER TO CONFIRM IF THEY HAVE MADE THE TRANSFER OR NOT
  // const handleConfirmTransaction = async (chatInput: string) => {
  //   if (greetings.includes(chatInput.trim().toLowerCase())) {
  //     goToStep("start");
  //     helloMenu(chatInput);
  //   } else if (chatInput.trim() === "00") {
  //     goToStep("start");
  //     helloMenu(chatInput);
  //   } else if (chatInput.trim() === "0") {
  //   } else if (chatInput.trim().length > 3) {
  //     console.log("Input is:", chatInput.trim());
  //     const transaction_id = chatInput.trim();
  //     setLoading(true);
  //     setSharedTransactionId(transaction_id);
  //     let transactionExists = (await checkTranscationExists(transaction_id))
  //       .exists;

  //     console.log(
  //       "User phone:",
  //       (await checkTranscationExists(transaction_id)).user
  //         ?.customer_phoneNumber
  //     );

  //     setLoading(false);
  //     // IF TRANSACTION_ID EXIST IN DB,
  //     if (transactionExists) {
  //       displayConfirmPayment(addChatMessages, nextStep);
  //     } else {
  //       addChatMessages([
  //         {
  //           type: "incoming",
  //           content: "Invalid transaction_id. Try again",
  //         },
  //       ]);
  //     }
  //   } else {
  //     if (chatInput.trim() === "1") {
  //       updateTransaction(sharedTransactionId, procesingStatus);
  //       displayConfirmPayment(addChatMessages, nextStep);
  //     } else if (chatInput.trim() === "2") {
  //       updateTransaction(sharedTransactionId, cancelledStatus);
  //       displayConfirmPayment(addChatMessages, nextStep);
  //     }
  //   }
  // };

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
        handlePayOptions(chatInput);

        setChatInput("");
        break;

      case "charge":
        console.log("Current step is charge ");
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

      case "confirmTransaction":
        console.log("Current step is confirmTransaction ");
        handleConfirmTransaction(chatInput);
        setChatInput("");

        break;

      case "paymentProcessing":
        console.log("Current step is paymentProcessing ");
        handleTransactionProcessing(chatInput);
        setChatInput("");
        break;

      case "kycInfo":
        console.log("Current step is kycInfo ");
        handleKYCInfo(chatInput);
        setChatInput("");
        break;

      case "kycReg":
        console.log("Current step is kycReg ");
        handleRegKYC(chatInput);
        setChatInput("");
        break;

      case "thankForKYCReg":
        console.log("Current step is thankForKYCReg ");
        handleThankForKYCReg(chatInput);
        setChatInput("");
        break;

      case "supportWelcome":
        console.log("Current step is supportWelcome ");
        displayCustomerSupportWelcome(addChatMessages, nextStep);
        setChatInput("");
        break;

      case "assurance":
        console.log("Current step is assurance ");
        handleCustomerSupportAssurance(chatInput);
        setChatInput("");
        break;

      case "entreTrxId":
        console.log("Current step is entreTrxId ");
        handleTransactionId(chatInput);
        setChatInput("");
        break;

      case "makeComplain":
        console.log("Current step is makeComplain ");
        handleMakeComplain(chatInput);
        setChatInput("");
        break;

      case "completeTransactionId":
        console.log("Current step is completeTransactionId ");
        handleCompleteTransactionId(chatInput);
        setChatInput("");
        break;

      case "giftFeedBack":
        console.log("Current step is giftFeedBack ");
        handleGiftId(chatInput);
        setChatInput("");
        break;

      case "makeReport":
        console.log("Current step is makeReport ");
        handleReportlyWelcome(chatInput);
        setChatInput("");
        break;

      case "completetrxWithID":
        console.log("Current step is trxIDFeedback ");
        handleReportlyWelcome(chatInput);
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
    <div className="fixed right-8 bottom-24 w-10/12 md:w-7/12 lg:w-5/12 bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform scale-100 opacity-100 pointer-events-auto">
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
          <h2 className="text-lg font-bold justify-start items-center pr-36">
            2SettleHQ
          </h2>
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
        <div className="flex items-center p-3 border-t border-gray-200 bg-white pr-4">
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

          {/* <span
            className="ml-4 text-blue-500 cursor-pointer material-symbols-rounded"
            onClick={() => handleConversation(chatInput)}
          ></span> */}
          <span
            className="ml-2 text-blue-500 cursor-pointer material-symbols-rounded"
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
