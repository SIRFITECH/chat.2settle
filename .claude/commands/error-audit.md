Audit error handling in the following files/feature: $ARGUMENTS

If no specific files are provided, audit all recently changed files (use `git diff --name-only HEAD~1`).

## What to scan for

**Silent failures:**
- `catch` blocks that only `console.error`/`console.log` without re-throwing, returning an error state, or notifying the caller
- Async functions called without `await` (fire-and-forget with no error capture)
- Functions that return `null`, `undefined`, or `0` on failure with no way for callers to detect the error
- Promise chains with no `.catch()` handler

**Missing error handling:**
- Async functions with no `try/catch` at all
- `axios`/`fetch` calls with no timeout configured (add `timeout: 10000` as default)
- External API calls (NUBAN, Twilio, Blockstream, CoinMarketCap, OpenRouter) with no retry logic
- Database queries with no `finally` block to release connections

**API route errors:**
- Routes returning `200` for error conditions instead of proper `4xx`/`5xx`
- Inconsistent error response shapes (should be `{ success: false, error: string }`)
- Missing `try/catch` around the entire route handler
- Missing HTTP method validation at route start

**Frontend errors:**
- API calls in components/hooks with no error state handling
- Store actions that can throw but callers don't handle it
- `JSON.parse()` calls without try/catch (localStorage data can be corrupted)

**Resource leaks:**
- Database connections acquired with `pool.getConnection()` but no `connection.release()` in a `finally` block
- Event listeners added in `useEffect` without cleanup return
- Intervals/timeouts set without clearing

## Output format

For each finding:
```
[SILENT_FAIL/MISSING_HANDLER/RESOURCE_LEAK/BAD_STATUS] <file_path>:<line_number>
Issue: <what's wrong>
Impact: <what happens when this fails in production>
Fix: <specific code change>
```
