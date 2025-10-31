import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageType } from "./chatStore";

type StepMessages = {
  step: number;
  messages: MessageType;
};
type ChatFlowState = {
  steps: StepMessages[];
  currentStep: number;
  addStep: (message: MessageType) => void;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  getCurrentMessage: () => MessageType | null;
};

const useChatFlowStore = create<ChatFlowState>()(
  persist(
    (set, get) => ({
      steps: [],
      currentStep: 0,
      addStep: (message) =>
        set((store) => {
          const nextStep = store.steps.length + 1;
          const newStep = { step: nextStep, messages: message };
          return { steps: [...store.steps, newStep], currentStep: nextStep };
        }),

      goToStep: (step) =>
        set({
          currentStep: step,
        }),
      nextStep: () =>
        set((store) => {
          const next = Math.min(store.steps.length + 1, store.steps.length);
          return { currentStep: next };
        }),
      prevStep: () =>
        set((store) => {
          const prev = Math.min(store.steps.length - 1, 1);
          return { currentStep: prev };
        }),
      getCurrentMessage: () => {
        const { steps, currentStep } = get();
        return steps.find((s) => s.step === currentStep)?.messages ?? null;
      },
    }),
    { name: "chat-flow" }
  )
);

export default useChatFlowStore;
