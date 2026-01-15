import useChatStore from "stores/chatStore";

export const handlePayRequest = (chatInput: string) => {
  const { next, addMessages } = useChatStore.getState();
  const requestId = chatInput.trim();

  // check if request is valid
  // check if request is not claimed yet
  // move control to the enter search word
  addMessages([
    {
      type: "incoming",
      content: `You want to pay request with RequestID ${requestId}`,
      timestamp: new Date(),
    },
  ]);
};
