Perform a security audit on the following files/feature: $ARGUMENTS

If no specific files are provided, audit all recently changed files (use `git diff --name-only HEAD~1`).

## What to scan for

**Authentication & Authorization:**
- API routes in `src/pages/api/` missing authentication checks
- Endpoints accessible without session validation
- Missing CSRF protection on state-changing routes

**Cryptographic weaknesses:**
- `Math.random()` used for OTP, tokens, transaction IDs, or any security-sensitive value (must use `crypto.randomInt()` or `crypto.getRandomValues()`)
- Secrets, OTPs, or tokens returned in API response bodies
- Weak or missing hashing for stored credentials

**Injection:**
- SQL queries using string concatenation or template literals instead of parameterized queries (`?` placeholders)
- User input rendered with `dangerouslySetInnerHTML` or passed to `parse()` without sanitization
- User input passed to `eval()`, `Function()`, or shell commands

**Data exposure:**
- Sensitive data (bank details, phone numbers, wallet addresses) logged via `console.log` or `console.error`
- Sensitive data in plaintext SMS messages (check Twilio `body` strings)
- API responses leaking internal details (stack traces, DB schema, internal IDs)
- React Query DevTools or debug tools enabled outside development mode

**Web3 specific:**
- `window.ethereum` or `window.tronWeb` accessed without input validation
- Transaction amounts not validated before signing
- Missing chain ID verification before sending transactions
- Private keys or mnemonics in source code or logs

**Configuration:**
- Hardcoded API keys, secrets, or credentials anywhere outside `.env` files
- Missing rate limiting on sensitive endpoints (OTP, login, transaction creation)
- CORS headers allowing `*` origin

## Output format

For each finding, report:
```
[CRITICAL/HIGH/MEDIUM/LOW] <file_path>:<line_number>
Issue: <what's wrong>
Fix: <specific code change needed>
```

Sort by severity. If no issues found in a category, skip it — don't report "no issues found."
