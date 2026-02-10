# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

2Settle is a cryptocurrency-to-fiat payment platform. Users interact through a chat-based interface to spend or send crypto (BTC, ETH, BNB, TRX, USDT) as fiat currency. The platform supports transfers (crypto to bank), gifts (send crypto to recipients), and payment requests.

Live site: https://spend.2settle.io/

## Commands

```bash
pnpm dev              # Start development server
pnpm debug            # Dev server with debug logging (DEBUG='2settle:*')
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint (next lint)
pnpm test             # Run Vitest in watch mode
pnpm coverage         # Run tests with coverage report
```

## Tech Stack

- **Framework**: Next.js 14 (Pages Router, not App Router)
- **Language**: TypeScript (strict mode, path alias `@/*` → `src/*`)
- **Styling**: Tailwind CSS + Radix UI primitives + MUI components + Emotion
- **State**: Zustand (client state, persisted), React Query (server state), XState (chatbot flow)
- **Database**: MySQL via `mysql2/promise` connection pool (`src/lib/mysql.ts`)
- **Auth**: NextAuth with Google + credentials providers
- **Web3**: Wagmi + RainbowKit (EVM chains), TronWeb (TRON), bitcoinjs-lib (BTC)
- **AI**: LangChain with OpenAI and Google Gemini backends
- **Monitoring**: Sentry (client, server, edge)
- **Testing**: Vitest + jsdom + @testing-library/react

## Architecture

### Chatbot Conversation Engine

The core UX is a step-based chatbot defined in `src/core/machines/steps.ts` with ~40 conversation steps (e.g., `start` → `connectWallet` → `chooseAction` → ...). The chat conversations are save in a stack, and a pointer to the last node indicates the current state. Transitions between steps happen when a a message is added to the stack or poped from it. Feature handlers in `src/features/chatbot/handlers/` implement the logic for each step. The chat store (`stores/chatStore.tsx`) manages messages with serialization for persistence. To manage memory and performance, we save a max of 100 messages, every thing older is discarded from the history. Other useful states in the project are the payment store (`stores/paymentStore.ts`) to hold payment data, transaction store (`stores/transactionStore.ts`) to hold transaction details and user store (`stores/userStore.ts`) to hold user data like chatId and phone and useConfirmDialogStore (`stores/useConfirmDialogStore.ts`) to hold dialogue store data for cinfirmation when user wants to make payments

### State Management Layers

1. **Zustand stores** (`stores/`): Client-side persistent state — user, chat, transaction, bank, charges, payment, BTC wallet, TRON wallet, support
2. **SharedStateContext** (`src/context/SharedStateContext.tsx`): React Context holding per-session transaction details — rates, bank data, crypto selection, amounts, wallet addresses but I am moving all states to zustand to make my functions simpler with less arguements and eventually eliminate context api
3. **React Query**: Server state caching for API data

### API Layer

- **API routes**: `src/pages/api/` — REST endpoints for transactions, gifts, requests, transfers, crypto ops, banks, rates, AI services, messaging
- **Service layer**: `src/services/` — organized by domain (ai, bank, crypto, rate, transactionService with sub-services for gifts/transfers/requests)
- **HTTP client**: Axios instance in `src/services/api-client.ts` using `NEXT_PUBLIC_API_URL`
- **Database**: Global MySQL pool in `src/lib/mysql.ts` (2 connection limit, cached on `global` in dev to survive HMR)

### Multi-Chain Wallet Support

- EVM chains (Ethereum, BSC, Polygon, Optimism, Arbitrum, Base) via Wagmi/RainbowKit
- TRON via TronWeb with dedicated store (`stores/tronWalletStore.ts`)
- Bitcoin via bitcoinjs-lib with dedicated store (`stores/btcWalletStore.ts`)

### Directory Structure

- `src/pages/` — Next.js pages and API routes
- `src/components/` — React components by domain (chatbot, dashboard, crypto, history, settings, ui, shared)
- `src/features/` — Feature-specific business logic and handlers
- `src/services/` — External service integrations and API calls
- `src/core/machines/` — XState state machines and step definitions
- `src/hooks/` — Custom React hooks
- `src/types/` — TypeScript type definitions by domain
- `src/helpers/` — Utility functions (API calls, BTC/ETH scripts, formatting)
- `src/validation/` — Input validation utilities
- `src/config/` — App configuration
- `src/constants/` — Constant values
- `stores/` — Zustand stores (at project root, not in `src/`)

### Testing

Tests live in `__tests__/` at the project root. Vitest is configured with jsdom environment, global test utilities, and the `@/*` path alias. Setup file at `__tests__/setup.ts`. But we would have to restructure the tests to the appear next to the respective components and functions for easy mentainability

### Environment Variables

MySQL connection: `host`, `port`, `user`, `password`, `database`
APIs: `COINMARKETCAP_API_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
Client: `NEXT_PUBLIC_API_URL`

### Deployment

Deployed on Vercel. Sentry is integrated via `@sentry/nextjs` with source map uploads, React component annotation, and a tunnel route at `/monitoring`.
