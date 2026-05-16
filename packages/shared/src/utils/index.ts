/**
 * Formats an audit log message with a timestamp and agent ID.
 */
export function audit(agentId: string, msg: string): string {
  const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
  return `[${ts}] [${agentId.toUpperCase()}] ${msg}`;
}

/**
 * Strips model-specific artifacts (MiniMax tool_call XML, JSON blobs, etc.) from LLM output.
 * Also extracts content from markdown code blocks to ensure clean HTML/Code delivery.
 */
export function sanitizeResponse(raw: string): string {
  let cleaned = raw;

  // 1. Remove MiniMax tool_call XML blocks
  cleaned = cleaned.replace(/<minimax:tool_call>[\s\S]*?<\/minimax:tool_call>/g, "");

  // 2. Remove any generic XML tool invocations
  cleaned = cleaned.replace(/<invoke[\s\S]*?<\/invoke>/g, "");

  // 3. Extract content from markdown code blocks if present
  // This is critical for HTML live previews to work without backticks in the iframe
  const codeBlockMatch = cleaned.match(/```(?:html|css|js|javascript|json|markdown)?\n([\s\S]*?)```/i);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1];
  } else {
    // If no explicit code block, check for backticks without language label
    const simpleBlockMatch = cleaned.match(/```\n?([\s\S]*?)```/);
    if (simpleBlockMatch) {
      cleaned = simpleBlockMatch[1];
    }
  }

  // 4. Remove JSON blobs that look like tool parameters ({"QUERY":..., "MAX_RESULTS":...})
  cleaned = cleaned.replace(/^\s*\{["'](?:QUERY|query|MAX_RESULTS|max_results)["'][\s\S]*?\}\s*/gm, "");

  return cleaned.trim();
}
