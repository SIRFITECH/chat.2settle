Audit dependencies and configuration for the following context: $ARGUMENTS

If no specific context is provided, audit the entire project.

## What to scan for

**Vulnerability check:**
- Run `pnpm audit` and report findings
- Flag any critical or high severity vulnerabilities

**Unused dependencies:**
- Check every package in `dependencies` and `devDependencies` in `package.json`
- Search for imports of each package across the codebase
- Flag packages that are installed but never imported

**Duplicate functionality:**
- Libraries that overlap: `axios` vs native `fetch`, `ethers` vs `viem` vs `web3`, `date-fns` vs `dayjs`
- Flag which one is used more and suggest consolidating

**Hardcoded values that should be config:**
- Search for magic numbers in source code: fee amounts (200 satoshi, 500/1000/2000 naira), percentage discounts (0.8%), chain IDs (1, 56), connection limits
- These should be in environment variables or a config table in the database

**Environment configuration:**
- Check that every `process.env.*` reference has a corresponding entry in `.env.example` or documentation
- Flag any `process.env` access without a fallback or validation
- Check for dev-only code that could leak to production (DevTools, debug logging, test endpoints)

**Bundle size concerns:**
- Large inline data (ABI arrays, static JSON) that should be in separate files or loaded dynamically
- Heavy dependencies that could be replaced with lighter alternatives
- Imports that pull entire libraries when only one function is needed (e.g., full `lodash` vs `lodash/get`)

**Next.js configuration:**
- `next.config.js` settings inappropriate for production
- Missing security headers
- Image optimization configuration
- Sentry configuration completeness

## Output format

```
## Vulnerabilities
<pnpm audit results>

## Unused Dependencies
- <package>: no imports found

## Duplicate Libraries
- <library A> vs <library B>: recommend keeping <X> because <reason>

## Hardcoded Values
- <file>:<line> — <value> should be in config

## Missing Env Vars
- <VARIABLE> used in <file> but not documented

## Bundle Concerns
- <file>:<line> — <issue and suggestion>
```
