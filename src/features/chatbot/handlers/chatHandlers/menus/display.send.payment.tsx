import { CopyableText } from "@/features/transact/CopyableText";
import { formatCurrency } from "@/helpers/format_currency";
import { ReactNode } from "react";
import { MessageType } from "stores/chatStore";

export const displaySendPayment = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void,
  wallet: string,
  sharedCrypto: string,
  sharedPaymentAssetEstimate: string,
  sharedPaymentNairaEstimate: string,
  transactionID: number,
  sharedNetwork: string,
  sharedPaymentMode: string,
  connectedWallet: boolean,
  giftID?: number,
  requestID?: number,
  lastAssignedTime?: Date
) => {
  const allowedTime = 5;
  const assetPayment = parseFloat(sharedPaymentAssetEstimate);
  const paymentAsset = `${assetPayment.toFixed(8)} ${sharedCrypto}`;
  const isGift = sharedPaymentMode.toLowerCase() === "gift";
  const isRequest = sharedPaymentMode.toLowerCase() === "request";
  const isRequestPayment = sharedPaymentMode.toLowerCase() === "payrequest";

  const copyableTransactionID = (
    <>
      Tap to copy Transaction ID 👇🏾 : {transactionID.toString()}
      <CopyableText
        text={transactionID.toString()}
        label={"Transaction ID"}
        addChatMessages={addChatMessages}
        nextStep={nextStep}
        lastAssignedTime={lastAssignedTime}
      />
    </>
  );

  const copyableGiftID = isGift ? (
    <>
      Tap to copy Gift ID 👇🏾 : {giftID?.toString()}
      <CopyableText
        text={giftID?.toString() || ""}
        label={"Gift ID"}
        addChatMessages={addChatMessages}
        nextStep={nextStep}
        lastAssignedTime={lastAssignedTime}
      />
    </>
  ) : null;

  const copyableRequestID = isRequest ? (
    <>
      Tap to copy Request ID 👇🏾 : {requestID?.toString()}
      <CopyableText
        text={requestID?.toString() || ""}
        label={"Request ID"}
        addChatMessages={addChatMessages}
        nextStep={nextStep}
        lastAssignedTime={lastAssignedTime}
      />
    </>
  ) : null;

  const copyableWalletddress = (
    <>
      Tap to copy 👇🏾:
      <br />
      <CopyableText
        text={wallet}
        label={"Wallet Address"}
        isWallet={true}
        addChatMessages={addChatMessages}
        nextStep={nextStep}
        lastAssignedTime={lastAssignedTime}
      />
    </>
  );

  // helper function to generate transaction message
  const generateTransactionMessage = (extraContent?: ReactNode) => {
    return isRequest ? (
      <span>
        You will recieve{" "}
        <b>{formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}</b>.
        <br />
        {extraContent}
        <br />
        Disclaimer: You would get your payment as soon as your request is
        fulfilled
        <br />
      </span>
    ) : !connectedWallet ? (
      <>
        Note: You are sending{" "}
        <b>
          {paymentAsset} =
          {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}
        </b>{" "}
        only to 2Settle wallet address to complete your transaction
        <CopyableText
          text={assetPayment.toFixed(8)}
          label={`${sharedCrypto} amount`}
          addChatMessages={addChatMessages}
          nextStep={nextStep}
          lastAssignedTime={lastAssignedTime}
        />
        {copyableWalletddress}
        <span>
          This wallet address expires in{" "}
          <b>{allowedTime.toString()} minutes </b>
        </span>
      </>
    ) : (
      <span>
        <b>
          {paymentAsset} ={""}
          {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}
        </b>{" "}
        will be deducted from your {sharedCrypto} ({sharedNetwork}) wallet.
        <br />
        {extraContent}
        <br />
        Disclaimer: The estimated amount <b>{paymentAsset}</b> does not include{" "}
        {sharedCrypto} ({sharedNetwork}) transaction fee.
        {isGift
          ? `This wallet address expires in ${allowedTime.toString()} minutes`
          : ""}
        <br />
      </span>
    );
  };
  // Define initial message
  /**
   * isGift - for creating gift
   * isRquestPayment - for fulfilling a request
   * isRequest - making a request
   * last option - for making a regular transtion
   */
  const initialMessages: MessageType[] = [
    {
      type: "incoming",
      content: "Phone number confirmed",
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: generateTransactionMessage(
        isGift ? (
          <>
            Note: You are sending{" "}
            <b>
              {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")} ={" "}
              {paymentAsset}{" "}
            </b>{" "}
            only to 2Settle wallet address
            <CopyableText
              text={assetPayment.toFixed(8)}
              label={`${sharedCrypto} amount`}
              addChatMessages={addChatMessages}
              nextStep={nextStep}
              lastAssignedTime={lastAssignedTime}
            />
            {copyableWalletddress}
            {copyableGiftID}
          </>
        ) : isRequestPayment ? (
          <>
            Note: You are sending{" "}
            <b>
              {formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")} ={" "}
              {paymentAsset}
            </b>{" "}
            only to 2Settle wallet address to fulfill the request
            <CopyableText
              text={assetPayment.toFixed(8)}
              label={`${sharedCrypto} amount`}
              addChatMessages={addChatMessages}
              nextStep={nextStep}
              lastAssignedTime={lastAssignedTime}
            />
            {copyableWalletddress}
            {copyableRequestID}
          </>
        ) : isRequest ? (
          <>
            Note: You are Requesting for payment of
            <b>{formatCurrency(sharedPaymentNairaEstimate, "NGN", "en-NG")}</b>
            <br />
            {copyableRequestID}
          </>
        ) : (
          <>Tap to copy 👇🏾: {copyableTransactionID}</>
        )
      ),
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: connectedWallet
        ? "Thank you for transacting with me"
        : "Wait for  the pop-up. If missed, say 'hi' to restart.",
      timestamp: new Date(),
    },
  ];

  addChatMessages(initialMessages);
};