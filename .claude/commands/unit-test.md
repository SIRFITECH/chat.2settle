Generate unit tests for the following files/feature: $ARGUMENTS

If no specific files are provided, generate tests for all recently changed files (use `git diff --name-only HEAD~1`).

## Testing framework

- **Vitest** with `jsdom` environment
- **@testing-library/react** for component tests
- Path alias: `@/*` maps to `src/*`
- Setup file: `__tests__/setup.ts`
- Place test files next to their source files as `<filename>.test.ts(x)`

## What to test

**For utility/helper functions** (e.g., `src/helpers/`, `src/validation/`):
- Happy path with typical input
- Edge cases: empty string, 0, negative numbers, NaN, undefined, null
- Boundary conditions: very large numbers, very long strings
- For currency/amount functions: precision edge cases, formatting with/without decimals

**For Zustand stores** (e.g., `stores/`):
- Initial state is correct
- Each action produces expected state change
- Reset functions restore to initial state
- Persistence serialization/deserialization round-trips correctly
- For chatStore: message overflow at 100 limit, step navigation (next/prev), prevent popping past "start"

**For API route handlers** (e.g., `src/pages/api/`):
- Returns correct status code for valid request
- Returns 405 for wrong HTTP method
- Returns 400 for missing required fields
- Returns proper error shape on failure
- Mock database calls — don't hit real DB

**For service functions** (e.g., `src/services/`):
- Mock external API calls (axios)
- Test error handling paths (API returns 500, timeout, network error)
- Test data transformation (response parsing, field mapping)

**For React components** (e.g., `src/components/`):
- Renders without crashing
- Displays loading state while data fetches
- Displays error state on failure
- User interaction triggers expected callbacks
- Mock store state, don't rely on real stores

## Rules

- Do NOT test implementation details — test behavior
- Do NOT write tests that just assert the mock was called (test the outcome)
- Use `describe`/`it` blocks with descriptive names
- Each test should be independent — no shared mutable state between tests
- Mock external dependencies (axios, mysql, window.ethereum) at module level with `vi.mock()`

## Output

Write working test files. Run them with `pnpm test` to verify they pass. If a test fails because of a bug in the source code (not the test), note the bug separately.
