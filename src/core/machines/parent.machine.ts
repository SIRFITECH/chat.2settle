import { bankingMachine } from "./banking.machine";
import { onboardingMachine } from "./onboarding.machine";
import { machineSetup } from "./setup";
import { paymentMachine } from "./payment.machine";
import { reportingMachine } from "./reporting_machine";
import { supportMachine } from "./support.machine";
import { transactCryptoMachine } from "./transactCrypto.machine";
import { transactionMachine } from "./transaction.machine";

export const chatbotMachine = machineSetup.createMachine({
  id: "chatbotSteps",
  context: {},
  initial: "welcome",

  states: {
    welcome: {
      on: {
        NEXT: { target: "start" },
      },
    },

    start: {
      entry: [{ type: "just continue" }, { type: "connect wallet" }],
      on: {
        NEXT: [
          {
            target: "onboarding.connectWallet",
            guard: { type: "connectWallet" },
          },
          {
            target: "chooseAction",
            guard: { type: "continue without wallet" },
          },
        ],
        RESET: { target: "start" },
      },
    },

    chooseAction: {
      entry: [
        { type: "transactCrypto" },
        { type: "requestPayCard" },
        { type: "customerSupport" },
        { type: "reportly" },
        { type: "back" },
        { type: "transactionId" },
      ],
      on: {
        NEXT: [
          {
            target: "transactCrypto.transferMoney",
            guard: { type: "transactCrypto" },
          },
          {
            target: "payment.requestPayCard",
            guard: { type: "requestPayCard" },
          },
          {
            target: "support",
            guard: { type: "customerSupport" },
          },
          {
            target: "reporting",
            guard: { type: "reportly" },
          },
          {
            target: "transaction.continueWithId",
            guard: { type: "transactionId" },
          },
        ],
        PREV: { target: "start" },
        RESET: { target: "start" },
      },
    },

    onboarding: onboardingMachine,
    transactCrypto: transactCryptoMachine,
    payment: paymentMachine,
    banking: bankingMachine,
    support: supportMachine,
    reporting: reportingMachine,
    transaction: transactionMachine,
  },
});

