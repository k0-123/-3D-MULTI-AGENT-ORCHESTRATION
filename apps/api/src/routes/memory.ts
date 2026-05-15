import { Hono } from "hono";
import { storeMemory, retrieveMemory } from "@repo/orchestrator";

export const memoryRoute = new Hono<{
  Bindings: {
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
  };
}>();

memoryRoute.get("/:agentId", async (c) => {
  const agentId = c.req.param("agentId");
  const task = c.req.query("task") || "general";
  const memories = await retrieveMemory(task, agentId);
  return c.json({ memories });
});

memoryRoute.post("/", async (c) => {
  const { agentId, memory, task } = await c.req.json();
  await storeMemory(memory, agentId, task || "general");
  return c.json({ success: true });
});
