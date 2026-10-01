# TypeScript Coding Standards

These standards apply to all code in this repository.

## Core Principles

- Keep code simple, readable, and easy to change.
- Follow DRY (Don't Repeat Yourself), but avoid premature abstraction. Extract shared logic when repetition represents the same business rule or behavior.
- Follow the single-responsibility principle: each module, class, and function should have one clear purpose.
- Prefer composition over inheritance.
- Make the smallest change that fully solves the problem.
- Preserve existing behavior unless a change is explicitly required.

## TypeScript

- Keep TypeScript strict mode enabled.
- Do not use `any`. Use a precise type or `unknown`, then narrow it safely.
- Prefer type inference for local variables when the inferred type is clear.
- Add explicit types to public APIs, exported functions, and complex return values.
- Prefer `type` for unions, intersections, and aliases. Use `interface` when declaration merging or an extendable object contract is intentional.
- Model valid states directly with unions and discriminated unions instead of boolean flag combinations.
- Prefer immutable data. Use `readonly` where it communicates intent.
- Avoid non-null assertions (`!`) and unsafe type assertions (`as`). Validate or narrow values instead.
- Use `satisfies` when checking an object against a type while preserving its inferred shape.
- Handle optional and nullable values explicitly.
- Prefer named constants over unexplained literals.

## Functions and Modules

- Keep functions focused and reasonably small.
- Use descriptive names that explain intent rather than implementation details.
- Prefer early returns to deeply nested conditionals.
- Avoid hidden side effects. Make state changes and I/O obvious.
- Keep domain logic separate from transport, persistence, and framework code.
- Export only what other modules need.
- Avoid circular dependencies.
- Use dependency injection at system boundaries when it improves testability; do not add abstraction without a concrete need.

## Async Code and Errors

- Use `async`/`await` rather than chained promises when it improves clarity.
- Await promises intentionally; do not leave floating promises.
- Add context when propagating errors, but preserve the original cause when possible.
- Do not silently swallow errors.
- Use typed result objects for expected failures and exceptions for unexpected failures.
- Validate external input at the boundary before passing it into domain logic.
- Never expose secrets or sensitive user data in errors or logs.

## Style

- Follow the repository's formatter and linter configuration.
- Use consistent naming:
  - `camelCase` for variables and functions.
  - `PascalCase` for types, interfaces, classes, and components.
  - `UPPER_SNAKE_CASE` only for true constants.
- Prefer clear code over comments. Comments should explain why, constraints, or non-obvious tradeoffs—not restate the code.
- Remove dead code and unused imports instead of commenting them out.
- Keep files cohesive. Split files when they contain unrelated responsibilities or become difficult to navigate.

## Testing

- Add or update tests for every behavior change and bug fix.
- Test observable behavior rather than implementation details.
- Include happy paths, edge cases, and expected failures.
- Keep tests deterministic and independent of execution order.
- Mock only external boundaries; prefer real domain logic and lightweight fakes.
- A bug fix should include a regression test whenever practical.

## Dependencies and Security

- Prefer platform capabilities and existing dependencies before adding a package.
- Add dependencies only when their value outweighs maintenance, security, and bundle-size costs.
- Validate and sanitize untrusted input.
- Do not commit credentials, tokens, private keys, or environment-specific secrets.
- Keep secrets in environment variables and document required names in `.env.example`.

## Before Completing a Change

- Run the formatter and linter when configured.
- Run `npm run typecheck`.
- Run relevant tests.
- Run `npm run build` when the change can affect compilation or packaging.
- Review the diff for accidental changes, duplicated logic, unsafe casts, debug output, and secrets.
- Update documentation when behavior, setup, configuration, or public APIs change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project architecture

See [architecture.md](./architecture.md) for the website page tree and routing/component structure.
