import { useState, useEffect } from "react";
import { MessageType } from "@/types/general_types";
import { formatCurrency } from "@/helpers/format_currency";
import {
  createTransaction,
  fetchBankDetails,
  fetchBankNames,
  getAvaialableWallet,
} from "@/helpers/api_calls";
import { getFormattedDateTime } from "@/helpers/format_date";
import { formatPhoneNumber, generateTransactionId } from "@/utils/utilities";

interface TransactCryptoHook {
  handleTransferMoney: (chatInput: string) => void;
  handleEstimateAsset: (chatInput: string) => void;
  handleNetwork: (chatInput: string) => void;
  handlePayOptions: (chatInput: string) => void;
  handleCharge: (chatInput: string) => void;
  handleSearchBank: (chatInput: string) => Promise<void>;
  handleSelectBank: (chatInput: string) => Promise<void>;
  handleBankAccountNumber: (chatInput: string) => void;
  handleContinueToPay: (chatInput: string) => Promise<void>;
  handlePhoneNumber: (chatInput: string) => void;
  handleCryptoPayment: (chatInput: string) => Promise<void>;
  handleTransactionProcessing: (chatInput: string) => void;
}

interface TransactCryptoProps {
  addChatMessages: (messages: MessageType[]) => void;
  nextStep: (step: string) => void;
  prevStep: () => void;
  goToStep: (step: string) => void;
  helloMenu: (input: string) => void;
  displayTransferMoney: (
    addChatMessages: (messages: MessageType[]) => void
  ) => void;
  displayHowToEstimation: (
    addChatMessages: (messages: MessageType[]) => void,
    asset: string
  ) => void;
  displayPayIn: (
    addChatMessages: (messages: MessageType[]) => void,
    asset: string,
    rate: string,
    ticker: string,
    assetPrice: string,
    crypto: string
  ) => void;
  displayCharge: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void,
    amount: string,
    estimateAsset: string,
    rate: string,
    assetPrice: string,
    crypto: string,
    setCharge: (charge: string) => void,
    setPaymentAssetEstimate: (estimate: string) => void,
    setPaymentNairaEstimate: (estimate: string) => void,
    setNairaCharge: (charge: string) => void,
    setChargeForDB: (charge: string) => void,
    paymentMode: string
  ) => void;
  displaySearchBank: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void
  ) => void;
  displaySelectBank: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void,
    bankList: any[],
    setBankCodes: (codes: string[]) => void
  ) => void;
  displayEnterAccountNumber: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void,
    bankCode: string,
    bankCodes: string[],
    setSelectedBankCode: (code: string) => void,
    bankNames: string[],
    setSelectedBankName: (name: string) => void
  ) => void;
  displayContinueToPay: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void,
    accountName: string,
    bankName: string,
    accountNumber: string,
    paymentMode: string
  ) => void;
  displayEnterPhone: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void
  ) => void;
  displaySendPayment: (
    addChatMessages: (messages: MessageType[]) => void,
    nextStep: (step: string) => void,
    wallet: string,
    crypto: string,
    paymentAssetEstimate: string,
    paymentNairaEstimate: string,
    transactionID: string,
    network: string,
    paymentMode: string,
    giftID: number
  ) => void;
  sharedState: any; // Replace 'any' with the actual type of your shared state
  setSharedState: (state: any) => void; // Replace 'any' with the actual type of your shared state
  greetings: string[];
}

export function useTransactCrypto({
  addChatMessages,
  nextStep,
  prevStep,
  goToStep,
  helloMenu,
  displayTransferMoney,
  displayHowToEstimation,
  displayPayIn,
  displayCharge,
  displaySearchBank,
  displaySelectBank,
  displayEnterAccountNumber,
  displayContinueToPay,
  displayEnterPhone,
  displaySendPayment,
  sharedState,
  setSharedState,
  greetings,
}: TransactCryptoProps): TransactCryptoHook {
  const [loading, setLoading] = useState(false);

  const handleTransferMoney = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
      helloMenu("hi");
    } else if (chatInput === "1") {
      setSharedState({ ...sharedState, paymentMode: "transferMoney" });
      displayTransferMoney(addChatMessages);
      nextStep("estimateAsset");
    } else if (chatInput === "2") {
      displayTransferMoney(addChatMessages);
      setSharedState({ ...sharedState, paymentMode: "Gift" });
      nextStep("estimateAsset");
    } else if (chatInput === "3") {
      displaySearchBank(addChatMessages, nextStep);
      setSharedState({ ...sharedState, paymentMode: "request" });
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        },
      ]);
    }
  };

  const handleEstimateAsset = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "0") {
      prevStep();
      displayTransferMoney(addChatMessages);
    } else if (chatInput === "00") {
      goToStep("chooseAction");
      helloMenu("hi");
    } else if (chatInput === "1") {
      displayHowToEstimation(addChatMessages, "Bitcoin (BTC)");
      setSharedState({
        ...sharedState,
        ticker: "BTCUSDT",
        crypto: "BTC",
        network: "BTC",
      });
      nextStep("payOptions");
    } else if (chatInput === "2") {
      displayHowToEstimation(addChatMessages, "Ethereum (ETH)");
      setSharedState({
        ...sharedState,
        ticker: "ETHUSDT",
        crypto: "ETH",
        network: "ERC20",
      });
      nextStep("payOptions");
    } else if (chatInput === "3") {
      displayHowToEstimation(addChatMessages, "BINANCE (BNB)");
      setSharedState({
        ...sharedState,
        ticker: "BNBUSDT",
        crypto: "BNB",
        network: "BEP20",
      });
      nextStep("payOptions");
    } else if (chatInput === "4") {
      displayHowToEstimation(addChatMessages, "TRON (TRX)");
      setSharedState({
        ...sharedState,
        ticker: "TRXUSDT",
        crypto: "TRX",
        network: "TRC20",
      });
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
        },
      ];
      addChatMessages(newMessages);
      setSharedState({
        ...sharedState,
        ticker: "USDT",
        crypto: "USDT",
      });
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

  const handleNetwork = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displayTransferMoney(addChatMessages);
    } else if (chatInput === "1") {
      displayHowToEstimation(addChatMessages, "USDT (ERC20)");
      setSharedState({
        ...sharedState,
        ticker: "USDT",
        crypto: "USDT",
        network: "ERC20",
      });
      nextStep("payOptions");
    } else if (chatInput === "2") {
      displayHowToEstimation(addChatMessages, "USDT (TRC20)");
      setSharedState({
        ...sharedState,
        ticker: "USDT",
        crypto: "USDT",
        network: "TRC20",
      });
      nextStep("payOptions");
    } else if (chatInput === "3") {
      displayHowToEstimation(addChatMessages, "USDT (BEP20)");
      setSharedState({
        ...sharedState,
        ticker: "USDT",
        crypto: "USDT",
        network: "BEP20",
      });
      nextStep("payOptions");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. Choose your preferred network or say Hi if you are stuck.",
        },
      ]);
    }
  };

  const handlePayOptions = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displayHowToEstimation(
        addChatMessages,
        `${sharedState.crypto} (${sharedState.network})`
      );
    } else if (chatInput === "1") {
      displayPayIn(
        addChatMessages,
        "Naira",
        sharedState.rate,
        sharedState.ticker,
        sharedState.assetPrice,
        sharedState.crypto
      );
      setSharedState({ ...sharedState, estimateAsset: "Naira" });
      nextStep("charge");
    } else if (chatInput === "2") {
      displayPayIn(
        addChatMessages,
        "Dollar",
        sharedState.rate,
        sharedState.ticker,
        chatInput,
        sharedState.crypto
      );
      setSharedState({ ...sharedState, estimateAsset: "Dollar" });
      nextStep("charge");
    } else if (chatInput === "3") {
      displayPayIn(
        addChatMessages,
        sharedState.crypto,
        sharedState.rate,
        sharedState.ticker,
        sharedState.assetPrice,
        sharedState.crypto
      );
      setSharedState({ ...sharedState, estimateAsset: sharedState.crypto });
      nextStep("charge");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Choose your preferred estimate asset.",
        },
      ]);
    }
  };

  const handleCharge = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displayHowToEstimation(
        addChatMessages,
        `${sharedState.crypto} (${sharedState.network})`
      );
    } else if (chatInput != "0") {
      setSharedState({ ...sharedState, amount: chatInput.trim() });
      displayCharge(
        addChatMessages,
        nextStep,
        chatInput,
        sharedState.estimateAsset,
        sharedState.rate,
        sharedState.assetPrice,
        sharedState.crypto,
        (charge: string) => setSharedState({ ...sharedState, charge }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentAssetEstimate: estimate }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentNairaEstimate: estimate }),
        (charge: string) =>
          setSharedState({ ...sharedState, nairaCharge: charge }),
        (charge: string) =>
          setSharedState({ ...sharedState, chargeForDB: charge }),
        sharedState.paymentMode
      );
    } else {
      addChatMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. Do you want to include charge in your estimate or not?",
        },
      ]);
    }
  };

  const handleSearchBank = async (chatInput: string) => {
    let wantsToClaimGift =
      sharedState.paymentMode.toLowerCase().trim() === "claim gift";
    let wantsToSendGift =
      sharedState.paymentMode.toLowerCase().trim() === "gift";
    let wantsToRequestPayment =
      sharedState.paymentMode.toLowerCase().trim() === "request";

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput.trim() === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput.trim() === "0") {
      prevStep();
      displayCharge(
        addChatMessages,
        nextStep,
        sharedState.amount,
        sharedState.estimateAsset,
        sharedState.rate,
        sharedState.assetPrice,
        sharedState.crypto,
        (charge: string) => setSharedState({ ...sharedState, charge }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentAssetEstimate: estimate }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentNairaEstimate: estimate }),
        (charge: string) =>
          setSharedState({ ...sharedState, nairaCharge: charge }),
        (charge: string) =>
          setSharedState({ ...sharedState, chargeForDB: charge }),
        sharedState.paymentMode
      );
    } else if (chatInput !== "0") {
      if (wantsToClaimGift || wantsToRequestPayment || !wantsToSendGift) {
        displaySearchBank(addChatMessages, nextStep);
      } else {
        const chargeFixed = parseFloat(sharedState.charge);
        if (chatInput === "1") {
          const finalAsset = parseFloat(sharedState.paymentAssetEstimate);
          const finalNaira =
            parseFloat(sharedState.paymentNairaEstimate) -
            parseFloat(sharedState.nairaCharge);
          setSharedState({
            ...sharedState,
            paymentAssetEstimate: finalAsset.toString(),
            paymentNairaEstimate: finalNaira.toString(),
            chargeForDB: `${chargeFixed.toFixed(5)} ${sharedState.crypto} = ${
              sharedState.nairaCharge
            }`,
          });
        } else if (chatInput === "2") {
          const finalAsset =
            parseFloat(sharedState.paymentAssetEstimate) +
            parseFloat(sharedState.charge);
          const finalNaira = parseFloat(sharedState.paymentNairaEstimate);
          setSharedState({
            ...sharedState,
            paymentAssetEstimate: finalAsset.toString(),
            paymentNairaEstimate: finalNaira.toString(),
            chargeForDB: `${chargeFixed.toFixed(5)} ${sharedState.crypto} = ${
              sharedState.nairaCharge
            }`,
          });
        }
        displaySearchBank(addChatMessages, nextStep);
      }
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

  const handleSelectBank = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displayCharge(
        addChatMessages,
        nextStep,
        sharedState.amount,
        sharedState.estimateAsset,
        sharedState.rate,
        sharedState.assetPrice,
        sharedState.crypto,
        (charge: string) => setSharedState({ ...sharedState, charge }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentAssetEstimate: estimate }),
        (estimate: string) =>
          setSharedState({ ...sharedState, paymentNairaEstimate: estimate }),
        (charge: string) =>
          setSharedState({ ...sharedState, nairaCharge: charge }),
        (charge: string) =>
          setSharedState({ ...sharedState, chargeForDB: charge }),
        sharedState.paymentMode
      );
    } else if (chatInput != "0") {
      setLoading(true);
      try {
        const bankNames = await fetchBankNames(chatInput.trim());
        const bankList = bankNames["message"];
        if (Array.isArray(bankList)) {
          const bankNameList = bankList.map((bank: string) =>
            bank.replace(/^\d+\.\s*/, "").replace(/\s\d+$/, "")
          );
          setSharedState({ ...sharedState, bankNames: bankNameList });
        } else {
          console.error(
            "The fetched bank names are not in the expected format."
          );
        }
        setLoading(false);
        displaySelectBank(
          addChatMessages,
          nextStep,
          bankList,
          (codes: string[]) =>
            setSharedState({ ...sharedState, bankCodes: codes })
        );
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch bank names:", error);
      }
    }
  };

  const handleBankAccountNumber = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displaySelectBank(
        addChatMessages,
        nextStep,
        sharedState.bankNames,
        (codes: string[]) =>
          setSharedState({ ...sharedState, bankCodes: codes })
      );
    } else if (chatInput != "0") {
      displayEnterAccountNumber(
        addChatMessages,
        nextStep,
        chatInput,
        sharedState.bankCodes,
        (code: string) =>
          setSharedState({ ...sharedState, selectedBankCode: code }),
        sharedState.bankNames,
        (name: string) =>
          setSharedState({ ...sharedState, selectedBankName: name })
      );
    }
  };

  const handleContinueToPay = async (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displaySearchBank(addChatMessages, nextStep);
    } else if (chatInput !== "0") {
      if (chatInput === "1" || chatInput === "2") {
        displayEnterPhone(addChatMessages, nextStep);
      } else {
        setLoading(true);
        try {
          const bankData = await fetchBankDetails(
            sharedState.selectedBankCode,
            chatInput.trim()
          );
          const bank_name = bankData[0].bank_name;
          const account_name = bankData[0].account_name;
          const account_number = bankData[0].account_number;

          if (!account_number) {
            addChatMessages([
              {
                type: "incoming",
                content: <span>Invalid account number. Please try again.</span>,
              },
            ]);
            setLoading(false);
            return;
          }

          setLoading(false);
          setSharedState({
            ...sharedState,
            bankData: {
              acct_number: account_number,
              bank_name: sharedState.selectedBankName,
              receiver_name: account_name,
            },
          });
          displayContinueToPay(
            addChatMessages,
            nextStep,
            account_name,
            sharedState.selectedBankName,
            account_number,
            sharedState.paymentMode
          );
        } catch (error) {
          console.error("Failed to fetch bank data:", error);
          addChatMessages([
            {
              type: "incoming",
              content: (
                <span>
                  Failed to fetch bank data. Please check your account number
                  and try again.
                </span>
              ),
            },
          ]);
          setLoading(false);
        }
      }
    }
  };

  const handlePhoneNumber = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displaySearchBank(addChatMessages, nextStep);
    } else if (chatInput !== "0") {
      displayEnterPhone(addChatMessages, nextStep);
    }
  };

  const handleCryptoPayment = async (chatInput: string) => {
    const phoneNumber = chatInput.trim();

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput != "0") {
      setLoading(true);

      // Validate phone number
      const phoneNumberPattern = /^(\+234|0)[789]\d{9}$/;
      if (!phoneNumberPattern.test(phoneNumber)) {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <span>
                Please enter a valid phone number, <b>{phoneNumber}</b> is not a
                valid phone number.
              </span>
            ),
          },
        ]);
        setLoading(false);
        return;
      }

      setSharedState({ ...sharedState, phone: phoneNumber });

      let isGift = sharedState.paymentMode.toLowerCase() === "claim gift";
      let isGiftTrx = sharedState.paymentMode.toLowerCase() === "gift";
      let requestPayment = sharedState.paymentMode.toLowerCase() === "request";

      if (!isGift && !requestPayment) {
        addChatMessages([
          {
            type: "incoming",
            content: (
              <div className="flex flex-col items-center">
                <p className="mb-4">
                  Do you understand that you need to complete your payment
                  within <b>5 minutes</b>, otherwise you may lose your money.
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition-all duration-300 ease-in-out"
                  onClick={async () => {
                    setLoading(true);
                    await processTransaction(
                      phoneNumber,
                      false,
                      isGiftTrx,
                      requestPayment
                    );
                  }}
                >
                  Confirm and Proceed
                </button>
              </div>
            ),
          },
        ]);
        setLoading(false);
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
    requestPayment: boolean
  ) => {
    try {
      if (isGiftTrx) {
        console.log("USER WANTS TO SEND GIFT");
        const transactionID = generateTransactionId().toString();
        const giftID = generateTransactionId();
        setSharedState({
          ...sharedState,
          transactionId: transactionID.toString(),
          giftId: giftID.toString(),
        });
        window.localStorage.setItem("transactionID", transactionID.toString());
        window.localStorage.setItem("giftID", giftID.toString());

        const paymentAsset = ` ${parseFloat(sharedState.paymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedState.crypto} `;
        const date = getFormattedDateTime();

        const availableWallet = await getAvaialableWallet(
          sharedState.network.toLowerCase()
        );

        displaySendPayment(
          addChatMessages,
          nextStep,
          availableWallet,
          sharedState.crypto,
          sharedState.paymentAssetEstimate,
          sharedState.paymentNairaEstimate,
          transactionID,
          sharedState.network,
          sharedState.paymentMode,
          giftID
        );
        setLoading(false);

        const userData = {
          crypto: sharedState.crypto,
          network: sharedState.network,
          estimation: sharedState.estimateAsset,
          Amount: parseFloat(sharedState.paymentAssetEstimate)
            .toFixed(8)
            .toString(),
          charges: sharedState.chargeForDB,
          mode_of_payment: sharedState.paymentMode,
          acct_number: null,
          bank_name: null,
          receiver_name: null,
          receiver_amount: formatCurrency(
            sharedState.paymentNairaEstimate,
            "NGN",
            "en-NG"
          ),
          crypto_sent: paymentAsset,
          wallet_address: availableWallet,
          Date: date,
          status: "Processing",
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          gift_chatID: giftID.toString(),
          settle_walletLink: null,
          chat_id: sharedState.chatId,
          current_rate: formatCurrency(sharedState.rate, "NGN", "en-NG"),
          merchant_rate: sharedState.merchantRate,
          profit_rate: sharedState.profitRate,
          name: null,
          gift_status: "Pending",
          asset_price: formatCurrency(sharedState.assetPrice, "NGN", "en-NG"),
        };
        await createTransaction(userData);

        console.log("User gift data created", userData);
      } else if (requestPayment) {
        console.log("USER WANTS TO REQUEST PAYMENT");
        const transactionID = generateTransactionId();
        const requestID = generateTransactionId();
        setSharedState({
          ...sharedState,
          transactionId: transactionID.toString(),
        });
        window.localStorage.setItem("transactionID", transactionID.toString());
        const paymentAsset = ` ${parseFloat(sharedState.paymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedState.crypto} `;
        const date = getFormattedDateTime();

        setLoading(false);
        const userData = {
          crypto: sharedState.crypto,
          network: sharedState.network,
          estimation: sharedState.estimateAsset,
          Amount: parseFloat(sharedState.paymentAssetEstimate)
            .toFixed(8)
            .toString(),
          charges: sharedState.chargeForDB,
          mode_of_payment: sharedState.paymentMode,
          acct_number: null,
          bank_name: null,
          receiver_name: null,
          receiver_amount: formatCurrency(
            sharedState.paymentNairaEstimate,
            "NGN",
            "en-NG"
          ),
          crypto_sent: paymentAsset,
          wallet_address: null,
          Date: date,
          status: "Processing",
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          gift_chatID: null,
          settle_walletLink: null,
          chat_id: sharedState.chatId,
          current_rate: formatCurrency(sharedState.rate, "NGN", "en-NG"),
          merchant_rate: sharedState.merchantRate,
          profit_rate: sharedState.profitRate,
          name: null,
          gift_status: "Pending",
          asset_price: formatCurrency(sharedState.assetPrice, "NGN", "en-NG"),
        };
        // await createTransaction(userData);

        console.log("User request data created", userData);
        console.log("User requestID is ", requestID);
        console.log("User transactionID is ", transactionID.toString());
      } else {
        console.log("USER WANTS TO MAKE A REGULAR TRX");
        const transactionID = generateTransactionId().toString();
        setSharedState({
          ...sharedState,
          transactionId: transactionID.toString(),
        });
        window.localStorage.setItem("transactionID", transactionID.toString());
        const paymentAsset = ` ${parseFloat(sharedState.paymentAssetEstimate)
          .toFixed(8)
          .toString()} ${sharedState.crypto} `;
        const date = getFormattedDateTime();

        const availableWallet = await getAvaialableWallet(
          sharedState.network.toLowerCase()
        );

        displaySendPayment(
          addChatMessages,
          nextStep,
          availableWallet,
          sharedState.crypto,
          sharedState.paymentAssetEstimate,
          sharedState.paymentNairaEstimate,
          transactionID,
          sharedState.network,
          sharedState.paymentMode,
          0
        );
        console.log("User data created", availableWallet);
        setLoading(false);
        const userData = {
          crypto: sharedState.crypto,
          network: sharedState.network,
          estimation: sharedState.estimateAsset,
          Amount: parseFloat(sharedState.paymentAssetEstimate)
            .toFixed(8)
            .toString(),
          charges: sharedState.char,
          mode_of_payment: sharedState.paymentMode,
          acct_number: sharedState.bankData.acct_number,
          bank_name: sharedState.bankData.bank_name,
          receiver_name: sharedState.bankData.receiver_name,
          receiver_amount: formatCurrency(
            sharedState.paymentNairaEstimate,
            "NGN",
            "en-NG"
          ),
          crypto_sent: paymentAsset,
          wallet_address: availableWallet,
          Date: date,
          status: "Processing",
          customer_phoneNumber: formatPhoneNumber(phoneNumber),
          transac_id: transactionID.toString(),
          gift_chatID: null,
          settle_walletLink: null,
          chat_id: sharedState.chatId,
          current_rate: formatCurrency(sharedState.rate, "NGN", "en-NG"),
          merchant_rate: sharedState.merchantRate,
          profit_rate: sharedState.profitRate,
          name: null,
          gift_status: null,
          asset_price: formatCurrency(sharedState.assetPrice, "NGN", "en-NG"),
        };
        await createTransaction(userData);
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      setLoading(false);
      addChatMessages([
        {
          type: "incoming",
          content:
            "An error occurred while processing your transaction. Please try again.",
        },
      ]);
    }
  };

  const handleTransactionProcessing = (chatInput: string) => {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      goToStep("start");
      helloMenu("hi");
    } else if (chatInput === "0") {
      prevStep();
      displayEnterPhone(addChatMessages, nextStep);
    } else if (chatInput === "1") {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              Your transaction is being processed. Please wait for confirmation.
              <br />
              <br />
              1. Check transaction status
              <br />
              2. Cancel transaction
              <br />
              <br />
              0. Go back
              <br />
              00. Exit
            </span>
          ),
        },
      ]);
      nextStep("transactionStatus");
    } else if (chatInput === "2") {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              Are you sure you want to cancel this transaction?
              <br />
              <br />
              1. Yes, cancel the transaction
              <br />
              2. No, continue with the transaction
              <br />
              <br />
              0. Go back
              <br />
              00. Exit
            </span>
          ),
        },
      ]);
      nextStep("cancelTransaction");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: "Invalid choice. Please select a valid option.",
        },
      ]);
    }
  };

  return {
    handleTransferMoney,
    handleEstimateAsset,
    handleNetwork,
    handlePayOptions,
    handleCharge,
    handleSearchBank,
    handleSelectBank,
    handleBankAccountNumber,
    handleContinueToPay,
    handlePhoneNumber,
    handleCryptoPayment,
    handleTransactionProcessing,
  };
}
