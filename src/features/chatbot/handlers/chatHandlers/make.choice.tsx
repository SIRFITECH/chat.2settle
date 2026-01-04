import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore from "stores/chatStore";
import { shortWallet } from "@/helpers/ShortenAddress";
import { helloMenu } from "./hello.menu";
import { displayTransactCrypto } from "./menus/transact.crypto";
import { displayKYCInfo } from "./menus/kyc.info";
import { displayCustomerSupportWelcome } from "./menus/customer.support";
import { displayTransactIDWelcome } from "./menus/transactionid.welcome";
import { displayReportlyWelcome } from "./menus/reportly.welcome";

export const handleMakeAChoice = (chatInput: string) => {
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
    // console.log("The choice is ONE, TRANSACT CRYPTO");
    displayTransactCrypto();

    next({
      stepId: "transactCrypto",
    });
  } else if (chatInput === "2") {
    console.log("The choice is TWO, REQUEST PAY CARD");
    displayKYCInfo();
    next({ stepId: "kycReg" });
  } else if (chatInput === "3") {
    displayCustomerSupportWelcome();
    next({ stepId: "assurance" });
  } else if (chatInput === "4") {
    // console.log("The choice is FOUR, TRANSACTION ID");
    displayTransactIDWelcome();
    next({ stepId: "completeTransactionId" });
  } else if (chatInput === "5") {
    // console.log("The choice is FIVE, REPORTLY");
    displayReportlyWelcome();
    // nextStep("transferMoney");
    next({ stepId: "makeReport" });
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
