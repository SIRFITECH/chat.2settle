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
      // entry: assign(({ context }) => {
      //   console.log(context);
      //   // if (context.currentStepIndex === 0) return {};
      // }),
      on: {
        NEXT: [
          {
            target: "chooseAction",
            // guard: { type: "connectWallet" },
          },
          // {
          //   target: "chooseAction",
          //   // guard: { type: "continue without wallet" },
          // },
        ],
        PREV: { target: "start" },
        RESET: { target: "start" },
      },
    },

    chooseAction: {
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
    // transactCrypto: transactCryptoMachine,
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
