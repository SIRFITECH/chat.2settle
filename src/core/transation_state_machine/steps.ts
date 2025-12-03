// export const steps = ["start", "chooseAction", "transactCrypto", "transferMoney",] as const;
export const steps = [
  "start",
  "chooseAction",
  "transactCrypto",
  "transferMoney",
  "estimateAsset",
  "network",
  "payOptions",
  "charge",
  "enterBankSearchWord",
  "selectBank",
  "enterAccountNumber",
  "continueToPay",
  "enterPhone",
  "sendPayment",
  "confirmTransaction",
  "paymentProcessing",
] as const;

export type StepId = (typeof steps)[number];
