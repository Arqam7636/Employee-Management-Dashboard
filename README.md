# Employee Management Dashboard

A production-quality internal Employee Management Dashboard built with React, TypeScript, MUI, Redux Toolkit, React Query, and Axios.

## Features

- **Employee DataGrid** — paginated, sortable list with MUI DataGrid
- **CRUD Operations** — create, edit, and delete employees via dialog forms
- **Debounced Search** — filter employees by name, email, or position
- **Form Validation** — Zod schema + react-hook-form with inline error messages
- **Loading & Error States** — loading indicators and Snackbar error/success messages
- **Row Flash Animation** — subtle highlight on newly created/updated rows
- **MUI Theme** — clean, modern custom theme with consistent spacing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root (already included):

```
VITE_API_URL=http://localhost:3001
```

### Running the App

Start the mock API server and the dev server in **two separate terminals**:

```bash
# Terminal 1 — Mock API (json-server on port 3001)
npm run api

# Terminal 2 — Vite dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start Vite dev server               |
| `npm run api`           | Start json-server mock API          |
| `npm run build`         | TypeScript check + production build |
| `npm run lint`          | Run ESLint                          |
| `npm run test`          | Run Vitest in watch mode            |
| `npm run test:coverage` | Run tests with coverage report      |
| `npm run preview`       | Preview production build            |

## Architecture

### Why Redux Toolkit + React Query Together?

- **React Query** handles server state: fetching, caching, refetching, and mutation lifecycle.
- **Redux Toolkit** handles UI state: dialog open/close, search query, selected employee, snackbar queue, and flash row ID.
- **RTK EntityAdapter** normalizes employee data for predictable, stable DataGrid selectors.
- On React Query `onSuccess`, we dispatch RTK actions to keep the store in sync — so the DataGrid reads from stable, normalized selectors while React Query manages the fetch lifecycle.

### How CRUD Updates the Grid Immediately

1. User submits a form (create/edit) or confirms delete.
2. React Query mutation fires the API call.
3. On success, the mutation's `onSuccess` callback:
   - Dispatches RTK slice update (`upsertOne` / `removeOne`)
   - Shows a success snackbar
   - Flashes the row (create/edit only)
   - Invalidates the query for background refetch

This means the DataGrid updates immediately from the RTK dispatch, and the background refetch ensures data stays correct.

## Tech Stack

- **React 19** + **TypeScript** (strict mode) + **Vite 7** (SWC)
- **MUI v7** + **@mui/x-data-grid v8** — component library and data grid
- **Redux Toolkit** — UI state management with EntityAdapter
- **TanStack React Query** — server state and mutations
- **Axios** — HTTP client with centralized error normalization
- **react-hook-form** + **Zod** — form handling with schema validation
- **react-router-dom v7** — routing with `createBrowserRouter`
- **json-server** — mock REST API
- **Vitest** + **React Testing Library** + **MSW** — testing
