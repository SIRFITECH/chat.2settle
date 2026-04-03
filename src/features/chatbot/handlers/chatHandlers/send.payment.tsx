import { phoneNumberPattern } from "@/utils/utilities";
import useChatStore, { MessageType } from "stores/chatStore";
import { useUserStore } from "stores/userStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { processTransaction } from "@/core/process_transaction/process_transction_helpers";

export const handleCryptoPayment = async (chatInput: string) => {
  const { setLoading, addMessages } = useChatStore.getState();
  const { updateUser } = useUserStore.getState();
  const phoneNumber = chatInput.trim();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput !== "0") {
    if (!phoneNumberPattern.test(phoneNumber)) {
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: (
            <span>
              Please enter a valid phone number, <b>{phoneNumber}</b> is not
              valid.
            </span>
          ),
          timestamp: new Date(),
        },
      ];
      addMessages(newMessages);
      return;
    }

    updateUser({ phone: phoneNumber });

    setLoading(true);
    try {
      await processTransaction();
    } finally {
      setLoading(false);
    }
  }
};
