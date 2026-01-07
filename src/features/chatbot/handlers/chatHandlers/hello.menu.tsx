import { config } from "@/wagmi";
import useChatStore from "stores/chatStore";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import { shortWallet } from "@/helpers/ShortenAddress";
import { useUserStore } from "stores/userStore";

export const helloMenu = async (chatInput?: string) => {
  const { next, addMessages } = useChatStore.getState();
  const { user } = useUserStore.getState();
  console.log("we are at the start of the program", user);

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;

  const telFirstName = user?.telegram?.username;

  console.log("User chatinput", chatInput);

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
      // sendChatInput(chatInput!);
      next({
        stepId: "chooseAction",
      });
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
      // sendChatInput(chatInput!);
      next({
        stepId: "chooseAction",
      });
    }
  } else {
    addMessages?.([
      {
        type: "incoming",
        content: (
          <span>
            How far {telFirstName}👋
            <br />
            <br />
            It seems you entered the wrong respose, try <b>hi,</b> <b>hey,</b>{" "}
            <b>hello</b> or <b>howdy</b>
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
