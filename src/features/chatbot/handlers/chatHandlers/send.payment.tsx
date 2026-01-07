import useChatStore, { MessageType } from "stores/chatStore";
import { greetings } from "../../helpers/ChatbotConsts";
import { helloMenu } from "./hello.menu";
import { getBaseSymbol, phoneNumberPattern } from "@/utils/utilities";
import { usePaymentStore } from "stores/paymentStore";
import ConfirmAndProceedButton from "@/hooks/chatbot/confirmButtonHook";
import { useTransactionStore } from "stores/transactionStore";

export const handleCryptoPayment = async (
  //   addMessages: (messages: MessageType[]) => void,
  chatInput: string
  //   sharedCrypto: string,
  //   sharedNetwork: string,
  //   sharedPaymentMode: string,
  //   ethConnect: boolean,
  //   sharedPaymentAssetEstimate: string,
  //   walletIsConnected: boolean,
  //   wallet: WalletAddress,
  //   telFirstName: string,
  //   setSharedPhone: (phoneNumber: string) => void,
  //   processTransaction: (
  //     phoneNumber: string,
  //     isGift: boolean,
  //     isGiftTrx: boolean,
  //     requestPayment: boolean,
  //     activeWallet?: string,
  //     lastAssignedTime?: Date
  //   ) => Promise<void>,
  //   nextStep: () => void,
  //   goToStep: (step: StepId) => void,
  //   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  //   setSharedPaymentMode: (mode: string) => void
) => {
  const { setLoading, addMessages } = useChatStore.getState();
  const currentStep = useChatStore.getState().currentStep;
  const { paymentAssetEstimate, ticker, network } = usePaymentStore.getState();
  const { updateTransaction } = useTransactionStore.getState();

  const crypto = getBaseSymbol(ticker);

  // TODO: change this to read wallet connection
  const ethConnect = false;

  const phoneNumber = chatInput.trim();

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

    // updateTransaction(phoneNumber);

    const isGift = currentStep.transactionType?.toLowerCase() === "claim gift";
    const isGiftTrx = currentStep.transactionType?.toLowerCase() === "gift";
    const requestPayment =
      currentStep.transactionType?.toLowerCase() === "request";
    const payPayment =
      currentStep.transactionType?.toLowerCase() === "payrequest";

    if (!isGift && !requestPayment && !payPayment) {
      const assetPayment = parseFloat(paymentAssetEstimate);
      const paymentAsset = `${assetPayment.toFixed(8)} ${crypto}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {crypto} ({network}) wallet.
                  </p>
                  //{" "}
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
      const paymentAsset = `${assetPayment.toFixed(8)} ${crypto}`;

      const newMessages: MessageType[] = ethConnect
        ? [
            {
              type: "incoming",
              content: (
                <div className="flex flex-col items-center">
                  <p className="mb-4">
                    You are going to be charged <b>{paymentAsset}</b> directly
                    from your {crypto} ({network}) wallet.
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

      //   await processTransaction(phoneNumber, isGift, isGiftTrx, requestPayment);
    }
  } else {
    setLoading(false);
    console.log("User input not recognized");
  }
};
