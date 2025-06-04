"use client";

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
  checkRequestExists,
  createTransaction,
  fetchCoinPrice,
  isGiftValid,
  updateGiftTransaction,
  updateRequest,
} from "../../helpers/api_calls";
import { formatCurrency } from "../../helpers/format_currency";
import { getFormattedDateTime } from "../../helpers/format_date";
import type { MessageType } from "../../types/general_types";
import {
  formatPhoneNumber,
  generateChatId,
  generateGiftId,
  generateTransactionId,
  getChatId,
  saveChatId,
} from "../../utils/utilities";

import { displaySendPayment } from "@/menus/transact_crypto";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  format,
  isToday,
  isYesterday,
} from "date-fns";
import { useChatNavigation } from "../../hooks/useChatNavigation";
import {
  displayEnterId,
  displayGiftFeedbackMessage,
} from "../../menus/transaction_id";

import {
  getLocalStorageData,
  saveLocalStorageData,
} from "@/features/chatbot/helpers/localStorageUtils";
import type { ChatBotProps } from "@/types/chatbot_types";
import type { telegramUser } from "@/types/telegram_types";
import ErrorBoundary from "../TelegramError";
import TelegramIntegration from "../TelegramIntegration";
import ChatHeader from "../chatbot/ChatHeader";
import ChatInput from "../chatbot/ChatInput";
import ChatMessages from "../chatbot/ChatMessages";
import { withErrorHandling } from "../withErrorHandling";

import { helloMenu } from "@/features/chatbot/handlers/general";
import { handleConversation } from "@/features/chatbot/handlers/handleConversations";
import { getRates } from "@/services/chatBotService";
import { useBTCWallet } from "@/hooks/stores/btcWalletStore";
import type { WalletAddress } from "@/lib/wallets/types";
import useTronWallet from "@/hooks/stores/tronWalletStore";

const ChatBot: React.FC<ChatBotProps> = ({ isMobile, onClose, onError }) => {
  // CONST VARIABLES
  const { paymentAddress: btcWalletAddress, isConnected: isBTCConnected } =
    useBTCWallet();
  const { connected: isTronConnected, walletAddress: tronWalletAddress } =
    useTronWallet();
  const account = useAccount();

  console.log("Tron Account address:", tronWalletAddress);
  const wallet =
    account.address ||
    (btcWalletAddress as WalletAddress) ||
    (tronWalletAddress as WalletAddress);

  console.log("Connected Account address:", wallet);

  const procesingStatus = "Processing";
  const cancelledStatus = "Cancel";
  const narration = "BwB quiz price";

  const chatboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
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
  const walletIsConnected =
    account.isConnected || isBTCConnected || isTronConnected;

  // REF HOOKS
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isETH =
    sharedNetwork.trim().toLowerCase() === "erc20" ||
    sharedNetwork.trim().toLowerCase() === "bep20";

  const ethConnect = walletIsConnected || (walletIsConnected && isETH);

  // LOAD CHATS FROM LOCALSTORAGE
  // const [local, setLocal] = '
  useState(getLocalStorageData());
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
    const trxID = window.localStorage.getItem("transactionID");
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

  async function processTransaction(
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) {
    // Add a transaction lock to prevent multiple calls
    const transactionLockKey = `transaction_in_progress_${Date.now()}`;

    // Check if there's already a transaction in progress
    if (localStorage.getItem("transaction_in_progress")) {
      console.log("Transaction already in progress, ignoring request");
      return;
    }

    // Set the lock
    localStorage.setItem("transaction_in_progress", transactionLockKey);

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
            helloMenu(
              addChatMessages,
              "hi",
              nextStep,
              walletIsConnected,
              wallet,
              telFirstName,
              setSharedPaymentMode
            );
          } else if (giftClaimed) {
            setLoading(false);
            addChatMessages([
              {
                type: "incoming",
                content: "This gift is already claimed",
                timestamp: new Date(),
              },
            ]);
            helloMenu(
              addChatMessages,
              "hi",
              nextStep,
              walletIsConnected,
              wallet,
              telFirstName,
              setSharedPaymentMode
            );
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
            helloMenu(
              addChatMessages,
              "hi",
              nextStep,
              walletIsConnected,
              wallet,
              telFirstName,
              setSharedPaymentMode
            );
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
            helloMenu(
              addChatMessages,
              "hi",
              nextStep,
              walletIsConnected,
              wallet,
              telFirstName,
              setSharedPaymentMode
            );
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
            // helloMenu("hi");
            helloMenu(
              addChatMessages,
              "hi",
              nextStep,
              walletIsConnected,
              wallet,
              telFirstName,
              setSharedPaymentMode
            );
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
          isNaN(Number.parseFloat(sharedPaymentAssetEstimate))
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
        const paymentAsset = ` ${Number.parseFloat(sharedPaymentAssetEstimate)
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
          ethConnect,
          giftID,
          0,
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
          Amount: Number.parseFloat(sharedPaymentAssetEstimate)
            .toFixed(8)
            .toString(),
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
        const request =
          sharedGiftId !== "" ? await checkRequestExists(sharedGiftId) : null;
        const requestExists = request?.exists;
        console.log("request exists", requestExists);
        if (request && requestExists) {
          console.log("we are fulfilling request!!!");
          const user = request.user;

          const recieverAmount = Number.parseInt(
            user?.receiver_amount?.replace(/[^\d.]/g, "") || "0"
          );
          const dollar = recieverAmount / Number.parseInt(sharedRate);
          const assetPrice =
            sharedCrypto.toLowerCase() != "usdt"
              ? sharedAssetPrice
              : sharedRate;
          // naira converted to asset
          const charge = calculateCharge(
            user?.receiver_amount || "0",
            sharedPaymentMode,
            sharedRate,
            assetPrice
          );

          console.log("Before we continue, charge is:", charge);
          const finalPayable = dollar / Number.parseFloat(assetPrice);
          const paymentAssetEstimate = (finalPayable + charge).toString();

          setSharedPaymentAssetEstimate(paymentAssetEstimate);
          setSharedPaymentNairaEstimate(user?.receiver_amount || "0");
          const paymentAsset = `${Number.parseFloat(paymentAssetEstimate)
            .toFixed(8)
            .toString()} ${sharedCrypto}`;

          const userDate = {
            crypto: sharedCrypto,
            network: sharedNetwork,
            estimation: sharedEstimateAsset,
            Amount: Number.parseFloat(paymentAssetEstimate).toFixed(8),
            charges: charge,
            mode_of_payment: user?.mode_of_payment,
            acct_number: user?.acct_number,
            bank_name: user?.bank_name,
            receiver_name: user?.receiver_name,
            receiver_amount: user?.receiver_amount,
            crypto_sent: paymentAsset,
            wallet_address: activeWallet,
            Date: user?.Date,
            status: "Processing",
            receiver_phoneNumber: user?.receiver_phoneNumber,
            customer_phoneNumber: formatPhoneNumber(phoneNumber),
            transac_id: user?.transac_id,
            request_id: user?.request_id,
            settle_walletLink: null,
            chat_id: user?.chat_id,
            current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
            merchant_rate: user?.merchant_rate,
            profit_rate: user?.profit_rate,
            name: null,
            asset_price:
              sharedCrypto.toLowerCase() != "usdt"
                ? formatCurrency(sharedAssetPrice, "USD")
                : formatCurrency(sharedRate, "NGN", "en-NG"),
          };

          console.log("UserData", userDate);
          await updateRequest(sharedGiftId, userDate);
          const transactionID = Number.parseInt(user?.transac_id || "0");
          const requestID = Number.parseInt(user?.request_id || "0");

          console.log(
            "Lets see sharedPaymentAssetEstimate ",
            paymentAssetEstimate
          );

          console.log(
            "Lets see sharedPaymentNairaEstimate ",
            user?.receiver_amount ?? "0"
          );

          displaySendPayment(
            addChatMessages,
            nextStep,
            activeWallet ?? "",
            sharedCrypto,
            paymentAssetEstimate,
            (user?.receiver_amount ?? "0").replace(/[^\d.]/g, ""),
            transactionID,
            sharedNetwork,
            sharedPaymentMode,
            ethConnect,
            0,
            requestID,
            lastAssignedTime
          );
          setLoading(false);
          nextStep("start");
          helloMenu(
            addChatMessages,
            "hi",
            nextStep,
            walletIsConnected,
            wallet,
            telFirstName,
            setSharedPaymentMode
          );
        } else {
          // if requestId exists, user is paying for a request, otherwise, user is requesting for a payment
          console.log("we are creating a requests!!!");
          const transactionID = generateTransactionId();
          const requestID = generateTransactionId();
          setSharedTransactionId(transactionID.toString());
          window.localStorage.setItem(
            "transactionID",
            transactionID.toString()
          );
          const date = getFormattedDateTime();

          setLoading(false);
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
              "NGN",
              "en-NG"
            ),
            crypto_sent: null,
            wallet_address: null,
            Date: date,
            status: "Processing",
            receiver_phoneNumber: formatPhoneNumber(phoneNumber),
            customer_phoneNumber: null,
            transac_id: transactionID.toString(),
            request_id: requestID.toString(),
            settle_walletLink: null,
            chat_id: chatId,
            current_rate: formatCurrency(sharedRate, "NGN", "en-NG"),
            merchant_rate: merchantRate,
            profit_rate: profitRate,
            name: null,
            asset_price: null,
          };

          await createTransaction(userDate).then(() => {
            // clear the ref code from the cleint
            localStorage.removeItem("referralCode");
            localStorage.removeItem("referralCategory");
          });

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
            ethConnect,
            0,
            requestID,
            lastAssignedTime
          );
          setLoading(false);
          nextStep("start");
          helloMenu(
            addChatMessages,
            "hi",
            nextStep,
            walletIsConnected,
            wallet,
            telFirstName,
            setSharedPaymentMode
          );
        }
      } else {
        console.log("USER WANTS TO MAKE A REGULAR TRX");
        const transactionID = generateTransactionId();
        setSharedTransactionId(transactionID.toString());
        window.localStorage.setItem("transactionID", transactionID.toString());
        if (
          !sharedPaymentAssetEstimate ||
          isNaN(Number.parseFloat(sharedPaymentAssetEstimate))
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

        const paymentAsset = ` ${Number.parseFloat(sharedPaymentAssetEstimate)
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
          ethConnect,
          0,
          0,
          lastAssignedTime
        );

        setLoading(false);
        // let's save the transaction details to db
        const userDate = {
          crypto: sharedCrypto,
          network: sharedNetwork,
          estimation: sharedEstimateAsset,
          Amount: Number.parseFloat(sharedPaymentAssetEstimate)
            .toFixed(8)
            .toString(),
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
    } finally {
      // Clear the lock only if it's our lock (in case another transaction started)
      if (
        localStorage.getItem("transaction_in_progress") === transactionLockKey
      ) {
        localStorage.removeItem("transaction_in_progress");
      }
    }
  }

  // THE ROOT FUNCTION
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConversation(
        addChatMessages,
        chatInput,
        currentStep,
        walletIsConnected,
        wallet,
        sharedGiftId,
        telFirstName || "",
        sharedPaymentMode,
        sharedRate,
        sharedCrypto,
        sharedTicker,
        sharedAssetPrice,
        sharedEstimateAsset,
        sharedNetwork,
        sharedCharge,
        sharedPaymentAssetEstimate,
        sharedPaymentNairaEstimate,
        sharedNairaCharge,
        sharedSelectedBankCode,
        sharedSelectedBankName,
        sharedAmount,
        sharedBankCodes,
        sharedBankNames,
        ethConnect,
        sharedTransactionId,
        procesingStatus,
        cancelledStatus,
        reporterName,
        reporterPhoneNumber,
        reporterWalletAddress,
        fraudsterWalletAddress,
        sharedReportlyReportType,
        reportId,
        formattedRate,
        setSharedAmount,
        setSharedCharge,
        setSharedPaymentAssetEstimate,
        setSharedPaymentNairaEstimate,
        setSharedNairaCharge,
        setSharedChargeForDB,
        updateBankData,
        setChatInput,
        goToStep,
        nextStep,
        prevStep,
        setSharedPaymentMode,
        setSharedTicker,
        setSharedCrypto,
        setSharedNetwork,
        setSharedWallet,
        setSharedEstimateAsset,
        setSharedGiftId,
        setSharedBankNames,
        setSharedBankCodes,
        setSharedSelectedBankCode,
        setSharedSelectedBankName,
        setLoading,
        setSharedPhone,
        setSharedTransactionId,
        setSharedReportlyReportType,
        setReporterName,
        setReporterPhoneNumber,
        setReportId,
        setReporterWalletAddress,
        setFraudsterWalletAddress,
        setDescriptionNote,
        onError,
        processTransaction
      );
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
            handleConversation={() =>
              handleConversation(
                addChatMessages,
                chatInput,
                currentStep,
                walletIsConnected,
                wallet,
                sharedGiftId,
                telFirstName || "",
                sharedPaymentMode,
                sharedRate,
                sharedCrypto,
                sharedTicker,
                sharedAssetPrice,
                sharedEstimateAsset,
                sharedNetwork,
                sharedCharge,
                sharedPaymentAssetEstimate,
                sharedPaymentNairaEstimate,
                sharedNairaCharge,
                sharedSelectedBankCode,
                sharedSelectedBankName,
                sharedAmount,
                sharedBankCodes,
                sharedBankNames,
                ethConnect,
                sharedTransactionId,
                procesingStatus,
                cancelledStatus,
                reporterName,
                reporterPhoneNumber,
                reporterWalletAddress,
                fraudsterWalletAddress,
                sharedReportlyReportType,
                reportId,
                formattedRate,
                setSharedAmount,
                setSharedCharge,
                setSharedPaymentAssetEstimate,
                setSharedPaymentNairaEstimate,
                setSharedNairaCharge,
                setSharedChargeForDB,
                updateBankData,
                setChatInput,
                goToStep,
                nextStep,
                prevStep,
                setSharedPaymentMode,
                setSharedTicker,
                setSharedCrypto,
                setSharedNetwork,
                setSharedWallet,
                setSharedEstimateAsset,
                setSharedGiftId,
                setSharedBankNames,
                setSharedBankCodes,
                setSharedSelectedBankCode,
                setSharedSelectedBankName,
                setLoading,
                setSharedPhone,
                setSharedTransactionId,
                setSharedReportlyReportType,
                setReporterName,
                setReporterPhoneNumber,
                setReportId,
                setReporterWalletAddress,
                setFraudsterWalletAddress,
                setDescriptionNote,
                onError,
                processTransaction
              )
            }
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
            handleConversation={() =>
              handleConversation(
                addChatMessages,
                chatInput,
                currentStep,
                walletIsConnected,
                wallet,
                sharedGiftId,
                telFirstName || "",
                sharedPaymentMode,
                sharedRate,
                sharedCrypto,
                sharedTicker,
                sharedAssetPrice,
                sharedEstimateAsset,
                sharedNetwork,
                sharedCharge,
                sharedPaymentAssetEstimate,
                sharedPaymentNairaEstimate,
                sharedNairaCharge,
                sharedSelectedBankCode,
                sharedSelectedBankName,
                sharedAmount,
                sharedBankCodes,
                sharedBankNames,
                ethConnect,
                sharedTransactionId,
                procesingStatus,
                cancelledStatus,
                reporterName,
                reporterPhoneNumber,
                reporterWalletAddress,
                fraudsterWalletAddress,
                sharedReportlyReportType,
                reportId,
                formattedRate,
                setSharedAmount,
                setSharedCharge,
                setSharedPaymentAssetEstimate,
                setSharedPaymentNairaEstimate,
                setSharedNairaCharge,
                setSharedChargeForDB,
                updateBankData,
                setChatInput,
                goToStep,
                nextStep,
                prevStep,
                setSharedPaymentMode,
                setSharedTicker,
                setSharedCrypto,
                setSharedNetwork,
                setSharedWallet,
                setSharedEstimateAsset,
                setSharedGiftId,
                setSharedBankNames,
                setSharedBankCodes,
                setSharedSelectedBankCode,
                setSharedSelectedBankName,
                setLoading,
                setSharedPhone,
                setSharedTransactionId,
                setSharedReportlyReportType,
                setReporterName,
                setReporterPhoneNumber,
                setReportId,
                setReporterWalletAddress,
                setFraudsterWalletAddress,
                setDescriptionNote,
                onError,
                processTransaction
              )
            }
            chatInput={chatInput}
          />
        </div>
      )}
    </ErrorBoundary>
  );
};

export default withErrorHandling(ChatBot);

export function calculateCharge(
  amount: string,
  payment_mode: string,
  shared_rate: string,
  asset_price: string
) {
  const numAmount = Number.parseFloat(amount.replace(/[^\d.]/g, ""));
  let basic, median, premium;
  const rate = Number.parseFloat(shared_rate);
  const assetPrice = Number.parseFloat(asset_price);

  if (!rate || !assetPrice) {
    console.error("Invalid rate or asset price:", { rate, assetPrice });
    return 0;
  }

  if (payment_mode.toLowerCase().trim() === "usdt") {
    basic = 500 / rate;
    median = 1_000 / rate;
    premium = 1_500 / rate;
  } else {
    basic = 500 / rate / assetPrice;
    median = 1000 / rate / assetPrice;
    premium = 1500 / rate / assetPrice;
  }

  const nairaCharge =
    numAmount <= 100_000
      ? 500
      : numAmount > 100_000 && numAmount <= 1_000_000
      ? 1_000
      : 1_500;

  const cryptoCharge =
    nairaCharge === 500
      ? basic
      : nairaCharge === 1_000
      ? median
      : nairaCharge === 1_500
      ? premium
      : 0;

  return cryptoCharge;
}
