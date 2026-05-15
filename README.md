# 3D Multi-Agent Orchestration Dashboard 🚀

A high-performance, visual multi-agent orchestration engine built with **React 19**, **Three.js**, and **LangGraph**. This system transforms complex task execution into a visual 3D experience, coordinating a swarm of specialized AI agents to deliver professional-grade results.

## ✨ Features

- **Visual 3D Orchestration**: Real-time visualization of agent activity within a stunning 3D HUD environment.
- **Intelligent Swarm Architecture**: A hierarchy of specialized agents (CEO, Senior Builder, Growth Hacker, etc.) working in parallel.
- **LangGraph Workflow Engine**: Robust state management and task routing using LangGraph for complex, multi-step missions.
- **Adaptive Model Routing**: Dynamically routes tasks to the most efficient model (Gemini 1.5 Flash, Llama 3.3, MiniMax, GLM-4) based on complexity and cost.
- **Persistent Agent Memory**: 
  - **Night Cycles**: Agents reflect on past successes to extract optimization rules.
  - **Morning Briefings**: Agents load learned rules into their context before starting work.
- **Open Design Protocol**: Brand-aligned artifact generation with pre-defined design systems (Linear, Apple, Vercel, etc.).
- **Live Deliverables**: Streaming results (HTML, Markdown) delivered directly to the dashboard with integrated live previews.
- **GitHub & Search Integration**: Real-time access to repositories and the web for up-to-date execution.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Orchestration**: [LangGraph](https://python.langchain.com/v0.1/docs/langgraph/), [LangChain](https://www.langchain.com/)
- **3D Engine**: [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand), [TanStack Query](https://tanstack.com/query)
- **UI/UX**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Radix UI](https://www.radix-ui.com/)
- **Backend/Auth**: [Supabase](https://supabase.com/)
- **Infrastructure**: [Cloudflare Workers/Pages](https://workers.cloudflare.com/)

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js
- API Keys for: Google Gemini, Groq, OpenRouter, Supabase, Pinecone, and Tavily.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/k0-123/agent-flow.git
   cd agent-flow
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   Create a `.env` file in the root and add your API keys.

4. Start the development server:
   ```bash
   bun run dev
   ```

## 🧠 Agent Roster

- **CEO (Karan)**: Mission planning, roadmap creation, and quality assurance.
- **Senior Builder**: Technical architecture and GitHub-ready code generation.
- **Intern**: Support, documentation, and minor fixes.
- **Offer Architect**: Business strategy and pricing models.
- **Growth Hacker**: Viral strategies and marketing automation.
- **Funnel Engineer**: Conversion optimization and landing pages.
- **Designer**: UI/UX and visual asset creation.

## 📂 Project Structure

- `src/api-routes`: Server-side event-stream endpoints.
- `src/components`: React components (UI & 3D).
- `src/lib/agent-graph`: Core LangGraph orchestration logic.
- `src/store`: Zustand global state management.
- `src/worker`: Background agent execution logic.

---

Built with ❤️ by the Agentic Orchestration Team.
