export const proceedWithTransaction = async (
  phoneNumber: string,
  setLoading: (isLoading: boolean) => void,
  sharedPaymentMode: string,
  processTransaction: (
    phoneNumber: string,
    isGift: boolean,
    isGiftTrx: boolean,
    requestPayment: boolean
  ) => Promise<void>
): Promise<void> => {
  setLoading(true);
  const isGiftTrx = sharedPaymentMode.toLowerCase() === "gift";
  const requestPayment = sharedPaymentMode.toLowerCase() === "request";

  try {
    await processTransaction(phoneNumber, false, isGiftTrx, requestPayment);
  } finally {
    setLoading(false);
  }
};
