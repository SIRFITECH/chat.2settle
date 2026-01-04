import { config } from "@/wagmi";
import { getAccount } from "wagmi/actions";
import { greetings } from "../../helpers/ChatbotConsts";
import useChatStore, { MessageType } from "stores/chatStore";
import { helloMenu } from "./hello.menu";
import { displayTransferMoney } from "./menus/transfer.money";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { usePaymentStore } from "stores/paymentStore";

export const handleTransactCrypto = (chatInput: string) => {
  const { addMessages } = useChatStore.getState();
  const { setCrypto, setTicker } = usePaymentStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    setCrypto("Bitcoin");
    setTicker("BTC");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "2") {
      setCrypto("Ethereum");
      setTicker("ETH");
      const crypto = usePaymentStore.getState().crypto;
      const ticker = usePaymentStore.getState().ticker;
      displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "3") {
      setCrypto("Binance");
      setTicker("BNB");
      const crypto = usePaymentStore.getState().crypto;
      const ticker = usePaymentStore.getState().ticker;
      displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "3") {
      setCrypto("Tron");
      setTicker("TRX");
      const crypto = usePaymentStore.getState().crypto;
      const ticker = usePaymentStore.getState().ticker;
      displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "3") {
      setCrypto("USDT");
      setTicker("USDT");
      const crypto = usePaymentStore.getState().crypto;
      const ticker = usePaymentStore.getState().ticker;
      displayHowToEstimation({ crypto, ticker });
  } else {
    addMessages([
      {
        type: "incoming",
        content: "Invalid choice. Say 'Hi' or 'Hello' to start over",
        timestamp: new Date(),
      },
    ]);
  }
};
