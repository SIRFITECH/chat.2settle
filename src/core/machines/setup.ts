import { setup } from "xstate";

export const machineSetup = setup({
  types: {
    context: {} as {},
    events: {} as { type: "NEXT" } | { type: "PREV" } | { type: "RESET" },
  },
  actions: {
    "just continue": function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    "connect wallet": function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    transactCrypto: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    requestPayCard: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    customerSupport: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    reportly: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    back: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    transactionId: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    ERC20: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    BEP20: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    TRC20: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    BTC: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Ethereum: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Binance: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Tron: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    USDT: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Back: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Exit: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Naira: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Dollar: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
    Crypto: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
  },
  guards: {
    connectWallet: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "continue without wallet": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    transactCrypto: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    requestPayCard: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    customerSupport: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    reportly: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    transactionId: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    ERC20: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    BEP20: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    TRC20: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    transferMoney: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    BTC: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    USDT: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Ethereum: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Binance: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Tron: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Naira: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    Dollar: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    crypto: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    sendGift: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    fullFIllRequest: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "charge from account": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "add charges to amount": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "from transaferMoney": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "from requestPayment": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "from claimGift": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    requestPayment: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    claimGift: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    fullFillRequest: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    "from fullFillRequest": function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    trackTransaction: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    stolenFunds: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    fraud: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    makeEnquiry: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
    makeComplain: function ({ context, event }) {
      // Add your guard condition here
      return true;
    },
  },
});
