import {
  helloMenu,
  welcomeMenu,
} from "@/features/chatbot/handlers/chatbot.parent";
import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";

import { Dispatch, SetStateAction } from "react";
import useChatStore, { MessageType } from "stores/chatStore";

export interface ChatLogicProps {
  addChatMessages: (messages: MessageType[]) => void;
  setChatInput: Dispatch<SetStateAction<string>>;
  currentStep: string;
  setLoading: Dispatch<SetStateAction<boolean>>;
  onError?: (error: Error) => void;
}

export const useChatLogic = ({
  addChatMessages,
  setChatInput,
  setLoading,
  onError,
}: ChatLogicProps) => {
  const currentStep = useChatStore.getState().currentStep;
  const { reset } = useChatStore();
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
        reset();
      }

      console.log("Current Step:", currentStep);
      await stepHandlers[currentStep as StepId](chatInput);
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
  "chooseAction",
  "transactCrypto",
  // "transferMoney",
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
  chooseAction: async (chatInput) => welcomeMenu(chatInput),
  transactCrypto: async () => console.log("transactCrypto step"),
};

//   transactCrypto: async () => console.log("transactCrypto step"),
