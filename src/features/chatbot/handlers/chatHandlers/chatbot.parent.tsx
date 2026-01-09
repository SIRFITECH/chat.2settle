import { shortWallet } from "@/helpers/ShortenAddress";
import { config } from "@/wagmi";
import useChatStore, { MessageType } from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { formatCurrency } from "@/helpers/format_currency";
import ConnectWallet from "@/components/crypto/ConnectWallet";
import { useAccount } from "wagmi";
import { useEffect } from "react";

export function ConnectWalletWithChat() {
  const { isConnected } = useAccount();
  // const { sendChatInput } = useChatStore();

  //   useEffect(() => {
  //     if (isConnected) {
  //       sendChatInput("connected");
  //     }
  //   }, [isConnected, sendChatInput]);

  return <ConnectWallet />;
}
export const connectWallet = async () => {
  const { next, addMessages } = useChatStore.getState();

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

  // sendChatInput("connected");
  next({
    stepId: "chooseAction",
  });
};
