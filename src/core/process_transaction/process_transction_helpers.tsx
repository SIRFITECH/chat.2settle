import { displayGiftFeedbackMessage } from "@/features/chatbot/handlers/chatHandlers/menus/display.gift.transaction.confirmation";
import { displaySendPayment } from "@/features/chatbot/handlers/chatHandlers/menus/display.send.payment";
import {
  createGift,
  updateGiftTransaction,
} from "@/services/transactionService/giftService/giftService";
import {
  createRequest,
  updateRequest,
} from "@/services/transactionService/requestService/requestService";
import { createTransfer } from "@/services/transactionService/transferService/transfer.service";
import { resetAllTransactionState } from "@/utils/resetTransactionState";
import { generateTransactionId } from "@/utils/utilities";
import { useBankStore } from "stores/bankStore";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";
import { useTransactionStore } from "stores/transactionStore";
import { useUserStore } from "stores/userStore";

export async function processTransaction() {
  const currentStep = useChatStore.getState().currentStep;
  const { next } = useChatStore.getState();
  const { paymentMode } = usePaymentStore.getState();

  const paymentStore = usePaymentStore.getState();
  const { user } = useUserStore.getState();
  const { bankData } = useBankStore.getState();
  const { giftId } = useTransactionStore.getState();

  const { acct_number, bank_name, receiver_name } = bankData;
  const receiver_phoneNumber = user?.phone!;
  const status = "Processing";
  const effort = paymentStore.paymentNairaEstimate
    ? parseFloat(paymentStore.paymentNairaEstimate) * 0.1
    : null;
  const transactionId = generateTransactionId().toString();

  function cleanCurrency(currencyStr: string): string {
    return currencyStr.replace(/[^0-9.]/g, "");
  }

  function toDecimal(val: string, maxTotal = 13, maxDecimals = 8): string {
    const cleaned = cleanCurrency(val);
    const num = parseFloat(cleaned);
    if (isNaN(num)) return "0";
    const intDigits = Math.floor(Math.abs(num)).toString().length;
    const decimals = Math.max(0, Math.min(maxDecimals, maxTotal - intDigits));
    const fixed = num.toFixed(decimals);
    if (fixed.includes(".")) {
      return fixed.replace(/0+$/, "").replace(/\.$/, "");
    }
    return fixed;
  }

  const estimateAmount =
    paymentStore.estimateAsset === "Naira"
      ? toDecimal(paymentStore.paymentNairaEstimate)
      : toDecimal(paymentStore.paymentAssetEstimate);

  const payer = {
    customer_phoneNumber: receiver_phoneNumber,
    chat_id: user?.chatId!.toString(),
  };

  const receiver = {
    acct_number: acct_number,
    bank_name: bank_name,
    receiver_name: receiver_name,
    receiver_phoneNumber: receiver_phoneNumber,
  };

  // Calculate dollar equivalent of amount_payable (naira amount / exchange rate)
  const nairaAmount =
    parseFloat(cleanCurrency(paymentStore.paymentNairaEstimate)) || 0;
  const exchangeRate = parseFloat(cleanCurrency(paymentStore.rate)) || 1;
  const dollarEquivalent = nairaAmount / exchangeRate;

  const summary = {
    transaction_type: currentStep.transactionType?.toLowerCase(),
    transactionId,
    total_dollar: toDecimal(dollarEquivalent.toString()),
    total_naira: toDecimal(paymentStore.paymentNairaEstimate),
    effort: effort ? toDecimal(effort.toString()) : undefined,
    asset_price: toDecimal(paymentStore.assetPrice),
    status,
  };

  const isTransfer = currentStep.transactionType?.toLowerCase() === "transfer";
  const isRequest = currentStep.transactionType?.toLowerCase() === "request";
  const isGift = currentStep.transactionType?.toLowerCase() === "gift";
  const isClaimGift = paymentMode.toLowerCase() === "claim gift";

  const transferData = {
    // TRANSFER
    // crypto
    // network
    // estimate_asset
    // amount_payable
    // crypto_amount // the amount the user is sending without charge
    // charges
    // date
    // transfer_id
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // estimate_amount // the amount the user is sending with or without charge
    // wallet_address
    // status

    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    amount_payable: toDecimal(paymentStore.paymentNairaEstimate),
    crypto_amount: toDecimal(paymentStore.paymentAssetEstimate),
    charges: toDecimal(paymentStore.nairaCharge),
    date: new Date(),
    transfer_id: transactionId,
    current_rate: toDecimal(paymentStore.rate),
    merchant_rate: toDecimal(paymentStore.merchantRate),
    profit_rate: toDecimal(paymentStore.profitRate),
    estimate_amount: estimateAmount,
    wallet_address: paymentStore.activeWallet,
    status,

    payer,
    receiver,
    summary,
  };

  const giftData = {
    // GIFT
    // gift_id
    // crypto
    // network
    // estimate_asset
    // estimate_amount
    // amount_payable
    // charges
    // crypto_amount
    // date
    // receiver_id
    // gift_status
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // wallet_address
    // status
    gift_id: transactionId,
    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    estimate_amount: estimateAmount,
    amount_payable: toDecimal(paymentStore.paymentNairaEstimate),
    charges: toDecimal(paymentStore.nairaCharge),
    crypto_amount: toDecimal(paymentStore.paymentAssetEstimate),
    date: new Date(),
    gift_status: "Not claimed",
    current_rate: toDecimal(paymentStore.rate),
    merchant_rate: toDecimal(paymentStore.merchantRate),
    profit_rate: toDecimal(paymentStore.profitRate),
    wallet_address: paymentStore.activeWallet,
    status,

    payer,
    summary,
  };

  const requestData = {
    // REQUEST
    // request_id
    // request_status
    // crypto
    // network
    // estimate_asset
    // estimate_amount
    // amount_payable
    // charges
    // crypto_amount
    // date
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // wallet_address
    // status

    request_id: transactionId,
    request_status: "Pending",
    crypto: paymentStore.crypto,
    network: paymentStore.network,
    estimate_asset: paymentStore.estimateAsset,
    estimate_amount: estimateAmount,
    amount_payable: toDecimal(paymentStore.paymentNairaEstimate),
    charges: toDecimal(paymentStore.nairaCharge),
    crypto_amount: toDecimal(paymentStore.paymentAssetEstimate),
    date: new Date(),
    // current_rate: toDecimal(paymentStore.rate),
    // merchant_rate: toDecimal(paymentStore.merchantRate),
    // profit_rate: toDecimal(paymentStore.profitRate),
    wallet_address: paymentStore.activeWallet,
    status,

    receiver,
    summary,
  };

  const updateRequestData = {
    // REQUEST
    // request_id
    // request_status
    // crypto
    // network
    // estimate_asset
    // estimate_amount
    // amount_payable
    // charges
    // crypto_amount
    // date
    // receiver_id
    // payer_id
    // current_rate
    // merchant_rate
    // profit_rate
    // wallet_address
    // status

    request_status: "Paid",
    crypto: paymentStore.crypto,
    network: paymentStore.network,
    charges: toDecimal(paymentStore.nairaCharge),
    crypto_amount: toDecimal(paymentStore.paymentAssetEstimate),
    date: new Date(),
    current_rate: toDecimal(paymentStore.rate),
    merchant_rate: toDecimal(paymentStore.merchantRate),
    profit_rate: toDecimal(paymentStore.profitRate),
    wallet_address: paymentStore.activeWallet,

    payer,
    summary,
  };

  if (isTransfer) {
    // call the endpoint that saves transfer transaction
    try {
      console.log("Processing transfer transaction...", transferData);
      const { setTransferId, setTransactionId } =
        useTransactionStore.getState();
      setTransactionId(transactionId);
      setTransferId(transactionId);
      await createTransfer(transferData);
      displaySendPayment();
    } catch (error) {
      console.error("Error creating transfer:", error);
    }
  } else if (isGift) {
    // call the endpoint that saves gift transaction
    try {
      console.log("Processing gift transaction...");
      const { setGiftId, setTransactionId } = useTransactionStore.getState();
      setTransactionId(transactionId);
      setGiftId(giftData.gift_id);
      await createGift(giftData);
      console.log("Gift created, displaying send payment...");
      displaySendPayment();
    } catch (error) {
      console.error("Error creating gift:", error);
    }
  } else if (isRequest) {
    // call the endpoint that saves request transaction
    try {
      console.log("Processing request transaction...");
      const { setRequestId, setTransactionId } = useTransactionStore.getState();
      setTransactionId(transactionId);
      setRequestId(requestData.request_id);
      await createRequest(requestData);
      displaySendPayment();
    } catch (error) {
      console.error("Error creating request:", error);
    }
  } else if (isClaimGift) {
    // call the endpoint that saves gift transaction
    console.log("Processing claim gift transaction...");
    await updateGiftTransaction(giftId, {
      acct_number,
      bank_name,
      receiver_name,
      receiver_phoneNumber,
    });
    displayGiftFeedbackMessage();

    // Reset all transaction state after claim gift completion
    resetAllTransactionState();

    next({ stepId: "start", transactionType: undefined });
  } else {
    // call the endpoint that saves request transaction (pay request)
    console.log("Paying request transaction...");
    await updateRequest(updateRequestData);
    displaySendPayment();
  }

  // const {
  //   activeWallet,
  //   assetPrice,
  //   crypto,
  //   dollarCharge,
  //   estimateAsset,
  //   merchantRate,
  //   rate,
  //   profitRate,
  //   network,
  //   nairaCharge,
  //   paymentMode,
  //   paymentAssetEstimate,
  //   paymentNairaEstimate,
  // } = usePaymentStore.getState();

  // save payer, get the payer_id
  // save reciever, get reciever_id
  // generate gift_id
  // then save gift.

  //GIFT

  /**
   * gift_id
   * status
   * crypto # ETH, BTC
   * network # ERC20
   * estimate_asset # Naira, Dollar, BTC
   * estimate_amount # amount estimated in estimate asset
   * amount_payable # amount we pay the user in naira
   * charges #
   * crypto_amount # estimate_amount in crypto
   * date
   * reciever_id
   * gift_status
   * payer_id
   * current_rate
   * merchant_rate
   * profit_rate
   * wallet_address # recieving wallet address
   */

  //SUMMARY

  /**
   * transaction_type
   * total_dollar
   * settle_date
   * transaction_id
   * total_naira
   * effort
   * merchant_id
   * status
   * ref_code
   * asset_price
   * */
}
