import { useState } from "react";
import { useChatNavigation } from "./useChatNavigation";

// useChatState.ts
export const useChatState = () => {
  const [chatInput, setChatInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  const { chatMessages,addChatMessages } = useChatNavigation();

  return {
    chatInput,
    setChatInput,
    loading,
    setLoading,
    chatMessages,
    addChatMessages,
    currentDate,
    setCurrentDate,
  };
};
