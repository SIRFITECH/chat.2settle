import {
  buildChargeMenuMessage,
  calculateChargeFromTier,
  commitChargeToStores,
  getChargeContext,
  getChargeTier,
  navigateAfterCharge,
  parsePaymentInput,
} from "@/helpers/transaction/transaction_charge";
import { getLimits } from "@/services/rate/getLimits";
import { getRate } from "@/services/rate/getRates";
import useChatStore from "stores/chatStore";
import { usePaymentStore } from "stores/paymentStore";

export type ChargeContext = {
  ticker: string;
  estimateAsset: "naira" | "dollar" | "crypto";
  assetSymbol: string;
  assetPrice: number;
  isUSDT: boolean;
};

export type ChargeCalculation = {
  nairaCharge: number;
  assetCharge: number;
};

// Holds intermediate charge calculation between the two phases
type PendingCharge = {
  amount: number;
  rate: number;
  context: ChargeContext;
  charge: ChargeCalculation;
};

let pendingCharge: PendingCharge | null = null;

export const displayCharge = async (input: string) => {
  const { addMessages, setLoading } = useChatStore.getState();

  // ── Phase 2: user picked "1" or "2" from the charge menu ──────────────────
  if (pendingCharge && (input.trim() === "1" || input.trim() === "2")) {
    const { amount, rate, context, charge } = pendingCharge;
    pendingCharge = null;
    commitChargeToStores(amount, rate, context, charge, input);
    navigateAfterCharge();
    return;
  }

  // ── Phase 1: user entered an amount ───────────────────────────────────────
  pendingCharge = null; // clear any stale pending from a previous attempt

  const { crypto, estimateAsset, setAssetPrice } = usePaymentStore.getState();

  const amount = parsePaymentInput(input);
  if (amount === null) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid amount entered",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const rate = await getRate();

  // Fetch limits — validates bounds and locks in the asset price
  let limits;
  try {
    setLoading(true);
    limits = await getLimits(crypto, estimateAsset);
    if (limits.cryptoPrice > 0) {
      setAssetPrice(limits.cryptoPrice.toString());
    }
  } catch (e) {
    console.error("Error fetching limits for validation:", e);
    addMessages([
      {
        type: "incoming",
        content: "Unable to validate amount. Please try again.",
        timestamp: new Date(),
      },
    ]);
    return;
  } finally {
    setLoading(false);
  }

  // Validate bounds
  if (amount < limits.min || amount > limits.max) {
    addMessages([
      {
        type: "incoming",
        content: `Invalid amount. Must be between ${limits.min} and ${limits.max} ${limits.unit}.`,
        timestamp: new Date(),
      },
    ]);
    return;
  }

  const context = getChargeContext();

  if (Number.isNaN(context.assetPrice)) {
    addMessages([
      {
        type: "incoming",
        content: "Invalid asset price configuration",
        timestamp: new Date(),
      },
    ]);
    return;
  }

  let nairaEquivalent: number;
  if (context.estimateAsset === "naira") {
    nairaEquivalent = amount;
  } else if (context.estimateAsset === "dollar") {
    nairaEquivalent = amount * rate;
  } else {
    nairaEquivalent = amount * context.assetPrice * rate;
  }

  const tier = getChargeTier(nairaEquivalent);
  const { assetCharge, nairaCharge } = calculateChargeFromTier(tier, context, rate);

  // If the amount is too small to absorb the fiat charge, auto-add it to crypto
  if (nairaEquivalent <= nairaCharge) {
    commitChargeToStores(amount, rate, context, { assetCharge, nairaCharge }, "2");
    addMessages([
      {
        type: "incoming",
        content: (
          <span>
            Your amount is smaller than the service charge, so the charge
            of <b>{assetCharge.toFixed(8)} {context.assetSymbol}</b> has been
            automatically added to the crypto amount.
          </span>
        ),
        timestamp: new Date(),
      },
    ]);
    navigateAfterCharge();
    return;
  }

  // Amount is large enough — let the user decide
  pendingCharge = { amount, rate, context, charge: { assetCharge, nairaCharge } };
  addMessages([buildChargeMenuMessage({ assetCharge, nairaCharge, context })]);
};
