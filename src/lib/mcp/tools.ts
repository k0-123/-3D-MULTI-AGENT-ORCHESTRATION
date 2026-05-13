import { tool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Mock MCP Tool: Read File
 */
export const mcp_read_file = tool(
  async ({ path }) => {
    console.log(`[MCP] Reading file: ${path}`);
    return `Content of file at ${path}: // Mock data for ${path}`;
  },
  {
    name: "mcp_read_file",
    description: "Simulates reading a local repository file.",
    schema: z.object({
      path: z.string().describe("The path to the file to read"),
    }),
  }
);

/**
 * Mock MCP Tool: Write Code
 */
export const mcp_write_code = tool(
  async ({ path, code }) => {
    console.log(`[MCP] Writing code to: ${path}`);
    return `Successfully wrote code to ${path}`;
  },
  {
    name: "mcp_write_code",
    description: "Simulates writing a code block to a specific path.",
    schema: z.object({
      path: z.string().describe("The path to write the code to"),
      code: z.string().describe("The code content to write"),
    }),
  }
);

/**
 * Mock MCP Tool: Web Search
 */
export const mcp_web_search = tool(
  async ({ query }) => {
    console.log(`[MCP] Web search: ${query}`);
    return `Search results for "${query}": 1. Market trend A, 2. Competitor B analysis, 3. SaaS growth data.`;
  },
  {
    name: "mcp_web_search",
    description: "Simulates scraping a URL for market data.",
    schema: z.object({
      query: z.string().describe("The search query or URL to scrape"),
    }),
  }
);
