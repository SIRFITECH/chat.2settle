import api from "./api-client";

// Maps chat app network names to payment engine network names
const NETWORK_MAP: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  bnb: "bsc",
  trx: "tron",
  erc20: "erc20",
  bep20: "bep20",
  trc20: "trc20",
};

export function mapNetwork(network: string): string {
  return NETWORK_MAP[network.toLowerCase()] ?? network.toLowerCase();
}

export interface EnginePayment {
  reference: string;
  depositAddress: string | null;
  cryptoAmount: number | null;
  fiatAmount: number;
  crypto: string;
  network: string;
  status: string;
  expiresAt: string | null;
}

interface CreatePaymentInput {
  type: "transfer" | "gift" | "request";
  fiatAmount: number;
  fiatCurrency?: string;
  crypto?: string;
  network?: string;
  chargeFrom?: "fiat" | "crypto";
  payer?: { chatId: string; phone?: string };
  receiver?: { bankCode: string; accountNumber: string };
}

interface FulfillRequestInput {
  crypto: string;
  network: string;
  payer: { chatId: string; phone?: string };
}

interface ClaimGiftInput {
  bankCode: string;
  accountNumber: string;
}

export async function createEnginePayment(input: CreatePaymentInput): Promise<EnginePayment> {
  const body: Record<string, unknown> = {
    type: input.type,
    fiatAmount: input.fiatAmount,
    fiatCurrency: input.fiatCurrency ?? "NGN",
  };

  if (input.crypto) body.crypto = input.crypto;
  if (input.network) body.network = mapNetwork(input.network);
  if (input.chargeFrom) body.chargeFrom = input.chargeFrom;
  if (input.payer) body.payer = input.payer;
  if (input.receiver) body.receiver = input.receiver;

  const response = await api.post<{ success: boolean; payment: EnginePayment }>(
    "/api/payments",
    body
  );

  return response.data.payment;
}

export async function fulfillRequest(
  reference: string,
  input: FulfillRequestInput
): Promise<EnginePayment> {
  const response = await api.post<{ success: boolean; payment: EnginePayment }>(
    `/api/payments/requests/${reference}/fulfill`,
    {
      crypto: input.crypto,
      network: mapNetwork(input.network),
      payer: input.payer,
    }
  );

  return response.data.payment;
}

export async function verifyReceiver(input: ClaimGiftInput): Promise<void> {
  await api.post("/api/payments/verify-receiver", {
    bankCode: input.bankCode,
    accountNumber: input.accountNumber,
  });
}

export interface ManualPaymentInput {
  fiatAmount: number;
  crypto: string;
  network: string;
  cryptoAmount: number;
  depositAddress: string;
  payer: { phone: string };
  receiver: { bankCode: string; accountNumber: string };
  transactionDate?: string;
}

export async function createManualPayment(input: ManualPaymentInput): Promise<EnginePayment> {
  const response = await api.post<{ success: boolean; payment: EnginePayment }>(
    "/api/payments",
    {
      type: "transfer",
      status: "settled",
      fiatAmount: input.fiatAmount,
      fiatCurrency: "NGN",
      crypto: input.crypto,
      network: input.network,
      cryptoAmount: input.cryptoAmount,
      depositAddress: input.depositAddress,
      payer: { chatId: input.payer.phone, phone: input.payer.phone },
      receiver: input.receiver,
      chargeFrom: "fiat",
      ...(input.transactionDate ? { transactionDate: input.transactionDate } : {}),
    }
  );

  return response.data.payment;
}

export async function claimGift(
  reference: string,
  input: ClaimGiftInput
): Promise<void> {
  await api.post(`/api/payments/gifts/${reference}/claim`, {
    bankCode: input.bankCode,
    accountNumber: input.accountNumber,
  });
}
