# 🏗️ Project Restructuring Master Plan
## 3D Multi-Agent Orchestration — Monorepo Migration

---

## 1. Migration Overview

| Phase | Description | Status |
| :--- | :--- | :--- |
| **Phase 1** | Monorepo Scaffolding (Turborepo + PNPM) | ✅ Completed |
| **Phase 2** | Package Decoupling (`@repo/shared`, `@repo/orchestrator`) | ✅ Completed |
| **Phase 3** | Content Migration (`@repo/design-systems`, `@repo/skills`) | ✅ Completed |
| **Phase 4** | Backend Decoupling (Hono + Cloudflare Workers) | ✅ Completed |
| **Phase 5** | Frontend Modernization (Vite + React 19 SPA) | ✅ Completed |
| **Phase 6** | Shared UI Library (`@repo/ui`) | ✅ Completed |
| **Phase 7** | Database & Auth Hardening | ✅ Completed |
| **Phase 8** | DevOps & Deployment | ✅ Completed |

---

## 2. Phase 5 Details: Frontend Modernization

- [x] **Scaffold `apps/web`**
    - [x] Vite + React 19 + TypeScript
    - [x] Tailwind CSS v4 setup
    - [x] TanStack Router (Pure SPA mode)
- [x] **Decompose `DashboardOverlay.tsx`**
    - [x] Extract `Sidebar.tsx` and `Header.tsx`
    - [x] Extract `IssueKanban.tsx`, `KanbanColumn.tsx`, `IssueCard.tsx`
    - [x] Extract `ResultsList.tsx` and `ArtifactPreview.tsx`
    - [x] Extract `InboxPanel.tsx` and `RoutinesList.tsx`
    - [x] Extract `GoalsPanel.tsx` and `IssueDetail.tsx`
    - [x] Extract `NewIssueModal.tsx` and `NewRoutineModal.tsx`
- [x] **Store & Logic Migration**
    - [x] Port `useAgentStore.ts` to `apps/web/src/store/`
    - [x] Implement `lib/sse.ts` and `lib/api.ts`
    - [x] Refactor `runOrchestration` to use SSE utility
- [x] **Final Assembly**
    - [x] Create `Dashboard.tsx` page
    - [x] Wire all components to the store
    - [x] Update `index.tsx` route
- [x] **Cleanup**
    - [x] Delete deprecated files in root `src/`
    - [x] Verify production build

- [x] **Phase 6: Shared UI Library (@repo/ui)**
    - [x] Initialize `packages/ui` workspace
    - [x] Migrate 40+ Shadcn components to shared package
    - [x] Configure Tailwind v4 for shared consumption
    - [x] Update `apps/web` to consume components from `@repo/ui`
    - [x] **Phase 7: Database & Auth Hardening**
    - [x] Create `supabase/migrations` directory
    - [x] Migration 001: `issues` table with RLS
    - [x] Migration 002: `deliverables` table with RLS
    - [x] Migration 003: `agent_memory` table with RLS
    - [x] Implement multi-tenancy in `@repo/orchestrator` (userId pass-through)
    - [x] **Phase 8: DevOps & Deployment**
    - [x] Create GitHub Actions workflow (`deploy.yml`)
    - [x] Configure `apps/api/wrangler.toml` for production Workers
    - [x] Set up environment variable placeholders
    - [x] Update root `README.md` with monorepo documentation
    - [x] Verify full build pipeline (`turbo build`)
    - [x] Perform final root cleanup (Move legacy `src/` to `src.bak/`)
