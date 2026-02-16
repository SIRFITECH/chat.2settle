/**
 * Payment Engine
 *
 * A standalone payment processing engine for crypto-to-fiat transactions.
 * This engine can be used by:
 * - The 2Settle chat interface
 * - The merchant API (for banks/fintechs)
 * - Any future client
 *
 * Architecture:
 * - SessionManager: Creates and manages payment sessions
 * - WalletPool: Assigns deposit wallets from a pool
 * - RateService: Fetches and locks exchange rates
 * - ChargeCalculator: Computes transaction fees
 *
 * Usage:
 * ```typescript
 * import { PaymentEngine } from '@/services/payment-engine';
 *
 * const engine = new PaymentEngine();
 *
 * const session = await engine.createPayment({
 *   type: 'transfer',
 *   fiatAmount: 50000,
 *   fiatCurrency: 'NGN',
 *   crypto: 'USDT',
 *   network: 'bsc',
 *   payer: { chatId: 'user123' },
 *   receiver: { bankCode: '058', accountNumber: '1234567890', accountName: 'John' }
 * });
 * ```
 */

// We'll export everything from here once implemented
// export { PaymentEngine } from './payment-engine';
// export * from './types';
// export * from './errors';
