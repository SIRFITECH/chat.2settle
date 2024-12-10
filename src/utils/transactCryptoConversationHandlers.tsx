import { MessageType } from "@/types/general_types";
import { greetings } from "./ChatbotConsts";
import { displayTransactCrypto } from "@/menus/transact_crypto";
import { displayKYCInfo } from "@/menus/request_paycard";
import { displayCustomerSupportWelcome } from "@/menus/customer_support";
import { displayReportlyWelcome } from "@/menus/reportly";
import { displayTransactIDWelcome } from "@/menus/transaction_id";
import { helloMenu } from "./genConversationHandlers";

export const handleMakeAChoice = (
  addChatMessages: (messages: MessageType[]) => void,
  chatInput: string,
  walletIsConnected: boolean,
  wallet: `0x${string}` | undefined,
  telFirstName: string,
  nextStep: (step: string) => void,
  prevStep: () => void,
  goToStep: (step: string) => void,
  setSharedPaymentMode: (mode: string) => void
) => {
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    goToStep("start");
    helloMenu(
      addChatMessages,
      chatInput,
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (chatInput === "00") {
    goToStep("start");
    helloMenu(
      addChatMessages,
      "hi",
      walletIsConnected,
      wallet,
      telFirstName,
      setSharedPaymentMode,
      nextStep
    );
  } else if (chatInput === "0") {
    prevStep();
     helloMenu(
       addChatMessages,
       "hi",
       walletIsConnected,
       wallet,
       telFirstName,
       setSharedPaymentMode,
       nextStep
     );
  } else if (chatInput === "1") {
    // console.log("The choice is ONE, TRANSACT CRYPTO");
    displayTransactCrypto(addChatMessages);

    nextStep("transferMoney");
  } else if (chatInput === "2") {
    // console.log("The choice is TWO, REQUEST PAY CARD");
    displayKYCInfo(addChatMessages, nextStep);
  } else if (chatInput === "3") {
    displayCustomerSupportWelcome(addChatMessages, nextStep);
  } else if (chatInput === "4") {
    // console.log("The choice is FOUR, TRANSACTION ID");
    displayTransactIDWelcome(addChatMessages, nextStep);
  } else if (chatInput === "5") {
    // console.log("The choice is FIVE, REPORTLY");
    displayReportlyWelcome(addChatMessages, nextStep);
    // nextStep("transferMoney");
  } else {
    addChatMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. You need to choose an action from the options",
        timestamp: new Date(),
      },
    ]);
  }
};

// // ... Continue extracting all other functions
