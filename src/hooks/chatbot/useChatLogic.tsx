import {
  connectWallet,
  helloMenu,
  choiceMenu,
} from "@/features/chatbot/handlers/chatHandlers/chatbot.parent";
import { requestPayCard } from "@/features/chatbot/handlers/chatHandlers/request.pay.card";
import { handleMakeAChoice } from "@/features/chatbot/handlers/chatHandlers/transact.crypto";
import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";

import { Dispatch, SetStateAction } from "react";
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
  const { sendChatInput } = useChatStore();
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
        // sendChatInput(chatInput);
      } else {
        console.log("Current Step:", currentStep);
        await stepHandlers[currentStep as StepId](chatInput);
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
  "transactCrypto",
  "requestPayCard",
  "transferMoney",
  // "estimateAsset",
  // "network",
  // "payOptions",
  // "charge",
  // "enterBankSearchWord",
  // "selectBank",
  // "enterAccountNumber",
  // "continueToPay",
  // "enterPhone",
  // "sendPayment",
  // "confirmTransaction",
  // "paymentProcessing",
  // "kycInfo",
  // "kycReg",
  // "thankForKYCReg",
  // "supportWelcome",
  // "assurance",
  // "entreTrxId",
  // "makeComplain",
  // "completeTransactionId",
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

const stepHandlers: Record<
  StepId,
  (chatInput: string) => Promise<void> | void
> = {
  start: async (chatInput) => helloMenu(chatInput),
  connectWallet: async () => connectWallet(),
  chooseAction: async (chatInput) => choiceMenu(chatInput),
  transactCrypto: async (chatInput) => handleMakeAChoice(chatInput),
  transferMoney: async () => console.log("ttransferMoney step"),
  requestPayCard: async () => requestPayCard(),
};

//   transactCrypto: async () => console.log("transactCrypto step"),
