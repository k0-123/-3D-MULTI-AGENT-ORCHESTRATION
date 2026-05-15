import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { runAgentStream } from "@repo/orchestrator";
import { z } from "zod";

const orchestrateSchema = z.object({
  mission: z.string(),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  mode: z.enum(["auto", "manual"]).optional().default("auto"),
  designSystemId: z.string().optional(),
});

export const orchestrateRoute = new Hono<{
  Bindings: {
    GEMINI_API_KEY: string;
    GROQ_API_KEY: string;
    OPENROUTER_API_KEY: string;
    TAVILY_API_KEY: string;
    GITHUB_TOKEN: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
}>();

orchestrateRoute.post("/", async (c) => {
  const body = await c.req.json();
  const result = orchestrateSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Invalid request body", details: result.error.errors }, 400);
  }

  const { mission, priority, mode, designSystemId } = result.data;

  // Set up SSE headers
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  return streamSSE(c, async (stream) => {
    try {
      console.log(`[API] Starting orchestration for mission: ${mission}`);
      
      const agentStream = runAgentStream({
        mission,
        priority,
        mode,
        designSystemId,
      });

      for await (const event of agentStream) {
        await stream.writeSSE({
          data: JSON.stringify(event),
          event: "message",
        });
      }

      console.log(`[API] Orchestration complete for mission: ${mission}`);
    } catch (err) {
      console.error("[API] Orchestration error:", err);
      await stream.writeSSE({
        data: JSON.stringify({
          type: "error",
          error: err instanceof Error ? err.message : "Internal Server Error",
        }),
        event: "error",
      });
    }
  });
});
