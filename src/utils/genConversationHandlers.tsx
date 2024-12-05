import ShortenedAddress from "@/components/ShortenAddress";
import { MessageType } from "../types/general_types";
import { greetings } from "./ChatbotConsts";

// Import other necessary functions and types
// prevStep: (step: string) => void,
// goToStep: (step: string) => void
export const helloMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  telFirstName: string,
  setSharedPaymentMode: (mode: string) => void,
  nextStep: (step: string) => void
) => {
  console.log("we are at the start");
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    window.localStorage.setItem("transactionID", "");
    setSharedPaymentMode("");
    if (walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              How far {telFirstName} 👋
              <br />
              <br />
              You are connected as{" "}
              <b>
                <ShortenedAddress wallet={wallet} />
              </b>
              <br />
              <br />
              1. To disconnect wallet <br />
              2. Continue to transact
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      nextStep("chooseAction");
    } else {
      setSharedPaymentMode("");
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              How far {telFirstName}👋
              <br />
              <br />
              Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual
              assistance, <br />
              <b>Your wallet is not connected,</b> reply with:
              <br />
              <br />
              1. To connect wallet <br />
              2. To just continue
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      console.log("Wallet not connected");
    }
    nextStep("chooseAction");
  }
};

export const welcomeMenu = (
  walletIsConnected: boolean,
  wallet: string,
  telFirstName: string,
  formattedRate: string
) => {
  // Implementation of welcomeMenu
};

export const choiceMenu = (
  chatInput: string,
  walletIsConnected: boolean,
  formattedRate: string
) => {
  // Implementation of choiceMenu
};

// ... Extract all other functions called in handleConversation
// Make sure to update the function signatures to include all necessary parameters

export const handleMakeAChoice = (chatInput: string) => {
  // Implementation of handleMakeAChoice
};

// ... Continue extracting all other functions
