import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageType } from "./chatStore";
import { StepId } from "@/core/transation_state_machine/steps";
import { stepService } from "@/core/transation_state_machine/transaction_state_machine";

// type StepMessages = {
//   step: number;
//   messages: MessageType;
// };
// type ChatFlowState = {
//   steps: StepMessages[];
//   currentStep: number;
//   addStep: (message: MessageType) => void;
//   goToStep: (step: number) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   getCurrentMessage: () => MessageType | null;
// };

// const useChatFlowStore = create<ChatFlowState>()(
//   persist(
//     (set, get) => ({
//       steps: [],
//       currentStep: 0,
//       addStep: (message) =>
//         set((store) => {
//           const nextStep = store.steps.length + 1;
//           const newStep = { step: nextStep, messages: message };
//           return { steps: [...store.steps, newStep], currentStep: nextStep };
//         }),

//       goToStep: (step) =>
//         set({
//           currentStep: step,
//         }),
//       nextStep: () =>
//         set((store) => {
//           const next = Math.min(store.steps.length + 1, store.steps.length);
//           return { currentStep: next };
//         }),
//       prevStep: () =>
//         set((store) => {
//           const prev = Math.min(store.steps.length - 1, 1);
//           return { currentStep: prev };
//         }),
//       getCurrentMessage: () => {
//         const { steps, currentStep } = get();
//         return steps.find((s) => s.step === currentStep)?.messages ?? null;
//       },
//     }),
//     { name: "chat-flow" }
//   )
// );

// export default useChatFlowStore;

type ChatFlowState = {
  messages: MessageType[];
  serialized: { type: string; content: string }[];
  currentStep: StepId;
  stepHistory: StepId[];

  addMessage: (msg: MessageType) => void;
  setSerialized: (msgs: any[]) => void;
  recordStep: (step: StepId) => void;

  goto: (step: StepId) => void;
  next: () => void;
  prev: () => void;
  clear: () => void;
};

const useChatFlowStore = create<ChatFlowState>()(
  persist(
    (set, get) => ({
      messages: [],
      serialized: [],
      currentStep: "start",
      stepHistory: ["start"],

      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),
      setSerialized: (msgs) =>
        set({
          serialized: msgs,
        }),

      // for the state sub service

      recordStep: (step: StepId) =>
        set((state) => {
          // prevent duplicate messages
          if (state.stepHistory[state.stepHistory.length - 1] === step) {
            return { currentStep: step };
          }

          return {
            currentStep: step,
            stepHistory: [...state.stepHistory, step],
          };
        }),

      goto: (step) => stepService.send({ type: "GOTO", step }),
      next: () => stepService.send({ type: "NEXT" }),
      prev: () => stepService.send({ type: "PREV" }),
      clear: () =>
        set({
          messages: [],
          serialized: [],
          currentStep: "start",
          stepHistory: ["start"],
        }),
    }),
    { name: "chat-flow" }
  )
);

// sync xstate to zustand store on every transition
stepService.subscribe((snapshot) => {
  const step = snapshot.value as StepId;

  useChatFlowStore.getState().recordStep(step);
});


// let prev = stepService.getSnapshot().value;

// stepService.subscribe((state) => {
//   let next = state.value;
//   if (prev !== next) {
//     useChatFlowStore.setState((old) => ({
//       currentStep: state.value as StepId,
//       stepHistory: [...old.stepHistory, state.value as StepId],
//     }));
//   }
//   prev = next;
// });
export default useChatFlowStore;
