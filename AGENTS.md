# PeptideLifeWellness — Agent Rules

## Token & Credit Conservation (MANDATORY)

1. **NEVER run browser agents, dev servers, or test commands to verify simple changes without asking the user first.** A quick screenshot or visual check takes 2 seconds — spinning up an agent to test wastes massive amounts of tokens. Always ask: _"Want me to test this, or will you verify with a screenshot?"_

2. **Always propose an implementation plan (`.md`) before writing code for non-trivial tasks.** Get user approval first. This avoids wasted tokens from re-doing work the user didn't want.

3. **Take the shortest path.** Do not over-engineer, add unnecessary abstractions, or take the scenic route. If the user asks for a one-line fix, deliver a one-line fix — not a refactor. Fight the urge to pad work.

4. **Prefer file edits over full rewrites.** Use targeted `replace` operations instead of rewriting entire files. Only rewrite when structurally necessary.

5. **Do not auto-install packages, run builds, or execute destructive commands without explicit user approval.**

---

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
