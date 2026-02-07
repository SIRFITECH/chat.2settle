import { CopyableText } from "@/features/transact/CopyableText";
import { formatCurrency } from "@/helpers/format_currency";
import { CountdownTimer } from "@/helpers/format_date";
import { getBaseSymbol } from "@/utils/utilities";
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

  const { currentStep, addMessages } = useChatStore.getState();

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

  // Calculate wallet expiry time from lastAssignedTime
  const lastAssignedTime = walletLastAssignedTime
    ? new Date(walletLastAssignedTime)
    : new Date();

  const walletExpiryTime = new Date(
    lastAssignedTime.getTime() + allowedTime * 60 * 1000
  );

  // Generate the transaction summary message
  const generateTransactionSummary = () => {
    // For request (no wallet needed, user is requesting payment)
    if (isRequest) {
      return (
        <div>
          You will receive{" "}
          <b>{formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}</b>.
          <br />
          <br />
          <CopyableText text={transactionId} label="Transaction ID" />
          <br />
          <CopyableText text={requestId} label="Request ID" />
          <br />
          <br />
          Disclaimer: You would get your payment as soon as your request is
          fulfilled
        </div>
      );
    }

    // For transfer, gift, or request payment (needs wallet display)
    return (
      <div>
        Note: You are sending{" "}
        <b>
          {paymentAsset} = {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}
        </b>{" "}
        only to 2Settle wallet address to complete your transaction
        <br />
        <br />
        <CopyableText
          text={assetPayment.toFixed(8)}
          label={`${paymentTicker} Amount`}
        />
        <br />
        <CopyableText
          text={activeWallet}
          label="Wallet Address"
          isWallet={true}
          lastAssignedTime={lastAssignedTime}
        />
        <br />
        <CopyableText text={transactionId} label="Transaction ID" />
        <br />
        {isGift && (
          <>
            <CopyableText text={giftId} label="Gift ID" />
            <br />
          </>
        )}
        {isTransfer && (
          <>
            <CopyableText text={transferId} label="Transfer ID" />
            <br />
          </>
        )}
        {isRequestPayment && (
          <>
            <CopyableText text={requestId} label="Request ID" />
            <br />
          </>
        )}
        <br />
        This wallet address expires in <b>{allowedTime} minutes</b>{" "}
        <CountdownTimer expiryTime={walletExpiryTime} />
      </div>
    );
  };

  const initialMessages: MessageType[] = [
    {
      type: "incoming",
      content: "Phone number confirmed",
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: generateTransactionSummary(),
      timestamp: new Date(),
    },
  ];

  addMessages(initialMessages);
};
