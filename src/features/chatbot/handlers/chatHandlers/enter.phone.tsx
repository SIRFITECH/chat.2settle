import useChatStore from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displaySearchBank } from "./menus/display.bank.search";
import { displayEnterPhone } from "./menus/display.phone";

export const handlePhoneNumber = async (chatInput: string) => {
  const { prev, next, addMessages } = useChatStore.getState();
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      // console.log("THIS IS WHERE WE ARE");
      prev();
      displaySearchBank();
    })();
  } else if (chatInput !== "0") {
    // check if number is valid phone
    displayEnterPhone();
    next({ stepId: "sendPayment" });
  } else {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Please enter a valid Phone Number.
           
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
