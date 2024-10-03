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
  console.log("Next is reporterName");
  nextStep("reporterName");
  addChatMessages(newMessages);
};
export const displayReportlyName = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Please enter your full name
          <br />
       
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is reporterPhoneNumber");
  nextStep("reporterPhoneNumber");
  addChatMessages(newMessages);
};
export const displayReportlyPhoneNumber = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Please enter your phone number
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
    },
  ];
  console.log("Next is reporterFarwell");
  nextStep("reporterFarwell");
  addChatMessages(newMessages);
};
export const displayReportlyFarwell = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Your report is noted.
          <br />
        Thanks for using Reportly 
        </span>
      ),
    },
    // go to home back
  ];
  console.log("Next is start");
  nextStep("start");
  addChatMessages(newMessages);
};
