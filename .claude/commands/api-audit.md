Audit API routes and contracts for the following files/feature: $ARGUMENTS

If no specific files are provided, audit all API routes in `src/pages/api/`.

## What to scan for

**Request validation:**
- Routes that destructure `req.body` or `req.query` without checking required fields exist
- Missing type validation on inputs (e.g., amount should be a number, not a string "abc")
- No validation of `req.method` (GET vs POST vs PUT)
- Accepting unbounded input (no max length on strings, no min/max on numbers)

**Response consistency:**
- Every success response should follow: `{ success: true, data: <T> }`
- Every error response should follow: `{ success: false, error: <string> }`
- Check for routes that return ad-hoc shapes like `{ message, exists, user, activeWallet }` etc.
- Status codes: 200 for success, 400 for bad input, 401 for unauth, 404 for not found, 500 for server error

**Database usage:**
- Routes creating their own `mysql.createConnection()` or `mysql.createPool()` instead of importing from `src/lib/mysql.ts`
- Missing connection release in `finally` blocks
- `SELECT *` queries (should select specific columns)

**Idempotency:**
- POST routes that create records without idempotency keys
- State-changing operations that could duplicate on retry

**Rate limiting:**
- Sensitive endpoints (OTP, transactions, auth) with no rate limiting

## Output format

For each API route, produce a row:
```
Route: <method> <path>
File: <file_path>
Issues:
  - <issue description>
  - <issue description>
Suggested fix: <brief description>
```

Also produce a summary table of all routes and their compliance status.
