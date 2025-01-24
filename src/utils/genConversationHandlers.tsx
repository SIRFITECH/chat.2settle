import ShortenedAddress from "@/components/shared/ShortenAddress";
import { MessageType } from "../types/general_types";
import { greetings } from "./ChatbotConsts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// ON HI | HELLO | HOWDY | HEY PROMPT
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

// WELCOME USER DEPENDING ON IF THEY CONNECT WALLET OR NOT
export const welcomeMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  telFirstName: string,
  formattedRate: string
) => {
  if (walletIsConnected) {
    addChatMessages([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName} 👋
            <br />
            <br />
            You are connected as
            <b>
              <ShortenedAddress wallet={wallet} />
            </b>
            <br />
            <br />
            Your wallet is connected. The current rate is
            <b> {formattedRate}/$1</b>
          </span>
        ),
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content: (
          <span>
            1. Transact Crypto
            <br />
            2. Request for paycard
            <br />
            3. Customer support
            <br />
            4. Transaction ID
            <br />
            5. Reportly,
          </span>
        ),
      },
    ] as unknown as MessageType[]);
  } else {
    {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued <b>without connecting your wallet</b>
              <br />
              <br />
              Today Rate: <b>{formattedRate}/$1</b> <br />
              <br />
              Welcome to 2SettleHQ {telFirstName}, how can I help you today?
            </span>
          ),
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              1. Transact Crypto
              <br />
              2. Request for paycard
              <br />
              3. Customer support
              <br />
              4. Transaction ID
              <br />
              5. Reportly
              <br />
              0. Back
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
    }
  }
};

// TRANSACT CRYPTO SEQUENCE FUNCTIONS
export const choiceMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  telFirstName: string,
  formattedRate: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setChatInput: (chat: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  const choice = chatInput.trim();
  if (greetings.includes(choice.toLowerCase())) {
    helloMenu(
      addChatMessages,
      choice,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
    goToStep("start");
  } else if (choice === "0") {
    prevStep();
    helloMenu(
      addChatMessages,
      "hi",
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (choice.toLowerCase() === "1") {
    if (!walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: <ConnectButton />,
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              Type to go back:
              <br />
              0. Go Back
              <br />
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      nextStep("transactCrypto");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: <ConnectButton />,
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              Type to go back:
              <br />
              0. Go Back
              <br />
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      nextStep("transactCrypto");
    }
  } else if (choice.toLowerCase() === "2") {
    if (!walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued <b>without connecting your wallet</b>
              <br />
              <br />
              Today Rate: <b>{formattedRate}/$1</b> <br />
              <br />
              Welcome to 2SettleHQ, how can I help you today?
            </span>
          ),
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              1. Transact Crypto
              <br />
              2. Request for paycard
              <br />
              3. Customer support
              <br />
              4. Transaction ID
              <br />
              5. Reportly
              <br />
              0. Back
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      nextStep("transactCrypto");
    } else {
      addChatMessages([
        {
          type: "incoming",
          content: (
            <span>
              You continued as{" "}
              <b>
                <ShortenedAddress wallet={wallet} />
              </b>
              <br />
              <br />
              Today Rate: <b>{formattedRate}/$1</b> <br />
              <br />
              Welcome to 2SettleHQ, how can I help you today?
            </span>
          ),
          timestamp: new Date(),
        },
        {
          type: "incoming",
          content: (
            <span>
              1. Transact Crypto
              <br />
              2. Request for paycard
              <br />
              3. Customer support
              <br />
              4. Transaction ID
              <br />
              5. Reportly
              <br />
              0. Back
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      nextStep("transactCrypto");
    }
  } else {
    addChatMessages([
      {
        type: "incoming",
        content: (
          <span>
            You need to make a valid choice
            <br />
            <br />
            Please Try again, or say 'Hi' or 'Hello' to start over
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
  setChatInput("");
};
