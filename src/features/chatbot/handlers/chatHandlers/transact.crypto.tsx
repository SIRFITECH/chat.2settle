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

  const { isConnected, address } = useWalletStore.getState();
  const walletIsConnected = isConnected;

  const wallet = address;
  const walletType = getWalletType(wallet);

  const isRequest = paymentMode.toLowerCase() === "payrequest";

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    helloMenu("hi");
  } else if (chatInput === "0") {
    helloMenu("hi");
  } else if (chatInput === "1") {
    const walletType = getWalletType(wallet);
    if (walletIsConnected && walletType !== "BTC") {
      addMessages([
        {
          type: "incoming",
          content: `BTC is only supported when BTC wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

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
    if (walletIsConnected && walletType !== "EVM") {
      addMessages([
        {
          type: "incoming",
          content: `ETH is only supported when ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setCrypto("ETH");
    setTicker("ETHUSDT");
    setNetwork("ETH");
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
    if (walletIsConnected && walletType !== "EVM") {
      addMessages([
        {
          type: "incoming",
          content: `BNB is only supported when BNB/ETH wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setCrypto("BNB");
    setTicker("BNBUSDT");
    setNetwork("BNB");
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
    if (walletIsConnected && walletType !== "TRX") {
      addMessages([
        {
          type: "incoming",
          content: `TRX is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    setCrypto("TRX");
    setTicker("TRXUSDT");
    setNetwork("TRX");
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
    if (walletIsConnected && walletType !== "EVM" && walletType !== "TRX") {
      addMessages([
        {
          type: "incoming",
          content: `USDT is only supported when ETH or TRX wallet is connected. \n Please select the asset of the wallet connected`,
          timestamp: new Date(),
        },
      ]);
      return;
    }
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
