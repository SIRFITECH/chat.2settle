import { ConnectButton } from "@rainbow-me/rainbowkit";
import ShortenedAddress from "@/components/shared/ShortenAddress";
import { MessageType } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";

/**
 *
 * @param addChatMessages
 * @param chatInput
 * @param walletIsConnected
 * @param wallet
 * @param telFirstName
 * @param setSharedPaymentMode
 * @param nextStep
 *
 * Handle greetings, chat starters and session initialization
 */

// ON HI | HELLO | HOWDY | HEY PROMPT
export const helloMenu = (
  addChatMessages?: (messages: MessageType[]) => void,
  chatInput?: string,
  nextStep?: (step: string) => void,
  walletIsConnected?: boolean,
  wallet?: `0x${string}` | undefined,
  telFirstName?: string,
  setSharedPaymentMode?: (mode: string) => void
) => {
  console.log("we are at the start");
  if (greetings.includes((chatInput ?? "").trim().toLowerCase())) {
    window.localStorage.setItem("transactionID", "");
    setSharedPaymentMode?.("");
    if (walletIsConnected) {
      addChatMessages?.([
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
      nextStep?.("chooseAction");
    } else {
      setSharedPaymentMode?.("");
      addChatMessages?.([
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
    nextStep?.("chooseAction");
  }
};

