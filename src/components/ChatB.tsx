"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import SendIcon from "@mui/icons-material/Send";
import Image from "next/image";
import Loader from "./Loader";
import parse from "html-react-parser";
import elementToJSXString from "react-element-to-jsx-string";
import { useAccount } from "wagmi";
import ShortenedAddress from "./ShortenAddress";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MessageType, WalletInfo } from "../types/general_types";
import {
  checkGiftExists,
  checkRequestExists,
  checkTranscationExists,
  createComplain,
  createTransaction,
  fetchBankDetails,
  fetchBankNames,
  fetchCoinPrice,
  fetchMerchantRate,
  fetchProfitRate,
  fetchRate,
  isGiftValid,
  updateGiftTransaction,
  updateTransaction,
} from "../helpers/api_calls";
import { formatCurrency } from "../helpers/format_currency";
import {
  formatPhoneNumber,
  generateChatId,
  generateComplainId,
  generateGiftId,
  generateTransactionId,
  getChatId,
  greetings,
  phoneNumberPattern,
  saveChatId,
} from "../utils/utilities";
import { useSharedState } from "../context/SharedStateContext";
import { getFormattedDateTime } from "../helpers/format_date";

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
  displayEnterCompleteTransactionId,
  displayEnterId,
  displayGiftFeedbackMessage,
  displayTransactIDWelcome,
} from "../menus/transaction_id";
import {
  displayReportlyFarwell,
  displayReportlyFraudsterWalletAddress,
  displayReportlyName,
  displayReportlyNote,
  displayReportlyPhoneNumber,
  displayReportlyReporterWalletAddress,
  displayReportlyWelcome,
} from "../menus/reportly";
import {
  displayCharge,
  displayConfirmPayment,
  displayContinueToPay,
  displayEnterAccountNumber,
  displayEnterPhone,
  displayHowToEstimation,
  displayPayIn,
  displayRequestPaymentSummary,
  displaySearchBank,
  displaySelectBank,
  displaySendPayment,
  displayTransactCrypto,
  displayTransferMoney,
} from "@/menus/transact_crypto";
import { useChatNavigation } from "../hooks/useChatNavigation";
import {
  countWords,
  getLastReportId,
  getNextReportID,
  isValidWalletAddress,
  makeAReport,
} from "@/helpers/api_call/reportly_page_calls";
import { reportData } from "@/types/reportly_types";
import ConfirmAndProceedButton from "@/hooks/confirmButtonHook";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";

import { telegramUser } from "@/types/telegram_types";
import useErrorHandler from "@/hooks/useErrorHandler";
import TelegramIntegration from "./TelegramIntegration";
import { withErrorHandling } from "./withErrorHandling";
import { handleConversation } from "@/utils/handleConversations";

const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        How may I help you?
        <br />
        Say "Hi" let us start
      </span>
    ),
    timestamp: new Date(),
    isComponent: false,
  },
];

const componentMap: { [key: string]: React.ComponentType<any> } = {
  ConnectButton: ConnectButton,
  // Add other components here as needed
};

const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const serializeMessage = (message: MessageType) => {
  if (message.isComponent && message.componentName) {
    return {
      ...message,
      content: elementToJSXString(message.content),
    };
  }
  return {
    ...message,
    content: sanitizeSerializedContent(elementToJSXString(message.content)),
  };
};

const deserializeMessage = (message: MessageType): MessageType => {
  if (message.isComponent && message.componentName) {
    const Component = componentMap[message.componentName];
    if (Component) {
      return {
        ...message,
        content: <Component />,
      };
    }
    // Fallback if component is not found
    return {
      ...message,
      content: <span>Unknown component: {message.componentName}</span>,
    };
  }
  return {
    ...message,
    content: parse(message.content as string),
  };
};
interface ChatBotProps {
  isMobile: boolean;
  onClose: () => void;
}
const ChatBot: React.FC<ChatBotProps> = ({ isMobile, onClose }) => {
  // CONST VARIABLES
  const account = useAccount();
  const wallet = account.address;
  let walletIsConnected = account.isConnected;
  const procesingStatus = "Processing";
  const cancelledStatus = "Cancel";
  const narration = "BwB quiz price";
  const { error, handleError, clearError } = useErrorHandler();

  const chatboxRef = useRef<HTMLDivElement>(null);
  const [visibleDateSeparators, setVisibleDateSeparators] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        const maxHeight = window.innerHeight * 0.75;
        if (chatboxRef.current) {
          if (height > maxHeight) {
            chatboxRef.current.style.height = `${maxHeight}px`;
          }
        }
      }
    });

    if (chatboxRef.current) {
      resizeObserver.observe(chatboxRef.current);
    }

    return () => {
      if (chatboxRef.current) {
        resizeObserver.unobserve(chatboxRef.current);
      }
    };
  }, []);

  // SHAREDSTATE HOOK
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
    sharedReportlyReportType,
    setSharedReportlyReportType,
  } = useSharedState();

  // USECHATNAVIGATION HOOK

  const {
    chatMessages,
    serializedMessages,
    currentStep,
    stepHistory,
    addChatMessages,
    nextStep,
    prevStep,
    goToStep,
  } = useChatNavigation();

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
  const [reporterName, setReporterName] = useState("");
  const [reporterPhoneNumber, setReporterPhoneNumber] = useState("");
  const [reporterWalletAddress, setReporterWalletAddress] = useState("");
  const [fraudsterWalletAddress, setFraudsterWalletAddress] = useState("");
  const [descriptionNote, setDescriptionNote] = useState("");
  const [reportId, setReportId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [telegramUser, setTelegramUser] = useState<telegramUser | null>(null);
  const [isTelUser, setIsTelUser] = useState(false);
  const code = localStorage.getItem("referralCode") ?? "";
  const MAX_MESSAGES = 100;

  // REF HOOKS
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [local, setLocal] = useState<{
    messages: MessageType[];
    serializedMessages: {
      type: string;
      content: string;
      timestamp: string;
      isComponent?: boolean;
      componentName?: string;
    }[];
    step: string;
    stepHistory: string[];
  }>(() => {
    if (typeof window !== "undefined") {
      const fromLocalStorage = window.localStorage.getItem("chat_data");
      if (fromLocalStorage) {
        const parsedData = JSON.parse(fromLocalStorage);
        const deserializedMessages = parsedData.messages.map((msg: any) => ({
          ...deserializeMessage(msg),
          timestamp: new Date(msg.timestamp),
        }));
        const { currentStep, stepHistory = ["start"] } = parsedData;

        // Only keep the last 100 messages
        const limitedMessages = deserializedMessages.slice(-MAX_MESSAGES);
        const limitedSerializedMessages = parsedData.messages.slice(
          -MAX_MESSAGES
        );
        return {
          messages: limitedMessages,
          serializedMessages: limitedSerializedMessages,
          step: currentStep,
          stepHistory: parsedData.stepHistory || ["start"],
        };
      }
    }

    return {
      messages: initialMessages,
      serializedMessages: initialMessages.map((msg) => ({
        ...serializeMessage(msg),
        timestamp: msg.timestamp.toISOString(),
      })),
      step: "start",
      stepHistory: ["start"],
    };
  });

  // Add this effect to monitor localStorage changes
  useEffect(() => {
    const storageListener = () => {
      const chatData = window.localStorage.getItem("chat_data");
    };

    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  React.useEffect(() => {
    const limitedMessages = serializedMessages.slice(-MAX_MESSAGES);
    const chatData = {
      messages: limitedMessages,
      // serializedMessages,
      currentStep,
      stepHistory,
    };
    window.localStorage.setItem("chat_data", JSON.stringify(chatData));
  }, [serializedMessages, currentStep, stepHistory]);

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);
  // To help debug performance issues
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          // 50ms threshold
          console.warn("Long task detected:", entry);
        }
      }
    });

    observer.observe({ entryTypes: ["longtask"] });
    return () => observer.disconnect();
  }, []);

  // Load telegram data
  useEffect(() => {
    <TelegramIntegration />;
  }, []);

  const telFirstName = isTelUser ? telegramUser?.first_name : "";

  useEffect(() => {
    if (sharedCrypto != "") {
      if (sharedCrypto.toLowerCase() === "usdt") {
        setSharedAssetPrice(`${rate}`);
      } else {
        fetchCoinPrice(`${sharedCrypto}`).then((price) => {
          if (price !== null) {
            setSharedAssetPrice(`${price}`);
          } else {
            console.log("form fetchCoinPrice Failed to fetch the price.");
          }
        });
      }
    }
  }, [sharedCrypto]);

  React.useEffect(() => {
    let trxID = window.localStorage.getItem("transactionID");
    trxID == "" ? sharedTransactionId : setSharedTransactionId(trxID || "");
  });

  const scrollToBottom = useCallback(() => {
    if (!messagesEndRef.current) return;

    // Use requestAnimationFrame to avoid forced reflow
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    // Debounce scroll updates for rapid message additions
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    () => setIsOpen(isOpen);
  });

  const initializeChatId = () => {
    // we now set the telegram chatId to the chatId if it a telegram user
    const existingChatId = isTelUser
      ? telegramUser?.id.toString()
      : getChatId();
    setSharedChatId(`${existingChatId}`);

    if (!existingChatId) {
      const newChatId = isTelUser
        ? // ? telegramUser?.id ?? generateChatId()
          telegramUser?.id.toString()
        : generateChatId();

      if (newChatId !== undefined) {
        // Ensure newChatId is defined
        saveChatId(newChatId);
        setChatId(newChatId.toString());
      } else {
        console.warn("Failed to generate a new chat ID.");
      }
    } else {
      if (existingChatId !== chatId) {
        setChatId(existingChatId);
      }
    }
  };

  useEffect(() => {
    initializeChatId();
  }, [chatId]);

  // Replace multiple sequential API calls with Promise.all
  const fetchData = async () => {
    try {
      const [fetchedRate, fetchedMerchantRate, fetchedProfitRate] =
        await Promise.all([
          fetchRate(),
          fetchMerchantRate(),
          fetchProfitRate(),
        ]);

      // Batch state updates
      const updates = {
        rate: fetchedRate.toString(),
        formattedRate: formatCurrency(fetchedRate.toString(), "NGN", "en-NG"),
        merchantRate: formatCurrency(
          fetchedMerchantRate.toString(),
          "NGN",
          "en-NG"
        ),
        profitRate: formatCurrency(
          fetchedProfitRate.toString(),
          "NGN",
          "en-NG"
        ),
      };

      // Update all states at once
      setRate(updates.rate);
      setFormattedRate(updates.formattedRate);
      setMerchantRate(updates.merchantRate);
      setProfitRate(updates.profitRate);
      setSharedRate(updates.rate);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const dateSeparators = document.querySelectorAll(".date-separator");
    dateSeparators.forEach((separator) => {
      if (observerRef.current) {
        observerRef.current.observe(separator);
      }
    });
  }, [chatMessages]);

  // OPERATINAL FUNCTIONS
  // ON HI | HELLO | HOWDY | HEY PROMPT
  const helloMenu = (chatInput: string) => {
    console.log("we are at the start");
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      window.localStorage.setItem("transactionID", "");
      setSharedPaymentMode("");
      if (walletIsConnected) {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                How far {telFirstName} 👋
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
            timestamp: new Date(),
          },
        ]);
        nextStep("chooseAction");
      } else {
        setSharedPaymentMode("");
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                How far {telFirstName}👋
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
            timestamp: new Date(),
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
              How far {telFirstName} 👋
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
          timestamp: new Date(),
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
                Welcome to 2SettleHQ {telFirstName}, how can I help you today?
              </span>
            ),
            timestamp: new Date(),
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
            timestamp: new Date(),
          },
        ]);
      }
    }
  };

  // TRANSACT CRYPTO SEQUENCE FUNCTIONS
  const choiceMenu = (chatInput: string) => {
    const choice = chatInput.trim();
    if (greetings.includes(choice.toLowerCase())) {
      helloMenu(choice);
      goToStep("start");
    } else if (choice === "0") {
      prevStep();
      helloMenu("hi");
    } else if (choice.toLowerCase() === "1") {
      if (!walletIsConnected) {
        addChatMessages([
          {
            type: "incoming",
            content: <ConnectButton />,
            timestamp: new Date(),
            isComponent: true,
            componentName: "ConnectButton",
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
            timestamp: new Date(),
          },
        ]);
        nextStep("transactCrypto");
      } else {
        addChatMessages([
          {
            type: "incoming",
            content: <ConnectButton />,
            timestamp: new Date(),
            isComponent: true,
            componentName: "ConnectButton",
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
            timestamp: new Date(),
          },
        ]);
        nextStep("transactCrypto");
      }
    } else if (choice.toLowerCase() === "2") {
      if (!walletIsConnected) {
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
            timestamp: new Date(),
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
            timestamp: new Date(),
          },
        ]);
        nextStep("transactCrypto");
      } else {
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
            timestamp: new Date(),
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
            timestamp: new Date(),
          },
        ]);
        nextStep("transactCrypto");
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
          timestamp: new Date(),
        },
      ]);
    }
    setChatInput("");
  };

  // HANDLE THE CHOICE FROM ABOVE
  const handleMakeAChoice = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
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
          content: (
            <span>
              You need to make a valid choice
              <br />
              <br />
              Please Try again, or say 'Hi' or 'Hello' to start over
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
    }
    setChatInput("");
  };

  // HANDLE TRANSFER MONEY MENU
  const handleTransferMoney = (chatInput: string) => {
    setSharedWallet("");
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
  const handleEstimateAsset = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
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
      helloMenu("hi");
    } else if (chatInput === "1") {
      displayHowToEstimation(
        addChatMessages,
        "Bitcoin (BTC)",
        sharedPaymentMode
      );
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
      displayHowToEstimation(
        addChatMessages,
        "USDT (ERC20)",
        sharedPaymentMode
      );

      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("ERC20");
      nextStep("payOptions");
    } else if (chatInput === "2") {
      displayHowToEstimation(
        addChatMessages,
        "USDT (TRC20)",
        sharedPaymentMode
      );
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
        : displayHowToEstimation(
            addChatMessages,
            "USDT (BEP20)",
            sharedPaymentMode
          );
      setSharedTicker("USDT");
      setSharedCrypto("USDT");
      setSharedNetwork("BEP20");
      console.log("sharedPaymentMode:", sharedPaymentMode);
      // sharedPaymentMode.toLowerCase() === "request"
      //   ? nextStep("charge")
      //   : nextStep("payOptions");
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
  const handlePayOptions = (chatInput: string) => {
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
    } else {
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

  // GET USER BANK DETAILS FROM NUBAN
  const handleSearchBank = async (chatInput: string) => {
    // IS USER TRYING TO CLAIM GIFT?
    let wantsToClaimGift =
      sharedPaymentMode.toLowerCase().trim() === "claim gift";
    let wantsToSendGift = sharedPaymentMode.toLowerCase().trim() === "gift";
    let wantsToRequestPayment =
      sharedPaymentMode.toLowerCase().trim() === "request";

    if (wantsToClaimGift) {
      console.log("USER WANTS TO CLAIM GIFT");
      if (greetings.includes(chatInput.trim().toLowerCase())) {
        goToStep("start");
        helloMenu(chatInput);
      } else if (chatInput.trim() === "00") {
        (() => {
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
              timestamp: new Date(),
            },
          ]);
        }
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
    } else if (wantsToSendGift) {
      console.log("USER WANTS TO SEND GIFT");
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
            timestamp: new Date(),
          },
        ]);
      }
    } else if (wantsToRequestPayment) {
      console.log("USER WANTS TO REQUEST PAYMENT");
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
      } else {
        // chatInput.trim()
        // CLEAN THE STRING HERE
        chatInput = chatInput.replace(/[^0-9.]/g, "");
        if (Number(chatInput) > 20000 && Number(chatInput) < 2000000) {
          setSharedPaymentNairaEstimate(chatInput);
          displaySearchBank(addChatMessages, nextStep);
        } else {
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>
                  You can only recieve <br />
                  <b>Min: {formatCurrency("20000", "NGN", "en-NG")}</b> and{" "}
                  <br />
                  <b>Max: {formatCurrency("2000000", "NGN", "en-NG")}</b>
                </span>
              ),
              timestamp: new Date(),
            },
          ]);
        }
      }
    } else {
      console.log("USER WANTS TO TRANSACT CRYPTO");
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
          parseFloat(sharedNairaCharge.replace(/[^\d.]/g, ""));
        console.log("Naira charger is :", sharedNairaCharge);
        console.log(
          "We are setting setSharedPaymentNairaEstimate to:",
          finalNairaPayment.toString()
        );

        setSharedPaymentAssetEstimate(finalAssetPayment.toString());
        setSharedPaymentNairaEstimate(finalNairaPayment.toString());
        setSharedChargeForDB(
          `${chargeFixed.toFixed(5)} ${sharedCrypto} = ${sharedNairaCharge}`
        ),
          displaySearchBank(addChatMessages, nextStep);
      } else if (chatInput === "2") {
        const finalAssetPayment =
          parseFloat(sharedPaymentAssetEstimate) +
          parseFloat(sharedCharge.replace(/[^\d.]/g, ""));
        // const finalNairaPayment = parseFloat(sharedPaymentNairaEstimate);

        console.log(
          "We are setting setSharedPaymentNairaEstimate to:",
          sharedPaymentNairaEstimate
        );

        setSharedPaymentAssetEstimate(finalAssetPayment.toString());
        // setSharedPaymentNairaEstimate(finalNairaPayment.toString());
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
            timestamp: new Date(),
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
          setSharedChargeForDB,
          sharedPaymentMode
        );
      })();
    } else if (chatInput != "0") {
      let bankList: [] = [];
      setLoading(true);

      try {
        const bankNames = await fetchBankNames(
          chatInput.trim(),
          handleError,
          setLoading
        );
        bankList = bankNames["message"];

        if (Array.isArray(bankList)) {
          const bankNameList = bankList.map((bank: string) =>
            bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, "")
          );

          setSharedBankNames(bankNameList);
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
      if (chatInput === "1" || chatInput === "2") {
        displayEnterPhone(addChatMessages, nextStep);
      } else {
        let bank_name = "";
        let account_name = "";
        let account_number = "";

        setLoading(true);

        try {
          const bankData = await fetchBankDetails(
            sharedSelectedBankCode,
            chatInput.trim()
          );

          bank_name = bankData[0].bank_name;
          account_name = bankData[0].account_name;
          account_number = bankData[0].account_number;

          if (!account_number) {
            const newMessages: MessageType[] = [
              {
                type: "incoming",
                content: <span>Invalid account number. Please try again.</span>,
                timestamp: new Date(),
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
            account_number,
            sharedPaymentMode
          );
        } catch (error) {
          console.error("Failed to fetch bank data:", error);
          const errorMessage: MessageType[] = [
            {
              type: "incoming",
              content: (
                <span>
                  Failed to fetch bank data. Please check your accouunt number
                  and try again.
                </span>
              ),
              timestamp: new Date(),
            },
          ];
          addChatMessages(errorMessage);
          setLoading(false);
        }
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

  // final part to finish transaction
  const handleCryptoPayment = async (chatInput: string) => {
    const phoneNumber = chatInput.trim();

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      (() => {
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput != "0") {
      setLoading(true);

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
            timestamp: new Date(),
          },
        ];
        setLoading(false);
        addChatMessages(newMessages);
        return;
      }

      setSharedPhone(phoneNumber);

      const isGift = sharedPaymentMode.toLowerCase() === "claim gift";
      const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
      const requestPayment = sharedPaymentMode.toLowerCase() === "request";

      const network =
        sharedCrypto.toLowerCase() === "usdt"
          ? sharedNetwork.toLowerCase()
          : sharedCrypto.toLowerCase();

      if (!isGift && !requestPayment) {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <div className="flex flex-col items-center">
                <p className="mb-4">
                  Do you understand that you need to complete your payment
                  within <b>5 minutes</b>, otherwise you may lose your money.
                </p>

                <ConfirmAndProceedButton
                  phoneNumber={phoneNumber}
                  setLoading={setLoading}
                  sharedPaymentMode={sharedPaymentMode}
                  processTransaction={processTransaction}
                  network={network}
                />
              </div>
            ),
            timestamp: new Date(),
          },
        ];

        setLoading(false);
        addChatMessages(newMessages);
      } else {
        await processTransaction(
          phoneNumber,
          isGift,
          isGiftTrx,
          requestPayment
        );
      }
    } else {
      setLoading(false);
      console.log("User input not recognized");
    }
  };

  const processTransaction = async (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) => {
    // one last check is for USER WANT TO PAY REQUEST
    try {
      if (isGift) {
        // UPDATE THE USER GIFT PAYMENT DATA
        console.log("USER WANTS TO CLAIM GIFT");

        const giftStatus = (await isGiftValid(sharedGiftId)).user?.gift_status;
        const transactionStatus = (await isGiftValid(sharedGiftId)).user
          ?.status;

        try {
          const giftNotClaimed =
            giftStatus?.toLocaleLowerCase() === "not claimed" &&
            transactionStatus?.toLocaleLowerCase() === "successful";

          const giftClaimed =
            giftStatus?.toLocaleLowerCase() === "claimed" &&
            transactionStatus?.toLocaleLowerCase() === "successful";

          const paymentPending =
            giftStatus?.toLocaleLowerCase() === "not claimed" &&
            transactionStatus?.toLocaleLowerCase() === "processing";

          const giftNotPaid =
            giftStatus?.toLocaleLowerCase() === "cancel" &&
            transactionStatus?.toLocaleLowerCase() === "unsuccessful";

          if (giftNotClaimed) {
            const giftUpdateDate = {
              gift_chatID: sharedGiftId,
              acct_number: bankData.acct_number,
              bank_name: bankData.bank_name,
              receiver_name: bankData.receiver_name,
              receiver_phoneNumber: formatPhoneNumber(phoneNumber),
              gift_status: "Processing",
            };

            // Only update the status to "Claimed" if payoutMoney is successful
            // update the status to "Processing" and for the user to claim his gift
            await updateGiftTransaction(sharedGiftId, giftUpdateDate);

            setLoading(false);
            displayGiftFeedbackMessage(addChatMessages, nextStep);
            helloMenu("hi");
          } else if (giftClaimed) {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: "This gift is already claimed",
                timestamp: new Date(),
              },
            ]);
            helloMenu("hi");
            goToStep("start");
          } else if (paymentPending) {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: (
                  <span>
                    We are yet to confirm the crypto payment <br />
                    Please check again later.
                  </span>
                ),
                timestamp: new Date(),
              },
              {
                type: "incoming",
                content:
                  "If it persists, it could be that the gifter has not sent the asset yet.",
                timestamp: new Date(),
              },
            ]);
            helloMenu("hi");
            goToStep("start");
          } else if (giftNotPaid) {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: (
                  <span>
                    This gift has been canceled. <br />
                    You have to contact your gifter to do the transaction again.
                  </span>
                ),
                timestamp: new Date(),
              },
            ]);
            helloMenu("hi");
            goToStep("start");
          } else {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: (
                  <span>
                    We have an issue determining this gift status.
                    <br />
                    You have to reach our customer support.
                  </span>
                ),
                timestamp: new Date(),
              },
            ]);
            helloMenu("hi");
            goToStep("start");
          }
        } catch (error) {
          console.error("Error during gift claim process:", error);

          // Rollback or retain the transaction status in case of failure
          await updateGiftTransaction(sharedGiftId, {
            gift_status: giftStatus,
          });

          setLoading(false);
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>Sorry, the transaction failed. Please try again.</span>
              ),
              timestamp: new Date(),
            },
          ]);
          displayEnterId(addChatMessages, nextStep, sharedPaymentMode);
        }
      } else if (isGiftTrx) {
        console.log("USER WANTS TO SEND GIFT");
        const transactionID = generateTransactionId();
        setSharedTransactionId(transactionID.toString());
        window.localStorage.setItem("transactionID", transactionID.toString());
        const giftID = generateGiftId();
        setSharedGiftId(giftID.toString());
        window.localStorage.setItem("giftID", giftID.toString());

        // Add validation
        if (
          !sharedPaymentAssetEstimate ||
          isNaN(parseFloat(sharedPaymentAssetEstimate))
        ) {
          console.error(
            "Invalid sharedPaymentAssetEstimate:",
            sharedPaymentAssetEstimate
          );
          setLoading(false);
          addChatMessages([
            {
              type: "incoming",
              content:
                "There was an error calculating the payment amount. Please try again.",
              timestamp: new Date(),
            },
          ]);
          setLoading(false);
          return;
        }
        const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedCrypto} `;
        const date = getFormattedDateTime();
        console.log("sharedPaymentNairaEstimate", sharedPaymentNairaEstimate);

        displaySendPayment(
          addChatMessages,
          nextStep,
          activeWallet ?? "",
          sharedCrypto,
          sharedPaymentAssetEstimate,
          sharedPaymentNairaEstimate,
          transactionID,
          sharedNetwork,
          sharedPaymentMode,
          giftID,
          lastAssignedTime
        );

        console.log("User data created", activeWallet);

        setLoading(false);
        console.log("testing for gift:", sharedPaymentNairaEstimate);
        // let's save the transaction details to db
        const userDate = {
          crypto: sharedCrypto,
          network: sharedNetwork,
          estimation: sharedEstimateAsset,
          Amount: parseFloat(sharedPaymentAssetEstimate).toFixed(8).toString(),
          charges: sharedChargeForDB,
          mode_of_payment: sharedPaymentMode,
          acct_number: null,
          bank_name: null,
          receiver_name: null,
          receiver_amount: formatCurrency(
            sharedPaymentNairaEstimate,
            "NGN",
            "en-NG"
          ),
          crypto_sent: paymentAsset,
          wallet_address: activeWallet,
          Date: date,
          status: "Processing",
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          gift_chatID: giftID.toString(),
          settle_walletLink: null,
          chat_id: chatId,
          current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
          merchant_rate: merchantRate,
          profit_rate: profitRate,
          name: null,
          gift_status: "Not Claimed",
          asset_price:
            sharedCrypto.toLowerCase() != "usdt"
              ? formatCurrency(sharedAssetPrice, "USD")
              : formatCurrency(sharedRate, "NGN", "en-NG"),
        };
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });

        console.log("User gift data created", userDate);
      } else if (requestPayment) {
        console.log("USER WANTS TO DO A REQUEST TRANSACTION");
        if (sharedGiftId) {
          const requestStatus = (await checkRequestExists(sharedGiftId)).exists;
          if (requestStatus) {
          }
        }

        console.log("USER WANTS TO REQUEST PAYMENT");

        // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
        const transactionID = generateTransactionId();
        const requestID = generateTransactionId();
        setSharedTransactionId(transactionID.toString());
        window.localStorage.setItem("transactionID", transactionID.toString());
        const date = getFormattedDateTime();

        setLoading(false);
        console.log("testing for request crypto:", sharedPaymentNairaEstimate);
        // let's save the transaction details to db
        const userDate = {
          crypto: null,
          network: null,
          estimation: sharedEstimateAsset,
          Amount: null,
          charges: null,
          mode_of_payment: sharedPaymentMode,
          acct_number: bankData.acct_number,
          bank_name: bankData.bank_name,
          receiver_name: bankData.receiver_name,
          receiver_amount: formatCurrency(
            sharedPaymentNairaEstimate,
            // "200000",
            "NGN",
            "en-NG"
          ),
          crypto_sent: null,
          wallet_address: null,
          Date: date,
          status: "Processing",
          receiver_phoneNumber: formatPhoneNumber(phoneNumber),
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          request_id: requestID.toString(),
          settle_walletLink: "",
          chat_id: chatId,
          current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
          merchant_rate: merchantRate,
          profit_rate: profitRate,
          name: "",
          asset_price:
            sharedCrypto.toLowerCase() != "usdt"
              ? formatCurrency(sharedAssetPrice, "USD")
              : formatCurrency(sharedRate, "NGN", "en-NG"),
        };
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });

        console.log("request payment data created", userDate);
        // nextStep("start");
        // helloMenu("hi");
        displaySendPayment(
          addChatMessages,
          nextStep,
          activeWallet ?? "",
          sharedCrypto,
          sharedPaymentAssetEstimate,
          sharedPaymentNairaEstimate,
          transactionID,
          sharedNetwork,
          sharedPaymentMode,
          requestID,
          lastAssignedTime
        );
        setLoading(false);
        nextStep("start");
        helloMenu("hi");
      } else {
        console.log("USER WANTS TO MAKE A REGULAR TRX");
        const transactionID = generateTransactionId();
        setSharedTransactionId(transactionID.toString());
        window.localStorage.setItem("transactionID", transactionID.toString());
        if (
          !sharedPaymentAssetEstimate ||
          isNaN(parseFloat(sharedPaymentAssetEstimate))
        ) {
          console.error(
            "Invalid sharedPaymentAssetEstimate:",
            sharedPaymentAssetEstimate
          );
          setLoading(false);
          addChatMessages([
            {
              type: "incoming",
              content:
                "There was an error calculating the payment amount. Please try again.",
              timestamp: new Date(),
            },
          ]);
          setLoading(false);
          return;
        }

        const paymentAsset = ` ${parseFloat(sharedPaymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedCrypto} `;
        const date = getFormattedDateTime();

        displaySendPayment(
          addChatMessages,
          nextStep,
          activeWallet ?? "",
          sharedCrypto,
          sharedPaymentAssetEstimate,
          sharedPaymentNairaEstimate,
          transactionID,
          sharedNetwork,
          sharedPaymentMode,
          0,
          lastAssignedTime
        );

        console.log("Just to know that the wallet is available ", activeWallet);
        console.log("The ref code for this transaction is", code);
        console.log(
          "sharedPaymentNairaEstimate is",
          sharedPaymentNairaEstimate
        );
        console.log("sharedAssetPrice is", sharedAssetPrice);
        console.log("sharedRate is", sharedRate);
        console.log("The ref code for this transaction is", code);
        console.log(
          "sharedPaymentNairaEstimate is",
          sharedPaymentNairaEstimate
        );
        console.log("sharedAssetPrice is", sharedAssetPrice);
        console.log("sharedRate is", sharedRate);
        setLoading(false);
        console.log("testing for transact crypto:", sharedPaymentNairaEstimate);
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
          wallet_address: activeWallet,
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
          asset_price:
            sharedCrypto.toLowerCase() != "usdt"
              ? formatCurrency(sharedAssetPrice, "USD")
              : formatCurrency(sharedRate, "NGN", "en-NG"),
        };
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });
        await createTransaction(userDate).then(() => {
          // clear the ref code from the cleint

          localStorage.removeItem("referralCode");
          localStorage.removeItem("referralCategory");
        });

        console.log("User data created", userDate);
      }
    } catch (error) {
      console.error("Error during transaction", error);
    }
  };

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
            timestamp: new Date(),
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

  // ALLOW USER TO START A NEW TRANSACTION OR CONTACT SUPPORT
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
          timestamp: new Date(),
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
          timestamp: new Date(),
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
          timestamp: new Date(),
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
          timestamp: new Date(),
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
      const transactionExists = (await checkTranscationExists(transaction_id))
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
            timestamp: new Date(),
          },
        ]);
      }
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
            timestamp: new Date(),
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
            timestamp: new Date(),
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
          timestamp: new Date(),
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
      displayEnterId(addChatMessages, nextStep, "Claim Gift");
      setSharedPaymentMode("Claim Gift");
    } else if (chatInput === "3") {
      displayEnterId(addChatMessages, nextStep, "request");
      setSharedPaymentMode("request");
    }
  };

  // CUSTOMER TRANSACTION ID SEQUENCE FUNCTIONS

  // ALLOW USERS ENTER GIFT ID
  const handleGiftRequestId = async (chatInput: string) => {
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
      const needed_id = chatInput.trim();
      setLoading(true);
      setSharedGiftId(chatInput.trim());

      try {
        let giftExists = false;
        let requestExists = false;

        // Check if it's a gift or request
        if (sharedPaymentMode === "Claim Gift") {
          giftExists = (await checkGiftExists(needed_id)).exists;
        } else {
          requestExists = (await checkRequestExists(needed_id)).exists;
        }

        const idExists = giftExists || requestExists;

        console.log("gift is processing");

        // IF GIFT_ID EXIST IN DB,
        if (idExists) {
          if (giftExists) {
            // Handle gift exists case
            displayGiftFeedbackMessage(addChatMessages, nextStep);
            helloMenu("hi");
          } else if (requestExists) {
            // Handle request exists case
            // displayRequestFeedbackMessage(addChatMessages, nextStep);
            displayTransferMoney(addChatMessages);
            nextStep("estimateAsset");
          }
        } else {
          addChatMessages([
            {
              type: "incoming",
              content: `Invalid ${
                sharedPaymentMode === "Claim Gift" ? "gift" : "request"
              }_id. Try again`,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        addChatMessages([
          {
            type: "incoming",
            content: "Error checking ID. Please try again.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  // CUSTOMER REPORTLY SEQUENCE FUNCTIONS

  // first page for reportly, with 3 options and goBack
  const handleReportlyWelcome = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        welcomeMenu();
      })();
    } else if (chatInput === "1") {
      setSharedReportlyReportType("Track Transaction");
      console.log("Omo, na to report Track Transaction, input is: ", chatInput);
      displayReportlyName(addChatMessages, nextStep);
    } else if (chatInput === "2") {
      console.log("Omo, na to report Stolen funds, input is: ", chatInput);
      setSharedReportlyReportType("Stolen funds | disappear funds");
      displayReportlyName(addChatMessages, nextStep);
    } else if (chatInput === "3") {
      console.log("Omo, na to report Fraud, input is: ", chatInput);
      setSharedReportlyReportType("Fraud");
      displayReportlyName(addChatMessages, nextStep);
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

  const handleReporterName = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput === "1") {
      setSharedReportlyReportType("Track Transaction");
      console.log("Omo, na to report Track Transaction");
      displayReportlyName(addChatMessages, nextStep);
    } else if (chatInput === "2") {
      console.log("Omo, na to report Stolen funds");
      setSharedReportlyReportType("Stolen funds | disappear funds");
      displayReportlyName(addChatMessages, nextStep);
    } else if (chatInput === "3") {
      console.log("Omo, na to report Fraud");

      setSharedReportlyReportType("Fraud");
      displayReportlyName(addChatMessages, nextStep);
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
  // Option to allow user tract transaction, enter name or goBack to the very start
  const handleEnterReporterPhoneNumber = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        goToStep("reporterName");
        displayReportlyName(addChatMessages, nextStep);
      })();
    } else {
      const name = chatInput.trim();

      if (name === "") {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Please enter a your name. You can not summit an empty space
              </span>
            ),
            timestamp: new Date(),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
      setReporterName(chatInput.trim());
      console.log(`Full name is ${reporterName}`);
      displayReportlyPhoneNumber(addChatMessages, nextStep);
    }
  };

  const handleEnterReporterWalletAddress = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayReportlyName(addChatMessages, nextStep);
      })();
    } else {
      let phoneNumber = chatInput.trim();
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
            timestamp: new Date(),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
      setReporterPhoneNumber(phoneNumber);
      console.log(`Reporter phone number  is ${reporterPhoneNumber}`);
      displayReportlyReporterWalletAddress(addChatMessages, nextStep);
    }
  };

  const handleEnterFraudsterWalletAddress = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayReportlyPhoneNumber(addChatMessages, nextStep);
      })();
    } else {
      const wallet = chatInput.trim();
      const lastReportId = async () => {
        try {
          const lastReportId = await getLastReportId();
          const lastId = getNextReportID(lastReportId);
          const report_id = `Report_${lastId}`;

          setReportId(report_id);
        } catch (e) {
          console.log("we got into a challenge bro", e);
        }
      };
      lastReportId();
      if (!isValidWalletAddress(wallet)) {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Please enter a valid wallet address, <b>{wallet}</b> is not a
                valid wallet address.
              </span>
            ),
            timestamp: new Date(),
          },
        ];
        addChatMessages(newMessages);
        return;
      }
      setReporterWalletAddress(wallet);

      displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
    }
  };

  const handleReportlyNote = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayReportlyReporterWalletAddress(addChatMessages, nextStep);
      })();
    } else if (chatInput.trim() === "1") {
      (() => {
        goToStep("reportlyNote");
        displayReportlyNote(addChatMessages, nextStep);
      })();
    } else {
      const wallet = chatInput.trim();
      if (!isValidWalletAddress(wallet)) {
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Please enter a valid wallet address, <b>{wallet}</b> is not a
                valid wallet address.
              </span>
            ),
            timestamp: new Date(),
          },
        ];
        addChatMessages(newMessages);
        return;
      }

      setFraudsterWalletAddress(wallet);
      displayReportlyNote(addChatMessages, nextStep);
    }
  };

  const handleReporterFarwell = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      console.log("Going back to start");
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      (() => {
        console.log("Going back from handleReportlyWelcome");
        goToStep("start");
        helloMenu("hi");
      })();
    } else if (chatInput.trim() === "0") {
      (() => {
        prevStep();
        displayReportlyFraudsterWalletAddress(addChatMessages, nextStep);
      })();
    } else {
      const note = chatInput.trim();

      const wordCount = countWords(note);

      if (!(wordCount <= 100)) {
        console.log("word count is: ", wordCount);
        const newMessages: MessageType[] = [
          {
            type: "incoming",
            content: (
              <span>
                Please enter a note within the specified word count. Your note
                is {wordCount} words long. The maximum allowed is 100 words.
              </span>
            ),
            timestamp: new Date(),
          },
        ];
        addChatMessages(newMessages);
        return;
      }

      setDescriptionNote(note);
      const reportData: reportData = {
        name: reporterName,
        phone_Number: formatPhoneNumber(reporterPhoneNumber),
        wallet_address: reporterWalletAddress,
        fraudster_wallet_address: fraudsterWalletAddress,
        description: note,
        complaint: sharedReportlyReportType,
        status: "pending",
        report_id: reportId,
        confirmer: "",
      };
      setLoading(true);
      try {
        await makeAReport(reportData);
        // re write write_report api to throw error if we get any response other than 200
        // if (response.status !== 200) {
        //   throw new Error(`API responded with status ${response.status}`);
        // }
        setReporterName("");
        setReporterPhoneNumber("");
        setReporterWalletAddress("");
        setFraudsterWalletAddress("");
        setDescriptionNote("");
        displayReportlyFarwell(addChatMessages, nextStep);
        helloMenu("hi");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                Aje!!, there was a issue saving the report.
                <br />
                Maybe check your internet and try again or say 'hi' to go to the
                start of the conversation
              </span>
            ),
            timestamp: new Date(),
          },
        ]);
        console.log("Aje!!, there was a issue saving the report", error);
      }
      return;
    }
  };

  // THE ROOT FUNCTION

  //   const handleConversation = async (chatInput: any) => {
  //     try {
  //       setLoading(true);
  //       if (chatInput.trim()) {
  //         const newMessage: MessageType = {
  //           type: "outgoing",
  //           content: <span>{chatInput}</span>,
  //           timestamp: new Date(),
  //         };
  //         addChatMessages([newMessage]);
  //         // setChatInput(""); //Removed as per update instruction
  //       }

  //       if (greetings.includes(chatInput.trim().toLowerCase())) {
  //         goToStep("start");
  //       }

  //       switch (currentStep) {
  //         case "start":
  //           console.log("current step is start");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           helloMenu(chatInput);
  //           setSharedPaymentMode("");
  //           break;

  //         case "chooseAction":
  //           console.log("current step is chooseAction");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           choiceMenu(chatInput);
  //           break;

  //         case "transactCrypto":
  //           console.log("current step is transactCrypto");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleMakeAChoice(chatInput);
  //           break;

  //         case "transferMoney":
  //           console.log("Current step is transferMoney ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleTransferMoney(chatInput);
  //           break;

  //         case "estimateAsset":
  //           console.log("Current step is estimateAsset ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleEstimateAsset(chatInput);
  //           break;

  //         case "network":
  //           console.log("Current step is network ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleNetwork(chatInput);
  //           break;

  //         case "payOptions":
  //           console.log("Current step is payOptions ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handlePayOptions(chatInput);
  //           break;

  //         case "charge":
  //           console.log("Current step is charge ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleCharge(chatInput);
  //           break;

  //         case "enterBankSearchWord":
  //           console.log("Current step is enterBankSearchWord");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           let wantsToClaimGift =
  //             sharedPaymentMode.toLowerCase() === "claim gift";
  //           let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
  //           let wantsToRequestPayment =
  //             sharedPaymentMode.toLowerCase() === "request";
  //           let wnatsToTransactCrypto =
  //             sharedPaymentMode.toLowerCase() === "transfermoney";

  //           wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
  //             ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
  //               console.log("PAYMENT MODE IS:", sharedPaymentMode),
  //               handleSearchBank(chatInput))
  //             : (console.log(
  //                 "CURRENT STEP IS continueToPay IN enterBankSearchWord "
  //               ),
  //               console.log("PAYMENT MODE IS:", sharedPaymentMode),
  //               handleContinueToPay(chatInput));
  //           break;

  //         case "selectBank":
  //           console.log("Current step is selectBank ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleSelectBank(chatInput);
  //           break;

  //         case "enterAccountNumber":
  //           console.log("Current step is enterAccountNumber ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleBankAccountNumber(chatInput);
  //           break;

  //         case "continueToPay":
  //           console.log("Current step is continueToPay ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleContinueToPay(chatInput);
  //           break;

  //         case "enterPhone":
  //           console.log("Current step is enterPhone ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handlePhoneNumber(chatInput);
  //           break;

  //         case "sendPayment":
  //           console.log("Current step is sendPayment ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           await handleCryptoPayment(chatInput);
  //           break;

  //         case "confirmTransaction":
  //           console.log("Current step is confirmTransaction ");
  //           console.log(
  //             `sharedPaymentNairaEstimate is ${sharedPaymentNairaEstimate}`
  //           );
  //           handleConfirmTransaction(chatInput);
  //           break;

  //         case "paymentProcessing":
  //           console.log("Current step is paymentProcessing ");
  //           handleTransactionProcessing(chatInput);
  //           break;

  //         case "kycInfo":
  //           console.log("Current step is kycInfo ");
  //           handleKYCInfo(chatInput);
  //           break;

  //         case "kycReg":
  //           console.log("Current step is kycReg ");
  //           handleRegKYC(chatInput);
  //           break;

  //         case "thankForKYCReg":
  //           console.log("Current step is thankForKYCReg ");
  //           handleThankForKYCReg(chatInput);
  //           break;

  //         case "supportWelcome":
  //           console.log("Current step is supportWelcome ");
  //           displayCustomerSupportWelcome(addChatMessages, nextStep);
  //           break;

  //         case "assurance":
  //           console.log("Current step is assurance ");
  //           handleCustomerSupportAssurance(chatInput);
  //           break;

  //         case "entreTrxId":
  //           console.log("Current step is entreTrxId ");
  //           handleTransactionId(chatInput);
  //           break;

  //         case "makeComplain":
  //           console.log("Current step is makeComplain ");
  //           handleMakeComplain(chatInput);
  //           break;

  //         case "completeTransactionId":
  //           console.log("Current step is completeTransactionId ");
  //           handleCompleteTransactionId(chatInput);
  //           break;

  //         case "giftFeedBack":
  //           console.log("Current step is giftFeedBack ");
  //           handleGiftRequestId(chatInput);
  //           break;

  //         case "completetrxWithID":
  //           console.log("Current step is trxIDFeedback ");
  //           // handleReportlyWelcome(chatInput);
  //           break;

  //         case "makeReport":
  //           console.log("Current step is makeReport ");
  //           handleReportlyWelcome(chatInput);
  //           break;

  //         case "reporterName":
  //           console.log("Current step is reporterName ");
  //           handleReporterName(chatInput);
  //           break;

  //         case "reporterPhoneNumber":
  //           console.log("Current step is reporterPhoneNumber ");
  //           handleEnterReporterPhoneNumber(chatInput);
  //           break;

  //         case "reporterWallet":
  //           console.log("Current step is reporterWallet");
  //           handleEnterReporterWalletAddress(chatInput);
  //           break;

  //         case "fraudsterWallet":
  //           console.log("Current step is fraudsterWallet");
  //           handleEnterFraudsterWalletAddress(chatInput);
  //           break;

  //         case "reportlyNote":
  //           console.log("Current step is reportlyNote");
  //           handleReportlyNote(chatInput);
  //           break;

  //         case "reporterFarwell":
  //           console.log("Current step is reporterFarwell");
  //           handleReporterFarwell(chatInput);
  //           break;

  //         default:
  //           addChatMessages([
  //             {
  //               type: "incoming",
  //               content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
  //               timestamp: new Date(),
  //             },
  //           ]);
  //           break;
  //       }
  //     } catch (error) {
  //       handleError(
  //         error instanceof Error ? error.message : "An unknown error occurred"
  //       );
  //       addChatMessages([
  //         {
  //           type: "incoming",
  //           content:
  //             "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
  //           timestamp: new Date(),
  //         },
  //       ]);
  //     } finally {
  //       setLoading(false);
  //       setChatInput(""); //Added as per update instruction
  //     }
  //     // } catch (error) {
  //     //   handleError(error);
  //     // addChatMessages([
  //     //   {
  //     //     type: "incoming",
  //     //     content:
  //     //       "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
  //     //     timestamp: new Date(),
  //     //   },
  //     // ]);
  //     // }
  //   };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConversation(
        chatInput,
        currentStep,
        walletIsConnected,
        wallet,
        formattedRate,
        telFirstName ?? "",
        setLoading,
        addChatMessages,
        setChatInput,
        goToStep,
        nextStep,
        setSharedPaymentMode
      );

      //   handleConversation(chatInput);
    }
  };

  const renderDateSeparator = (date: Date) => {
    const now = new Date();
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);
    const monthsDiff = differenceInMonths(now, date);

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (daysDiff < 7) {
      return format(date, "EEEE");
    } else if (monthsDiff < 6) {
      return format(date, "EEE. d MMM");
    } else {
      return format(date, "d MMM, yyyy");
    }
  };

  useEffect(() => {
    if (chatMessages.length > 0) {
      const latestMessage = chatMessages[chatMessages.length - 1];
      const dateString = renderDateSeparator(new Date(latestMessage.timestamp));
      setCurrentDate(dateString);
      setShowDateDropdown(true);

      const timer = setTimeout(() => {
        setShowDateDropdown(false);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [chatMessages]);
  const groupedMessages = useMemo(
    () =>
      chatMessages.reduce((groups, message) => {
        const dateString = format(new Date(message.timestamp), "yyyy-MM-dd");
        if (!groups[dateString]) {
          groups[dateString] = [];
        }
        groups[dateString].push(message);
        return groups;
      }, {} as Record<string, MessageType[]>),
    [chatMessages]
  );

  // CHATBOT
  return isMobile ? (
    <div className="fixed inset-0 flex flex-col bg-white">
      <header className="py-4 text-center text-white bg-blue-500 shadow relative z-10">
        <div className="flex items-center justify-between px-4">
          <span className="flex-shrink-0 w-8 h-8 bg-white rounded">
            <Image
              src="/waaa.png"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded"
            />
          </span>
          <h2 className="text-lg font-bold">2SettleHQ</h2>
          <button
            onClick={onClose}
            className="text-white"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {showDateDropdown && currentDate && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-700 px-4 py-2 rounded-b-lg shadow-md text-sm transition-all duration-300 ease-in-out">
            {currentDate}
          </div>
        )}
      </header>
      <div className="flex-grow overflow-y-auto" ref={chatboxRef}>
        <ul className="p-4 space-y-4">
          {Object.entries(groupedMessages).map(([dateString, messages]) => (
            <React.Fragment key={dateString}>
              <li
                className={`date-separator text-center text-sm text-gray-500 my-2 ${
                  visibleDateSeparators.has(dateString) ? "" : "hidden"
                }`}
                data-date={dateString}
              >
                {renderDateSeparator(new Date(dateString))}
              </li>
              {chatMessages.map((msg, index) => (
                <li
                  key={`${dateString}-${index}`}
                  className={`flex ${
                    msg.type === "incoming" ? "items-start" : "justify-end"
                  }`}
                >
                  {msg.type === "incoming" && (
                    <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-white rounded self-end">
                      <Image
                        src="/waaa.png"
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </span>
                  )}
                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`p-2 md:p-3 rounded-lg ${
                        msg.type === "incoming"
                          ? "bg-gray-200 text-black rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      <p className="text-xs md:text-sm">{msg.content}</p>
                    </div>
                    <span
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.type === "incoming" ? "self-end" : "self-start"
                      }`}
                    >
                      {format(new Date(msg.timestamp), "h:mm a").toLowerCase()}
                    </span>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))}
          {loading && (
            <div className="flex items-center">
              <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 mt-2 bg-white rounded">
                <Image
                  src="/waaa.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </span>
              <div className="bg-gray-200 relative left-1 top-1 rounded-bl-none pr-2 pt-2 pl-2 pb-1 md:pr-4 md:pt-4 md:pl-3 md:pb-2 rounded-lg mr-12 md:mr-48">
                <div className="flex justify-start">
                  <Loader />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <textarea
            ref={textareaRef}
            className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
            placeholder="Enter a message..."
            rows={1}
            spellCheck={false}
            required
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="ml-2 text-blue-500 cursor-pointer"
            onClick={() =>
              handleConversation(
                chatInput,
                currentStep,
                walletIsConnected,
                wallet,
                formattedRate,
                telFirstName ?? "",
                setLoading,
                addChatMessages,
                setChatInput,
                goToStep,
                nextStep,
                setSharedPaymentMode
              )
            }
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div
      ref={chatboxRef}
      className={`fixed ${
        isMobile
          ? "inset-0 top-10"
          : "right-8 bottom-24 w-10/12 md:w-7/12 lg:w-6/12"
      } bg-white rounded-lg shadow-lg overflow-hidden flex flex-col`}
      style={{ height: isMobile ? "150%" : "80vh" }}
    >
      <header className="py-4 text-center text-white bg-blue-500 shadow relative z-10">
        <div className="flex items-center justify-between px-4">
          <span className="flex-shrink-0 w-8 h-8 bg-white rounded">
            <Image
              src="/waaa.png"
              alt="Avatar"
              width={32}
              height={32}
              className="rounded"
            />
          </span>
          <h2 className="text-lg font-bold">2SettleHQ</h2>
          <button
            onClick={onClose}
            className="text-white"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {showDateDropdown && currentDate && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-700 px-4 py-2 rounded-b-lg shadow-md text-sm transition-all duration-300 ease-in-out">
            {currentDate}
          </div>
        )}
      </header>
      <div className="flex-grow overflow-y-auto" ref={chatboxRef}>
        <ul className="p-4 space-y-4">
          {Object.entries(groupedMessages).map(([dateString, messages]) => (
            <React.Fragment key={dateString}>
              <li
                className={`date-separator text-center text-sm text-gray-500 my-2 ${
                  visibleDateSeparators.has(dateString) ? "" : "hidden"
                }`}
                data-date={dateString}
              >
                {renderDateSeparator(new Date(dateString))}
              </li>
              {chatMessages.map((msg, index) => (
                <li
                  key={`${dateString}-${index}`}
                  className={`flex ${
                    msg.type === "incoming" ? "items-start" : "justify-end"
                  }`}
                >
                  {msg.type === "incoming" && (
                    <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 bg-white rounded self-end">
                      <Image
                        src="/waaa.png"
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    </span>
                  )}
                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`p-2 md:p-3 rounded-lg ${
                        msg.type === "incoming"
                          ? "bg-gray-200 text-black rounded-bl-none"
                          : "bg-blue-500 text-white rounded-br-none"
                      }`}
                    >
                      <p className="text-xs md:text-sm">{msg.content}</p>
                    </div>
                    <span
                      className={`text-xs text-gray-500 mt-1 ${
                        msg.type === "incoming" ? "self-end" : "self-start"
                      }`}
                    >
                      {format(new Date(msg.timestamp), "h:mm a").toLowerCase()}
                    </span>
                  </div>
                </li>
              ))}
            </React.Fragment>
          ))}
          {loading && (
            <div className="flex items-center">
              <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-4 mt-2 bg-white rounded">
                <Image
                  src="/waaa.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded"
                />
              </span>
              <div className="bg-gray-200 relative left-1 top-1 rounded-bl-none pr-2 pt-2 pl-2 pb-1 md:pr-4 md:pt-4 md:pl-3 md:pb-2 rounded-lg mr-12 md:mr-48">
                <div className="flex justify-start">
                  <Loader />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </ul>
      </div>
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <textarea
            ref={textareaRef}
            className="flex-grow pl-2 pr-2 py-2 border-none outline-none resize-none"
            placeholder="Enter a message..."
            rows={1}
            spellCheck={false}
            required
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="ml-2 text-blue-500 cursor-pointer"
            onClick={() =>
              handleConversation(
                chatInput,
                currentStep,
                walletIsConnected,
                wallet,
                formattedRate,
                telFirstName ?? "",
                setLoading,
                addChatMessages,
                setChatInput,
                goToStep,
                nextStep,
                setSharedPaymentMode
              )
            }
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// export default ChatBot;
export default withErrorHandling(ChatBot);
// export default ChatBot;
// export default withErrorHandling(ChatBot);
