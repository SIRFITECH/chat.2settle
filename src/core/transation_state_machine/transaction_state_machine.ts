import { createMachine, assign, interpret } from "xstate";
import { StepId, steps } from "./steps";

// define the context interface
interface Ctx {
  currentStepIndex: number;
}

// define the events union type
type Events =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; step: StepId };

// generate states for the state machine
const generateStates = steps.reduce((acc, step, index) => {
  acc[step] = {
    entry: assign({
      currentStepIndex: index,
    }),
    on: {
      NEXT: {
        target: steps[index + 1] || steps[index],
      },
      PREV: {
        target: steps[index - 1] || steps[index],
      },
      GOTO: {
        target: (_ctx: Ctx, event: Events) => {
          if (event.type === "GOTO" && steps.includes(event.step)) {
            return event.step;
          }
          return steps[index];
        },
      },
    },
  };
  return acc;
}, {} as Record<StepId, any>);

// create the state machine
export const stepMachine = createMachine({
  id: "chatbotSteps",
  initial: steps[0],
  types: {
    context: {} as Ctx,
    events: {} as Events,
  },
  context: {
    currentStepIndex: 0,
  },

  states: generateStates,
});
