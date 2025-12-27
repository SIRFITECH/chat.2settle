import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";

import { Dispatch, SetStateAction } from "react";
import { MessageType } from "stores/chatStore";

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
  currentStep,
  setLoading,
  onError,
}: ChatLogicProps) => {
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
        addChatMessages([
          {
            type: "incoming",
            content: <span>Hello! How can I assist you?</span>,
            timestamp: new Date(),
          },
        ]);
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
