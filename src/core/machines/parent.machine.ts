import { bankingMachine } from "./banking.machine";
import { onboardingMachine } from "./onboarding.machine";
import { machineSetup } from "./setup";
import { paymentMachine } from "./payment.machine";
import { reportingMachine } from "./reporting_machine";
import { supportMachine } from "./support.machine";
import { transactCryptoMachine } from "./transactCrypto.machine";
import { transactionMachine } from "./transaction.machine";
import { assign, createActor } from "xstate";
import { steps } from "./steps";
import { greetings } from "@/features/chatbot/helpers/ChatbotConsts";

interface Ctx {
  currentStepIndex: number;
  nextStepIndex: number;
  prevStepIndex: number;
}

type Events = { type: "NEXT" } | { type: "PREV" } | { type: "RESET" };
export const chatbotMachine = machineSetup.createMachine({
  id: "chatbotSteps",

  context: {
    currentStepIndex: 0,
    nextStepIndex: 1,
    prevStepIndex: 0,
  },
  initial: steps[0],

  states: {
    start: {
      on: {
        CHAT_INPUT: [
          {
            target: "connectWallet",
            guard: ({ event }) => {
              if (event.value === "1") {
                console.log(
                  "event: we are going to connectWallet",
                  event.value
                );
              }
              return event.value === "1";
            },
          },
          {
            guard: ({ event }) => {
              if (event.value === "2") {
                console.log("event: start", event.value);
              }
              return event.value === "2";
            },
            target: "chooseAction",
          },

          {
            guard: ({ event }) => {
              if (greetings.includes(event.value)) {
                console.log("event: start wants to reenter", event.value);
              }
              return greetings.includes(event.value);
            },
            target: "start",
            reenter: true,
          },
        ],
      },
    },
    connectWallet: {
      on: {
        CHAT_INPUT: [
          {
            target: "connectWallet",
            guard: ({ event }) => {
              console.log("event rendering connectWallet: ", event.value);
              return event.value == "connected";
            },
          },
          {
            target: "start",
            guard: ({ event }) => {
              console.log("event going back from connectWallet: ", event.value);
              return event.value == "0";
            },
          },
          {
            guard: ({ event }) => {
              if (greetings.includes(event.value)) {
                console.log(
                  "event: connectWallet wants to return to start",
                  event.value
                );
              }
              return greetings.includes(event.value);
            },
            target: "start",
          },
        ],
      },
    },

    chooseAction: {
      on: {
        CHAT_INPUT: [
          {
            target: "transactCrypto",
            guard: ({ event }) => event.value === "1",
          },
          // {
          //   target: "requestPayCard",
          //   guard: ({ event }) => event.value === "2",
          // },
          // {
          //   target: "support",
          //   guard: ({ event }) => event.value === "3",
          // },
          // {
          //   target: "transactionId",
          //   guard: ({ event }) => event.value === "4",
          // },
          // {
          //   target: "reportly",
          //   guard: ({ event }) => event.value === "5",
          // },
          {
            target: "start",
            guard: ({ event }) => event.value === "0",
          },
          {
            guard: ({ event }) => greetings.includes(event.value),
            target: "start",
          },
        ],
      },
    },

    transferMoney: {
      on: {
        CHAT_INPUT: [
          {
            guard: ({ event }) => greetings.includes(event.value),
            target: "start",
          },
          {
            guard: ({ event }) => greetings.includes(event.value),
            target: "start",
          },
        ],
      },

      // on: {
      //   NEXT: [
      //     {
      //       target: "transferMoney",
      //       // guard: { type: "transactCrypto" },
      //     },
      //     // {
      //     //   target: "requestPayCard",
      //     //   // guard: { type: "requestPayCard" },
      //     // },
      //     // {
      //     //   target: "support",
      //     //   guard: { type: "customerSupport" },
      //     // },
      //     // {
      //     //   target: "reporting",
      //     //   guard: { type: "reportly" },
      //     // },
      //     // {
      //     //   target: "transaction.continueWithId",
      //     //   guard: { type: "transactionId" },
      //     // },
      //   ],
      //   PREV: { target: "start" },
      //   RESET: { target: "start" },
      // },
    },

    // onboarding: onboardingMachine,
    transactCrypto: {
      on: {
        CHAT_INPUT: [
          {
            guard: ({ event }) => greetings.includes(event.value),
            target: "start",
          },
          {
            guard: ({ event }) => greetings.includes(event.value),
            target: "start",
          },
        ],
      },
    },
    // transactCryptoMachine,
    // payment: paymentMachine,
    // banking: bankingMachine,
    // support: supportMachine,
    // reporting: reportingMachine,
    // transaction: transactionMachine,
  },
});

let _actor: ReturnType<typeof createActor> | null = null;

export function getStepService() {
  if (!_actor) {
    _actor = createActor(chatbotMachine).start();
  }
  return _actor;
}
