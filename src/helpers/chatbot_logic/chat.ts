import { ReactNode } from "react";

export interface MessageType {
  type: "incoming" | "outgoing";
  content: ReactNode;
  timestamp: Date;
  isComponent?: boolean;
  componentName?: string;
}

export interface ChatNavigationHook {
  chatMessages: MessageType[];
  addChatMessages: (messages: MessageType[]) => void;
  currentStep: string;
  nextStep: (step: string) => void;
  prevStep: () => void;
  goToStep: (step: string) => void;
}
