import { phoneNumberPattern } from "@/utils/utilities";
import useChatStore from "stores/chatStore";
import { useUserStore } from "stores/userStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displaySearchBank } from "./menus/display.bank.search";
import { displayEnterPhone } from "./menus/display.phone";
import { processTransaction } from "@/core/process_transaction/process_transction_helpers";

export const handlePhoneNumber = async (chatInput: string) => {
  const { prev, next, addMessages, setLoading } = useChatStore.getState();
  const { updateUser } = useUserStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    prev();
    displaySearchBank();
  } else if (chatInput.trim() === "1") {
    // Transfer flow: user confirmed bank details, now ask for phone
    displayEnterPhone();
    next({ stepId: "sendPayment" });
  } else if (phoneNumberPattern.test(chatInput.trim())) {
    // Gift/request flow: phone entered directly at this step
    updateUser({ phone: chatInput.trim() });
    setLoading(true);
    try {
      await processTransaction();
    } finally {
      setLoading(false);
    }
  } else {
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Please enter a valid phone number.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
  }
};
