Review UX resilience for the following files/feature: $ARGUMENTS

If no specific files are provided, review all recently changed component files (use `git diff --name-only HEAD~1 -- '*.tsx'`).

## What to scan for

**Loading states:**
- API calls in components with no loading indicator (spinner, skeleton, disabled state)
- Buttons that trigger async operations without being disabled during execution
- Pages/components that render empty/blank while data loads

**Error states:**
- API calls with no error UI (what does the user see when a request fails?)
- Raw error messages shown to users (technical strings, stack traces)
- Errors silently swallowed with no user feedback at all

**Double-submit prevention:**
- Forms or action buttons with no disable-on-click during async operations
- Transaction confirmation buttons that can be clicked multiple times
- Chat input that can send duplicate messages while a request is in-flight

**Navigation resilience:**
- Transaction state lost on browser back button
- Page refresh losing critical in-progress data
- Session timeout with no warning to the user

**Wallet connection UX:**
- What happens when wallet extension is not installed?
- What happens when user rejects the connection prompt?
- What happens when user is on wrong network/chain?
- Timeout handling for wallet prompts that hang

**Chatbot UX:**
- What happens when a bot message fails to load?
- Can users retry a failed message?
- Is there feedback when the bot is "thinking"?
- What happens when the conversation overflows 100 messages?

**Responsive & accessibility:**
- Interactive elements with no focus states
- Touch targets smaller than 44x44px on mobile
- Missing aria-labels on icon-only buttons
- Modals/dialogs that can't be closed with Escape key

## Output format

For each finding:
```
[LOADING/ERROR/DOUBLE_SUBMIT/NAV/WALLET/CHAT/A11Y] <file_path>:<line_number>
Scenario: <what the user does>
Current behavior: <what happens now>
Expected behavior: <what should happen>
```
