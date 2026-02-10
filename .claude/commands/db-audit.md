Audit database interactions in the following files/feature: $ARGUMENTS

If no specific files are provided, audit all files that import from `mysql`, `mysql2`, or `src/lib/mysql`.

## What to scan for

**Connection management:**
- Files importing `mysql2` directly and creating their own connections/pools instead of using `src/lib/mysql.ts`
- `pool.getConnection()` calls without corresponding `connection.release()` in a `finally` block
- Connections acquired but not released on early returns or thrown exceptions

**Query safety:**
- SQL using template literals or string concatenation for values (must use `?` parameterized queries)
- Dynamic column or table names injected without whitelist validation
- `SELECT *` queries (should select only needed columns)
- Missing `LIMIT` on queries that could return unbounded rows
- `LIKE` queries without index support

**Transaction safety:**
- Multi-step writes (INSERT + UPDATE, or multiple INSERTs) without `BEGIN`/`COMMIT`/`ROLLBACK`
- Transaction blocks without `ROLLBACK` in the `catch`
- Long-running transactions that could hold locks (check for API calls inside transaction blocks)

**Data integrity:**
- Generated IDs (transaction IDs, gift IDs) without uniqueness validation before insert
- Missing `WHERE` clauses on `UPDATE` or `DELETE` statements
- Nullable columns accessed without null checks in application code
- Timestamps stored without timezone info

**Performance:**
- Queries inside loops (N+1 pattern)
- Missing indexes implied by `WHERE`, `ORDER BY`, or `JOIN` clauses
- Connection pool size (currently `connectionLimit: 2` in `src/lib/mysql.ts` — may be too low)

## Output format

For each finding:
```
[LEAK/INJECTION/TRANSACTION/INTEGRITY/PERFORMANCE] <file_path>:<line_number>
Query: <the SQL or query pattern>
Issue: <what's wrong>
Fix: <specific change>
```
