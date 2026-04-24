---
name: bun-package-manager
description: >-
  Uses Bun as the sole JavaScript runtime and package manager for this project.
  Use when installing dependencies, running scripts, executing CLIs, suggesting
  commands, or when the user mentions npm, npx, node, pnpm, yarn, corepack, or
  package management.
---

# Bun package manager and runtime

## Rules

- **Default to Bun** for installs, scripts, and one-off command execution in this repo.
- **Do not** recommend or use `npm`, `npx`, `pnpm`, `yarn`, `corepack`, or `node`/`nodejs` invocations for project workflows unless the user explicitly requires a different tool for a one-off external constraint.

## Command mapping

| Task | Use |
|------|-----|
| Install dependencies | `bun install` |
| Add dependency | `bun add <pkg>` |
| Add dev dependency | `bun add -d <pkg>` |
| Run package.json script | `bun run <script>` |
| Run a package binary (npx equivalent) | `bunx <pkg> [args]` |
| Execute a file | `bun path/to/script.ts` (or `.js`) |

## Notes

- Prefer `bun run` over assuming a global `node` or other runner when documenting or executing project commands.
- If a tutorial or upstream docs show `npm`/`yarn`/`pnpm`, translate the example to the Bun equivalent before applying it here.
