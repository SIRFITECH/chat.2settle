export const onboardingMachine = {
  initial: "connectWallet",
  states: {
    connectWallet: {
      on: {
        PREV: { target: "#chatbotSteps.start" },
        NEXT: { target: "#chatbotSteps.chooseAction" },
      },
    },
  },
};
