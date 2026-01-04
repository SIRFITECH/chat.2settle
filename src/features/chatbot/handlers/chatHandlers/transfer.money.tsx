import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore from "stores/chatStore";
import { helloMenu } from "./hello.menu";

export const handleTransferMoney = (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;
  const telFirstName = "Mosnyik";

  {
    if (greetings.includes(chatInput.trim().toLowerCase())) {
      helloMenu(chatInput);
    } else if (chatInput === "00") {
      helloMenu("hi");
    } else if (chatInput === "0") {
      helloMenu("hi");
    } else if (chatInput === "1") {
      // console.log("The choice is ONE, TRANSACT CRYPTO");
    //   displayDisplayEstimateAsset();

      next({
        stepId: "transactCrypto",
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
