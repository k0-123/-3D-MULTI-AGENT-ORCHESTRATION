export async function tavilySearch(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "Web search unavailable (API key missing).";
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: "basic",
        include_images: false,
        max_results: 5,
      }),
    });
    if (!res.ok) throw new Error(`Tavily error: ${res.status}`);
    const data = await res.json();
    return data.results
      .map((r: any) => `TITLE: ${r.title}\nURL: ${r.url}\nCONTENT: ${r.content}`)
      .join("\n\n---\n\n");
  } catch (err) {
    return `Search Error: ${err instanceof Error ? err.message : String(err)}`;
  }
}
