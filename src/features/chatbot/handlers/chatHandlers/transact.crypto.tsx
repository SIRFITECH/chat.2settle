import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore from "stores/chatStore";
import { shortWallet } from "@/helpers/ShortenAddress";
import { helloMenu } from "./hello.menu";
import { displayTransactCrypto } from "./menus/transact.crypto";

export const transactCrypto = (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;
  const telFirstName = "Mosnyik";

  // if (greetings.includes((chatInput ?? "").trim().toLowerCase())) {
  //   if (walletIsConnected) {
  //     addMessages?.([
  //       {
  //         type: "incoming",
  //         content: (
  //           <span>
  //             How far {telFirstName} 👋
  //             <br />
  //             <br />
  //             You are connected as <b>{shortWallet(wallet)}</b>
  //             <br />
  //             <br />
  //             1. To disconnect wallet <br />
  //             2. Continue to transact
  //           </span>
  //         ),
  //         timestamp: new Date(),
  //       },
  //     ]);
  //     // sendChatInput(chatInput!);
  //     next({
  //       stepId: "chooseAction",
  //     });
  //   } else {
  //     //   setSharedPaymentMode?.("");
  //     addMessages?.([
  //       {
  //         type: "incoming",
  //         content: (
  //           <span>
  //             How far {telFirstName}👋
  //             <br />
  //             <br />
  //             Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual
  //             assistance, <br />
  //             <b>Your wallet is not connected,</b> reply with:
  //             <br />
  //             <br />
  //             1. To connect wallet <br />
  //             2. To just continue
  //           </span>
  //         ),
  //         timestamp: new Date(),
  //       },
  //     ]);
  //     console.log("Wallet not connected");
  //     // sendChatInput(chatInput!);
  //     next({
  //       stepId: "chooseAction",
  //     });
  //   }
  // } else {
  //   addMessages?.([
  //     {
  //       type: "incoming",
  //       content: (
  //         <span>
  //           How far {telFirstName} 👋
  //           <br />
  //           <br />
  //           {/* You are connected as <b>{shortWallet(wallet)}</b> */}
  //           <br />
  //           <br />
  //           Handling make choice...
  //         </span>
  //       ),
  //       timestamp: new Date(),
  //     },
  //   ]);

  // }

  {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      helloMenu("hi");
    } else if (chatInput === "0") {
      helloMenu("hi");
    } else if (chatInput === "1") {
      // console.log("The choice is ONE, TRANSACT CRYPTO");
      displayTransactCrypto();

      next({
        stepId: "transferMoney",
      });
      // nextStep("transferMoney");
    }
    // else if (chatInput === "2") {
    //   // console.log("The choice is TWO, REQUEST PAY CARD");
    //   displayKYCInfo(addChatMessages, nextStep);
    // } else if (chatInput === "3") {
    //   displayCustomerSupportWelcome(addChatMessages, nextStep);
    // } else if (chatInput === "4") {
    //   // console.log("The choice is FOUR, TRANSACTION ID");
    //   displayTransactIDWelcome(addChatMessages, nextStep);
    // } else if (chatInput === "5") {
    //   // console.log("The choice is FIVE, REPORTLY");
    //   displayReportlyWelcome(addChatMessages, nextStep);
    //   // nextStep("transferMoney");
    // }
    else {
      addMessages([
        {
          type: "incoming",
          content:
            "Invalid choice. You need to choose an action from the options",
          timestamp: new Date(),
        },
      ]);
    }
  }
};


