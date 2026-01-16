import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StepId } from "@/core/machines/steps";
import elementToJSXString from "react-element-to-jsx-string";
import parse from "html-react-parser";

type MessageIntent =
  | { kind: "text"; value: string }
  | { kind: "component"; name: string; props?: any; persist?: boolean };

type SerializedMessage =
  | {
      type: string;
      intent: MessageIntent;
      timestamp: string;
    }
  | {
      type: string;
      content: string;
      timestamp: string;
    };

export type MessageType = {
  type: string;
  content?: string | React.ReactNode;
  intent?: MessageIntent;
  timestamp: Date;
};

// export type MessageType = {
//   type: string;
//   content: string | React.ReactNode;
//   timestamp: Date;
// };

interface StepContext {
  stepId: StepId;
  transactionType?: "transfer" | "gift" | "request";
}

type StepContextPatch = Partial<StepContext>;
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

// const deserializeMessage = (msg: SerializedMessage) => ({
//   type: msg.type,
//   content: parse(msg.content),
//   timestamp:  new Date(msg.timestamp),
//   // timestamp: new Date(),
// });

const deserializeMessage = (msg: SerializedMessage): MessageType => {
  if ("intent" in msg) {
    return {
      type: msg.type,
      intent: msg.intent,
      timestamp: new Date(msg.timestamp),
    };
  }

  return {
    type: msg.type,
    content: parse(msg.content),
    timestamp: new Date(msg.timestamp),
  };
};

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
  serialized: MessageType[];
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
      const MAX_MESSAGES = 100;

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

        // addMessages: (msgs) =>
        //   set((state) => {
        //     const serialized = msgs.map(serializeMessage);

        //     const nextMessages = [...state.messages, ...msgs];
        //     const nextSerializedMessages = [...state.serialized, ...serialized];

        //     const overflow = nextMessages.length - MAX_MESSAGES;

        //     if (overflow > 0) {
        //       return {
        //         messages: nextMessages.slice(overflow),
        //         serialized: nextSerializedMessages.slice(overflow),
        //       };
        //     }

        //     return {
        //       messages: [...state.messages, ...msgs],
        //       serialized: [...state.serialized, ...serialized],
        //     };
        //   }),

        addMessages: (msgs) =>
          set((state) => {
            const serialized = msgs
              .filter((msg) => {
                if (!msg.intent) return true;

                if (msg.intent.kind === "text") return true;

                if (msg.intent.kind === "component") {
                  return msg.intent.persist === true;
                }

                return false;
              })
              .map((msg) => {
                console.log("We have to map the msg now", msg)
                if (msg.intent) {
                  return {
                    type: msg.type,
                    intent: msg.intent,
                    timestamp: msg.timestamp,
                  };
                }
                console.log(
                  "Msg has intent and we have transformed the intent",
                  msg.intent
                );

                // fallback: legacy JSX serialization
                return serializeMessage(msg);
              });

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

            // return {
            //   messages: [...state.messages, ...msgs],
            //   serialized: [...state.serialized, ...serialized],
            // };
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
          return get().serialized.map(deserializeMessage);
          // return get().serialized.map((msg) => deserializeMessage(msg));
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
      };
    },
    { name: "chat-flow" }
  )
);

export default useChatStore;
