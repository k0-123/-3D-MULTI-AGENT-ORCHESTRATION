export interface Env {
  ASSETS: Fetcher;
  AGENT_CACHE: KVNamespace;
  OPENROUTER_API_KEY: string;
  TAVILY_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // Proxy: /api/llm → OpenRouter (hides API key from browser)
    if (url.pathname === "/api/llm" && request.method === "POST") {
      const body = await request.json() as any;

      // KV cache check (1 hour TTL)
      const cacheKey = "llm:" + btoa(JSON.stringify(body.messages).slice(0, 80));
      const cached = await env.AGENT_CACHE.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { ...cors, "Content-Type": "application/json", "X-Cache": "HIT" }
        });
      }

      // Enforce free-tier models only
      const FREE_MODELS = [
        "mistralai/mistral-7b-instruct:free",
        "meta-llama/llama-3.1-8b-instruct:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "google/gemma-2-9b-it:free",
        "microsoft/phi-3-mini-128k-instruct:free",
      ];
      if (!FREE_MODELS.includes(body.model)) {
        body.model = "mistralai/mistral-7b-instruct:free";
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": request.headers.get("origin") ?? "",
          "X-Title": "Agent Flow",
        },
        body: JSON.stringify({ ...body, max_tokens: body.max_tokens ?? 512 }),
      });

      const data = await res.text();
      if (res.ok) {
        await env.AGENT_CACHE.put(cacheKey, data, { expirationTtl: 3600 });
      }
      return new Response(data, {
        status: res.status,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // Proxy: /api/search → Tavily (hides API key)
    if (url.pathname === "/api/search" && request.method === "POST") {
      const { query } = await request.json() as { query: string };
      const cacheKey = "search:" + btoa(query.toLowerCase().slice(0, 60));
      const cached = await env.AGENT_CACHE.get(cacheKey);
      if (cached) {
        return new Response(cached, {
          headers: { ...cors, "Content-Type": "application/json", "X-Cache": "HIT" }
        });
      }
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: env.TAVILY_API_KEY,
          query,
          max_results: 3,
          search_depth: "basic",
        }),
      });
      const data = await res.text();
      if (res.ok) await env.AGENT_CACHE.put(cacheKey, data, { expirationTtl: 86400 });
      return new Response(data, {
        status: res.status,
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }

    // All other routes: serve static Vite build
    return env.ASSETS.fetch(request);
  },
};
