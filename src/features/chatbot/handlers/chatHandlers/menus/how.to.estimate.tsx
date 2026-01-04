import { MessageType } from "stores/chatStore";

export const displayHowToEstimation = async (
  addChatMessages: (messages: MessageType[]) => void,
  input: string,
  sharedPaymentMode: string
) => {
  const parsedInput = input.trim();
  const ethChainId = 1;
  const bnbChainId = 56;
  const bnbTestChainId = 97;
  const sopeliaChainId = 11155111;

  const newMessages: MessageType[] = [
    {
      type: "incoming",
      content: `How would you like to estimate your ${parsedInput}?`,
      timestamp: new Date(),
    },
    {
      type: "incoming",
      content: (
        <span>
          Here is your menu:
          <br />
          <br />
          1. Naira
          <br />
          2. Dollar
          <br />
          3. Crypto
          <br />
          00. Exit
        </span>
      ),
      timestamp: new Date(),
    },
  ];

  console.log("Next is estimationAmount");
  addChatMessages(newMessages);
};
