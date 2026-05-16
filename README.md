# 3D Multi-Agent Orchestration — Production Monorepo 🚀

A high-performance, visual multi-agent orchestration engine built with **React 19**, **Three.js**, and **LangGraph**. This system transforms complex task execution into a visual 3D experience, coordinating a swarm of specialized AI agents to deliver professional-grade results.

## 🏗️ Architecture

This project is organized as a high-performance monorepo using **Turborepo**:

- **apps/web**: Pure Vite + React 19 SPA (Dashboard & 3D HUD).
- **apps/api**: Hono backend running on Cloudflare Workers (SSE Orchestration).
- **packages/orchestrator**: Standalone LangGraph agent engine.
- **packages/ui**: Shared Radix UI + Tailwind CSS v4 component library.
- **packages/shared**: Universal types, constants, and utilities.
- **packages/design-systems**: 150+ professional design system definitions.
- **packages/skills**: 107+ specialized agent skill definitions.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **API**: [Hono](https://hono.dev/) on [Cloudflare Workers](https://workers.cloudflare.com/)
- **Orchestration**: [LangGraph](https://python.langchain.com/v0.1/docs/langgraph/), [LangChain](https://www.langchain.com/)
- **3D Engine**: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database/Auth**: [Supabase](https://supabase.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) & [GitHub Actions](https://github.com/features/actions)

## 🚀 Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Cloudflare & Supabase accounts.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/3d-agent-orch.git
   cd 3d-agent-orch
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Fill in your API keys for Gemini, Groq, OpenRouter, Supabase, etc.

### Development

Start all apps and packages in parallel:
```bash
npm run dev
```

## 🧠 Deployment

### Automated Deployment
The project uses GitHub Actions (`.github/workflows/deploy.yml`) to automatically deploy to Cloudflare on every push to `main`.

### Manual Deployment
```bash
# Build all workspaces
npx turbo build

# Deploy API
cd apps/api && npx wrangler deploy

# Deploy Web
cd apps/web && npx wrangler pages deploy dist --project-name=3d-agent-orch
```

---

Built with ❤️ by the Agentic Orchestration Team.
