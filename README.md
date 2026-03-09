# Lyncs — Personal Finance Tracker

A clean, dark-themed personal finance dashboard built with React + TypeScript + Vite. Track monthly income and expenses, visualize spending patterns, and stay on budget — all persisted locally with no backend required.

## What I Built

Lyncs is a single-page personal finance tracker with three views:

- **Dashboard** — At-a-glance summary cards (income, expenses, balance), an interactive donut chart of spending by category, a daily spending bar chart, and a horizontal category breakdown.
- **Transactions** — A date-grouped list of all transactions for the selected month. Each entry shows its type (income/expense), description, category badge, and amount. Delete with a hover-reveal trash icon.
- **Budgets** — Set per-category spending limits with inline editing. Animated progress bars show how close you are to each limit, with clear visual warnings (red glow, pulsing bar, "over budget by $X" callout) when a category is exceeded.

Adding a transaction is done via a floating action button (FAB) that opens a bottom-sheet modal with an expense/income toggle, a tappable category picker, amount field, description, and date selector. The modal slides up with a backdrop blur and the form is designed to feel fast — amount is autofocused, and the form closes on submit.

Data persists entirely in `localStorage`, so everything survives page refreshes without a backend.

## Design Choices

| Choice                                                                             | Reasoning                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dark theme (Catppuccin-inspired palette)**                                       | Finance apps are often used at night or for extended review sessions. A dark palette with high-contrast accent colors reduces eye strain while making the data pop.                            |
| **5 categories: Housing, Food & Dining, Transportation, Entertainment, Utilities** | Covers the most common personal expense buckets without overwhelming the user. Each has a distinct color and Lucide icon for instant visual recognition.                                       |
| **Tab navigation over routing**                                                    | For a focused single-purpose app, tabs keep the mental model simple — everything is one click away, no URL management needed.                                                                  |
| **Bottom-sheet modal for new transactions**                                        | Follows mobile-first interaction patterns. The form slides up from the bottom, which feels natural and keeps the FAB as a persistent, discoverable entry point.                                |
| **Seed data on first visit**                                                       | An empty dashboard tells the user nothing. Pre-populated sample transactions let users immediately understand the app's capabilities and how data is visualized.                               |
| **Inline budget editing**                                                          | Click-to-edit with Enter/Escape support avoids a separate settings page. Budget management stays contextual — you see the progress bar update as you adjust.                                   |
| **BEM-style CSS class naming**                                                     | Keeps styles predictable and avoids specificity wars without adding a CSS-in-JS dependency. Component boundaries are clear from class names alone.                                             |
| **Recharts for visualization**                                                     | Lightweight, composable, and supports responsive containers out of the box. The donut chart with a centered total label and the daily bar chart give two useful perspectives on the same data. |

## What I'd Improve With More Time

- **Recurring transactions** — Many expenses (rent, subscriptions) repeat monthly. Auto-generating them would save time and improve accuracy.
- **Data export/import** — CSV or JSON export so users can back up their data or migrate between devices.
- **Month-over-month trends** — A line chart comparing spending across several months to surface longer-term patterns.
- **Drag-to-reorder categories** — Let users prioritize which categories appear first in charts and budgets.
- **Accessibility audit** — While semantic HTML and ARIA labels are used throughout, a full screen-reader walkthrough and keyboard navigation pass would catch edge cases.
- **Animations and transitions** — Page transitions between tabs, staggered list entry animations, and more micro-interactions to make the app feel alive.
- **Mobile gesture support** — Swipe-to-delete on transactions, pull-to-refresh patterns.
- **Testing** — Unit tests for the financial calculation utilities, integration tests for the hooks, and component tests for key user flows.

## Challenges

- **localStorage hydration with seed data** — Getting the initial state right required care: the app needs to seed sample transactions on first load but never overwrite user data on subsequent visits. Solved with a clean initialization function that checks localStorage before falling back to seed data.
- **Recharts TypeScript types** — The `Tooltip` formatter prop has complex generic types that don't play well with simple inline callbacks. Required casting the value through `Number()` to satisfy the type checker without losing runtime behavior.
- **React Compiler compatibility** — The project uses the React Compiler (via Babel plugin), which is still relatively new. Ensured all hooks follow the rules of React strictly — no conditional hooks, stable callback references via `useCallback`, and pure render functions.

## Tech Stack

- **React 19** with React Compiler enabled
- **TypeScript** (strict mode)
- **Vite 8** (beta) for build tooling
- **Recharts** for data visualization
- **Lucide React** for icons
- **localStorage** for persistence
- No CSS framework — hand-written CSS with CSS custom properties and BEM naming

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Time Spent

Approximately **2 days**, including design decisions, implementation, polish, and testing.
