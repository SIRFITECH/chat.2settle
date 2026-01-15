import { usePaymentStore } from "stores/paymentStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayEnterId } from "./menus/display.enterid";
import useChatStore from "stores/chatStore";
import { displayTransactIDWelcome } from "./menus/transactionid.welcome";

export const handleCompleteTransactionId = async (chatInput: string) => {
  const { setPaymentMode } = usePaymentStore.getState();
  const { next, prev, addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput.trim() === "0") {
    (() => {
      prev();
      displayTransactIDWelcome();
    })();
  } else if (chatInput === "1") {
    // displayEnterCompleteTransactionId(addChatMessages, nextStep);
  } else if (chatInput === "2") {
    console.log("Let's see what is going on HERE!!!");
    setPaymentMode("Claim Gift");
    const paymentMode = usePaymentStore.getState().paymentMode;

      displayEnterId(paymentMode);
      next({ stepId: "claimGift"})
  } else if (chatInput === "3") {
    setPaymentMode("payRequest");
    const paymentMode = usePaymentStore.getState().paymentMode;

      displayEnterId(paymentMode);
       next({ stepId: "payRequest" });
  }
};
