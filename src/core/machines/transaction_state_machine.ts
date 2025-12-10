import { setup, assign, createActor } from "xstate";
import { StepId, steps } from "./steps";

interface Ctx {
  currentStepIndex: number;
}

type Events =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; step: StepId };

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
    entry: assign({
      currentStepIndex: index,
    }),
    on: {
      NEXT: steps[index + 1] || steps[index],
      PREV: steps[index - 1] || steps[index],
      GOTO: {
        target: (_ctx: Ctx, event: Events) =>
          event.type === "GOTO" && steps.includes(event.step)
            ? event.step
            : steps[0],
      },
    },
  };
  return acc;
}, {} as Record<StepId, any>);

export const stepMachine = machineSetup.createMachine({
  id: "chatbotSteps",
  initial: steps[0],
  context: {
    currentStepIndex: 0,
  },
  states: generateStates,
});

// export const stepService = createActor(stepMachine).start();
// export a singleton instance that does not gets redeclared on every inport or reload
let _actor: ReturnType<typeof createActor> | null = null;

export function getStepService() {
  if (!_actor) {
    _actor = createActor(stepMachine).start();
  }
  return _actor;
}