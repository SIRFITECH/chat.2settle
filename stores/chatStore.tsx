import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StepId } from "@/core/machines/steps";
import elementToJSXString from "react-element-to-jsx-string";
import parse from "html-react-parser";
import { getStepService } from "@/core/machines/parent.machine";
import { StateFrom } from "xstate";
import { stepMachine } from "@/core/machines/chat_machine";
type StepSnapshot = StateFrom<typeof stepMachine>;

const stepService = getStepService();
export type MessageType = {
  type: string;
  content: React.ReactNode;
  timestamp: Date;
};

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
  stepHistory: StepId[];
  loading: boolean;

  snapshot: StepSnapshot | null;
  currentStep: StepId;
  context: StepSnapshot["context"] | null;

  addMessages: (msg: MessageType[]) => void;
  setSerialized: (msgs: any[]) => void;
  recordStep: (step: StepId) => void;
  getDeserializedMessages: () => MessageType[];

  setLoading: (loading: boolean) => void;
  sendChatInput: (input: string) => void;
  // goto: (step: StepId) => void;
  // next: () => void;
  // prev: () => void;
  // reset: () => void;
  // clear: () => void;
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => {
      // --- Custom INITIALIZATION LOGIC ---
      let initialState;

      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("chat-flow");

        if (stored) {
          const parsed = JSON.parse(stored).state; // Zustand persist wraps it in `.state`

          const deserialized = parsed.serialized.map(deserializeMessage);

          initialState = {
            messages: deserialized,
            serialized: parsed.serialized,
            currentStep: parsed.currentStep ?? "start",
            stepHistory: parsed.stepHistory ?? ["start"],
          };
        }
      }

      // If nothing exists in storage → use initial welcome message
      if (!initialState) {
        const serializedInitial = initialMessages.map(serializeMessage);

        initialState = {
          messages: initialMessages,
          serialized: serializedInitial,
          currentStep: "start",
          stepHistory: ["start"],
        };
      }

      return {
        ...initialState,
        loading: false,
        snapshot: null,
        currentStep: "start",
        context: null,

        setLoading: (loading: boolean) => set({ loading: loading }),

        addMessages: (msgs) =>
          set((state) => {
            const serialized = msgs.map(serializeMessage);
            return {
              messages: [...state.messages, ...msgs],
              serialized: [...state.serialized, ...serialized],
            };
          }),

        setSerialized: (msgs) => set({ serialized: msgs }),

        recordStep: (step: StepId) =>
          set((state) => {
            if (state.stepHistory[state.stepHistory.length - 1] === step) {
              return { currentStep: step };
            }
            return {
              currentStep: step,
              stepHistory: [...state.stepHistory, step],
            };
          }),
        getDeserializedMessages: () => {
          return get().serialized.map((msg) => deserializeMessage(msg));
        },

        sendChatInput: (input: string) => {
          console.log("ACTOR STATUS:", stepService.getSnapshot()?.status);
          return stepService.send({ type: "CHAT_INPUT", value: input });
        },

        // goto: (step) => {
        //   return stepService.send({ type: "GOTO", step });
        // },
        // reset: () => stepService.send({ type: "RESET" }),
        // next: () => stepService.send({ type: "NEXT" }),
        // prev: () => stepService.send({ type: "PREV" }),

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
