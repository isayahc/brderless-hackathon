# Candidate Instructions

Welcome! This exercise uses a small but realistic app: **HelpDesk Copilot**, an
AI-assisted support triage tool. Setup takes about two minutes — see the
[README](README.md). The default configuration uses a built-in mock LLM, so no
API key is required.

## Your task

You may use any tools, including AI assistants.

This repository contains a small app with several production-style issues. Your
task is to make the app behave correctly and submit a short Loom walkthrough
(~5 minutes).

We care less about the amount of code changed and more about your debugging
process, judgment, and ability to verify your fixes.

For each issue you address, explain:

1. **Symptom** — what incorrect or unsafe behavior you observed
2. **Reproduction** — how you triggered it reliably
3. **Root cause** — where and why it happens
4. **Fix** — what you changed and why that's the right layer to fix it
5. **Verification** — the test or check you added to prove it's fixed and keep it fixed

Assume this code is going to production.

## Hints on scope

- The issues span the full stack: LLM prompting and output handling, retrieval,
  business logic, and frontend behavior. Not every issue is in the AI layer.
- The app "mostly works" — the problems show up in specific scenarios. Explore
  the seed tickets; they cover a range of situations a real support team sees.
- You are not expected to fix cosmetic issues or rewrite the app. Prioritize by
  user impact and risk, and say so in your walkthrough.
- Adding tests where they would have caught a bug is a strong signal.

## Submitting

- Push your changes to a branch (or fork) and share the link.
- Record a ~5 minute Loom walking through what you found, in priority order.
