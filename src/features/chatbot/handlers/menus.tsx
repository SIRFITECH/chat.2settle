/**
 * Handle menus, choices, navigation
 */

import ShortenedAddress from "@/helpers/ShortenAddress";
import { MessageType } from "@/types/general_types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { greetings } from "../helpers/ChatbotConsts";
import { helloMenu } from "./general";
import { WalletAddress } from "@/lib/wallets/types";
import ConnectBTCButton from "@/components/crypto/ConnectBTCButton";
import { StepId } from "@/core/transation_state_machine/steps";

// WELCOME USER DEPENDING ON IF THEY CONNECT WALLET OR NOT
export const welcomeMenu = (
  addChatMessages: (messages: MessageType[]) => void,
  walletIsConnected: boolean,
  wallet: WalletAddress,
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
  wallet: WalletAddress,
  telFirstName: string,
  formattedRate: string,
  nextStep: () => void,
  prevStep: () => void,
  goToStep: (step: StepId) => void,
  setChatInput: (chat: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  const choice = chatInput.trim();
  const isEth = wallet?.includes("0x");
  console.log("is ETH", isEth);
  if (greetings.includes(choice.toLowerCase())) {
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
  } else if (choice.toLowerCase() === "1") {
    if (!walletIsConnected) {
      addChatMessages([
        {
          type: "incoming",
          content: isEth ? <ConnectButton /> : <ConnectBTCButton />,
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
      nextStep();
      // nextStep("transactCrypto");
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
      nextStep();
      // nextStep("transactCrypto");
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
      nextStep();
      // nextStep("transactCrypto");
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
      nextStep();
      // nextStep("transactCrypto");
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
