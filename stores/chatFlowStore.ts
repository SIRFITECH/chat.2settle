// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { MessageType } from "./chatStore";
// import { StepId } from "@/core/transation_state_machine/steps";
// import { stepService } from "@/core/transation_state_machine/transaction_state_machine";

// type ChatFlowState = {
//   messages: MessageType[];
//   serialized: { type: string; content: string }[];
//   currentStep: StepId;
//   stepHistory: StepId[];

//   addMessage: (msg: MessageType) => void;
//   setSerialized: (msgs: any[]) => void;
//   recordStep: (step: StepId) => void;

//   goto: (step: StepId) => void;
//   next: () => void;
//   prev: () => void;
//   clear: () => void;
// };

// const useChatFlowStore = create<ChatFlowState>()(
//   persist(
//     (set, get) => ({
//       messages: [],
//       serialized: [],
//       currentStep: "start",
//       stepHistory: ["start"],

//       addMessage: (msg) =>
//         set((state) => ({
//           messages: [...state.messages, msg],
//         })),
//       setSerialized: (msgs) =>
//         set({
//           serialized: msgs,
//         }),

//       // for the state sub service

//       recordStep: (step: StepId) =>
//         set((state) => {
//           // prevent duplicate messages
//           if (state.stepHistory[state.stepHistory.length - 1] === step) {
//             return { currentStep: step };
//           }

//           return {
//             currentStep: step,
//             stepHistory: [...state.stepHistory, step],
//           };
//         }),

//       goto: (step) => stepService.send({ type: "GOTO", step }),
//       next: () => stepService.send({ type: "NEXT" }),
//       prev: () => stepService.send({ type: "PREV" }),
//       clear: () =>
//         set({
//           messages: [],
//           serialized: [],
//           currentStep: "start",
//           stepHistory: ["start"],
//         }),
//     }),
//     { name: "chat-flow" }
//   )
// );

// // sync xstate to zustand store on every transition
// stepService.subscribe((snapshot) => {
//   const step = snapshot.value as StepId;

//   useChatFlowStore.getState().recordStep(step);
// });


// export default useChatFlowStore;
