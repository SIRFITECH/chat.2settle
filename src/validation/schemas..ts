import { z } from "zod";
import { amountStr, dateField, longStr, number, shortStr } from "./helper";

export const payerSchema = z.object({
  chat_id: shortStr(50),
  customer_phoneNumber: shortStr(20),
});

export const receiverSchema = z.object({
  acct_number: shortStr(20).optional(),
  bank_name: shortStr(50).optional(),
  receiver_name: shortStr(100).optional(),
  receiver_phoneNumber: shortStr(20).optional(),
  is_vendor: z.boolean().optional(),
});

export const transferSchema = z
  .object({
    crypto: shortStr(20).optional(),
    network: shortStr(20).optional(),
    estimate_asset: shortStr(20).optional(),

    amount_payable: amountStr().optional(),
    crypto_amount: amountStr().optional(),
    estimate_amount: amountStr().optional(),
    charges: amountStr().optional(),

    date: dateField,
    transfer_id: shortStr(50).optional(),

    receiver_id: number(0).optional(),
    payer_id: number(0).optional(),

    current_rate: amountStr().optional(),
    merchant_rate: amountStr().optional(),
    profit_rate: amountStr().optional(),

    wallet_address: longStr(255).optional(),
    status: shortStr(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Request body cannot be empty",
  });

export const giftSchema = z.object({
  gift_id: shortStr(50).optional(),
  crypto: shortStr(20).optional(),
  network: shortStr(20).optional(),
  estimate_asset: shortStr(20).optional(),
  estimate_amount: amountStr().optional(),
  amount_payable: amountStr().optional(),
  charges: amountStr().optional(),
  crypto_amount: amountStr().optional(),
  date: dateField,

  receiver_id: z.number().optional(),
  payer_id: z.number().optional(),

  current_rate: amountStr().optional(),
  merchant_rate: amountStr().optional(),
  profit_rate: amountStr().optional(),

  wallet_address: longStr(255).optional(),
  status: shortStr(20).optional(),
});

export const requestSchema = z.object({
  request_id: shortStr(50).optional(),
  request_status: shortStr(20).optional(),

  crypto: shortStr(20).optional(),
  network: shortStr(20).optional(),
  estimate_asset: shortStr(20).optional(),

  estimate_amount: amountStr().optional(),
  amount_payable: amountStr().optional(),
  charges: amountStr().optional(),
  crypto_amount: amountStr().optional(),

  date: dateField,

  receiver_id: z.number().optional(),
  payer_id: z.number().optional(),

  current_rate: amountStr().optional(),
  merchant_rate: amountStr().optional(),
  profit_rate: amountStr().optional(),

  wallet_address: longStr(255).optional(),
  status: shortStr(20).optional(),
});

export const summarySchema = z.object({
  total_dollar: amountStr().optional(),
  total_naira: amountStr().optional(),
  effort: shortStr(50).optional(),
  merchant_id: z.number().optional(),
  ref_code: shortStr(50).optional(),
  asset_price: amountStr().optional(),
  status: shortStr(20).optional(),
});
