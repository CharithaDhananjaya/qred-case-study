# Claude Code Instructions

## General Rules

- **Never commit changes unless the user explicitly asks.** Complete the task, then stop. Do not commit, stage, or suggest committing automatically.
- **When committing, always ask the user to approve each commit one by one** before running it. Show the proposed commit message and files being staged, wait for confirmation, then proceed to the next.

## Commit Messages

- **Always** use a gitmoji at the start of the commit subject, followed by a conventional commit type prefix.
- Format: `<gitmoji> <type> : <short description>`
- Examples:
  - `✨ feat : add AI proposal builder workspace`
  - `🐛 fix : resolve chat sidebar scroll overflow`
  - `♻️ refactor : extract proposal canvas into component`
  - `🎨 style : update Tailwind tokens for dark mode`
  - `🔧 chore : add eslint rule for unused imports`
  - `📦 chore : upgrade next to 16.3`
  - `✅ test : add unit tests for proposal builder hook`
  - `📝 docs : update README with local setup steps`
- **Never** add a `Co-Authored-By` trailer. The author is always the human committing.
- Keep the subject line under 72 characters.
- If a body is needed, leave a blank line after the subject and explain the _why_, not the _what_.

## Before Committing

- If you are uncertain about the correct commit type or scope, **ask the user** before creating the commit.
- Do not batch unrelated changes into one commit — split them logically.
- Never commit `.env` files or secrets.

## Staging Files

- Group files into commits that tell a coherent story — files belonging to the same app, feature, or task should go together.
- When multiple logical groups exist in the working tree, create **separate commits** for each group rather than staging everything at once.
- Good groupings: all UI changes for a single feature, a config change with its related type fix, a new route with its component and styles.
- Bad groupings: mixing a feature addition with an unrelated chore, or bundling changes across two different apps into one commit.
- When in doubt about how to split, show the user the proposed groupings and ask for confirmation before committing.

## Pull Requests

- **Never open a PR unless the user explicitly asks.**
- When asked for a PR title and description, output them as markdown in the chat — do not open the PR automatically.
- **PR title**: short, imperative, under 72 characters. No gitmoji (that's for commits).
- **PR description** must include:
  - `## Summary` — bullet points covering what changed and why, grouped by area (schema, backend, frontend, infra, etc.)
  - `## Test plan` — a markdown checklist of steps to verify the change works
- Do not add a `Co-Authored-By` line, generated-by footer, or any AI attribution to PR descriptions.
