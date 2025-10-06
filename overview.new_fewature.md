## New Features Repository - Overview

This document describes the standalone `new_features` repository. It covers architecture, key directories, tech stack, core features, environment setup, and how to run locally.

### Architecture

- **Frontend**: React 19 + Vite 7 + TypeScript
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Routing**: React Router
- **Editors**: Jodit, TinyMCE, Quill (via React bindings)
- **Validation**: Zod
- **Backend/Worker**: Hono framework (Node server / worker entry in `src/worker`)
- **Database**: MySQL (managed via SQL migrations and a migration runner)

### Key Directories

- `migrations/`
  - `consolidated.sql`: Full schema (tables, indexes, and sample data)
  - `run-migration.js`: Node migration runner
  - `README.md`: Migration docs and `.env` format
- `src/react-app/`
  - `pages/`: App pages (Admin and Member areas, auth callback, public funnel)
  - `components/`: UI components (template selector/preview, WYSIWYG editors, sidebar, notifications)
  - `utils/`: Auth utilities and icon mapping
  - `main.tsx`, `App.tsx`: App bootstrap
  - `index.css`, `global-video-styles.css`: Styles
- `src/worker/`
  - `index.ts`: Hono server/worker entry
  - `database.ts`: MySQL connection helpers
- `src/shared/`
  - `types.ts`: Shared TypeScript types

### Core Features

- **Funnel templates**: Admin-managed and user-managed templates with live previews
- **Funnel builder/editor**: WYSIWYG editing (Jodit, TinyMCE, Quill supported)
- **Member funnels**: Create and manage funnels separate from templates
- **Leads management**: Capture and view leads
- **Analytics tracking**: Store funnel analytics
- **Notifications**: In-app notification center
- **Auth flow**: Client auth utility (`useAuth`) and callback page

### Tech Stack Details

- Build tooling: Vite 7, `@vitejs/plugin-react`
- Server/runtime: Hono (`@hono/node-server`), TypeScript, `tsx` for dev
- Data: MySQL via `mysql2`
- UI/Icons: `lucide-react`
- Linting: ESLint 9 + TypeScript ESLint
- Env: `dotenv`

### NPM Scripts (from `package.json`)

- `dev`: Start Vite dev server (frontend)
- `server`: Start Hono worker/server (watches `src/worker/index.ts`)
- `migrate`: Run database migration via Node script
- `build`: TypeScript build + Vite build
- `start`: Run compiled worker
- `lint`, `check`, `cf-typegen`: Developer utilities

### Environment

Create `.env` in the repository root for database connectivity (see `migrations/README.md`):

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=online_empires
```

### Getting Started

1. Install dependencies
   - `pnpm install` (or `npm install`)
2. Configure database
   - Create `.env` as above and ensure MySQL is running
3. Apply schema
   - `pnpm run migrate` (or `node migrations/run-migration.js`)
4. Run backend/worker (API)
   - `pnpm run server`
5. Run frontend
   - `pnpm run dev`

### Notes

- Aliases: `@` → `./src` (see `vite.config.ts`)
- Large chunk warnings are relaxed (`chunkSizeWarningLimit: 5000`)
- Cloudflare build/plugins are scaffolded but commented out; Hono runs locally via Node by default.


