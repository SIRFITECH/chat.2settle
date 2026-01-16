import useChatStore, { MessageType } from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { getBaseSymbol, phoneNumberPattern } from "@/utils/utilities";
import { usePaymentStore } from "stores/paymentStore";
import ConfirmAndProceedButton from "@/hooks/chatbot/confirmButtonHook";
import { useTransactionStore } from "stores/transactionStore";
import { useUserStore } from "stores/userStore";
import { Button } from "@/components/ui/button";
import { displaySendPayment } from "./menus/display.send.payment";

export const handleCryptoPayment = async (chatInput: string) => {
  const { currentStep, setLoading, addMessages } = useChatStore.getState();
  const { paymentMode, ticker, network, paymentAssetEstimate } =
    usePaymentStore.getState();

  const { updateUser, user } = useUserStore.getState();
  const phoneNumber = chatInput.trim();

  const ethConnect = false;
  const cryptoTicker = getBaseSymbol(ticker);

  if (greetings.includes(chatInput.trim().toLowerCase())) {
    helloMenu(chatInput);
  } else if (chatInput === "00") {
    (() => {
      helloMenu("hi");
    })();
  } else if (chatInput != "0") {
    setLoading(true);

    if (!phoneNumberPattern.test(phoneNumber)) {
      const newMessages: MessageType[] = [
        {
          type: "incoming",
          content: (
            <span>
              Please enter a valid phone number, <b>{phoneNumber}</b> is not a
              valid phone number.
            </span>
          ),
          timestamp: new Date(),
        },
      ];
      setLoading(false);
      addMessages(newMessages);
      return;
    }

    updateUser({ phone: phoneNumber });

    const isGift = paymentMode.toLowerCase() === "claim gift";
    const isGiftTrx = currentStep.transactionType?.toLowerCase() === "gift";
    const requestPayment =
      currentStep.transactionType?.toLowerCase() === "request";
    const payPayment = paymentMode.toLowerCase() === "payrequest";

    if (!isGift && !requestPayment && !payPayment) {
      const assetPayment = parseFloat(paymentAssetEstimate);
      const paymentAsset = `${assetPayment.toFixed(8)} ${cryptoTicker}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {network} ({cryptoTicker}) wallet.
                  </p>

                  {/* <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  /> */}
                </div>
              ),
              timestamp: new Date(),
            },
          ]
        : [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    Do you understand that you need to complete your payment
                    within <b>5 minutes</b>, otherwise you may lose your money.
                  </p>

                  {/* <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  /> */}
                </div>
              ),
              timestamp: new Date(),
            },
          ];

      setLoading(false);
      addMessages(newMessages);
    } else if (payPayment) {
      const assetPayment = parseFloat(paymentAssetEstimate);
      const paymentAsset = `${assetPayment.toFixed(8)} ${cryptoTicker}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {cryptoTicker} ({network}) wallet.
                  </p>
                  {/* <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  /> */}
                </div>
              ),
              timestamp: new Date(),
            },
          ]
        : [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    Do you understand that you need to complete your payment
                    within <b>5 minutes</b>, otherwise you may lose your money.
                  </p>

                  {/* <ConfirmAndProceedButton
                    phoneNumber={phoneNumber}
                    setLoading={setLoading}
                    sharedPaymentMode={sharedPaymentMode}
                    processTransaction={processTransaction}
                    network={network}
                    connectedWallet={ethConnect}
                    amount={sharedPaymentAssetEstimate}
                  /> */}
                </div>
              ),
              timestamp: new Date(),
            },
          ];

      setLoading(false);
      addMessages(newMessages);
    } else {
      console.log(
        "Calling processTransaction with:",
        phoneNumber,
        isGift,
        isGiftTrx,
        requestPayment
      );

      // await processTransaction(phoneNumber, isGift, isGiftTrx, requestPayment);
    }
  } else {
    setLoading(false);
    console.log("User input not recognized");
  }
};
