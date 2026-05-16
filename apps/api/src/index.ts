import { Hono } from "hono";
import { cors } from "hono/cors";
import { orchestrateRoute } from "./routes/orchestrate";
import { memoryRoute } from "./routes/memory";

type Bindings = {
  GEMINI_API_KEY: string;
  GROQ_API_KEY: string;
  OPENROUTER_API_KEY: string;
  TAVILY_API_KEY: string;
  GITHUB_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY?: string;
  CODEX_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", cors());

// Sync Cloudflare env to process.env for shared packages
app.use("*", async (c, next) => {
  if (c.env) {
    Object.assign(process.env, c.env);
  }
  await next();
});

// Routes
app.get("/health", (c) => c.json({ status: "ok", version: "1.0.0" }));
app.route("/orchestrate", orchestrateRoute);
app.route("/memory", memoryRoute);

export default app;
