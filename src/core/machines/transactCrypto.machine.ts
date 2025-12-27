export const transactCryptoMachine = {
  type: "parallel",
  states: {
    transferMoney: {
      on: {
        RESET: { target: "#chatbotSteps.start" },
        NEXT: {
          target: "#chatbotSteps.payment.payOptions",
          guard: { type: "transferMoney" },
        },
      },
    },

    sendGift: {
      on: {
        NEXT: {
          target: "#chatbotSteps.payment.payOptions",
          guard: { type: "sendGift" },
        },
      },
    },

    requestPayment: {
      on: {
        NEXT: {
          target: "#chatbotSteps.banking.enterBankSearchWord",
          guard: { type: "requestPayment" },
        },
      },
    },

    back: {
      on: {
        PREV: { target: "#chatbotSteps.chooseAction" },
      },
    },
  },
};
