"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAccount } from "wagmi";
import { useSharedState } from "../../context/SharedStateContext";
import {
  checkGiftExists,
  checkRequestExists,
  createTransaction,
  fetchCoinPrice,
  isGiftValid,
  updateGiftTransaction,
} from "../../helpers/api_calls";
import { formatCurrency } from "../../helpers/format_currency";
import { getFormattedDateTime } from "../../helpers/format_date";
import { MessageType } from "../../types/general_types";
import {
  formatPhoneNumber,
  generateChatId,
  generateGiftId,
  generateTransactionId,
  getChatId,
  saveChatId,
} from "../../utils/utilities";
import ShortenedAddress from "../shared/ShortenAddress";

import {
  displaySendPayment,
  displayTransferMoney
} from "@/menus/transact_crypto";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { useChatNavigation } from "../../hooks/useChatNavigation";
import { displayCustomerSupportWelcome } from "../../menus/customer_support";
import {
  displayReportlyNote,
  displayReportlyPhoneNumber,
} from "../../menus/reportly";
import {
  displayEnterId,
  displayGiftFeedbackMessage,
  displayTransactIDWelcome,
} from "../../menus/transaction_id";

import {
  getLocalStorageData,
  saveLocalStorageData,
} from "@/features/chatbot/helpers/localStorageUtils";
import { ChatBotProps } from "@/types/chatbot_types";
import { telegramUser } from "@/types/telegram_types";
import ErrorBoundary from "../TelegramError";
import TelegramIntegration from "../TelegramIntegration";
import ChatHeader from "../chatbot/ChatHeader";
import ChatInput from "../chatbot/ChatInput";
import ChatMessages from "../chatbot/ChatMessages";
import { withErrorHandling } from "../withErrorHandling";

import {
  handleBankAccountNumber,
  handleSearchBank,
  handleSelectBank,
} from "@/features/chatbot/handlers/banking";
import {
  handleEnterFraudsterWalletAddress,
  handleEnterReporterPhoneNumber,
  handleEnterReporterWalletAddress,
  handleReporterFarwell,
  handleReporterName,
  handleReportlyNote,
  handleReportlyWelcome,
} from "@/features/chatbot/handlers/reportly";
import {
  handleCompleteTransactionId,
  handleCustomerSupportAssurance,
  handleKYCInfo,
  handleMakeComplain,
  handleRegKYC,
  handleThankForKYCReg,
  handleTransactionId,
} from "@/features/chatbot/handlers/support";
import {
  handleCharge,
  handleEstimateAsset,
  handleMakeAChoice,
  handleNetwork,
  handlePayOptions,
  handleTransferMoney,
} from "@/features/chatbot/handlers/transact";
import {
  handleConfirmTransaction,
  handleContinueToPay,
  handleCryptoPayment,
  handlePhoneNumber,
  handleTransactionProcessing,
} from "@/features/chatbot/handlers/transactionClosing";
import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
import { getRates } from "@/services/chatBotService";
// import { helloMenu } from "@/features/chatbot/handlers/general";

const ChatBot: React.FC<ChatBotProps> = ({ isMobile, onClose, onError }) => {
  // CONST VARIABLES
  const account = useAccount();
  const wallet = account.address;
  let walletIsConnected = account.isConnected;

  const procesingStatus = "Processing";
  const cancelledStatus = "Cancel";
  const narration = "BwB quiz price";

  const chatboxRef = useRef<HTMLDivElement>(null);

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

  // REF HOOKS
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  let isETH =
    sharedNetwork.trim().toLowerCase() === "erc20" ||
    sharedNetwork.trim().toLowerCase() === "bep20";

  let ethConnect = walletIsConnected && isETH;

  // LOAD CHATS FROM LOCALSTORAGE
  const [local, setLocal] = useState(getLocalStorageData());
  useEffect(() => {
    const storageListener = () => {
      const chatData = window.localStorage.getItem("chat_data");
    };

    window.addEventListener("storage", storageListener);
    return () => window.removeEventListener("storage", storageListener);
  }, []);

  React.useEffect(() => {
    saveLocalStorageData(serializedMessages, currentStep, stepHistory);
  }, [serializedMessages, currentStep, stepHistory]);

  useEffect(() => {
    console.log("Loading top state changed:", loading);
  }, [loading]);

  // Load telegram data
  useEffect(() => {
    <TelegramIntegration />;
  }, []);

  const telFirstName = isTelUser ? telegramUser?.first_name : "";

  // set crypto asset price
  useEffect(() => {
    if (sharedCrypto != "") {
      if (sharedCrypto.trim().toLowerCase() === "usdt") {
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

  useEffect(() => {
    async function fetchData() {
      const rates = await getRates();
      if (rates) {
        // Batch state updates
        const updates = {
          rate: rates.fetchedRate.toString(),
          formattedRate: formatCurrency(
            rates.fetchedRate.toString(),
            "NGN",
            "en-NG"
          ),
          merchantRate: formatCurrency(
            rates.fetchedMerchantRate.toString(),
            "NGN",
            "en-NG"
          ),
          profitRate: formatCurrency(
            rates.fetchedProfitRate.toString(),
            "NGN",
            "en-NG"
          ),
        };
        console.log("Rate is:", rate);
        // Update all states at once
        setRate(updates.rate);
        setFormattedRate(updates.formattedRate);
        setMerchantRate(updates.merchantRate);
        setProfitRate(updates.profitRate);
        setSharedRate(updates.rate);
      }
    }
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
  async function processTransaction(
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) {
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
          ethConnect,
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

        console.log("request payment data created", userDate);

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
          ethConnect,
          lastAssignedTime
        );
        setLoading(false);
        nextStep("start");
        helloMenu("hi");
      } else {
        console.log("USER WANTS TO MAKE A REGULAR TRX");
        const transactionID = generateTransactionId();
        // React.useMemo(()=>getFormattedDateTime(), []);
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
        // React.useMemo(()=>getFormattedDateTime(), []);

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
          ethConnect,
          lastAssignedTime
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

        console.log("User data created", userDate);
      }
    } catch (error) {
      console.error("Error during transaction", error);
    }
  }

  // ALLOW USERS ENTER GIFT ID
  const handleGiftRequestId = async (chatInput: string) => {
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

  // THE ROOT FUNCTION

  const handleConversation = async (chatInput: any) => {
    setLoading(true);
    try {
      if (chatInput.trim()) {
        const newMessage: MessageType = {
          type: "outgoing",
          content: <span>{chatInput}</span>,
          timestamp: new Date(),
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
          setSharedPaymentMode("");
          break;

        case "chooseAction":
          console.log("current step is chooseAction");

          choiceMenu(chatInput);
          setChatInput("");
          break;

        case "transactCrypto":
          console.log("current step is transactCrypto");

          handleMakeAChoice(
            addChatMessages,
            chatInput,
            walletIsConnected,
            wallet,
            telFirstName || "",
            nextStep,
            prevStep,
            goToStep,
            setSharedPaymentMode
          );
          setChatInput("");
          break;

        case "transferMoney":
          console.log("Current step is transferMoney ");

          handleTransferMoney(
            addChatMessages,
            chatInput,
            walletIsConnected,
            wallet,
            telFirstName || "",
            sharedPaymentMode,
            sharedRate,
            nextStep,
            prevStep,
            goToStep,
            setSharedPaymentMode,
            setSharedWallet,
            setSharedEstimateAsset
          );
          setChatInput("");
          break;

        case "estimateAsset":
          console.log("Current step is estimateAsset ");

          handleEstimateAsset(
            addChatMessages,
            chatInput,
            walletIsConnected,
            wallet,
            telFirstName || "",
            sharedPaymentMode,
            nextStep,
            prevStep,
            goToStep,
            setSharedPaymentMode,
            setSharedTicker,
            setSharedCrypto,
            setSharedNetwork
          );
          setChatInput("");
          break;

        case "network":
          console.log("Current step is network ");

          handleNetwork(
            addChatMessages,
            chatInput,
            sharedPaymentMode,
            sharedGiftId,
            nextStep,
            prevStep,
            goToStep,
            setSharedTicker,
            setSharedCrypto,
            setSharedNetwork
          );
          setChatInput("");
          break;

        case "payOptions":
          console.log("Current step is payOptions ");

          handlePayOptions(
            addChatMessages,
            chatInput,
            sharedPaymentMode,
            sharedCrypto,
            sharedNetwork,
            sharedRate,
            sharedTicker,
            sharedAssetPrice,
            nextStep,
            prevStep,
            goToStep,
            setSharedEstimateAsset
          );
          setChatInput("");
          break;

        case "charge":
          console.log("Current step is charge ");

          handleCharge(
            addChatMessages,
            chatInput,
            sharedPaymentMode,
            sharedEstimateAsset,
            sharedCrypto,
            sharedNetwork,
            sharedRate,
            sharedAssetPrice,
            nextStep,
            prevStep,
            goToStep,
            setSharedAmount,
            setSharedCharge,
            setSharedPaymentAssetEstimate,
            setSharedPaymentNairaEstimate,
            setSharedNairaCharge,
            setSharedChargeForDB
          );
          setChatInput("");
          break;

        case "enterBankSearchWord":
          console.log("Current step is enterBankSearchWord");
          let wantsToClaimGift =
            sharedPaymentMode.toLowerCase() === "claim gift";
          let wantsToSendGift = sharedPaymentMode.toLowerCase() === "gift";
          let wantsToRequestPayment =
            sharedPaymentMode.toLowerCase() === "request";
          let wnatsToTransactCrypto =
            sharedPaymentMode.toLowerCase() === "transfermoney";

          wantsToClaimGift || wnatsToTransactCrypto || wantsToRequestPayment
            ? (console.log("CURRENT STEP IS search IN enterBankSearchWord "),
              handleSearchBank(
                addChatMessages,
                chatInput,
                sharedCharge,
                sharedPaymentMode,
                sharedCrypto,
                sharedPaymentAssetEstimate,
                sharedRate,
                sharedPaymentNairaEstimate,
                sharedAssetPrice,
                sharedEstimateAsset,
                sharedNairaCharge,
                nextStep,
                prevStep,
                goToStep,
                setSharedGiftId,
                setSharedPaymentAssetEstimate,
                setSharedPaymentNairaEstimate,
                setSharedChargeForDB,
                setLoading
              ))
            : (console.log(
                "CURRENT STEP IS continueToPay IN enterBankSearchWord "
              ),
              handleContinueToPay(
                addChatMessages,
                chatInput,
                sharedSelectedBankCode,
                sharedSelectedBankName,
                sharedPaymentMode,
                nextStep,
                prevStep,
                goToStep,
                updateBankData,
                setLoading
              ));
          setChatInput("");
          break;

        case "selectBank":
          console.log("Current step is selectBank ");
          handleSelectBank(
            addChatMessages,
            chatInput,
            sharedPaymentMode,
            sharedCrypto,
            sharedAmount,
            sharedRate,
            sharedAssetPrice,
            sharedEstimateAsset,
            nextStep,
            prevStep,
            goToStep,
            setSharedBankNames,
            setSharedPaymentAssetEstimate,
            setSharedPaymentNairaEstimate,
            setSharedChargeForDB,
            setSharedCharge,
            setSharedNairaCharge,
            setSharedBankCodes,
            setLoading
          );
          setChatInput("");
          break;

        case "enterAccountNumber":
          console.log("Current step is enterAccountNumber ");
          handleBankAccountNumber(
            addChatMessages,
            chatInput,
            sharedBankCodes,
            sharedBankNames,
            nextStep,
            prevStep,
            goToStep,
            setSharedBankCodes,
            setSharedSelectedBankCode,
            setSharedSelectedBankName
          );
          setChatInput("");
          break;

        case "continueToPay":
          console.log("Current step is continueToPay ");

          handleContinueToPay(
            addChatMessages,
            chatInput,
            sharedSelectedBankCode,
            sharedSelectedBankName,
            sharedPaymentMode,
            nextStep,
            prevStep,
            goToStep,
            updateBankData,
            setLoading
          );
          setChatInput("");
          break;

        case "enterPhone":
          console.log("Current step is enterPhone ");

          handlePhoneNumber(
            addChatMessages,
            chatInput,
            nextStep,
            prevStep,
            goToStep
          );
          setChatInput("");
          break;

        case "sendPayment":
          console.log("Current step is sendPayment ");

          await handleCryptoPayment(
            addChatMessages,
            chatInput,
            sharedCrypto,
            sharedNetwork,
            sharedPaymentMode,
            ethConnect,
            sharedPaymentAssetEstimate,
            setSharedPhone,
            processTransaction,
            goToStep,
            setLoading
          );
          setChatInput("");
          break;

        case "confirmTransaction":
          console.log("Current step is confirmTransaction ");

          handleConfirmTransaction(
            addChatMessages,
            chatInput,
            sharedTransactionId,
            procesingStatus,
            cancelledStatus,
            nextStep,
            goToStep,
            setSharedTransactionId,
            setLoading
          );
          setChatInput("");

          break;

        case "paymentProcessing":
          console.log("Current step is paymentProcessing ");
          handleTransactionProcessing(
            addChatMessages,
            chatInput,
            nextStep,
            prevStep,
            goToStep
          );
          setChatInput("");
          break;

        case "kycInfo":
          console.log("Current step is kycInfo ");
          handleKYCInfo(addChatMessages, chatInput, nextStep, goToStep);
          setChatInput("");
          break;

        case "kycReg":
          console.log("Current step is kycReg ");
          handleRegKYC(addChatMessages, chatInput, nextStep, goToStep);
          setChatInput("");
          break;

        case "thankForKYCReg":
          console.log("Current step is thankForKYCReg ");
          handleThankForKYCReg(addChatMessages, chatInput, nextStep, goToStep);
          setChatInput("");
          break;

        case "supportWelcome":
          console.log("Current step is supportWelcome ");
          displayCustomerSupportWelcome(addChatMessages, nextStep);
          setChatInput("");
          break;

        case "assurance":
          console.log("Current step is assurance ");
          handleCustomerSupportAssurance(
            addChatMessages,
            chatInput,
            nextStep,
            prevStep,
            goToStep
          );
          setChatInput("");
          break;

        case "entreTrxId":
          console.log("Current step is entreTrxId ");
          handleTransactionId(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            setSharedTransactionId,
            setLoading
          );

          setChatInput("");
          break;

        case "makeComplain":
          console.log("Current step is makeComplain ");
          handleMakeComplain(
            addChatMessages,
            chatInput,
            sharedTransactionId,
            goToStep,
            goToStep,
            prevStep,
            setLoading
          );
          setChatInput("");
          break;

        case "completeTransactionId":
          console.log("Current step is completeTransactionId ");
          handleCompleteTransactionId(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            prevStep,
            setSharedPaymentMode
          );
          setChatInput("");
          break;

        case "giftFeedBack":
          console.log("Current step is giftFeedBack ");
          handleGiftRequestId(chatInput);
          setChatInput("");
          break;

        case "completetrxWithID":
          console.log("Current step is trxIDFeedback ");
          // handleReportlyWelcome(chatInput);
          setChatInput("");
          break;

        case "makeReport":
          console.log("Current step is makeReport ");
          handleReportlyWelcome(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            prevStep,
            setSharedReportlyReportType
          );
          setChatInput("");
          break;

        case "reporterName":
          console.log("Current step is reporterName ");
          handleReporterName(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            setSharedReportlyReportType
          );
          setChatInput("");
          break;

        case "reporterPhoneNumber":
          console.log("Current step is reporterPhoneNumber ");
          handleEnterReporterPhoneNumber(
            addChatMessages,
            chatInput,
            reporterName,
            nextStep,
            goToStep,
            setReporterName,
            displayReportlyPhoneNumber
          );
          setChatInput("");
          break;

        case "reporterWallet":
          console.log("Current step is reporterWallet");
          handleEnterReporterWalletAddress(
            addChatMessages,
            chatInput,
            reporterPhoneNumber,
            nextStep,
            goToStep,
            prevStep,
            setReporterPhoneNumber
          );
          setChatInput("");
          break;

        case "fraudsterWallet":
          console.log("Current step is fraudsterWallet");
          handleEnterFraudsterWalletAddress(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            prevStep,
            setReportId,
            setReporterWalletAddress,
            displayReportlyPhoneNumber
          );
          setChatInput("");
          break;

        case "reportlyNote":
          console.log("Current step is reportlyNote");
          handleReportlyNote(
            addChatMessages,
            chatInput,
            nextStep,
            goToStep,
            prevStep,
            setFraudsterWalletAddress,
            displayReportlyNote
          );
          setChatInput("");
          break;

        case "reporterFarwell":
          console.log("Current step is reporterFarwell");
          handleReporterFarwell(
            addChatMessages,
            chatInput,
            reporterName,
            reporterPhoneNumber,
            reporterWalletAddress,
            fraudsterWalletAddress,
            sharedReportlyReportType,
            reportId,
            nextStep,
            goToStep,
            prevStep,
            setDescriptionNote,
            setReporterPhoneNumber,
            setReporterWalletAddress,
            setFraudsterWalletAddress,
            setReporterName,
            setLoading
          );

          setChatInput("");
          break;

        default:
          addChatMessages([
            {
              type: "incoming",
              content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
              timestamp: new Date(),
            },
          ]);
          setChatInput("");
          break;
      }

      // const trimmedInput = chatInput.trim();
      // if (!trimmedInput) return;

      // const newMessage: MessageType = {
      //   type: "incoming",
      //   content: trimmedInput,
      //   timestamp: new Date(),
      // };
      // addChatMessages([newMessage]);
      // setChatInput("");
      // if (greetings.includes(trimmedInput.toLowerCase())) {
      //   goToStep("start");
      //   return;
      // }

      // if (StepHandler[currentStep]) {
      //   await StepHandler[currentStep](trimmedInput);
      // } else {
      //   addChatMessages([
      //     {
      //       type: "incoming",
      //       content:
      //         "Invalid choice. You can say 'Hi' or 'Hello' to start over",
      //       timestamp: new Date(),
      //     },
      //   ]);
      // }
    } catch (error) {
      console.error("Error in conversation:", error);
      onError?.(
        error instanceof Error ? error : new Error("An unknown error occurred")
      );
      addChatMessages([
        {
          type: "incoming",
          content:
            "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConversation(chatInput);
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

  // centralize the date seperator badge for both mobile and desktop
  const dateSeperatorBadge = (dateString: string) => {
    return (
      <li
        className={`date-separator text-center text-sm text-gray-900 my-2 mx-auto bg-gray-200 w-fit rounded-lg px-4 py-1 `}
        data-date={dateString}
      >
        {renderDateSeparator(new Date(dateString))}
      </li>
    );
  };

  // CHATBOT
  return (
    <ErrorBoundary>
      {isMobile ? (
        <div className="fixed inset-0 flex flex-col bg-white">
          <ChatHeader
            onClose={onClose}
            showDateDropdown={showDateDropdown}
            currentDate={currentDate}
          />
          <ChatMessages
            groupedMessages={groupedMessages}
            chatMessages={chatMessages}
            loading={loading}
            dateSeperatorBadge={dateSeperatorBadge}
            messagesEndRef={messagesEndRef}
            chatboxRef={chatboxRef}
          />

          <ChatInput
            textareaRef={textareaRef}
            onChange={(e) => setChatInput(e.target.value)}
            handleKeyPress={handleKeyPress}
            handleConversation={() => handleConversation(chatInput)}
            chatInput={chatInput}
          />
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
          <ChatHeader
            onClose={onClose}
            showDateDropdown={showDateDropdown}
            currentDate={currentDate}
          />
          <ChatMessages
            groupedMessages={groupedMessages}
            chatMessages={chatMessages}
            loading={loading}
            dateSeperatorBadge={dateSeperatorBadge}
            messagesEndRef={messagesEndRef}
            chatboxRef={chatboxRef}
          />
          <ChatInput
            textareaRef={textareaRef}
            onChange={(e) => setChatInput(e.target.value)}
            handleKeyPress={handleKeyPress}
            handleConversation={() => handleConversation(chatInput)}
            chatInput={chatInput}
          />
        </div>
      )}
    </ErrorBoundary>
  );
};

// export default ChatBot;
export default withErrorHandling(ChatBot);
