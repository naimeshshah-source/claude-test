# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Repository Structure

This monorepo contains two Next.js applications:

- **expense-tracker/** — Expense tracking app with PDF export support
- **travel-search/** — Travel search application

Both apps share the same tech stack: Next.js 14, React 18, TypeScript, Tailwind CSS, and ESLint.

## Common Commands

Run these commands from within the relevant project directory (e.g., `cd expense-tracker` or `cd travel-search`).

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Linting**: ESLint (eslint-config-next)
- **PDF generation** (expense-tracker only): jsPDF, jspdf-autotable

## Development Notes

- Each app has its own `package.json` and `node_modules`; install dependencies separately per project
- Both apps use the Next.js App Router (the `src/` directory contains the `app/` folder)
- TypeScript strict mode is enabled via `tsconfig.json`
