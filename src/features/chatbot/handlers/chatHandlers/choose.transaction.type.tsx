import { config } from "@/wagmi";
import useChatStore from "stores/chatStore";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayCustomerSupportWelcome } from "./menus/customer.support";
import { displayKYCInfo } from "./menus/kyc.info";
import { displayReportlyWelcome } from "./menus/reportly.welcome";
import { displayTransactIDWelcome } from "./menus/transactionid.welcome";
import { displayTransferMoney } from "./menus/transfer.money";

// select how you want to transactCrypto (transferMoney, sendGift, requestpyment)
export const handleChooseTransactionType = (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;
  const telFirstName = "Mosnyik";

  console.log("Chatinput from make choice", chatInput);
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    console.log("The choice is ONE, handleChooseTransactionType");
    displayTransferMoney();
    next({
      stepId: "transactCrypto",
      transactionType: "transfer",
    });
  } else if (chatInput === "2") {
    console.log("The choice is TWO, REQUEST PAY CARD");
    displayTransferMoney();
    next({
      stepId: "transactCrypto",
      transactionType: "gift",
    });
  } else if (chatInput === "3") {
    displayTransferMoney();
    next({
      stepId: "transactCrypto",
      transactionType: "request",
    });
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. You need to choose an action from the options",
        timestamp: new Date(),
      },
    ]);
  }
};
