import { fetchCoinPrice } from "@/helpers/api_calls";
import { getBaseSymbol } from "@/utils/utilities";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { displayNetwork } from "./menus/display.network";
import { displayEnterPhone } from "./menus/display.phone";
import { getWalletType } from "@/helpers/transaction/transact_crypto";
import { getAccount } from "wagmi/actions";
import { config } from "@/wagmi";
import { useWalletStore } from "@/hooks/wallet/useWalletStore";

export const handleTransactCrypto = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const {
    assetPrice,
    paymentMode,
    setAssetPrice,
    setCrypto,
    setTicker,
    setNetwork,
  } = usePaymentStore.getState();

  const walletD = useWalletStore.getState();
  const account = getAccount(config);

  walletD
  // const walletIsConnected = account.isConnected;
  const wallet = walletD.address;
  const walletType = getWalletType(wallet);

  console.log({ walletD})

  const isRequest = paymentMode.toLowerCase() === "payrequest";

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    // if not connected to btc,
    // tell the user they can only transact btc if the connect to btc wallet

    console.log({ walletType });

    setCrypto("BTC");
    setTicker("BTCUSDT");
    setNetwork("BTC");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });
    // next({ stepId: "payOptions" });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
  } else if (chatInput === "2") {
    console.log({ walletType });

    setCrypto("ETH");
    setTicker("ETHUSDT");
    setNetwork("ERC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    // next({ stepId: "payOptions" });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });
  } else if (chatInput === "3") {
    console.log({ walletType });

    setCrypto("BNB");
    setTicker("BNBUSDT");
    setNetwork("BEP20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });
    // next({ stepId: "payOptions" });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
  } else if (chatInput === "4") {
    console.log({ walletType });

    setCrypto("TRX");
    setTicker("TRXUSDT");
    setNetwork("TRC20");
    const crypto = getBaseSymbol(usePaymentStore.getState().crypto);
    const ticker = getBaseSymbol(usePaymentStore.getState().ticker);
    const asset = await fetchCoinPrice(ticker);
    setAssetPrice(asset.toString());

    console.log({ assetPrice });
    isRequest
      ? displayEnterPhone()
      : displayHowToEstimation({ crypto, ticker });
    // next({ stepId: "payOptions" });
    isRequest ? next({ stepId: "enterPhone" }) : next({ stepId: "payOptions" });
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
