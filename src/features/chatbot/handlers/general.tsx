import ConnectWallet from "../../../components/shared/ConnectWallet";
import ShortenedAddress from "@/components/shared/ShortenAddress";
import { MessageType } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";
import { WalletAddress } from "@/lib/wallets/types";
import { useEffect, useState } from 'react';
import { OpenAI } from "@/helpers/api_calls";

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
export const helloMenu = async (
  addChatMessages?: (messages: MessageType[]) => void,
  chatInput?: string,
  nextStep?: (step: string) => void,
  walletIsConnected?: boolean,
  wallet?: WalletAddress,
  telFirstName?: string,
  setSharedPaymentMode?: (mode: string) => void
) => {
  // const [messages, setMessages] = useState([{}]);
  // const [newMessages, setNewMessages] = useState([]);
  // const [loading, setLoading] = useState(false);

  console.log("we are at the start");
  
    window.localStorage.setItem("transactionID", "");
    setSharedPaymentMode?.("");
    const messages: any = []
    const updatedMessages = [...messages, { role: 'user', content: chatInput }];
     const reply = await OpenAI(
       updatedMessages 
     )
    console.log('this is the response from backend', reply.reply)

    addChatMessages?.([
      {
        type: "incoming",
        content: <span>{reply.reply}</span>, // simplified: just the assistant's latest reply
        timestamp: new Date(),
      },
    ]);

  }



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
