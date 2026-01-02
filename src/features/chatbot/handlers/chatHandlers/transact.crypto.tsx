import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore from "stores/chatStore";

export const handleMakeAChoice = (chatInput: string) => {
  const { sendChatInput, addMessages } = useChatStore.getState();

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;
  const telFirstName = "Mosnyik";

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
              {/* You are connected as <b>{shortWallet(wallet)}</b> */}
              <br />
              <br />
              Please choose what you want to do
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
              Please choose what you want to do
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
              {/* You are connected as <b>{shortWallet(wallet)}</b> */}
              <br />
              <br />
              Please choose what you want to do
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      // sendChatInput(chatInput!);
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
              Please choose what you want to do
            </span>
          ),
          timestamp: new Date(),
        },
      ]);
      console.log("Wallet not connected", chatInput);
      sendChatInput(chatInput!);
    }
  }

  //   if (greetings.includes(chatInput.trim().toLowerCase())) {
  //     helloMenu(
  //       chatInput,
  //     );
  //   } else if (chatInput === "00") {
  //     goToStep("start");
  //     helloMenu(
  //       addChatMessages,
  //       "hi",
  //       nextStep,
  //       walletIsConnected,
  //       wallet,
  //       telFirstName,
  //       setSharedPaymentMode
  //     );
  //   } else if (chatInput === "0") {
  //     console.log("Previous going back");
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
  //   } else if (chatInput === "1") {
  //     // console.log("The choice is ONE, TRANSACT CRYPTO");
  //     displayTransactCrypto(addChatMessages);

  //     nextStep();
  //     // nextStep("transferMoney");
  //   } else if (chatInput === "2") {
  //     // console.log("The choice is TWO, REQUEST PAY CARD");
  //     displayKYCInfo(addChatMessages, nextStep);
  //   } else if (chatInput === "3") {
  //     displayCustomerSupportWelcome(addChatMessages, nextStep);
  //   } else if (chatInput === "4") {
  //     // console.log("The choice is FOUR, TRANSACTION ID");
  //     displayTransactIDWelcome(addChatMessages, nextStep);
  //   } else if (chatInput === "5") {
  //     // console.log("The choice is FIVE, REPORTLY");
  //     displayReportlyWelcome(addChatMessages, nextStep);
  //     // nextStep("transferMoney");
  //   } else {
  //     addChatMessages([
  //       {
  //         type: "incoming",
  //         content:
  //           "Invalid choice. You need to choose an action from the options",
  //         timestamp: new Date(),
  //       },
  //     ]);
  //   }
};
