import { setup, assign, createActor } from "xstate";
import { StepId, steps } from "./steps";

interface Ctx {
  currentStepIndex: number;
  fromPrev?: boolean;
}

type Events =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; step: StepId };

const getNextStep = (index: number) => steps[index + 1] ?? steps[index];

// const getPrevStep = (index: number) =>
//   index <= 1 ? steps[0] : steps[index - 1];
const getPrevStep = (index: number) =>
  index <= 0 ? steps[0] : steps[index - 1];

const machineSetup = setup({
  types: {
    context: {} as Ctx,
    events: {} as Events,
  },
  actions: {
    setStepIndex: assign((_ctx, _evt) => ({
      currentStepIndex: 0,
    })),
  },
});

// dynamic states
const generateStates = steps.reduce((acc, step, index) => {
  acc[step] = {
    entry: assign(({ context }) => {
      if (context.currentStepIndex === index) return {};
      return { currentStepIndex: index };
    }),

    on: {
      NEXT: {
        target: getNextStep(index),
      },
      PREV: {
        target: getPrevStep(index),
        actions: assign({ fromPrev: true }),
      },
      GOTO: {
        target: (_ctx: Ctx, event: Events) => {
          if (event.type !== "GOTO") return "start";

          if (!steps.includes(event.step)) {
            console.warn("Invalid step requested:", event.step);
            return "start";
          }

          return event.step;
        },
        actions: assign({
          currentStepIndex: ({ event }) => {
            console.log("Step of event" + steps.indexOf(event.step));
            if (event.type !== "GOTO") {
              return 0;
            }
            return steps.indexOf(event.step);
          },
        }),
        internal: false,
      },
    },
  };
  return acc;
}, {} as Record<StepId, any>);

const startStep = {
  entry: assign(({ context }) => {
    if (context.currentStepIndex === 0) return {};

    return { currentStepIndex: 0, fromPrev: false };
  }),
  on: {
    NEXT: {
      target: "chooseAction",
    },

    PREV: {
      target: "start",
      actions: assign({ fromPrev: true }),
    },

    GOTO: {
      target: (_ctx: Ctx, event: Events) => {
        if (event.type !== "GOTO") return "start";
        if (!steps.includes(event.step)) {
          console.warn("Invalid step requested:", event.step);
          return "start";
        }
        return event.step;
      },
      actions: assign({
        currentStepIndex: ({ event }) => {
          if (event.type !== "GOTO") {
            return 0;
          }
          return steps.indexOf(event.step);
        },
      }),
      internal: false,
    },
  },
};
export const stepMachine = machineSetup.createMachine({
  id: "chatbotSteps",
  initial: steps[0],
  context: {
    currentStepIndex: 0,
  },
  // states: {
  //   start: {
  //     entry: assign(({ context }) => {
  //       if (context.currentStepIndex === 0) return {};

  //       return { currentStepIndex: 0, fromPrev: false };
  //     }),
  //     on: {
  //       NEXT: {
  //         target: "chooseAction",
  //       },

  //       PREV: {
  //         target: "start",
  //         actions: assign({ fromPrev: true }),
  //       },
  //       // GOTO: {
  //       //   target: (actor) => {
  //       //     console.log({ actor });
  //       //   },
  //       // },

  //       GOTO: {
  //         target: (_ctx: Ctx, event: Events) => {
  //           console.log("Event", event.type);
  //           if (event.type !== "GOTO") return "start";
  //           if (!steps.includes(event.step)) {
  //             console.warn("Invalid step requested:", event.step);
  //             return "start";
  //           }
  //           return event.step;
  //         },
  //         actions: assign({
  //           currentStepIndex: ({ event }) => {
  //             if (event.type !== "GOTO") {
  //               return 0;
  //             }
  //             return steps.indexOf(event.step);
  //           },
  //         }),
  //         internal: false,
  //       },
  //     },
  //   },
  //   chooseAction: {
  //     entry: assign(({ context }) => {
  //       if (context.currentStepIndex === 0) return {};

  //       return { currentStepIndex: 0, fromPrev: false };
  //     }),
  //     on: {
  //       NEXT: {
  //         target: "chooseAction",
  //       },

  //       PREV: {
  //         target: "start",
  //         actions: assign({ fromPrev: true }),
  //       },

  //       GOTO: {
  //         target: (_ctx: Ctx, event: Events) => {
  //           if (event.type !== "GOTO") return "start";
  //           if (!steps.includes(event.step)) {
  //             console.warn("Invalid step requested:", event.step);
  //             return "start";
  //           }
  //           return event.step;
  //         },
  //         actions: assign({
  //           currentStepIndex: ({ event }) => {
  //             if (event.type !== "GOTO") {
  //               return 0;
  //             }
  //             return steps.indexOf(event.step);
  //           },
  //         }),
  //         internal: false,
  //       },
  //     },
  //   },
  //   transactCrypto: {},
  //   transferMoney: {},
  //   estimateAsset: {},
  //   network: {},
  //   payOptions: {},
  //   charge: {},
  //   enterBankSearchWord: {},
  //   selectBank: {},
  //   enterAccountNumber: {},
  //   continueToPay: {},
  //   enterPhone: {},
  //   sendPayment: {},
  //   confirmTransaction: {},
  //   paymentProcessing: {},
  //   kycInfo: {},
  //   kycReg: {},
  //   thankForKYCReg: {},
  //   supportWelcome: {},
  //   assurance: {},
  //   entreTrxId: {},
  //   makeComplain: {},
  //   completeTransactionId: {},
  //   giftFeedBack: {},
  //   makeReport: {},
  //   reporterName: {},
  //   reporterPhoneNumber: {},
  //   reporterWallet: {},
  //   fraudsterWallet: {},
  //   reportlyNote: {},
  //   reporterFarwell: {},
  // },
  states: generateStates,
});

// export a singleton instance that does not gets redeclared on every inport or reload
let _actor: ReturnType<typeof createActor> | null = null;

export function getStepService() {
  if (!_actor) {
    _actor = createActor(stepMachine).start();
  }
  return _actor;
}

// on: {
//   NEXT: steps[index + 1] || steps[index],
//   PREV: steps[index - 2] || steps[index],
//   GOTO: {
//     target: (_ctx: Ctx, event: Events) =>
//       event.type === "GOTO" && steps.includes(event.step)
//         ? event.step
//         : steps[0],
//   },
// },


