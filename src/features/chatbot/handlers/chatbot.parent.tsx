import { shortWallet } from "@/helpers/ShortenAddress";
import { fetchRate } from "@/services/rate/rates.service";
import { config } from "@/wagmi";
import useChatStore, { MessageType } from "stores/chatStore";
import { getAccount } from "wagmi/actions";
import { greetings } from "../helpers/ChatbotConsts";
import { formatCurrency } from "@/helpers/format_currency";
import ConnectWallet from "@/components/crypto/ConnectWallet";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export const helloMenu = async (chatInput?: string) => {
  console.log("we are at the start of the program");
  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;

  const telFirstName = "Mosnyik";

  const { sendChatInput, addMessages } = useChatStore.getState();
  if (greetings.includes((chatInput ?? "").trim().toLowerCase())) {
    if (walletIsConnected) {
      addMessages?.([
        {
          type: "incoming",
          content: (
            <span>
              How far {telFirstName} 👋
              <br />
              <br />
              You are connected as <b>{shortWallet(wallet)}</b>
              <br />
              <br />
              1. To disconnect wallet <br />
              2. Continue to transact
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      sendChatInput(chatInput!);
    } else {
      //   setSharedPaymentMode?.("");
      addMessages?.([
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
      sendChatInput(chatInput!);
    }
  } else {
      if (walletIsConnected) {
        addMessages?.([
          {
            type: "incoming",
            content: (
              <span>
                How far {telFirstName} 👋
                <br />
                <br />
                You are connected as <b>{shortWallet(wallet)}</b>
                <br />
                <br />
                1. To disconnect wallet <br />
                2. Continue to transact
              </span>
            ),
            timestamp: new Date(),
          },
        ]);
        sendChatInput(chatInput!);
      } else {
        //   setSharedPaymentMode?.("");
        addMessages?.([
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
        console.log("Wallet not connected", chatInput);
        sendChatInput(chatInput!);
      }
  }
};

export const welcomeMenu = async (chatInput?: string) => {
  let rate: number | null = null;

  try {
    rate = await fetchRate();
  } catch (err) {
    console.error("Failed to fetch rate", err);
  }
  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;

  const formatRate = formatCurrency(rate?.toString() ?? "0", "NGN", "en-NG");

  const telFirstName = "Mosnyik";
  const { addMessages } = useChatStore.getState();
  if (walletIsConnected) {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName} 👋
            <br />
            <br />
            You are connected as <b>{shortWallet(wallet)}</b>
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
      addMessages([
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


export function ConnectWalletWithChat() {
  const { isConnected } = useAccount();
  const { sendChatInput } = useChatStore();

  useEffect(() => {
    if (isConnected) {
      sendChatInput("connected");
    }
  }, [isConnected, sendChatInput]);

  return <ConnectWallet />;
}
export const connectWallet = async () => {
  const { sendChatInput, addMessages } = useChatStore.getState();

  addMessages([
    {
      type: "incoming",
      content: (
        <span>
          {" "}
          <ConnectWalletWithChat />
        </span>
      ),
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          To go back type 0:
          <br />
          <br />
          0. Go back
        </span>
      ),
      timestamp: new Date(),
    },
  ]);

  sendChatInput("connected");
};
