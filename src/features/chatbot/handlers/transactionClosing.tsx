import {
  checkTranscationExists,
  fetchBankDetails,
  updateTransaction,
} from "@/helpers/api_calls";
import ConfirmAndProceedButton from "@/hooks/chatbot/confirmButtonHook";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import {
  displayConfirmPayment,
  displayContinueToPay,
  displayEnterPhone,
  displaySearchBank,
} from "@/menus/transact_crypto";
import { MessageType, UserBankData } from "@/types/general_types";
import { phoneNumberPattern } from "@/utils/utilities";
import { greetings } from "../helpers/ChatbotConsts";
import { helloMenu } from "./general";
import { WalletAddress } from "@/lib/wallets/types";
import { StepId } from "@/core/transation_state_machine/steps";

// VALIDATE USER ACCOUNT DETAILS USING PHONE NUMBER AND BANK NAME
export const handleContinueToPay = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedSelectedBankCode: string,
  sharedSelectedBankName: string,
  sharedPaymentMode: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: () => void,
  prevStep: () => void,
  goToStep: (step: StepId) => void,
  updateBankData: (newData: Partial<UserBankData>) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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
                Failed to fetch bank data. Please check your accouunt number and
                try again.
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
export const handlePhoneNumber = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: () => void,
  prevStep: () => void,
  goToStep: (step: StepId) => void,
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
      // console.log("THIS IS WHERE WE ARE");
      prevStep();
      displaySearchBank(addChatMessages, nextStep);
    })();
  } else if (chatInput !== "0") {
    displayEnterPhone(addChatMessages, nextStep);
  }
};
export const handleCryptoPayment = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedCrypto: string,
  sharedNetwork: string,
  sharedPaymentMode: string,
  ethConnect: boolean,
  sharedPaymentAssetEstimate: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  setSharedPhone: (phoneNumber: string) => void,
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean,
    activeWallet?: string,
    lastAssignedTime?: Date
  ) => Promise<void>,
  nextStep: () => void,
  goToStep: (step: StepId) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSharedPaymentMode: (mode: string) => void
) => {
  const phoneNumber = chatInput.trim();

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
    const payPayment = sharedPaymentMode.toLowerCase() === "payrequest";

    const network =
      sharedCrypto.toLowerCase() === "usdt"
        ? sharedNetwork.toLowerCase()
        : sharedCrypto.toLowerCase();

    if (!isGift && !requestPayment && !payPayment) {
      const assetPayment = parseFloat(sharedPaymentAssetEstimate);
      const paymentAsset = `${assetPayment.toFixed(8)} ${sharedCrypto}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {sharedCrypto} ({sharedNetwork}) wallet.
                  </p>
                  //{" "}
                  <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  />
                </div>
              ),
              timestamp: new Date(),
            },
          ]
        : [
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
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  />
                </div>
              ),
              timestamp: new Date(),
            },
          ];

      setLoading(false);
      addChatMessages(newMessages);
    } else if (payPayment) {
      const assetPayment = parseFloat(sharedPaymentAssetEstimate);
      const paymentAsset = `${assetPayment.toFixed(8)} ${sharedCrypto}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {sharedCrypto} ({sharedNetwork}) wallet.
                  </p>
                  //{" "}
                  <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  />
                </div>
              ),
              timestamp: new Date(),
            },
          ]
        : [
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
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  />
                </div>
              ),
              timestamp: new Date(),
            },
          ];

      setLoading(false);
      addChatMessages(newMessages);
    } else {
      console.log(
        "Calling processTransaction with:",
        phoneNumber,
        isGift,
        isGiftTrx,
        requestPayment
      );

      await processTransaction(phoneNumber, isGift, isGiftTrx, requestPayment);
    }
  } else {
    setLoading(false);
    console.log("User input not recognized");
  }
};

export const handleConfirmTransaction = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  sharedTransactionId: string,
  procesingStatus: string,
  cancelledStatus: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: () => void,
  goToStep: (step: StepId) => void,
  setSharedTransactionId: (step: string) => void,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
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
  } else if (chatInput.trim() === "00") {
  } else if (chatInput.trim() === "00") {
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
      (await checkTranscationExists(transaction_id)).user?.customer_phoneNumber
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
export const handleTransactionProcessing = async (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  nextStep: () => void,
  prevStep: () => void,
  goToStep: (step: StepId) => void,
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
  } else if (chatInput.trim() === "00") {
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
  } else if (chatInput.trim() === "0") {
    (() => {
      prevStep();
      displaySearchBank(addChatMessages, nextStep);
    })();
  } else if (chatInput.trim() === "1") {
    helloMenu(
      addChatMessages,
      "hi",
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
  } else if (chatInput.trim() === "2") {
    goToStep("supportWelcome");
    displayCustomerSupportWelcome(addChatMessages, nextStep);
  }
};
