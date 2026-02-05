import { CopyableText } from "@/features/transact/CopyableText";
import { formatCurrency } from "@/helpers/format_currency";
import { CountdownTimer } from "@/helpers/format_date";
import { getBaseSymbol } from "@/utils/utilities";
import { ReactNode } from "react";
import useChatStore, { MessageType } from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";

export const displaySendPayment = async () =>
  // addChatMessages: (messages: MessageType[]) => void,
  // nextStep: (step: string) => void,
  // wallet: string,
  // sharedCrypto: string,
  // sharedPaymentAssetEstimate: string,
  // sharedPaymentNairaEstimate: string,
  // transactionID: number,
  // sharedNetwork: string,
  // sharedPaymentMode: string,
  // connectedWallet: boolean,
  // giftID?: number,
  // requestID?: number,
  // lastAssignedTime?: Date
  {
    console.log("Displaying send payment message...");
    const { paymentAssetEstimate, paymentNairaEstimate, ticker } =
      usePaymentStore.getState();
    const { currentStep, addMessages } = useChatStore.getState();
    const { transaction, giftId } = useTransactionStore.getState();
    const paymentTicker = getBaseSymbol(ticker);
    const transactionID = transaction?.transac_id;
    const requestID = "We are not there yet";
    const payment = usePaymentStore.getState();
    console.log({ payment });

    const allowedTime = 5;
    const assetPayment = parseFloat(paymentAssetEstimate);
    const paymentAsset = `${assetPayment.toFixed(8)} ${paymentTicker}`;
    const isGift = currentStep.transactionType?.toLowerCase() === "gift";
    const isRequest = currentStep.transactionType?.toLowerCase() === "request";
    const isRequestPayment =
      currentStep.transactionType?.toLowerCase() === "payrequest";

    const copyableTransactionID = (
      <div>
        Tap to copy Transaction ID 👇🏾 : {transactionID}
        {/* <CopyableText
          text={transactionID.toString()}
          label={"Transaction ID"}
          addChatMessages={addChatMessages}
          nextStep={nextStep}
          lastAssignedTime={lastAssignedTime}
        /> */}
      </div>
    );

    const copyableGiftID = isGift ? (
      <div>
        Tap to copy Gift ID 👇🏾 : {giftId}
        {/* <CopyableText
          text={giftId}
          label={"Gift ID"}
          addChatMessages={addChatMessages}
          nextStep={nextStep}
          lastAssignedTime={lastAssignedTime}
        /> */}
      </div>
    ) : null;

    const copyableRequestID = isRequest ? (
      <div>
        Tap to copy Request ID 👇🏾 : {requestID}
        {/* <CopyableText
          text={requestID}
          label={"Request ID"}
          addChatMessages={addChatMessages}
          nextStep={nextStep}
          lastAssignedTime={lastAssignedTime}
        /> */}
      </div>
    ) : null;

    const copyableWalletddress = (
      <div>
        Tap to copy 👇🏾:
        <br />
        {/* <CopyableText
          text={wallet}
          label={"Wallet Address"}
          isWallet={true}
          addChatMessages={addChatMessages}
          nextStep={nextStep}
          lastAssignedTime={lastAssignedTime}
        /> */}
      </div>
    );

    const connectedWallet = "";
    // helper function to generate transaction message
    const generateTransactionMessage = (extraContent?: ReactNode) => {
      return isRequest ? (
        <span>
          You will recieve{" "}
          <b>{formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}</b>.
          <br />
          {extraContent}
          <br />
          Disclaimer: You would get your payment as soon as your request is
          fulfilled
          <br />
        </span>
      ) : !connectedWallet ? (
        <div>
          Note: You are sending{" "}
          <b>
            {paymentAsset} =
            {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}
          </b>{" "}
          only to 2Settle wallet address to complete your transaction
          {/* <CopyableText
            text={assetPayment.toFixed(8)}
            label={`${sharedCrypto} amount`}
            addChatMessages={addChatMessages}
            nextStep={nextStep}
            lastAssignedTime={lastAssignedTime}
          /> */}
          {copyableWalletddress}
          <span>
            This wallet address expires in{" "}
            <b>{allowedTime.toString()} minutes </b>
            <CountdownTimer
              expiryTime={new Date(Date.now() + allowedTime * 60 * 1000)}
            />
          </span>
        </div>
      ) : (
        <span>
          <b>
            {paymentAsset} ={""}
            {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}
          </b>{" "}
          {/* will be deducted from your {sharedCrypto} ({sharedNetwork}) wallet.
          <br />
          {extraContent}
          <br />
          Disclaimer: The estimated amount <b>{paymentAsset}</b> does not
          include {sharedCrypto} ({sharedNetwork}) transaction fee.
          {isGift
            ? `This wallet address expires in ${allowedTime.toString()} minutes`
            : ""}
          <br /> */}
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
            <div>
              Note: You are sending{" "}
              <b>
                {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")} ={" "}
                {paymentAsset}{" "}
              </b>{" "}
              only to 2Settle wallet address
              {/* <CopyableText
                text={assetPayment.toFixed(8)}
                label={`${sharedCrypto} amount`}
                addChatMessages={addChatMessages}
                nextStep={nextStep}
                lastAssignedTime={lastAssignedTime}
              /> */}
              {copyableWalletddress}
              {copyableGiftID}
            </div>
          ) : isRequestPayment ? (
            <div>
              Note: You are sending{" "}
              <b>
                {formatCurrency(paymentNairaEstimate, "NGN", "en-NG")} ={" "}
                {paymentAsset}
              </b>{" "}
              only to 2Settle wallet address to fulfill the request
              {/* <CopyableText
                text={assetPayment.toFixed(8)}
                label={`${sharedCrypto} amount`}
                addChatMessages={addChatMessages}
                nextStep={nextStep}
                lastAssignedTime={lastAssignedTime}
              /> */}
              {copyableWalletddress}
              {copyableRequestID}
            </div>
          ) : isRequest ? (
            <div>
              Note: You are Requesting for payment of
              <b>{formatCurrency(paymentNairaEstimate, "NGN", "en-NG")}</b>
              <br />
              {copyableRequestID}
            </div>
          ) : (
            <div>Tap to copy 👇🏾: {copyableTransactionID}</div>
          ),
        ),
        timestamp: new Date(),
      },
    ];

    addMessages(initialMessages);
  };
