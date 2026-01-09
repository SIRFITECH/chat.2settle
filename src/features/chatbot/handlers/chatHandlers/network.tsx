import { getWalletType } from "@/helpers/transaction/transact_crypto";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { displayHowToEstimation } from "./menus/how.to.estimate";
import { getAccount } from "wagmi/actions";
import { config } from "@/wagmi";

export const handleNetwork = async (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();

  const account = getAccount(config);

  const walletIsConnected = account.isConnected;
  const wallet = account.address;

  const { assetPrice, setAssetPrice, setCrypto, setTicker, setNetwork } =
    usePaymentStore.getState();

  const { rate } = usePaymentStore.getState();
  setAssetPrice(rate);

  const walletType = getWalletType(wallet);
  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput === "0") {
    (() => {
      //   displayTransferMoney();
    })();
  } else if (chatInput === "1") {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("ERC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    displayHowToEstimation({ crypto, ticker });
    // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone(addChatMessages, nextStep);
    // } else {
    //   if (walletIsConnected && walletType !== "EVM") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `USDT (ERC20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {

    // nextStep();
    next({ stepId: "payOptions" });
    //   }
    // }
  } else if (chatInput === "2") {
    // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone();
    // } else {
    //   if (walletIsConnected && walletType !== "TRX") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `TRC20 is only supported when TRX wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("TRC20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    displayHowToEstimation({ crypto, ticker });

    // nextStep();
    next({ stepId: "payOptions" });
    //   }
    // }
  } else if (chatInput === "3") {
    // sharedGiftId
    // if (sharedPaymentMode.toLowerCase() === "payrequest") {
    //   displayEnterPhone(addChatMessages, nextStep);
    // } else {
    //   if (walletIsConnected && walletType !== "EVM") {
    //     addChatMessages([
    //       {
    //         type: "incoming",
    //         content: `USDT (BEP20) is only supported when EVM wallet is connected. \n Please select the asset of the wallet connected`,
    //         timestamp: new Date(),
    //       },
    //     ]);
    //     return;
    //   } else {
    setCrypto("USDT");
    setTicker("USDT");
    setNetwork("BEP20");
    const crypto = usePaymentStore.getState().crypto;
    const ticker = usePaymentStore.getState().ticker;
    displayHowToEstimation({ crypto, ticker });
    // nextStep();
    next({ stepId: "payOptions" });
    //   }
    // }
  } else {
    addMessages([
      {
        type: "incoming",
        content:
          "Invalid choice. Choose your prefered network or say Hi if you are stock.",
        timestamp: new Date(),
      },
    ]);
  }
};
