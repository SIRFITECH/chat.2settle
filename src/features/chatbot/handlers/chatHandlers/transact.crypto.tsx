import { fetchCoinPrice } from "@/helpers/api_calls";
import { getBaseSymbol } from "@/utils/utilities";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { displayNetwork } from "./menus/display.network";

export const handleTransactCrypto = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const { assetPrice, setAssetPrice, setCrypto, setTicker, setNetwork } =
    usePaymentStore.getState();

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    setCrypto("Bitcoin");
    setTicker("BTCUSDT");
    setNetwork("BTC");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "2") {
    setCrypto("Ethereum");
    setTicker("ETHUSDT");
    setNetwork("ERC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "3") {
    setCrypto("Binance");
    setTicker("BNBUSDT");
    setNetwork("BEP20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "4") {
    setCrypto("Tron");
    setTicker("TRXUSDT");
    setNetwork("TRC20");
    const crypto = getBaseSymbol(usePaymentStore.getState().crypto);
    const ticker = getBaseSymbol(usePaymentStore.getState().ticker);
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "5") {
    displayNetwork();
    next({ stepId: "network" });
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
