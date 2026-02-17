import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";
import { usePaymentStore } from "stores/paymentStore";
import useChatStore, { MessageType } from "stores/chatStore";
import { formatCurrency } from "@/helpers/format_currency";
import { helloMenu } from "./hello.menu";
import { displayPayIn } from "./menus/display.payment.options";

export const handlePayOptions = (chatInput: string) => {
  const { crypto, setEstimateAsset } = usePaymentStore.getState();
  const { next, addMessages } = useChatStore.getState();
  const currentStep = useChatStore.getState().currentStep;

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
  
  } else if (chatInput === "1") {
    displayPayIn();

    setEstimateAsset("Naira");
    next({ stepId: "charge" });
    // nextStep("charge);
  } else if (chatInput === "2") {
    displayPayIn();

    setEstimateAsset("Dollar");
    next({ stepId: "charge" });
    // nextStep("charge);
  } else if (chatInput === "3") {
    console.log("We are paying with crypto");

    displayPayIn();

    setEstimateAsset(crypto);
    next({ stepId: "charge" });
  } else if (currentStep.transactionType?.trim().toLowerCase() === "request") {
    displayPayIn();

    setEstimateAsset("Naira");
    next({ stepId: "charge" });
  } else {
    addMessages([
      {
        type: "incoming",
        content: "Invalid choice. Please choose a valid pay option.",

        timestamp: new Date(),
      },
    ]);
  }
};
