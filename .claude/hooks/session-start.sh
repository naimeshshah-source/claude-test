#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "Installing dependencies for expense-tracker..."
cd "$PROJECT_DIR/expense-tracker"
npm install

echo "Installing dependencies for travel-search..."
cd "$PROJECT_DIR/travel-search"
npm install

echo "Dependencies installed successfully."
