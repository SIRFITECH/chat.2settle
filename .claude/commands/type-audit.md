Audit type safety in the following files/feature: $ARGUMENTS

If no specific files are provided, audit all recently changed files (use `git diff --name-only HEAD~1`).

## What to scan for

**Explicit `any`:**
- Any use of `: any`, `as any`, or `<any>` — each one needs a concrete type or `unknown`
- Function parameters without type annotations
- Event handlers typed as `any`

**Unsafe assertions:**
- `as` type casts without runtime validation (e.g., `error as { code: number }`)
- Non-null assertions (`!`) on values that could genuinely be null
- Type assertions that narrow types incorrectly

**God types:**
- Uses of `userData` from `general_types.ts` — identify which fields are actually used at each call site and suggest a narrower type
- Interfaces where all fields are optional (`?`) but some are always required in practice
- Types with `string | number` for the same concept (amounts should be consistently one or the other)

**Naming inconsistencies:**
- Mixed casing: `Amount` vs `amount`, `receiver` vs `reciever`
- Fields with different names for the same data across types
- Store types that don't match API response shapes

**Missing types:**
- Functions with no return type annotation (especially exported functions)
- API route handlers with untyped `req.body`
- Zustand store actions with implicit return types
- React component props using inline types instead of named interfaces

**Null safety:**
- Optional chaining needed but missing (accessing `.property` on possibly undefined)
- `localStorage.getItem()` results used without null check
- Array access `[0]` without checking array length
- `JSON.parse()` results used without validation

## Output format

For each finding:
```
[ANY/ASSERTION/GOD_TYPE/NAMING/MISSING/NULL] <file_path>:<line_number>
Current: <what exists>
Suggested: <what it should be>
```
