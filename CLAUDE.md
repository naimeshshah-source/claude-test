# Claude Code Guide

This repository contains two independent Next.js web applications.

## Projects

### expense-tracker
A personal finance app for tracking, filtering, and exporting expenses.

- **Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, jspdf / jspdf-autotable
- **Key directories:**
  - `src/app/` — Next.js App Router pages and layout
  - `src/components/` — UI components (Dashboard, ExpenseForm, ExpenseList, ExportHub, ExportModal, Navigation)
  - `src/context/` — React context for global expense state (`ExpenseContext`)
  - `src/lib/` — Utilities: export logic, seed data, localStorage helpers
  - `src/types/` — TypeScript type definitions

### travel-search
A travel discovery app (TravelScout) for finding destinations, best travel times, and flight estimates from Boston.

- **Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Key directories:**
  - `src/app/` — Next.js App Router pages, layout, and API route (`/api/search`)
  - `src/components/` — UI components (SearchForm, DestinationCard, FlightResults, MonthlyRecommendations, LoadingSkeleton)
  - `src/lib/` — Static travel data
  - `src/types/` — TypeScript type definitions

## Common Commands

Run all commands from within the respective project directory (`expense-tracker/` or `travel-search/`).

```bash
npm run dev     # Start local dev server (http://localhost:3000)
npm run build   # Production build
npm run lint    # Run ESLint
```

## Development Notes

- Both projects use the **Next.js App Router** (`src/app/`).
- Styling is done exclusively with **Tailwind CSS** — no separate CSS files beyond `globals.css`.
- **TypeScript** is enforced across both projects; avoid using `any`.
- State in `expense-tracker` flows through `ExpenseContext`; components consume it via the context hook.
- `travel-search` fetches destination data via the internal `/api/search` route, which uses static data from `src/lib/travel-data.ts`.
- There are no tests currently. Linting is the primary code quality check (`npm run lint`).

## Session Start Hook

A `SessionStart` hook is configured at `.claude/hooks/session-start.sh`. When running in Claude Code on the web (`CLAUDE_CODE_REMOTE=true`), it installs npm dependencies for both projects automatically.
