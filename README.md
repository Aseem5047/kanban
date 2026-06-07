# Kanban Board

A drag-and-drop Kanban board built with React, TypeScript, Tailwind CSS, Zustand, and json-server as a mock REST API.

---

## Tech Stack

- **React 19** — UI
- **TypeScript** — Type safety
- **Tailwind CSS 4** — Styling
- **Zustand** — State management
- **Vite** — Dev server and bundler
- **json-server** — Mock REST API backed by `db.json`
- **concurrently** — Runs Vite and json-server in parallel

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

---

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd kanban
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run start
```

This runs both the Vite dev server and json-server concurrently:

| Service     | URL                      |
|-------------|--------------------------|
| App         | http://localhost:5173    |
| JSON Server | http://localhost:3000    |

---

## Available Scripts

| Script            | Description                                          |
|-------------------|------------------------------------------------------|
| `npm run start`   | Runs Vite + json-server concurrently (recommended)   |
| `npm run dev`     | Runs only the Vite dev server                        |
| `npm run server`  | Runs only json-server on port 3000                   |
| `npm run build`   | Type-checks and builds for production                |
| `npm run preview` | Previews the production build locally                |
| `npm run lint`    | Runs ESLint                                          |

---

## Project Structure

```
src/
├── components/
│   ├── Common/          # Shared UI components (Avatar, Drawer, etc.)
│   ├── TaskCard/        # Individual task card
│   ├── TaskColumn/      # Kanban column
│   ├── TaskDrawer/      # Task detail drawer and sub-components
│   ├── Topbar/          # Top navigation and filters
│   └── UndoToast/       # Undo notification toast
├── hooks/               # Custom React hooks
├── pages/
│   └── Board.tsx        # Main board page
├── services/
│   └── task.services.ts # API calls to json-server
├── stores/
│   ├── task.store.ts    # Zustand store for tasks, filters, assignees, tags
│   └── undo.store.ts    # Zustand store for undo actions
├── types/
│   └── task.types.ts    # TypeScript types
└── utils/
    └── task.utils.ts    # Helper functions (e.g. buildColumns)
```

---

## Features

- **Kanban columns** — Backlog (To-do), In Progress, Done
- **Drag and drop** — Move tasks between columns
- **Task drawer** — Edit title, status, priority, assignee, tag, due date, and story points
- **Inline delete confirmation** — On both task cards and the drawer
- **Undo toast** — 5-second undo window for moves and deletes
- **Filters** — Search, priority, assignee, and tag filters in the topbar
- **Persistent UI state** — Assignees, tags, and filters persisted via localStorage
- **Optimistic-style loading states** — Per-operation loading flags (creating, updating, deleting)

---

## Data

Tasks are stored in `db.json` in the project root and served by json-server at `http://localhost:3000/tasks`.

> **Note:** `db.json` is excluded from Vite's file watcher to prevent hot reloads on every task mutation. This is configured in `vite.config.ts`.

### Example task shape

```json
{
  "id": "abc-123",
  "title": "Build login page",
  "status": "in progress",
  "priority": "high",
  "points": 5,
  "assigneeId": "a1",
  "tagId": "t1",
  "expirationDate": "2025-12-31T00:00:00.000Z"
}
```

---

## Configuration

### `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: ['**/db.json'],
    },
  },
})
```

The `ignored: ['**/db.json']` entry is important — without it, every json-server write triggers a full Vite page reload, breaking the undo functionality.
