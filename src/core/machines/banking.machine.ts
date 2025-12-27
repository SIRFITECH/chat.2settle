export const bankingMachine = {
  states: {
    enterBankSearchWord: {
      on: {
        PREV: [
          { target: "charge", guard: { type: "from transaferMoney" } },
          {
            target: "#chatbotSteps.transactCrypto.requestPayment",
            guard: { type: "from requestPayment" },
          },
          {
            target: "#chatbotSteps.transaction.entreTrxId",
            guard: { type: "from claimGift" },
          },
        ],
        NEXT: { target: "selectBank" },
        RESET: { target: "#chatbotSteps.start" },
      },
    },

    selectBank: {
      on: {
        NEXT: { target: "enterAccountNumber" },
        RESET: { target: "#chatbotSteps.start" },
      },
    },

    enterAccountNumber: {
      on: {
        PREV: { target: "enterBankSearchWord" },
        NEXT: { target: "confirmAcoount" },
        RESET: { target: "#chatbotSteps.start" },
      },
    },
  },
};
