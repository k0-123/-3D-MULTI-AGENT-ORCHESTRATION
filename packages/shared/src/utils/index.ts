/**
 * Formats an audit log message with a timestamp and agent ID.
 */
export function audit(agentId: string, msg: string): string {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
  return `[${ts}] [${agentId.toUpperCase()}] ${msg}`;
}

/**
 * Strips model-specific artifacts (MiniMax tool_call XML, JSON blobs, etc.) from LLM output.
 */
export function sanitizeResponse(raw: string): string {
  let cleaned = raw;
  // Remove MiniMax tool_call XML blocks
  cleaned = cleaned.replace(/<minimax:tool_call>[\s\S]*?<\/minimax:tool_call>/g, "").trim();
  // Remove any generic XML tool invocations
  cleaned = cleaned.replace(/<invoke[\s\S]*?<\/invoke>/g, "").trim();
  // Remove JSON blobs that look like tool parameters ({"QUERY":..., "MAX_RESULTS":...})
  cleaned = cleaned.replace(/^\s*\{["'](?:QUERY|query|MAX_RESULTS|max_results)["'][\s\S]*?\}\s*/gm, "").trim();
  // Remove lines that are only whitespace after cleanup
  return cleaned;
}
