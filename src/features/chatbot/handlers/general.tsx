import ConnectWallet from "../../../components/shared/ConnectWallet";
import ShortenedAddress from "@/components/shared/ShortenAddress";
import { MessageType } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";
import { WalletAddress } from "@/lib/wallets/types";

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

// OPERATINAL FUNCTIONS
// ON HI | HELLO | HOWDY | HEY PROMPT

// Welcome message for the user with instruction on how to start a chat
export const helloMenu = (
  addChatMessages?: (messages: MessageType[]) => void,
  chatInput?: string,
  nextStep?: (step: string) => void,
  walletIsConnected?: boolean,
  wallet?: WalletAddress,
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
  } else {
    addChatMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            👋 How far {telFirstName}!
            <br />
            <br />I didn't catch that. To start a conversation with me, kindly
            say something like <b>"hi"</b>, <b>"hello"</b>,<b> "howdy"</b>, or{" "}
            <b>"hey"</b>
            <br />
            <br />
            I'm ready when you are 😄
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};

// WELCOME USER DEPENDING ON IF THEY CONNECT WALLET OR NOT
export const welcomeMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  formattedRate: string,
  walletIsConnected?: boolean,
  wallet?: WalletAddress,
  telFirstName?: string
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

// Allow user to choose whether to use wallet or not
export const choiceMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: WalletAddress,
  telFirstName: string,
  formattedRate: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  const choice = chatInput.trim();
  if (greetings.includes(choice.toLowerCase())) {
    // helloMenu(choice);
    helloMenu(
      addChatMessages,
      choice,
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
    goToStep("start");
  } else if (choice === "0") {
    prevStep();
    helloMenu(
      addChatMessages,
      "hi",
      nextStep,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode
    );
    // helloMenu("hi");
  } else if (choice.toLowerCase() === "1") {
    if (!walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: <ConnectWallet />,
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
          content: <ConnectWallet />,
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
};
