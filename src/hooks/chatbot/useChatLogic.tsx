import { connectWallet } from "@/features/chatbot/handlers/chatHandlers/chatbot.parent";
import { choiceMenu } from "@/features/chatbot/handlers/chatHandlers/choice.menu";
import { helloMenu } from "@/features/chatbot/handlers/chatHandlers/hello.menu";
import { handleMakeAChoice } from "@/features/chatbot/handlers/chatHandlers/make.choice";
import { requestPayCard } from "@/features/chatbot/handlers/chatHandlers/request.pay.card";
import { transactCrypto } from "@/features/chatbot/handlers/chatHandlers/transact.crypto";
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
  // const { sendChatInput } = useChatStore();
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
        await stepHandlers[currentStep.stepId as StepId](chatInput);
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

const stepHandlers: Record<
  StepId,
  (chatInput: string) => Promise<void> | void
> = {
  start: async (chatInput) => helloMenu(chatInput),
  connectWallet: async () => connectWallet(),
  chooseAction: async (chatInput) => choiceMenu(chatInput),
  makeAChoice: async (chatInput) => handleMakeAChoice(chatInput),
  transactCrypto: async (chatInput) => transactCrypto(chatInput),
  transferMoney: async () => console.log("transferMoney step"),
  requestPayCard: async () => requestPayCard(),
  assurance: async () => console.log("assurance step"),
  completeTransactionId: async () => console.log("assurance step"),
};

//   transactCrypto: async () => console.log("transactCrypto step"),
