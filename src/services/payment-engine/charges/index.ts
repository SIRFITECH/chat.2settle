/**
 * Charges Module
 *
 * Fee calculation for payments.
 */

export {
  // Types
  type FeeTier,
  type ChargeResult,

  // Constants
  DEFAULT_FEE_TIERS,

  // Functions
  getFeeTier,
  getFiatCharge,
  fiatChargeToCrypto,
  calculateCharges,
  formatCryptoAmount,
  formatFiatAmount,
} from './charge-calculator';
