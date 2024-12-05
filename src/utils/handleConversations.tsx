import { MessageType } from "../types/general_types";
import { greetings } from "./ChatbotConsts";
import * as handlers from "./genConversationHandlers";
// Import other necessary functions and types

export const handleConversation = async (
  chatInput: string,
  currentStep: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  formattedRate: string,
  telFirstName: string,
  setLoading: (loading: boolean) => void,
  addChatMessages: (messages: MessageType[]) => void,
  setChatInput: (input: string) => void,
  goToStep: (step: string) => void,
  nextStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  try {
    setLoading(true);
    if (chatInput.trim()) {
      const newMessage: MessageType = {
        type: "outgoing",
        content: <span>{chatInput}</span>,
        timestamp: new Date(),
      };
      addChatMessages([newMessage]);
    }

    if (greetings.includes(chatInput.trim().toLowerCase())) {
      goToStep("start");
    }

    switch (currentStep) {
      case "start":
        handlers.helloMenu(
          addChatMessages,
          chatInput,
          walletIsConnected,
          wallet,
          telFirstName,
          setSharedPaymentMode,
          nextStep
        );
        break;
      case "chooseAction":
        handlers.choiceMenu(chatInput, walletIsConnected, formattedRate);
        break;
      // ... Handle all other cases
      default:
        addChatMessages([
          {
            type: "incoming",
            content: "Invalid choice, You can say 'Hi' or 'Hello' start over",
            timestamp: new Date(),
          },
        ]);
        break;
    }
  } catch (error) {
    // handleError(
    //   error instanceof Error ? error.message : "An unknown error occurred"
    // );
    addChatMessages([
      {
        type: "incoming",
        content:
          "I'm sorry, but an error occurred. Please try again or contact support if the problem persists.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setLoading(false);
    setChatInput("");
  }
};

