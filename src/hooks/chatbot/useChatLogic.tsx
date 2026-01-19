import { handleCharge } from "@/features/chatbot/handlers/chatHandlers/charge";
import { connectWallet } from "@/features/chatbot/handlers/chatHandlers/chatbot.parent";
import { choiceMenu } from "@/features/chatbot/handlers/chatHandlers/choice.menu";
import { handleChooseTransactionType } from "@/features/chatbot/handlers/chatHandlers/choose.transaction.type";
import { handleContinueToPay } from "@/features/chatbot/handlers/chatHandlers/complete.payement";
import { handlePhoneNumber } from "@/features/chatbot/handlers/chatHandlers/enter.phone";
import {
  handleBankAccountNumber,
  handleSearchBank,
  handleSelectBank,
} from "@/features/chatbot/handlers/chatHandlers/handle.bank.steps";
import { helloMenu } from "@/features/chatbot/handlers/chatHandlers/hello.menu";
import { handleMakeAChoice } from "@/features/chatbot/handlers/chatHandlers/make.choice";
import { displayWelcomeMenu } from "@/features/chatbot/handlers/chatHandlers/menus/welcome";
import { handleNetwork } from "@/features/chatbot/handlers/chatHandlers/network";
import { handlePayOptions } from "@/features/chatbot/handlers/chatHandlers/payment.options";
import { requestPayCard } from "@/features/chatbot/handlers/chatHandlers/request.pay.card";
import { handleCryptoPayment } from "@/features/chatbot/handlers/chatHandlers/send.payment";
import { handleTransactCrypto } from "@/features/chatbot/handlers/chatHandlers/transact.crypto";
import { handleTransferMoney } from "@/features/chatbot/handlers/chatHandlers/transfer.money";
import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
import { geminiAi } from "@/services/ai/ai-services";

import { Dispatch, JSX, SetStateAction } from "react";
import useChatStore, { MessageType } from "stores/chatStore";

export interface ChatLogicProps {
  addChatMessages: (messages: MessageType[]) => void;
  setChatInput: Dispatch<SetStateAction<string>>;
  currentStep: string;
  onError?: (error: Error) => void;
}

export const useChatLogic = ({
  addChatMessages,
  setChatInput,
  onError,
}: ChatLogicProps) => {
  const currentStep = useChatStore((s) => s.currentStep);
  const { setLoading } = useChatStore.getState();

  const handleConversation = async (chatInput: string) => {
    setLoading(true);
    try {
      if (!chatInput.trim()) return;

      addChatMessages([
        {
          type: "outgoing",
          content: <span>{chatInput}</span>,
          timestamp: new Date(),
        },
      ]);
      setChatInput("");

      // greetings logic
      if (greetings.includes(chatInput.trim().toLowerCase())) {
        console.log("We are resetting to handle greeting...");
        console.log("Current Step:", currentStep);
        await stepHandlers["start"](chatInput);
      } else {
        console.log("Current Step:", currentStep);
        await handleAiChat(chatInput)
        // await stepHandlers[currentStep.stepId as StepId](chatInput);
      }
    } catch (error) {
      console.error(error);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
      addChatMessages([
        {
          type: "incoming",
          content: <span>Something went wrong.</span>,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { handleConversation };
};

const steps = [
  "start",
  "connectWallet",
  "chooseAction",
  "makeAChoice",
  "chooseTransactionType",
  "transactCrypto",
  "requestPayCard",
  "transferMoney",
  "howToEstimate",
  // "estimateAsset",
  "network",
  "payOptions",
  "charge",
  "enterBankSearchWord",
  "selectBank",
  "enterAccountNumber",
  "continueToPay",
  "enterPhone",
  "sendPayment",
  // "confirmTransaction",
  // "paymentProcessing",
  // "kycInfo",
  // "kycReg",
  // "thankForKYCReg",
  // "supportWelcome",
  "assurance",
  // "entreTrxId",
  // "makeComplain",
  "completeTransactionId",
  // "giftFeedBack",
  // "makeReport",
  // "reporterName",
  // "reporterPhoneNumber",
  // "reporterWallet",
  // "fraudsterWallet",
  // "reportlyNote",
  // "reporterFarwell",
] as const;

type StepId = (typeof steps)[number];

// create btc payment
/* Start --> handleWelcome(2) --> chooseAction(1) --> paymentOption(1) --> estimateAsset(1) --> 
estimateAmount(20000) --> charge(2) -->  bankSearchTerm --> selectBank(1) --> bankAccountNo --> 
confirmBank() --> proceedToPay() --> completePayement()
*/

export const handleAiChat = async (
  chatInput?: string
) => {
  const { addMessages } = useChatStore.getState();
  try {
    console.log("we are at the start");

    // window.localStorage.setItem("transactionID", "");

    const messages: any = [];
    const updatedMessages = [...messages, { role: "user", content: chatInput }];
    let sessionId = window.localStorage.getItem("transactionID");

    // ✅ If it doesn't exist, create and store it
    if (!sessionId) {
      sessionId = Math.floor(100000 + Math.random() * 900000).toString();
      window.localStorage.setItem("transactionID", sessionId);
      console.log("Generated new sessionId:", sessionId);
    } else {
      console.log("Using existing sessionId:", sessionId);
    }
    console.log("Generated new sessionId:", chatInput);
    // const reply = await OpenAI(updatedMessages, sessionId);
    const reply = await geminiAi(chatInput, sessionId);
    console.log("this is the response from backend", reply.reply);

    addMessages?.([
      {
        type: "incoming",
        content: <span>{reply.reply}</span>, // simplified: just the assistant's latest reply
        timestamp: new Date(),
      },
    ]);
  } catch (err) {
    console.error("There was an error from backend", err);
    addMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            😓 Sorry, something went wrong while processing your request.
            <br />
            Please try again in a moment.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};

const stepHandlers: Record<
  StepId,
  (chatInput: string) => Promise<void> | void
> = {
  start: async (chatInput) => displayWelcomeMenu(chatInput),
  connectWallet: async () => connectWallet(), // I will work on thisn later
  // choose what you want to do in 2settle (transactCrypto, ...reportly)
  chooseAction: async (chatInput) => choiceMenu(chatInput),
  // choose what you want to do in transact crypto
  makeAChoice: async (chatInput) => handleMakeAChoice(chatInput),
  // choose how you want to estimate the payment
  chooseTransactionType: async (chatInput) =>
    handleChooseTransactionType(chatInput),
  // choose what currency you want to use (naira, dollar, crypto)
  transactCrypto: async (chatInput) => handleTransactCrypto(chatInput),
  // this handles the network
  network: async (chatInput) => handleNetwork(chatInput),
  // calculates the charge and give user option to choose
  charge: async (chatInput) => handleCharge(chatInput),
  // allow user to enter bank search word
  enterBankSearchWord: async (chatInput) => handleSearchBank(chatInput),
  // allow user select bank from list
  selectBank: async (chatInput) => handleSelectBank(chatInput),
  // allow user enter account number
  enterAccountNumber: async (chatInput) => handleBankAccountNumber(chatInput),
  // continue to pay
  continueToPay: async (chatInput) => handleContinueToPay(chatInput),
  // use give there phone
  enterPhone: async (chatInput) => handlePhoneNumber(chatInput),
  // allow user send their crypto payment
  sendPayment: async (chatInput) => handleCryptoPayment(chatInput),
  howToEstimate: async () => console.log("transferMoney step"),
  transferMoney: async (chatInput) => handleTransferMoney(chatInput),
  payOptions: async (chatInput) => handlePayOptions(chatInput),
  requestPayCard: async () => requestPayCard(),
  assurance: async () => console.log("assurance step"),
  completeTransactionId: async () => console.log("assurance step"),
};


// function addChatMessages(arg0: {
//   type: string; content: JSX.Element; // simplified: just the assistant's latest reply
//   timestamp: Date;
// }[]) {
//   throw new Error("Function not implemented.");
// }
//   transactCrypto: async () => console.log("transactCrypto step"),
