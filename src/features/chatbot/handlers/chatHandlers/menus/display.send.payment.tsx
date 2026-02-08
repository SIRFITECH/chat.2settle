import { formatCurrency } from "@/helpers/format_currency";
import { getBaseSymbol } from "@/utils/utilities";
import { useBankStore } from "stores/bankStore";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";

export const displaySendPayment = async () => {
  console.log("Displaying send payment message...");

  const {
    paymentAssetEstimate,
    paymentNairaEstimate,
    ticker,
    activeWallet,
    walletLastAssignedTime,
  } = usePaymentStore.getState();

  const { bankData } = useBankStore.getState();

  const { acct_number, bank_name, receiver_name } = bankData;

  const { currentStep, addMessages, next } = useChatStore.getState();

  const { giftId, transferId, requestId, transactionId } =
    useTransactionStore.getState();

  const paymentTicker = getBaseSymbol(ticker);
  const allowedTime = 5;
  const assetPayment = parseFloat(paymentAssetEstimate);
  const paymentAsset = `${assetPayment.toFixed(8)} ${paymentTicker}`;

  const isGift = currentStep.transactionType?.toLowerCase() === "gift";
  const isRequest = currentStep.transactionType?.toLowerCase() === "request";
  const isTransfer = currentStep.transactionType?.toLowerCase() === "transfer";
  const isRequestPayment =
    currentStep.transactionType?.toLowerCase() === "payrequest";

  const lastAssignedTime = walletLastAssignedTime
    ? new Date(walletLastAssignedTime)
    : new Date();

  const walletExpiryTime = new Date(
    lastAssignedTime.getTime() + allowedTime * 60 * 1000,
  );

  const messages: MessageType[] = [
    {
      type: "incoming",
      content: "Phone number confirmed",
      timestamp: new Date(),
    },
  ];

  // For request (no wallet needed, user is requesting payment)
  if (isRequest) {
    messages.push(
      {
        type: "incoming",
        content: (
          <span>
            You will receive{" "}
            <b>${formatCurrency(paymentNairaEstimate, "NGN", "en-NG")} </b>.
            <br />
            It would be paid into:
            <br />
            Bank Name: {bank_name}
            Account Number: {acct_number}
            Bank Name: {receiver_name}
            <br />
            You can copy the requestId below and share with the person to
            fulfill the request
          </span>
        ),
        timestamp: new Date(),
      },
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: transactionId, label: "Transaction ID" },
          persist: true,
        },
        timestamp: new Date(),
      },
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: requestId, label: "Request ID" },
          persist: true,
        },
        timestamp: new Date(),
      },
      {
        type: "incoming",
        content:
          "Disclaimer: You would get your payment as soon as your request is fulfilled",
        timestamp: new Date(),
      },
    );
  } else {
    // For transfer, gift, or request payment (needs wallet display)
    messages.push(
      {
        type: "incoming",
        content: (
          <span>
            Note: You are sending{" "}
            <b>
              ${paymentAsset} = $
              {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}
            </b>{" "}
            only to 2Settle wallet address to complete your transaction
          </span>
        ),
        timestamp: new Date(),
      },
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: {
            text: assetPayment.toFixed(8),
            label: `${paymentTicker} Amount`,
          },
          persist: true,
        },
        timestamp: new Date(),
      },
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: {
            text: activeWallet,
            label: "Wallet Address",
            isWallet: true,
            lastAssignedTime: lastAssignedTime,
          },
          persist: true,
        },
        timestamp: new Date(),
      },
      {
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: transactionId, label: "Transaction ID" },
          persist: true,
        },
        timestamp: new Date(),
      },
    );

    if (isGift) {
      messages.push({
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: giftId, label: "Gift ID" },
          persist: true,
        },
        timestamp: new Date(),
      });
    }

    if (isTransfer) {
      messages.push({
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: transferId, label: "Transfer ID" },
          persist: true,
        },
        timestamp: new Date(),
      });
    }

    if (isRequestPayment) {
      messages.push({
        type: "incoming",
        intent: {
          kind: "component",
          name: "CopyableText",
          props: { text: requestId, label: "Request ID" },
          persist: true,
        },
        timestamp: new Date(),
      });
    }

    messages.push({
      type: "incoming",
      content: (
        <span>
          This wallet address expires in <b>{allowedTime}</b> minutes
        </span>
      ),
      intent: {
        kind: "component",
        name: "CountdownTimer",
        props: { expiryTime: walletExpiryTime },
        persist: true,
      },
      timestamp: new Date(),
    });
  }

  addMessages(messages);
  next({ stepId: "start" });
};
