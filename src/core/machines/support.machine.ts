export const supportMachine = {
  type: "parallel",
  states: {
    makeEnquiry: {
      on: {
        NEXT: {
          target: "#chatbotSteps.textSupport",
          guard: { type: "makeEnquiry" },
        },
      },
    },

    makeComplain: {
      on: {
        NEXT: {
          target: "#chatbotSteps.enterTrxId",
          guard: { type: "makeComplain" },
        },
      },
    },
  },
};
