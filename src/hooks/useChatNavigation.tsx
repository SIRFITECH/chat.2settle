import { MessageType } from "@/types/general_types";
import { ChatNavigationHook } from "@/types/use_navigation_hook_types";
import parse from "html-react-parser";
import React from "react";
import { useState, useRef, useEffect } from "react";
import elementToJSXString from "react-element-to-jsx-string";

const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far 👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        How may I help you?
        <br />
        Say "Hi" let us start
      </span>
    ),
  },
];

const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const serializeMessage = (message: {
  type: string;
  content: React.ReactNode;
}) => {
  return {
    ...message,
    content: sanitizeSerializedContent(elementToJSXString(message.content)),
  };
};
const deserializeMessage = (message: { type: string; content: string }) => {
  return {
    ...message,
    content: parse(message.content),
  };
};

export function useChatNavigation(): ChatNavigationHook {
  const [local, setLocal] = React.useState<{
    messages: { type: string; content: React.ReactNode }[];
    serializedMessages: { type: string; content: string }[];
    step: string;
    stepHistory: string[];
  }>(() => {
    if (typeof window !== "undefined") {
      const fromLocalStorage = window.localStorage.getItem("chat_data");
      if (fromLocalStorage) {
        const parsedData = JSON.parse(fromLocalStorage);
        const deserializedMessages =
          parsedData.messages.map(deserializeMessage);
        const { currentStep, stepHistory = ["start"] } = parsedData;
        return {
          messages: deserializedMessages,
          serializedMessages: parsedData.messages,
          step: currentStep,
          stepHistory: parsedData.stepHistory || ["start"],
        };
      }
    }
    const serializedInitialMessages = initialMessages.map(serializeMessage);
    return {
      messages: initialMessages,
      serializedMessages: serializedInitialMessages,
      step: "start",
      stepHistory: ["start"],
    };
  });

  const [chatMessages, setChatMessages] = useState<MessageType[]>(
    local.messages
  );
  const [serializedMessages, setSerializedMessages] = React.useState(
    local.serializedMessages
  );
  const [currentStep, setCurrentStep] = useState<string>("start");
  const [stepHistory, setStepHistory] = useState<string[]>(["start"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

//   const serializeMessage = (message: MessageType): SerializedMessageType => {
//     return {
//       type: message.type,
//       content:
//         typeof message.content === "string"
//           ? message.content
//           : JSON.stringify(message.content),
//     };
//   };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const addChatMessages = (messages: MessageType[]) => {
    const serializedMessages = messages.map(serializeMessage);
    setChatMessages((prevMessages) => [...prevMessages, ...messages]);
    setSerializedMessages((prevMessages) => [
      ...prevMessages,
      ...serializedMessages,
    ]);
  };

  const nextStep = (nextStep: string) => {
    setStepHistory((prevHistory) => {
      const newHistory = [...prevHistory, currentStep];
      if (
        newHistory[newHistory.length - 2] === "start" &&
        currentStep === "start"
      ) {
        return prevHistory;
      }
      return newHistory;
    });
    setCurrentStep(nextStep);
  };

  const prevStep = () => {
    setStepHistory((prevHistory) => prevHistory.slice(0, -1));
    setCurrentStep(stepHistory[stepHistory.length - 1] || "start");
  };

  const goToStep = (step: string) => {
    setStepHistory((prevHistory) => [...prevHistory, currentStep]);
    setCurrentStep(step);
  };

  return {
    chatMessages,
    serializedMessages,
    currentStep,
    stepHistory,
    addChatMessages,
    nextStep,
    prevStep,
    goToStep,
  };
}
