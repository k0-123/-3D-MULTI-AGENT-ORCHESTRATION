import { defineEventHandler, setResponseHeaders, readBody, createError, createEvent } from "h3";
import { runAgentStream } from "../lib/agent-graph/graph";
import { runNightCycle, getMorningBriefing } from "../lib/agent-graph/memory";

const AGENT_IDS = ["ceo", "senior", "intern", "offer", "growth", "funnel"];

export async function handleOrchestrateRequest(request: Request, env?: any): Promise<Response> {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const send = (data: unknown) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  (async () => {
    try {
      send({ type: "system", status: "connection_established", auditLog: ["[SYSTEM] Secure SSE tunnel established. Waiting for LLM..."] });

      let body: { prompt?: string; currentGoal?: string; issueId?: string; useOpenDesign?: boolean } = {};
      try {
        body = await request.json();
      } catch {
        send({ agentId: "system", actionLog: "Error: Invalid JSON body" });
        writer.close();
        return;
      }

      const task = body.prompt?.trim();
      const goal = body.currentGoal?.trim() || "Complete task";
      const issueId = body.issueId?.trim();

      if (!task) {
        send({ agentId: "system", actionLog: "Error: Missing prompt" });
        writer.close();
        return;
      }

      for await (const update of runAgentStream(task, goal, env, body.useOpenDesign)) {
        send({ ...update, issueId });  // attach issueId to every SSE event
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      send({ agentId: "system", actionLog: `Fatal: ${msg}`, auditLog: [`[ERROR] ${msg}`] });
    } finally {
      writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// Keep the default export for Nitro/H3 if needed
export default defineEventHandler(async (event) => {
  // Use explicit casting to avoid Node server vs Edge worker type conflicts
  const { req, res } = event.node as { req: any; res: any };

  setResponseHeaders(event, {
    "Content-Type":                "text/event-stream",
    "Cache-Control":               "no-cache",
    "Connection":                  "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "X-Accel-Buffering":           "no",
  });

  const url  = new URL(req.url ?? "", `http://${req.headers.host}`);
  const mode = url.searchParams.get("mode") ?? "task";

  console.log(`[Orchestrate] Request received. Mode: ${mode}`);
  console.log(`[Orchestrate] Keys Check: Gemini: ${!!process.env.GOOGLE_GENERATIVE_AI_API_KEY}, Groq: ${!!process.env.GROQ_API_KEY}`);

  function send(data: unknown) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  // Immediate heartbeat to confirm connection
  send({ type: "system", status: "connection_established", auditLog: ["[SYSTEM] Secure SSE tunnel established. Waiting for LLM..."] });

  if (mode === "night") {
    send({ type: "system", auditLog: ["[SYSTEM] Sunsetting daily operations. Initiating nighttime optimization protocol."] });
    const results = await runNightCycle(AGENT_IDS);
    for (const r of results) {
      send({
        agentId:   r.agentId,
        actionLog: `Reflected on ${r.memoriesReviewed} memories. Extracted ${r.rulesExtracted.length} rules.`,
        newStatus: "learning",
        auditLog:  r.rulesExtracted.map((rule: string) => `[MCP] ${r.agentId}: ${rule}`),
      });
    }
    send({ type: "system", auditLog: ["[SYSTEM] Sunrise. Agents returning to workstations."] });
    res.end();
    return;
  }

  if (mode === "morning") {
    const briefings = await Promise.all(
      AGENT_IDS.map(async id => ({ agentId: id, memories: await getMorningBriefing(id) }))
    );
    for (const b of briefings) {
      if (b.memories.length) {
        send({
          agentId:   b.agentId,
          actionLog: `Loaded ${b.memories.length} optimization rules from memory.`,
          newStatus: "working",
          auditLog:  b.memories.map((m: string) => `[MCP] ${b.agentId}: ${m}`),
        });
      }
    }
    res.end();
    return;
  }

  // FIX: read from POST body, not query params
  let body: any = {};
  try {
    body = await readBody(event) || {};
    console.log(`[Orchestrate] Body received: ${JSON.stringify(body)}`);
  } catch (err) {
    console.error("[Orchestrate] Body parse error:", err);
    throw createError({ statusCode: 400, statusMessage: "Invalid JSON body" });
  }

  const task = body.prompt?.trim();
  const goal = body.currentGoal?.trim() || "Complete task";
  const issueId = body.issueId?.trim();

  if (!task) {
    throw createError({ statusCode: 400, statusMessage: "Missing body.prompt" });
  }
  if (task.length > 1000) {
    throw createError({ statusCode: 400, statusMessage: "Prompt too long (max 1000 chars)" });
  }

  send({
    agentId:  "system",
    auditLog: [
      "[SYSTEM] MCP Orchestrator online. 6 agents registered.",
      `[INFO] Strategic Goal: ${goal}`,
      `[INFO] Task received: ${task}`,
    ],
    agentUpdates: AGENT_IDS.map(id => ({ agentId: id, newStatus: "idle", actionLog: "Standby" })),
  });

  let disconnected = false;
  req.on("close", () => { disconnected = true; });

  try {
    for await (const update of runAgentStream(task, goal, undefined, body.useOpenDesign)) {
      if (disconnected) break;
      send({ ...update, issueId });
      await new Promise(r => setTimeout(r, 50));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    send({ agentId: "system", actionLog: `Fatal: ${msg}`, auditLog: [`[ERROR] ${msg}`] });
  }

  res.end();
});
