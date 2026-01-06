import { useBankStore } from "stores/bankStore";
import useChatStore, { MessageType } from "stores/chatStore";

export const displayContinueToPay = () => {
  const currentStep = useChatStore.getState().currentStep;
  const { next, addMessages } = useChatStore.getState();
  const { selectedBankName, bankData } = useBankStore.getState();
  console.log({ bankData });

  //   bank.8063862295

  let isGift = currentStep.transactionType?.toLowerCase() !== "gift";

  const newMessages: MessageType[] = [];

  if (isGift) {
    newMessages.push({
      type: "incoming",
      content: (
        <span>
          Name:
          {/* {name} */}
          <br />
          Bank name:
          {/* {selectedBankName} */}
          <br />
          Account number:
          {/* {account_number} */}
        </span>
      ),
      timestamp: new Date(),
    });
  }

  newMessages.push({
    type: "incoming",
    content: (
      <span>
        Here is your menu:
        <br />
        <br />
        1. Continue
        <br />
        0. Go back
        <br />
        00. Exit
      </span>
    ),
    timestamp: new Date(),
  });

  console.log("Next is enterPhone");
  addMessages(newMessages);
};
