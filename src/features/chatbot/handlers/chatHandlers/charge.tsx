import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayCharge } from "./menus/display.charge";

export const handleCharge = (chatInput: string) => {
  const { addMessages } = useChatStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      // console.log("Going back from handlePayOptions");
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("Going back from handlePayOptions");
    //   displayHowToEstimation();
    })();
  } else if (chatInput != "0") {
    // setSharedAmount(chatInput.trim());
    //TODO: set the payment amount in usePayment()
    console.log("Lets see what comes in", chatInput.trim());
    displayCharge(chatInput);
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Do you want to include charge in your estimate or not?.",

        timestamp: new Date(),
      },
    ]);
  }
};
