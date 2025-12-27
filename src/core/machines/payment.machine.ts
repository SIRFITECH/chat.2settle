export const paymentMachine = {
  states: {
    requestPayCard: {
      on: {
        NEXT: { target: "kycReg" },
      },
    },

    payOptions: {
      entry: [
        { type: "BTC" },
        { type: "Ethereum" },
        { type: "Binance" },
        { type: "Tron" },
        { type: "USDT" },
        { type: "Back" },
        { type: "Exit" },
      ],
      on: {
        PREV: {
          target: "#chatbotSteps.transactCrypto.transferMoney",
        },
        NEXT: [
          { target: "estimateAsset", guard: { type: "BTC" } },
          { target: "network", guard: { type: "USDT" } },
          { target: "estimateAsset", guard: { type: "Ethereum" } },
          { target: "estimateAsset", guard: { type: "Binance" } },
          { target: "estimateAsset", guard: { type: "Tron" } },
        ],
        RESET: { target: "#chatbotSteps.start" },
      },
    },
  },
};
