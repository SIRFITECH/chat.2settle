import { MessageType } from "../types/general_types";

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
      timestamp: new Date(),
    },
  ];
  console.log("Next is reporterName");
  nextStep("makeReport");
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
      timestamp: new Date(),
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
      timestamp: new Date(),
    },
  ];
  console.log("Next is reporterWallet");
  nextStep("reporterWallet");
  addChatMessages(newMessages);
};
export const displayReportlyReporterWalletAddress = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Please enter your wallet address
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is fraudsterWallet");
  nextStep("fraudsterWallet");
  addChatMessages(newMessages);
};
export const displayReportlyFraudsterWalletAddress = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Please enter the fraudster wallet address (optional)
          <br />
          1. Skip
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];
  console.log("Next is reportlyNote");
  nextStep("reportlyNote");
  addChatMessages(newMessages);
};
export const displayReportlyNote = async (
  addChatMessages: (messages: MessageType[]) => void,
  nextStep: (step: string) => void
) => {
  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: (
        <span>
          Explain what happened in less than 100 words
          <br />
          0. Go back
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
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
          Thank you for submitting the report,
          <br />
          We get back to you shortly
        </span>
      ),
      timestamp: new Date(),
    },
    // go to home back
  ];
  console.log("Next is start");
  nextStep("start");
  addChatMessages(newMessages);
};
