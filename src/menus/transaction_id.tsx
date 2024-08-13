import { MessageType } from "../types/types";

// WELCOME USER TO TRANSACTION ID
export const displayTransactIDWelcome = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          1. Complete your transaction
          <br />
          2. Claim Gift
          <br />
          3. Complete payment
          <br />
          0. Go back
        </span>
      ),
    },
  ];
  console.log("Next is thankForKYCReg");
  nextStep("completeTransactionId");
  addChatMessages(newMessages);
};

// DISPLAY COMPLETE TRANSACTION
export const displayCompleteTransaction = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          1. Complete your transaction
          <br />
          2. Claim Gift
          <br />
          3. Complete payment
          <br />
          0. Go back
        </span>
      ),
    },
  ];
  console.log("Next is thankForKYCReg");
  nextStep("completeTrxID");
  addChatMessages(newMessages);
};

// ENTER TRANSACTION ID
export const displayEnterCompleteTransactionId = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter your Transaction ID.
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is entreTrxId");
  nextStep("confirmTransaction");
  addChatMessages(newMessages);
};
// TRANSACTION FEEDBACK MESSAGE
export const displayCompleteTrxFeedbackMessage = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: "This transaction is Processing",
    },
  ];
  console.log("Next is entreTrxId");
  nextStep("start");
  addChatMessages(newMessages);
};

// ENTER GIFT ID
export const displayEnterGiftId = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter your Gift ID.
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is giftFeedBack");
  nextStep("enterBankSearchWord");
  // nextStep("giftFeedBack");
  addChatMessages(newMessages);
};
// GIFT FEEDBACK MESSAGE
export const displayGiftFeedbackMessage = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: "This transaction is Processing",
    },
  ];
  console.log("Next is start");
  nextStep("start");
  addChatMessages(newMessages);
};

// ENTER REQUEST ID
export const displayEnterRequestId = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Enter your Request ID.
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is giftFeedBack");
  nextStep("requestFeedBack");
  addChatMessages(newMessages);
};
// RETURN MESSAGE
export const displayRequestFeedbackMessage = (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: "This transaction is Processing",
    },
  ];
  console.log("Next is start");
  nextStep("start");
  addChatMessages(newMessages);
};
