
import useChatStore from "stores/chatStore";

export function useChatNavigation() {
  const {
    messages,
    serialized,
    currentStep,
    stepHistory,
    getDeserializedMessages,
    addMessages,
    goto,
    next,
    prev,
  } = useChatStore();

    const chatMessages = getDeserializedMessages().map((msg) => ({
      ...msg,
      timestamp: msg.timestamp || new Date(),
      type: msg.type as "incoming" | "outgoing",
    }));

  return {
    chatMessages,
    serializedMessages: serialized,
    currentStep,
    stepHistory,
    addChatMessages: addMessages,
    goToStep: goto,
    nextStep: next,
    prevStep: prev,
  };
}
