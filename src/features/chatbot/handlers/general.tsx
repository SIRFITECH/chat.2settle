import ShortenedAddress from "@/helpers/ShortenAddress";
import { WalletAddress } from "@/lib/wallets/types";
import { MessageType } from "@/types/general_types";
import { greetings } from "../helpers/ChatbotConsts";
import { geminiAi } from "@/services/ai/ai-services";
import ConnectWallet from "@/components/crypto/ConnectWallet";
import { StepId } from "@/core/machines/steps";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

const next = useChatStore.getState().next;

let formatRate: string;
setTimeout(() => {
  formatRate = usePaymentStore.getState().rate;
  console.log({ formatRate });
}, 2500);

// const { data: formatRate, isLoading, error } = useRate()
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

export const aiChat = async (
  addChatMessages?: (messages: MessageType[]) => void,
  chatInput?: string,
  setSharedPaymentMode?: (mode: string) => void
) => {
  try {
    console.log("we are at the start");

    // window.localStorage.setItem("transactionID", "");
    setSharedPaymentMode?.("");
    const messages: any = [];
    const updatedMessages = [...messages, { role: "user", content: chatInput }];
    let sessionId = window.localStorage.getItem("transactionID");

    // ✅ If it doesn't exist, create and store it
    if (!sessionId) {
      sessionId = Math.floor(100000 + Math.random() * 900000).toString();
      window.localStorage.setItem("transactionID", sessionId);
      console.log("Generated new sessionId:", sessionId);
    } else {
      console.log("Using existing sessionId:", sessionId);
    }
       console.log("Generated new sessionId:", chatInput);
    // const reply = await OpenAI(updatedMessages, sessionId);
    const reply = await geminiAi(chatInput, sessionId);
    console.log("this is the response from backend", reply.reply);

    addChatMessages?.([
      {
        type: "incoming",
        content: <span>{reply.reply}</span>, // simplified: just the assistant's latest reply
        timestamp: new Date(),
      },
    ]);
  } catch (err) {
    console.error("There was an error from backend", err);
    addChatMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            😓 Sorry, something went wrong while processing your request.
            <br />
            Please try again in a moment.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};



export const helloMenu = (
  addChatMessages?: (messages: MessageType[]) => void,
  chatInput?: string,
  nextStep?: () => void,
  walletIsConnected?: boolean,
  wallet?: WalletAddress,
  telFirstName?: string,
  setSharedPaymentMode?: (mode: string) => void
) => {
  console.log("we are at the start of the program");
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
      // TODO: change this to nextStep() for consistency
      next();
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
    // TODO: change this to nextStep() for consistency
    next();
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
            <b> {formatRate}/$1</b>
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
              Today Rate: <b>{formatRate}/$1</b> <br />
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
// export const choiceMenu = (
//   addChatMessages: (messages: MessageType[]) => void,
//   chatInput: string,
//   walletIsConnected: boolean,
//   wallet: WalletAddress,
//   telFirstName: string,
//   formattedRate: string,
//   nextStep: () => void,
//   prevStep: () => void,
//   goToStep: (step: StepId) => void,
//   setSharedPaymentMode: (mode: string) => void
// ) => {
//   const choice = chatInput.trim();
//   if (greetings.includes(choice.toLowerCase())) {
//     // helloMenu(choice);
//     helloMenu(
//       addChatMessages,
//       choice,
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//     goToStep("start");
//   } else if (choice === "0") {
//     prevStep();
//     helloMenu(
//       addChatMessages,
//       "hi",
//       nextStep,
//       walletIsConnected,
//       wallet,
//       telFirstName,
//       setSharedPaymentMode
//     );
//   } else if (choice.toLowerCase() === "1") {
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectWallet />,
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//       // nextStep("transactCrypto");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: <ConnectWallet />,
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               Type to go back:
//               <br />
//               0. Go Back
//               <br />
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//       // nextStep("transactCrypto");
//     }
//   } else if (choice.toLowerCase() === "2") {
//     console.log("Rate is", formatRate);
//     if (!walletIsConnected) {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued <b>without connecting your wallet</b>
//               <br />
//               <br />
//               Today Rate: <b>{formatRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       nextStep();
//       // nextStep("transactCrypto");
//     } else {
//       addChatMessages([
//         {
//           type: "incoming",
//           content: (
//             <span>
//               You continued as{" "}
//               <b>
//                 <ShortenedAddress wallet={wallet} />
//               </b>
//               <br />
//               <br />
//               Today Rate: <b>{formatRate}/$1</b> <br />
//               <br />
//               Welcome to 2SettleHQ, how can I help you today?
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//         {
//           type: "incoming",
//           content: (
//             <span>
//               1. Transact Crypto
//               <br />
//               2. Request for paycard
//               <br />
//               3. Customer support
//               <br />
//               4. Transaction ID
//               <br />
//               5. Reportly
//               <br />
//               0. Back
//             </span>
//           ),
//           timestamp: new Date(),
//         },
//       ]);
//       // nextStep("transactCrypto");
//       nextStep();
//     }
//   } else {
//     addChatMessages([
//       {
//         type: "incoming",
//         content: (
//           <span>
//             You need to make a valid choice
//             <br />
//             <br />
//             Please Try again, or say 'Hi' or 'Hello' to start over
//           </span>
//         ),
//         timestamp: new Date(),
//       },
//     ]);
//   }
// };
