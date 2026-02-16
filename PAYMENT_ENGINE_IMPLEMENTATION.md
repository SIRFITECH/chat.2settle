# Payment Engine Implementation Plan

## Vision

Build a standalone payment engine that allows banks, fintechs, and merchants to accept crypto payments and settle in local fiat currency. The engine handles:

- Crypto-to-fiat conversion
- Wallet pool management
- Rate locking
- Deposit detection & reconciliation
- Fiat settlement
- Webhooks & notifications

**Target clients**: Banks, fintechs, e-commerce platforms, payment aggregators

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ 2Settle Chat │  │ Merchant API │  │ Bank/Fintech Integration │  │
│  │ (existing)   │  │ (new)        │  │ (new)                    │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────────┘  │
└─────────┼─────────────────┼────────────────────────┼────────────────┘
          │                 │                        │
          ▼                 ▼                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Payment Engine Core                             │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   Session   │  │   Wallet    │  │    Rate     │  │  Charge    │ │
│  │   Manager   │  │    Pool     │  │   Service   │  │ Calculator │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │  Deposit    │  │ Settlement  │  │  Webhook    │  │  Cashback  │ │
│  │  Monitor    │  │   Rails     │  │  Dispatcher │  │   Engine   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Data Layer                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Payments │  │ Wallets  │  │ Merchants│  │ Webhooks │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Core Engine Foundation
**Goal**: Extract and refactor existing logic into a clean, testable payment engine

**Duration**: 2 weeks

#### 1.1 Project Structure
```
src/services/payment-engine/
├── index.ts                     # PaymentEngine class (main facade)
├── types.ts                     # All TypeScript interfaces
├── errors.ts                    # Custom error classes
├── config.ts                    # Engine configuration
│
├── session/
│   ├── session-manager.ts       # Create, get, update sessions
│   └── session-repository.ts    # DB operations for sessions
│
├── wallet/
│   ├── wallet-pool.ts           # Assign/release wallets
│   └── wallet-repository.ts     # DB operations for wallets
│
├── rate/
│   ├── rate-service.ts          # Fetch & lock rates
│   └── rate-cache.ts            # In-memory rate caching
│
├── charges/
│   └── charge-calculator.ts     # Fee calculation logic
│
└── utils/
    ├── id-generator.ts          # Generate payment IDs
    └── validators.ts            # Input validation
```

#### 1.2 Core Types
- [ ] Define `CreatePaymentInput` interface
- [ ] Define `PaymentSession` interface
- [ ] Define `PaymentStatus` enum
- [ ] Define `WalletAssignment` interface
- [ ] Define `RateLock` interface
- [ ] Define error types (`InsufficientWallets`, `RateLockExpired`, etc.)

#### 1.3 Session Manager
- [ ] `createSession(input)` → Creates payment, locks rate, assigns wallet
- [ ] `getSession(id)` → Retrieves session by ID
- [ ] `getSessionByReference(ref)` → Retrieves by merchant reference
- [ ] `updateStatus(id, status)` → Status transitions with validation
- [ ] `expireSessions()` → Batch expire stale sessions

#### 1.4 Wallet Pool
- [ ] `assignWallet(network)` → Get available wallet, mark as in-use
- [ ] `releaseWallet(address, network)` → Return wallet to pool
- [ ] `getPoolStatus()` → Available/in-use counts per network
- [ ] Concurrency safety with `FOR UPDATE` locks

#### 1.5 Rate Service
- [ ] `getRate(crypto, fiat)` → Fetch current rate
- [ ] `lockRate(crypto, fiat, ttlMinutes)` → Lock rate for session
- [ ] Rate caching (1-minute TTL)
- [ ] Fallback to cached rate if API fails

#### 1.6 Charge Calculator
- [ ] `calculateCharge(amount, crypto, rate)` → Tiered fee calculation
- [ ] Support for different fee structures per client (future)

#### 1.7 Tests
- [ ] Unit tests for each component
- [ ] Integration test for full payment flow

**Deliverable**: Payment engine that can create sessions, assign wallets, lock rates

---

### Phase 2: Persistence & Migration
**Goal**: Clean database schema, migrate from legacy tables

**Duration**: 1 week

#### 2.1 New Schema
```sql
-- Core payment sessions (replaces transfers/gifts/requests for new flow)
CREATE TABLE payment_sessions (
  id VARCHAR(36) PRIMARY KEY,
  reference VARCHAR(100) NOT NULL UNIQUE,

  -- Type & status
  type ENUM('transfer', 'gift', 'request', 'merchant') NOT NULL,
  status ENUM('created', 'pending', 'confirming', 'confirmed', 'settling', 'settled', 'expired', 'failed') DEFAULT 'created',

  -- Amounts
  fiat_amount DECIMAL(15, 2) NOT NULL,
  fiat_currency VARCHAR(3) NOT NULL DEFAULT 'NGN',
  crypto_amount DECIMAL(18, 8) NOT NULL,
  crypto_currency VARCHAR(10) NOT NULL,
  network VARCHAR(20) NOT NULL,

  -- Rate
  rate DECIMAL(15, 4) NOT NULL,
  rate_locked_at TIMESTAMP NOT NULL,

  -- Charges
  charge_amount DECIMAL(15, 4) NOT NULL,
  charge_currency VARCHAR(3) DEFAULT 'NGN',

  -- Wallet assignment
  deposit_address VARCHAR(100) NOT NULL,
  wallet_id INT NOT NULL,

  -- Payer
  payer_id INT NULL,
  payer_chat_id VARCHAR(100) NULL,
  payer_wallet VARCHAR(100) NULL,

  -- Receiver (for transfers)
  receiver_id INT NULL,

  -- Merchant (for B2B)
  merchant_id VARCHAR(36) NULL,

  -- On-chain
  tx_hash VARCHAR(100) NULL,
  confirmations INT DEFAULT 0,

  -- Timing
  expires_at TIMESTAMP NOT NULL,
  confirmed_at TIMESTAMP NULL,
  settled_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Metadata
  metadata JSON NULL,

  INDEX idx_status (status),
  INDEX idx_merchant (merchant_id),
  INDEX idx_expires (expires_at, status),
  INDEX idx_deposit_address (deposit_address)
);

-- Wallet pool improvements
ALTER TABLE wallets
  ADD COLUMN current_session_id VARCHAR(36) NULL,
  ADD COLUMN assigned_at TIMESTAMP NULL,
  ADD COLUMN cooldown_until TIMESTAMP NULL;
```

#### 2.2 Repository Layer
- [ ] `PaymentSessionRepository` - CRUD for payment_sessions
- [ ] `WalletRepository` - Wallet pool operations
- [ ] Transaction wrapper for atomic operations

#### 2.3 Migration Strategy
- [ ] New payments use `payment_sessions` table
- [ ] Legacy code continues using `transfers`, `gifts`, `requests`
- [ ] Gradual migration path (not breaking existing flow)

**Deliverable**: Clean database schema, repository layer

---

### Phase 3: Chat Integration
**Goal**: Refactor existing chatbot to use the payment engine

**Duration**: 1.5 weeks

#### 3.1 Adapter Layer
```
src/features/chatbot/adapters/
├── payment-engine-adapter.ts    # Bridge between chatbot and engine
└── legacy-adapter.ts            # Keep old flow working during migration
```

#### 3.2 Handler Refactoring
- [ ] Refactor `transferHandler` to use engine
- [ ] Refactor `giftHandler` to use engine
- [ ] Refactor `requestHandler` to use engine
- [ ] Update stores to work with `PaymentSession` type

#### 3.3 Feature Flag
- [ ] Add `USE_PAYMENT_ENGINE` flag
- [ ] Toggle between old and new flow
- [ ] Gradual rollout

**Deliverable**: Existing chat product works on new engine

---

### Phase 4: Merchant API
**Goal**: REST API for external clients (banks, fintechs)

**Duration**: 2 weeks

#### 4.1 Merchant Management
```
src/services/payment-engine/merchant/
├── merchant-service.ts          # CRUD for merchants
├── api-key-service.ts           # Generate/validate API keys
└── merchant-repository.ts       # DB operations
```

Schema:
```sql
CREATE TABLE merchants (
  id VARCHAR(36) PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  webhook_url VARCHAR(500) NULL,
  webhook_secret VARCHAR(255) NULL,
  settlement_currency VARCHAR(3) DEFAULT 'NGN',
  kyc_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE merchant_api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  public_key VARCHAR(50) NOT NULL UNIQUE,   -- pk_live_xxx
  secret_key_hash VARCHAR(255) NOT NULL,    -- bcrypt hash
  environment ENUM('live', 'test') DEFAULT 'test',
  is_active TINYINT(1) DEFAULT 1,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE merchant_settlement_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  bank_code VARCHAR(10) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  is_default TINYINT(1) DEFAULT 0,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);
```

#### 4.2 API Endpoints
```
src/pages/api/v1/
├── payments/
│   ├── initialize.ts            # POST - Create payment
│   ├── [id].ts                  # GET - Get payment by ID
│   └── verify/[reference].ts    # GET - Verify by reference
├── rates.ts                     # GET - Current rates
└── merchants/
    └── me.ts                    # GET - Merchant profile
```

Endpoints:
- [ ] `POST /api/v1/payments/initialize` - Create payment session
- [ ] `GET /api/v1/payments/:id` - Get payment details
- [ ] `GET /api/v1/payments/verify/:reference` - Verify payment
- [ ] `GET /api/v1/rates` - Get current rates

#### 4.3 Authentication Middleware
- [ ] API key validation middleware
- [ ] Rate limiting per merchant
- [ ] Request logging

#### 4.4 Hosted Checkout Page
```
src/pages/pay/[paymentId].tsx
```
- [ ] Clean checkout UI (no chatbot)
- [ ] Crypto selector
- [ ] QR code + address display
- [ ] Countdown timer
- [ ] Status polling
- [ ] Redirect on completion

**Deliverable**: Working merchant API with hosted checkout

---

### Phase 5: Deposit Monitoring (Reconciliation)
**Goal**: Automated on-chain deposit detection

**Duration**: 2 weeks

#### 5.1 Monitor Architecture
```
src/services/payment-engine/monitoring/
├── deposit-monitor.ts           # Main monitor orchestrator
├── chain-adapters/
│   ├── types.ts                 # Common interface
│   ├── bitcoin-adapter.ts       # BTC monitoring
│   ├── evm-adapter.ts           # ETH, BSC, Polygon, etc.
│   └── tron-adapter.ts          # TRON monitoring
└── confirmation-tracker.ts      # Track confirmation counts
```

#### 5.2 Chain Adapters
Interface:
```typescript
interface ChainAdapter {
  chain: string;

  // Check for incoming transactions to an address
  getIncomingTransactions(address: string, since?: Date): Promise<Transaction[]>;

  // Get confirmation count for a transaction
  getConfirmations(txHash: string): Promise<number>;

  // Required confirmations for this chain
  requiredConfirmations: number;
}
```

Implementations:
- [ ] Bitcoin adapter (blockstream.info API or mempool.space)
- [ ] EVM adapter (Alchemy/Infura/public RPC)
- [ ] TRON adapter (TronGrid API)

#### 5.3 Monitor Cron Job
```
src/pages/api/cron/monitor-deposits.ts
```
- [ ] Fetch all `pending` payments
- [ ] Check each deposit address for incoming tx
- [ ] Match amount (with tolerance for fees)
- [ ] Update status to `confirming`
- [ ] Track confirmations until threshold
- [ ] Update to `confirmed` when ready
- [ ] Trigger settlement

#### 5.4 Reconciliation Logic
- [ ] Amount matching with fee tolerance
- [ ] Handle partial payments
- [ ] Handle overpayments
- [ ] Handle multiple deposits to same address
- [ ] Expiry handling

**Deliverable**: Automated deposit detection, no manual confirmation needed

---

### Phase 6: Webhooks
**Goal**: Notify merchants of payment events

**Duration**: 1 week

#### 6.1 Webhook System
```
src/services/payment-engine/webhooks/
├── webhook-dispatcher.ts        # Send webhooks
├── webhook-signer.ts            # HMAC signing
├── webhook-queue.ts             # Retry queue
└── webhook-repository.ts        # Log deliveries
```

#### 6.2 Events
- [ ] `payment.pending` - Wallet assigned
- [ ] `payment.confirming` - Deposit detected
- [ ] `payment.confirmed` - Deposit confirmed
- [ ] `payment.settled` - Fiat paid out
- [ ] `payment.expired` - No deposit received
- [ ] `payment.failed` - Something went wrong

#### 6.3 Delivery
- [ ] HMAC-SHA512 signature
- [ ] Retry with exponential backoff (1m, 5m, 30m)
- [ ] Delivery logging
- [ ] Manual retry from dashboard (future)

#### 6.4 Schema
```sql
CREATE TABLE webhook_deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  payment_id VARCHAR(36) NOT NULL,
  event VARCHAR(50) NOT NULL,
  url VARCHAR(500) NOT NULL,
  payload JSON NOT NULL,
  response_code INT NULL,
  response_body TEXT NULL,
  attempt INT DEFAULT 1,
  status ENUM('pending', 'delivered', 'failed') DEFAULT 'pending',
  next_retry_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Deliverable**: Reliable webhook delivery to merchants

---

### Phase 7: Settlement Rails
**Goal**: Automated fiat payout to merchants

**Duration**: 1.5 weeks

#### 7.1 Settlement Architecture
```
src/services/payment-engine/settlement/
├── settlement-engine.ts         # Orchestrator
├── rails/
│   ├── types.ts                 # SettlementRail interface
│   ├── ngn-rail.ts              # Nigerian Naira
│   ├── ghs-rail.ts              # Ghanaian Cedi (future)
│   └── kes-rail.ts              # Kenyan Shilling (future)
└── settlement-repository.ts     # DB operations
```

#### 7.2 NGN Rail
- [ ] Integrate with existing bank transfer logic
- [ ] Payout to merchant's settlement account
- [ ] Transaction reference generation
- [ ] Status tracking

#### 7.3 Settlement Modes
- [ ] **Instant**: Settle immediately after confirmation
- [ ] **Batched**: Aggregate and settle daily/weekly
- [ ] **Manual**: Merchant triggers settlement

#### 7.4 Schema
```sql
CREATE TABLE settlements (
  id VARCHAR(36) PRIMARY KEY,
  merchant_id VARCHAR(36) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  bank_code VARCHAR(10) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  reference VARCHAR(100) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  payment_ids JSON NOT NULL,           -- Array of payment IDs included
  provider_reference VARCHAR(100) NULL, -- Bank's reference
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Deliverable**: Automated fiat settlement to merchant bank accounts

---

### Phase 8: Cashback System
**Goal**: Reward users for transactions

**Duration**: 1 week

#### 8.1 Cashback Architecture
```
src/services/payment-engine/rewards/
├── cashback-engine.ts           # Calculate & credit cashbacks
├── cashback-rules.ts            # Rule definitions
├── cashback-ledger.ts           # User balances
└── cashback-repository.ts       # DB operations
```

#### 8.2 Features
- [ ] Rule-based cashback calculation
- [ ] Percentage or fixed amount
- [ ] Transaction type filtering
- [ ] User tier support
- [ ] Campaign/promo support
- [ ] Expiring cashbacks
- [ ] Balance tracking
- [ ] Redemption (apply to future transactions)

#### 8.3 Schema
```sql
CREATE TABLE cashback_rules (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('percentage', 'fixed') NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  min_transaction DECIMAL(15, 2) NULL,
  max_cashback DECIMAL(15, 2) NULL,
  applies_to JSON NULL,
  valid_from TIMESTAMP NULL,
  valid_until TIMESTAMP NULL,
  is_active TINYINT(1) DEFAULT 1
);

CREATE TABLE cashback_ledger (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(100) NOT NULL,
  payment_id VARCHAR(36) NOT NULL,
  rule_id VARCHAR(36) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status ENUM('credited', 'redeemed', 'expired') DEFAULT 'credited',
  credited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NULL,
  INDEX idx_user (user_id, status)
);
```

**Deliverable**: Working cashback system

---

### Phase 9: Admin Dashboard
**Goal**: Internal tools for managing the platform

**Duration**: 2 weeks

#### 9.1 Features
- [ ] Payment monitoring (all sessions, statuses)
- [ ] Wallet pool status
- [ ] Merchant management
- [ ] Settlement overview
- [ ] Webhook delivery logs
- [ ] Cashback rules management
- [ ] Rate monitoring
- [ ] Alerts & anomaly detection

**Deliverable**: Admin dashboard for operations team

---

### Phase 10: Merchant Dashboard
**Goal**: Self-service portal for merchants

**Duration**: 2 weeks

#### 10.1 Features
- [ ] Payment history
- [ ] Settlement reports
- [ ] API key management
- [ ] Webhook configuration
- [ ] Settlement account management
- [ ] Analytics & charts

**Deliverable**: Merchant self-service portal

---

## Timeline Summary

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 1. Core Engine | 2 weeks | 2 weeks |
| 2. Persistence | 1 week | 3 weeks |
| 3. Chat Integration | 1.5 weeks | 4.5 weeks |
| 4. Merchant API | 2 weeks | 6.5 weeks |
| 5. Deposit Monitoring | 2 weeks | 8.5 weeks |
| 6. Webhooks | 1 week | 9.5 weeks |
| 7. Settlement Rails | 1.5 weeks | 11 weeks |
| 8. Cashback | 1 week | 12 weeks |
| 9. Admin Dashboard | 2 weeks | 14 weeks |
| 10. Merchant Dashboard | 2 weeks | 16 weeks |

**Total: ~16 weeks (4 months) for full platform**

---

## MVP Scope (8 weeks)

For a working B2B product, prioritize:

1. ✅ Phase 1: Core Engine (2 weeks)
2. ✅ Phase 2: Persistence (1 week)
3. ⏭️ Skip Phase 3 initially (chat can use legacy)
4. ✅ Phase 4: Merchant API (2 weeks)
5. ✅ Phase 5: Deposit Monitoring (2 weeks)
6. ✅ Phase 6: Webhooks (1 week)

**MVP in 8 weeks** = Banks/fintechs can integrate, payments are auto-confirmed, webhooks notify them.

Settlement (Phase 7) can be manual initially, dashboards (9-10) can come later.

---

## Success Metrics

- **Payment Success Rate**: % of created payments that reach `settled`
- **Avg Confirmation Time**: Time from deposit to `confirmed`
- **Wallet Pool Utilization**: % of wallets in use at any time
- **Webhook Delivery Rate**: % of webhooks delivered on first attempt
- **Settlement Success Rate**: % of settlements completed successfully
- **API Latency**: p50, p95, p99 response times

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Wallet pool exhaustion | Monitor utilization, scale pool proactively |
| Blockchain API rate limits | Multiple providers, caching, backoff |
| Settlement failures | Retry logic, manual intervention alerts |
| Rate volatility | Short rate lock windows, margin buffer |
| Security breaches | API key rotation, webhook signing, audit logs |

---

## Next Steps

1. Review and approve this plan
2. Set up the folder structure for Phase 1
3. Define the core types
4. Implement session manager with tests
5. Implement wallet pool with tests
6. Implement rate service with tests
7. Wire it all together in PaymentEngine class
