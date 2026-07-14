# HelpDesk Copilot

An AI-assisted triage assistant for a B2B SaaS support team. Agents pick a ticket,
and the copilot classifies it, checks company policy, drafts a customer-facing reply,
and recommends whether to escalate.

## Stack

- **Frontend:** React 18 + TypeScript (Vite)
- **Backend:** Node + Express (TypeScript, run with `tsx`)
- **Data:** in-memory seed data (tickets + policy docs), reset on server restart
- **LLM:** OpenAI-compatible client with a built-in deterministic mock (default)
- **Tests:** Vitest

## Setup

```bash
npm install
cp .env.example .env   # defaults work out of the box (mock LLM, no API key needed)
npm run dev            # starts API on :3001 and web app on :5173
```

Open http://localhost:5173.

To use a real LLM instead of the mock, set in `.env`:

```
LLM_PROVIDER=gemini
GEMINI_API_KEY=...        # https://aistudio.google.com/apikey
```

`LLM_PROVIDER=openai` also works, as does any OpenAI-compatible endpoint via
`OPENAI_BASE_URL` (Azure, LiteLLM, Ollama, etc.).

## Scripts

| Command         | What it does                                  |
| --------------- | --------------------------------------------- |
| `npm run dev`   | Run API + frontend together (watch mode)      |
| `npm run dev:api` | API only (http://localhost:3001)            |
| `npm run dev:web` | Frontend only (proxies `/api` to :3001)     |
| `npm test`      | Run the Vitest suite                          |
| `npm run build` | Typecheck + production build of the frontend  |

## Project layout

```
server/
  index.ts               Express entrypoint
  routes.ts              API routes (/api/tickets, /api/tickets/:id/triage, ...)
  store.ts               In-memory DB seeded at startup
  data/                  Seed tickets and policy documents
  retrieval/policySearch.ts   Keyword-based policy retrieval
  triage/
    triageService.ts     Orchestrates retrieval -> prompt -> LLM -> parse
    promptBuilder.ts     Prompt and context construction
    parser.ts            Extracts structured triage output from model text
  llm/
    client.ts            LLM abstraction + OpenAI-compatible implementation
    mock.ts              Deterministic mock model for dev/tests
shared/types.ts          Types shared by client and server
src/                     React app
tests/                   Vitest suite
```

## API

- `GET  /api/tickets` — ticket summaries (includes last triage badges if any)
- `GET  /api/tickets/:id` — full ticket with customer metadata and internal notes
- `GET  /api/tickets/:id/triage` — last stored triage result (404 if none)
- `POST /api/tickets/:id/triage` — run (or re-run) AI triage for a ticket
- `GET  /api/policies` — policy document metadata

Triage results are kept in memory per ticket; the "Regenerate AI Triage" button
re-runs the pipeline and overwrites the stored result.
