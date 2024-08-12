import { MessageType } from "../types/types";

export const displayReportlyWelcome = async (
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
          <br />
          1. Track Transaction
          <br />
          2. Stolen funds | disappear funds
          <br />
          3. Fraud
          <br />
          0. Go back
        </span>
      ),
    },
  ];
  console.log("Next is thankForKYCReg");
  nextStep("makeReport");
  addChatMessages(newMessages);
};
