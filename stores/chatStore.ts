import { create } from "zustand";
import { persist } from "zustand/middleware";
export type MessageType = {
  type: string;
  content: React.ReactNode;
  timestamp: Date;
};
type ChatStore = {
  message: MessageType[];
  addMessage: (message: MessageType) => void;
};

export const useChatStore = create<ChatStore>()(
  // save chat in the local storage
  persist(
    (set) => ({
      message: [],
      addMessage: (message) =>
        set((store) => ({ message: [...store.message, message] })),
    }),
    {
      name: "chat-history",
    }
  )
);
