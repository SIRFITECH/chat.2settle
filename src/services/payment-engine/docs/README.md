# 2Settle Payment Engine

A standalone crypto-to-fiat payment engine that enables banks, fintechs, and merchants to accept cryptocurrency payments and settle in local fiat currency.

## Quick Start

```typescript
import { PaymentEngine } from '@/services/payment-engine';

// Create a payment session
const session = await PaymentEngine.createPayment({
  type: 'transfer',
  fiatAmount: 50000,        // ₦50,000
  fiatCurrency: 'NGN',
  crypto: 'USDT',
  network: 'bep20',         // BSC network
  payer: {
    chatId: 'user_123',
    phone: '08012345678'
  },
  receiver: {
    bankCode: '058',
    accountNumber: '1234567890',
    accountName: 'John Doe'
  }
});

console.log(session.depositAddress);  // Where user sends crypto
console.log(session.cryptoAmount);    // How much to send
console.log(session.reference);       // Human-readable reference (2S-XXXXXX)
```

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System diagrams and component overview |
| [Implementation Plan](./IMPLEMENTATION.md) | Phased development roadmap |
| [API Reference](./API.md) | Detailed API documentation |

## Features

- **Rate Locking** - Freeze exchange rates during payment window
- **Wallet Pool** - Automatic wallet assignment with concurrency safety
- **Tiered Fees** - Configurable fee tiers based on transaction amount
- **Multi-Chain** - Support for BTC, ETH, BNB, TRX, and USDT (ERC20/BEP20/TRC20)
- **State Machine** - Valid status transitions enforced

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ 2Settle Chat │  │ Merchant API │  │ Bank Integration │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼─────────────┘
          │                 │                   │
          ▼                 ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    Payment Engine Core                       │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Session   │  │   Wallet    │  │   Rate    │ Charge  │ │
│  │   Manager   │  │    Pool     │  │  Service  │ Calc    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Sessions   │  │   Wallets    │  │      Rates       │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
src/services/payment-engine/
├── index.ts                 # Public exports
├── payment-engine.ts        # Main facade class
├── types.ts                 # TypeScript interfaces
├── errors.ts                # Custom error classes
│
├── session/
│   ├── session-manager.ts   # Session orchestration
│   └── session-repository.ts # Database operations
│
├── wallet/
│   └── wallet-pool.ts       # Wallet assignment/release
│
├── rate/
│   └── rate-service.ts      # Rate fetching & locking
│
├── charges/
│   └── charge-calculator.ts # Fee calculation
│
├── utils/
│   └── id-generator.ts      # Payment ID generation
│
└── docs/
    ├── README.md            # This file
    ├── ARCHITECTURE.md      # Detailed diagrams
    └── IMPLEMENTATION.md    # Development roadmap
```

## Payment Session Lifecycle

```
┌──────────┐    ┌─────────┐    ┌────────────┐    ┌───────────┐    ┌──────────┐    ┌─────────┐
│ CREATED  │───▶│ PENDING │───▶│ CONFIRMING │───▶│ CONFIRMED │───▶│ SETTLING │───▶│ SETTLED │
└──────────┘    └─────────┘    └────────────┘    └───────────┘    └──────────┘    └─────────┘
     │               │
     │               ▼
     │          ┌─────────┐
     └────────▶│ EXPIRED │
               └─────────┘
```

| Status | Description |
|--------|-------------|
| `created` | Session initialized, wallet not yet assigned |
| `pending` | Wallet assigned, waiting for crypto deposit |
| `confirming` | Deposit detected, waiting for confirmations |
| `confirmed` | Deposit confirmed, ready for settlement |
| `settling` | Fiat payout in progress |
| `settled` | Complete - recipient received fiat |
| `expired` | No deposit received within time window |
| `failed` | Error occurred during processing |

## Fee Structure

| Fiat Amount | Fee |
|-------------|-----|
| ≤ ₦100,000 | ₦500 |
| ≤ ₦1,000,000 | ₦1,000 |
| > ₦1,000,000 | ₦1,500 |

## Supported Networks

| Crypto | Networks |
|--------|----------|
| BTC | `bitcoin` |
| ETH | `ethereum` |
| BNB | `bsc` |
| TRX | `tron` |
| USDT | `erc20`, `bep20`, `trc20` |

## Configuration

```typescript
const DEFAULT_CONFIG = {
  sessionTtlMinutes: 30,      // Payment window
  rateLockTtlMinutes: 30,     // Rate validity
  amountTolerance: 0.02,      // 2% tolerance for deposits
  confirmations: {
    bitcoin: 2,
    ethereum: 12,
    bsc: 15,
    tron: 19,
    polygon: 128,
    base: 12,
  },
};
```

## Testing

```bash
pnpm test                    # Run all tests
pnpm test payment-engine     # Run payment engine tests only
```

Tests are located in `__tests__/payment-engine/`:
- `id-generator.test.ts` - ID generation tests
- `charge-calculator.test.ts` - Fee calculation tests
- `rate-service.test.ts` - Rate locking tests
- `wallet-pool.test.ts` - Wallet assignment tests
- `session-manager.test.ts` - Session orchestration tests
