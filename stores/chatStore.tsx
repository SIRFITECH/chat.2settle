import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StepId } from "@/core/machines/steps";
import elementToJSXString from "react-element-to-jsx-string";
import parse from "html-react-parser";

export type MessageType = {
  type: string;
  content: string | React.ReactNode;
  timestamp: Date;
};

interface StepContext {
  stepId: StepId;
  transactionType?: "transfer" | "gift" | "request";
}

type StepContextPatch = Partial<StepContext>;
// utils
const sanitizeSerializedContent = (content: string) => {
  return content
    .replace(/\{['"]\s*['"]\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
const serializeMessage = (msg: MessageType) => ({
  type: msg.type,
  content: sanitizeSerializedContent(elementToJSXString(msg.content)),
  timestamp: msg.timestamp || new Date(),
});

const deserializeMessage = (msg: { type: string; content: string }) => ({
  type: msg.type,
  content: parse(msg.content),
  timestamp: new Date(),
});

const initialMessages = [
  {
    type: "incoming",
    content: (
      <span>
        How far 👋
        <br />
        <br />
        Welcome to 2SettleHQ!, my name is Wálé, I am 2settle virtual assistance,{" "}
        <br />
        How may I help you?
        <br />
        Say "Hi" let us start
      </span>
    ),
    timestamp: new Date(),
  },
];

type ChatStore = {
  messages: MessageType[];
  serialized: { type: string; content: string }[];
  stepHistory: StepContextPatch[];
  loading: boolean;

  currentStep: StepContextPatch;

  addMessages: (msg: MessageType[]) => void;
  setSerialized: (msgs: any[]) => void;

  recordStep: (step: StepContextPatch) => void;
  getDeserializedMessages: () => MessageType[];

  setLoading: (loading: boolean) => void;

  next: (step: StepContextPatch) => void;
  prev: () => void;
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => {
      // --- Custom INITIALIZATION LOGIC ---
      let initialState;
      const MAX_MESSAGES = 1000;

      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("chat-flow");

        if (stored) {
          const parsed = JSON.parse(stored).state; // Zustand persist wraps it in `.state`

          const deserialized = parsed.serialized.map(deserializeMessage);

          initialState = {
            messages: deserialized,
            serialized: parsed.serialized,
            currentStep: parsed.currentStep ?? {
              stepId: "start",
              transactionType: undefined,
            },
            stepHistory: parsed.stepHistory ?? [
              { stepId: "start", transactionType: undefined },
            ],
          };
        }
      }

      // If nothing exists in storage → use initial welcome message
      if (!initialState) {
        const serializedInitial = initialMessages.map(serializeMessage);

        initialState = {
          messages: initialMessages,
          serialized: serializedInitial,
          currentStep: {
            stepId: "start",
            transactionType: undefined,
          },
          stepHistory: [
            {
              stepId: "start",
              transactionType: undefined,
            },
          ],
        };
      }

      return {
        ...initialState,
        loading: false,
        currentStep: {
          stepId: "start",
          transactionType: undefined,
        },

        setLoading: (loading: boolean) => set({ loading: loading }),

        addMessages: (msgs) =>
          set((state) => {
            const serialized = msgs.map(serializeMessage);

            const nextMessages = [...state.messages, ...msgs];
            const nextSerializedMessages = [...state.serialized, ...serialized];

            const overflow = nextMessages.length - MAX_MESSAGES;

            if (overflow > 0) {
              return {
                messages: nextMessages.slice(overflow),
                serialized: nextSerializedMessages.slice(overflow),
              };
            }

            return {
              messages: [...state.messages, ...msgs],
              serialized: [...state.serialized, ...serialized],
            };
          }),

        setSerialized: (msgs) => set({ serialized: msgs }),

        recordStep: (step: StepContextPatch) =>
          set((state) => {
            if (state.stepHistory[state.stepHistory.length - 1] === step) {
              return { currentStep: { ...state.currentStep, ...step } };
            }
            return {
              currentStep: step,
              stepHistory: [
                ...state.stepHistory,
                { ...state.currentStep, ...step },
              ],
            };
          }),
        getDeserializedMessages: () => {
          return get().serialized.map((msg) => deserializeMessage(msg));
        },

        next: (step: StepContextPatch) =>
          set((state) => ({
            stepHistory: [
              ...state.stepHistory,
              { ...state.currentStep, ...step },
            ],
            currentStep: {
              ...state.currentStep,
              ...step,
            },
          })),
        prev: () =>
          set((state) => {
            if (state.stepHistory.length <= 1) {
              return state; // prevent popping "start"
            }

            const newHistory = state.stepHistory.slice(0, -1);
            const previousStep = newHistory[newHistory.length - 1];

            return {
              stepHistory: newHistory,
              currentStep: previousStep,
            };
          }),

        // goto: (step) => {
        //   return stepService.send({ type: "GOTO", step });
        // },
        // reset: () => stepService.send({ type: "RESET" }),

        // clear: () =>
        //   set({
        //     messages: initialMessages,
        //     serialized: initialMessages.map(serializeMessage),
        //     currentStep: "start",
        //     stepHistory: ["start"],
        //   }),
      };
    },
    { name: "chat-flow" }
  )
);

// stepService.subscribe((snapshot) => {
//   console.log("MACHINE STATE →", snapshot.value, "CTX →", snapshot.context);
//   let step: StepId;

//   if (typeof snapshot.value === "string") {
//     step = snapshot.value as StepId;
//   } else if (typeof snapshot.value === "object") {
//     // grab the first key if using nested states
//     step = Object.keys(snapshot.value)[0] as StepId;
//   } else {
//     console.log({ snapshot });
//     return; // invalid snapshot, ignore
//   }
//   const store = useChatStore.getState();
//   const lastStep = store.stepHistory[store.stepHistory.length - 1];

//   // Only record if the step has **actually changed**
//   if (lastStep !== step && lastStep !== undefined) {
//     store.recordStep(step);
//     console.log("ZUSTAND IMMEDIATE →", store.currentStep);
//   }
// });

export default useChatStore;
