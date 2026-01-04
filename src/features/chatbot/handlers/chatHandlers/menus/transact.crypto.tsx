

import useChatStore, { MessageType } from "stores/chatStore";

// choose what you want to do in transact crypto
export const displayTransactCrypto = (
) => {
    const { addMessages } = useChatStore.getState();

  {
    const newMessages: MessageType[] = [
      {
        type: "incoming",
        content: (
          <span>
            Here is your menu:
            <br />
            1. Transfer money
            <br />
            2. Send Gift
            <br />
            3. Request for payment
            <br />
            0. Go back
          </span>
        ),
        timestamp: new Date(),
      },
    ];
    console.log("Next is howToEstimate");

  addMessages(newMessages);
  }
};

export const displayHowToEstimation = async (
  input: string,
  sharedPaymentMode: string
) => {
  const { next, addMessages } = useChatStore.getState();
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
  addMessages(newMessages);
};