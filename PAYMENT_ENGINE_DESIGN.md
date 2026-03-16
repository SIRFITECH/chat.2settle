# 2Settle Payment Engine Design

## Overview

This document describes the architecture for exposing 2Settle's crypto-to-fiat payment engine as a **merchant payment gateway** — enabling businesses to accept crypto payments on their platforms the same way they integrate Paystack or Flutterwave.

### Goals

- Merchants integrate via API/SDK to accept crypto payments
- 2Settle receives crypto into its own wallet pool, settles fiat to merchant's bank
- Multi-currency fiat support (NGN first, extensible to GHS, KES, ZAR, etc.)
- Business-level KYC (2Settle KYCs the merchant, merchant KYCs their users)

### Non-Goals (for now)

- End-user KYC by 2Settle
- Non-custodial / user-connects-wallet model (existing chat product handles this separately)
- Crypto-to-crypto payments

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Integration Layer                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Hosted       │  │ JS SDK       │  │ REST API           │ │
│  │ Checkout     │  │ (inline.js)  │  │ (server-to-server) │ │
│  │ /pay/{ref}   │  │ iframe modal │  │ POST /v1/payments  │ │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬──────────┘ │
│         │                 │                     │            │
└─────────┼─────────────────┼─────────────────────┼────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    Public API Gateway                         │
│                                                              │
│  - API key authentication (pk_live_*, sk_live_*)             │
│  - Rate limiting (per merchant, per endpoint)                │
│  - Request validation                                        │
│  - API versioning (/v1/)                                     │
│  - Webhook dispatch                                          │
└──────────────────────────┬───────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Payment    │  │   Wallet     │  │  Settlement  │
│   Engine     │  │   Pool       │  │  Engine      │
│              │  │              │  │              │
│ - Sessions   │  │ - Assignment │  │ - Fiat payout│
│ - Rate lock  │  │ - Cooldown   │  │ - Multi-curr │
│ - Status     │  │ - Monitoring │  │ - Bank rails │
│ - Expiry     │  │ - Release    │  │ - Batching   │
└──────────────┘  └──────────────┘  └──────────────┘
          │                │                │
          ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────┐
│                         MySQL                                │
│                                                              │
│  merchants │ api_keys │ payments │ wallets │ settlements     │
└──────────────────────────────────────────────────────────────┘
```

---

## Wallet Pool Model

2Settle does **not** use HD wallet derivation. Instead, it maintains a **finite pool of pre-funded wallets** in the `wallets` table. Each wallet has addresses for multiple chains (BTC, EVM, TRON) and per-chain availability flags.

### Current Schema

```sql
CREATE TABLE wallets (
  id            INT NOT NULL,
  bitcoin       VARCHAR(80),
  evm           VARCHAR(80),
  tron          VARCHAR(80),
  bitcoin_flag  TINYINT(1),    -- 1 = available, 0 = in use
  ethereum_flag TINYINT(1),
  binance_flag  TINYINT(1),
  tron_flag     TINYINT(1),
  erc20_flag    TINYINT(1),
  bep20_flag    TINYINT(1),
  trc20_flag    TINYINT(1)
);
```

### Assignment Flow

```
1. Transaction initiated → network selected (e.g. "btc")
2. SELECT * FROM wallets WHERE bitcoin_flag = 1 LIMIT 1 FOR UPDATE
3. If found:
   - Set bitcoin_flag = 0
   - Record bitcoin_last_assigned = NOW()
   - Return wallet address to payment session
4. If none available:
   - Return 503 with estimated wait time
   - Wallet released after WALLET_EXPIRY_TIME (5 minutes)
```

**Concurrency safety**: `FOR UPDATE` row lock within a DB transaction prevents two payments from being assigned the same wallet.

### Adaptations for Merchant Gateway

The current wallet pool works for the chat product where one user transacts at a time. For the merchant gateway with concurrent payments from multiple merchants, the pool needs:

1. **More wallets** — Scale the pool to match expected concurrent payment volume
2. **Payment-scoped assignment** — Wallet is tied to a `payment_id`, not just flagged as "in use"
3. **Longer hold times** — Merchant payments may take longer than 5 minutes (customer delay). Consider 30-minute holds with configurable expiry.
4. **Deposit monitoring** — Actively watch assigned wallet addresses for incoming transactions on-chain. Currently the system relies on user confirmation; the merchant flow needs automated detection.
5. **Wallet recycling** — After a payment is confirmed or expired, release the wallet back to the pool

### Proposed Schema Extension

```sql
-- Link wallet assignment to a specific payment
ALTER TABLE wallets ADD COLUMN current_payment_id VARCHAR(36) DEFAULT NULL;
ALTER TABLE wallets ADD COLUMN assigned_at TIMESTAMP DEFAULT NULL;

-- Or track assignment history separately
CREATE TABLE wallet_assignments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  wallet_id       INT NOT NULL,
  payment_id      VARCHAR(36) NOT NULL,
  chain           ENUM('btc', 'evm', 'tron') NOT NULL,
  assigned_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  released_at     TIMESTAMP NULL,
  status          ENUM('active', 'completed', 'expired') DEFAULT 'active',
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
```

---

## Merchant Model

### Database Schema

```sql
CREATE TABLE merchants (
  id              VARCHAR(36) PRIMARY KEY,        -- UUID
  business_name   VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  kyc_status      ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  kyc_submitted_at TIMESTAMP NULL,
  kyc_approved_at  TIMESTAMP NULL,
  webhook_url     VARCHAR(500),
  webhook_secret  VARCHAR(255),                   -- HMAC secret for signing payloads
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE merchant_api_keys (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id     VARCHAR(36) NOT NULL,
  public_key      VARCHAR(50) NOT NULL UNIQUE,    -- pk_live_xxxx / pk_test_xxxx
  secret_key      VARCHAR(100) NOT NULL UNIQUE,   -- sk_live_xxxx (hashed)
  environment     ENUM('live', 'test') DEFAULT 'test',
  is_active       TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE merchant_settlement_accounts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id     VARCHAR(36) NOT NULL,
  currency        VARCHAR(3) NOT NULL,            -- NGN, GHS, KES
  bank_code       VARCHAR(10) NOT NULL,
  account_number  VARCHAR(20) NOT NULL,
  account_name    VARCHAR(255) NOT NULL,
  is_default      TINYINT(1) DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  UNIQUE KEY (merchant_id, currency, account_number)
);
```

### API Key Format

Following the Paystack convention:
- **Public key**: `pk_live_` + 32 random chars (used client-side, in JS SDK)
- **Secret key**: `sk_live_` + 40 random chars (used server-side, never exposed)
- **Test keys**: `pk_test_` / `sk_test_` for sandbox environment

---

## Payment Session Lifecycle

### States

```
┌──────────┐    ┌─────────┐    ┌───────────┐    ┌───────────┐
│ CREATED  │───▶│ PENDING │───▶│ CONFIRMED │───▶│ SETTLED   │
└──────────┘    └─────────┘    └───────────┘    └───────────┘
     │               │
     │               ▼
     │          ┌─────────┐
     └────────▶│ EXPIRED │
               └─────────┘
```

- **CREATED** — Payment initialized via API. Wallet not yet assigned.
- **PENDING** — Wallet assigned. Waiting for customer to send crypto.
- **CONFIRMED** — Crypto deposit detected and confirmed on-chain (N confirmations).
- **SETTLED** — Fiat paid out to merchant's bank account.
- **EXPIRED** — Customer didn't pay within the time window. Wallet released.

### Schema

```sql
CREATE TABLE payments (
  id                VARCHAR(36) PRIMARY KEY,
  reference         VARCHAR(100) NOT NULL UNIQUE,   -- Merchant-provided or auto-generated
  merchant_id       VARCHAR(36) NOT NULL,
  amount_fiat       DECIMAL(15, 2) NOT NULL,        -- Amount in settlement currency
  settlement_currency VARCHAR(3) NOT NULL,           -- NGN, GHS, KES
  crypto_currency   VARCHAR(10) NULL,                -- BTC, ETH, USDT, etc. (set when customer chooses)
  crypto_amount     DECIMAL(18, 8) NULL,             -- Calculated from rate at lock time
  rate              DECIMAL(15, 4) NULL,             -- Locked rate at payment creation
  rate_locked_at    TIMESTAMP NULL,
  wallet_address    VARCHAR(100) NULL,               -- Assigned from pool
  wallet_id         INT NULL,
  chain             VARCHAR(10) NULL,                -- btc, evm, tron
  tx_hash           VARCHAR(100) NULL,               -- On-chain transaction hash
  status            ENUM('created', 'pending', 'confirmed', 'settled', 'expired') DEFAULT 'created',
  expires_at        TIMESTAMP NULL,                  -- Payment window expiry
  confirmed_at      TIMESTAMP NULL,
  settled_at        TIMESTAMP NULL,
  callback_url      VARCHAR(500) NULL,               -- Per-payment redirect URL
  metadata          JSON NULL,                       -- Merchant-provided metadata
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
```

---

## Public API Design

### Base URL

```
Live:  https://api.2settle.io/v1
Test:  https://sandbox.2settle.io/v1
```

### Authentication

All API requests include the secret key in the `Authorization` header:

```
Authorization: Bearer live-api-key
```

Hosted checkout and JS SDK use the public key. Make the API key `live`

### Endpoints

#### Initialize Payment

```
POST /v1/payments/initialize

Headers:
  Authorization: Bearer sk_live_xxx

Body:
{
  "amount": 5000,                     // Amount in settlement currency (minor or major units — decide convention)
  "currency": "NGN",                  // Settlement currency
  "reference": "order_12345",         // Optional, auto-generated if omitted
  "callback_url": "https://merchant.com/callback",
  "metadata": {                       // Optional, returned in webhooks
    "order_id": "12345",
    "customer_email": "user@example.com"
  }
}

Response 200:
{
  "status": true,
  "message": "Payment initialized",
  "data": {
    "payment_id": "pay_abc123",
    "reference": "order_12345",
    "checkout_url": "https://spend.2settle.io/pay/pay_abc123",
    "amount": 5000,
    "currency": "NGN",
    "status": "created",
    "expires_at": null
  }
}
```

#### Verify Payment

```
GET /v1/payments/verify/:reference

Response 200:
{
  "status": true,
  "data": {
    "payment_id": "pay_abc123",
    "reference": "order_12345",
    "amount": 5000,
    "currency": "NGN",
    "crypto_currency": "USDT",
    "crypto_amount": "3.48",
    "status": "confirmed",
    "tx_hash": "0xabc...",
    "confirmed_at": "2026-02-09T12:34:56Z",
    "settled_at": null,
    "metadata": { "order_id": "12345" }
  }
}
```

#### List Payments

```
GET /v1/payments?status=confirmed&page=1&limit=50

Response 200:
{
  "status": true,
  "data": [...],
  "meta": { "page": 1, "total": 120, "limit": 50 }
}
```

#### Fetch Rates

```
GET /v1/rates?currency=NGN

Response 200:
{
  "status": true,
  "data": {
    "currency": "NGN",
    "rates": {
      "BTC": { "rate": 1436.96, "unit": "NGN per USD" },
      "ETH": { "rate": 1436.96, "unit": "NGN per USD" },
      "USDT": { "rate": 1436.96, "unit": "NGN per USD" },
      "BNB": { "rate": 1436.96, "unit": "NGN per USD" }
    },
    "timestamp": "2026-02-09T12:00:00Z"
  }
}
```

---

## Hosted Checkout Page

The simplest integration path. Merchant redirects customer to:

```
https://spend.2settle.io/pay/{payment_id}
```

### Checkout Flow

```
┌─────────────────┐     ┌──────────────────────────────────────┐
│ Merchant Site   │     │ 2Settle Hosted Checkout               │
│                 │     │ /pay/{payment_id}                     │
│ Customer clicks │     │                                       │
│ "Pay with       │────▶│  1. Show payment amount in fiat       │
│  Crypto"        │     │  2. Customer selects crypto (BTC/ETH/ │
│                 │     │     USDT/BNB/TRX)                     │
│                 │     │  3. Lock rate, calculate crypto amount │
│                 │     │  4. Assign wallet from pool            │
│                 │     │  5. Show deposit address + QR code     │
│                 │     │  6. Show countdown timer               │
│                 │     │  7. Poll for payment confirmation      │
│                 │     │  8. On confirm → redirect to callback  │
│                 │◀────│     with ?reference=order_12345        │
│                 │     │                                       │
│ Verify server-  │     │  On expire → show "Payment expired"   │
│ side via API    │     │                                       │
└─────────────────┘     └──────────────────────────────────────┘
```

### Page Location

```
src/pages/pay/[paymentId].tsx
```

This is a standalone page — no chatbot, no app chrome. Clean payment UI with:
- 2Settle branding
- Payment amount (fiat + crypto equivalent)
- Crypto selector (BTC, ETH, USDT, BNB, TRX)
- Wallet address + QR code
- Countdown timer
- Status polling

---

## JS SDK (Phase 2)

```html
<script src="https://js.2settle.io/v1/inline.js"></script>

<button onclick="payWith2Settle()">Pay ₦5,000</button>

<script>
  function payWith2Settle() {
    TwoSettle.pay({
      key: "pk_live_xxxxxxxxxx",
      amount: 5000,
      currency: "NGN",
      reference: "order_12345",       // optional
      callback_url: "https://merchant.com/callback",
      metadata: {
        order_id: "12345"
      },
      onSuccess: function(response) {
        // response.reference, response.tx_hash, response.status
        // Verify server-side before fulfilling order
      },
      onClose: function() {
        // Customer closed the payment modal
      }
    });
  }
</script>
```

Under the hood, `TwoSettle.pay()`:
1. Calls `/v1/payments/initialize` using the public key
2. Opens an iframe pointing to the hosted checkout page
3. Listens for postMessage events from the iframe
4. Calls `onSuccess` / `onClose` callbacks

---

## Webhook System

### Event Types

| Event | Trigger |
|---|---|
| `payment.pending` | Wallet assigned, waiting for deposit |
| `payment.confirmed` | Crypto deposit confirmed on-chain |
| `payment.settled` | Fiat paid to merchant's bank |
| `payment.expired` | Payment window expired, no deposit |

### Payload Format

```json
{
  "event": "payment.confirmed",
  "data": {
    "payment_id": "pay_abc123",
    "reference": "order_12345",
    "amount": 5000,
    "currency": "NGN",
    "crypto_currency": "USDT",
    "crypto_amount": "3.48",
    "tx_hash": "0xabc...",
    "status": "confirmed",
    "metadata": { "order_id": "12345" }
  }
}
```

### Security

Webhooks are signed with HMAC-SHA512 using the merchant's webhook secret:

```
X-2Settle-Signature: sha512=<HMAC of raw body>
```

Merchant verifies:

```javascript
const crypto = require("crypto");
const hash = crypto
  .createHmac("sha512", webhookSecret)
  .update(rawBody)
  .digest("hex");

if (hash === req.headers["x-2settle-signature"]) {
  // Authentic webhook from 2Settle
}
```

### Delivery

- POST to merchant's `webhook_url`
- Retry on failure: 3 attempts with exponential backoff (1min, 5min, 30min)
- Timeout: 10 seconds per attempt
- Log all delivery attempts for debugging

### Webhook Log Table

```sql
CREATE TABLE webhook_logs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id     VARCHAR(36) NOT NULL,
  payment_id      VARCHAR(36) NOT NULL,
  event           VARCHAR(50) NOT NULL,
  url             VARCHAR(500) NOT NULL,
  payload         JSON NOT NULL,
  response_code   INT NULL,
  response_body   TEXT NULL,
  attempt         INT DEFAULT 1,
  delivered_at    TIMESTAMP NULL,
  next_retry_at   TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id)
);
```

---

## Multi-Currency Settlement Engine

### Design Principle

Each fiat currency is a **settlement rail** — an implementation of a common interface. Adding a new currency means implementing a new rail and registering it.

### Interface

```typescript
interface SettlementRail {
  currency: string;                                     // "NGN", "GHS", "KES"

  // Rate
  getRate(): Promise<number>;                           // Crypto-to-fiat rate

  // Bank validation
  getBanks(): Promise<Bank[]>;                          // List of supported banks
  validateAccount(bankCode: string, accountNumber: string): Promise<AccountInfo>;

  // Payout
  initiatePayout(params: {
    amount: number;
    bankCode: string;
    accountNumber: string;
    accountName: string;
    reference: string;
  }): Promise<PayoutResult>;

  // Status
  verifyPayout(reference: string): Promise<PayoutStatus>;
}
```

### NGN Rail (First Implementation)

Uses existing 2Settle infrastructure:
- Rate: CoinMarketCap API (already integrated)
- Banks: Nigerian banks list (already have)
- Validation: Bank account verification API (already have)
- Payout: Existing bank transfer logic

### Adding a New Currency

```
src/services/settlement/
  index.ts                    # Rail registry + factory
  rails/
    ngn.ts                    # Nigerian Naira rail
    ghs.ts                    # Ghanaian Cedi rail (future)
    kes.ts                    # Kenyan Shilling rail (future)
    zar.ts                    # South African Rand rail (future)
```

```typescript
// src/services/settlement/index.ts
const rails: Record<string, SettlementRail> = {};

export function registerRail(rail: SettlementRail) {
  rails[rail.currency] = rail;
}

export function getRail(currency: string): SettlementRail {
  const rail = rails[currency];
  if (!rail) throw new Error(`Unsupported currency: ${currency}`);
  return rail;
}
```

Each new currency requires:
1. A banking/payout partner for that country
2. A rate source for crypto-to-local-currency
3. Bank list + account validation for that country
4. Implement the `SettlementRail` interface

---

## Deposit Monitoring

The merchant gateway needs **automated deposit detection** — unlike the chat product where the user confirms they've sent crypto.

### Approach

A background job polls/monitors assigned wallet addresses for incoming transactions.

```
┌─────────────────────┐
│   Deposit Monitor    │
│   (cron / worker)    │
│                      │
│  For each PENDING    │
│  payment:            │
│   1. Check chain for │
│      incoming tx to  │
│      assigned wallet │
│   2. If found:       │
│      - Verify amount │
│      - Wait for N    │
│        confirmations │
│      - Update status │
│        to CONFIRMED  │
│      - Fire webhook  │
│      - Trigger       │
│        settlement    │
│   3. If expired:     │
│      - Set EXPIRED   │
│      - Release wallet│
│      - Fire webhook  │
└─────────────────────┘
```

### Confirmation Requirements

| Chain | Confirmations | ~Time |
|---|---|---|
| BTC | 2 | ~20 min |
| ETH | 12 | ~2.5 min |
| BSC | 15 | ~45 sec |
| TRON | 19 | ~1 min |

### Implementation Options

1. **Polling** — Cron job checks balances/transactions every 30 seconds. Simple, works at low-medium volume.
2. **Blockchain node websockets** — Subscribe to pending transactions. More real-time, more infrastructure.
3. **Third-party service** — Use Alchemy/Moralis/Tatum webhooks for transaction notifications. Easiest to start.

**Recommendation**: Start with polling via a cron job or Next.js API route triggered by a scheduler (Vercel Cron). Move to a dedicated worker or third-party webhooks as volume grows.

### Cron Endpoint

```
src/pages/api/cron/monitor-deposits.ts
```

Triggered every 30 seconds. For each `PENDING` payment:
- Fetch recent transactions for the assigned wallet address
- Match against expected `crypto_amount` (with tolerance for network fees)
- Check confirmation count
- Update payment status accordingly

---

## Relationship to Existing Chat Product

The chat product (current 2Settle frontend) and the merchant gateway share the same underlying infrastructure:

```
┌───────────────────┐     ┌───────────────────┐
│  Chat Frontend    │     │  Merchant API      │
│  (spend.2settle)  │     │  (api.2settle)     │
│                   │     │                    │
│  - Chatbot UI     │     │  - REST endpoints  │
│  - User wallet    │     │  - Hosted checkout │
│  - Step machine   │     │  - JS SDK          │
└────────┬──────────┘     └────────┬───────────┘
         │                         │
         ▼                         ▼
┌──────────────────────────────────────────────┐
│           Shared Payment Engine               │
│                                              │
│  src/services/payment-engine/                │
│  - rate service (existing)                   │
│  - wallet pool (existing, extended)          │
│  - settlement rails (new)                    │
│  - transaction recording (existing)          │
└──────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────┐
│                  MySQL                        │
│  wallets │ payments │ merchants │ transfers   │
│  gifts   │ requests │ settlements │ webhooks  │
└──────────────────────────────────────────────┘
```

### Migration Path

1. **Extract** business logic from chatbot handlers (`src/features/`) into `src/services/payment-engine/`
2. **Refactor** chatbot handlers to call the payment engine service instead of duplicating logic
3. **Build** the merchant API layer on top of the same payment engine
4. Both products evolve independently but share the core engine

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1–3)

- [ ] Extract payment engine service from chatbot handlers
- [ ] Create merchant DB schema (merchants, api_keys, settlement_accounts)
- [ ] Build merchant registration + API key generation
- [ ] Build core API endpoints: initialize, verify, list payments
- [ ] Build payment session lifecycle (create → pending → confirmed → settled → expired)

### Phase 2: Hosted Checkout (Weeks 4–5)

- [ ] Build `/pay/[paymentId]` checkout page
- [ ] Crypto selector with rate locking
- [ ] Wallet assignment from pool
- [ ] QR code + deposit address display
- [ ] Countdown timer + status polling UI
- [ ] Callback redirect on success/expiry

### Phase 3: Deposit Monitoring (Weeks 5–6)

- [ ] Build deposit monitor cron job
- [ ] Chain-specific balance/transaction checking (BTC, EVM, TRON)
- [ ] Confirmation tracking
- [ ] Auto-update payment status on confirmed deposit

### Phase 4: Webhooks + Settlement (Weeks 6–7)

- [ ] Webhook dispatch system with retry logic
- [ ] Webhook signature verification
- [ ] Webhook logs
- [ ] Automated fiat settlement trigger on confirmed payment
- [ ] NGN settlement rail (refactor existing payout logic)

### Phase 5: JS SDK (Weeks 8–9)

- [ ] Build `inline.js` SDK
- [ ] iframe integration with hosted checkout
- [ ] postMessage bridge for callbacks
- [ ] NPM package for React/Node integrations

### Phase 6: Merchant Dashboard (Weeks 9–11)

- [ ] Transaction history
- [ ] Settlement reports
- [ ] API key management
- [ ] Webhook configuration
- [ ] Settlement account management

### Phase 7: Multi-Currency (Ongoing)

- [ ] Abstract settlement rail interface
- [ ] Add GHS, KES, ZAR rails as banking partners are onboarded

---

## Security Considerations

1. **API key storage** — Secret keys stored as bcrypt/argon2 hashes. Never returned after creation.
2. **Wallet private keys** — Already in DB. Must be encrypted at rest. Consider moving to a secrets manager (AWS KMS, Vault) as you scale.
3. **Webhook secrets** — Unique per merchant. HMAC-SHA512 signatures on all payloads.
4. **Rate limiting** — Per-merchant, per-endpoint. Prevent abuse and wallet pool exhaustion.
5. **Wallet pool exhaustion** — If all wallets are assigned, new payments queue or return 503. Monitor pool utilization as a key metric.
6. **Amount validation** — On-chain deposit must match expected crypto amount (with configurable tolerance for fee variance).
7. **Replay protection** — Idempotency keys on payment initialization. Webhook deduplication on merchant side.
8. **Test environment** — Separate test wallets, test API keys, no real crypto movement. Simulated deposit confirmations.

---

## Key Metrics to Track

- Payment conversion rate (created → confirmed)
- Average time to confirmation (per chain)
- Settlement success rate
- Wallet pool utilization (% in use at any time)
- Webhook delivery success rate
- API response times (p50, p95, p99)
