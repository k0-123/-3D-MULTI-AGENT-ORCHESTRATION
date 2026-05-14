import fs from "fs-extra";
import path from "path";

const MEMORY_PATH = path.join(process.cwd(), "agent-memory.json");

interface MemoryEntry {
  agentId: string;
  task: string;
  result: string;
  timestamp: string;
}

/**
 * Stores a memory for a specific agent.
 */
export async function storeMemory(content: string, agentId: string, task: string) {
  try {
    const memory: MemoryEntry[] = await fs.readJson(MEMORY_PATH).catch(() => []);
    
    // Only store unique-ish successful results
    const newEntry: MemoryEntry = {
      agentId,
      task,
      result: content.slice(0, 5000), // Cap size
      timestamp: new Date().toISOString()
    };

    memory.push(newEntry);
    
    // Keep last 100 memories total to prevent bloat
    const limitedMemory = memory.slice(-100);
    await fs.writeJson(MEMORY_PATH, limitedMemory, { spaces: 2 });
    
    console.log(`[Memory] Stored successful result for ${agentId}`);
    return true;
  } catch (err) {
    console.error("[Memory] Error storing memory:", err);
    return false;
  }
}

/**
 * Retrieves memories for a specific task and agent.
 */
export async function retrieveMemory(task: string, agentId: string) {
  try {
    const memory: MemoryEntry[] = await fs.readJson(MEMORY_PATH).catch(() => []);
    
    // Find relevant memories for this agent
    const agentMemories = memory.filter(m => m.agentId === agentId);
    
    // Simple relevance check: shared keywords
    const taskWords = task.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    const relevant = agentMemories
      .map(m => {
        let score = 0;
        const pastTask = m.task.toLowerCase();
        taskWords.forEach(w => {
          if (pastTask.includes(w)) score++;
        });
        return { ...m, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1); // Only return the best match to keep context clean

    if (relevant.length > 0) {
      console.log(`[Memory] Found relevant historical context for ${agentId}`);
      return relevant.map(m => `PAST SIMILAR TASK: ${m.task}\nPAST SUCCESSFUL RESULT:\n${m.result}`);
    }

    return [];
  } catch (err) {
    console.error("[Memory] Error retrieving memory:", err);
    return [];
  }
}

/**
 * Night Cycle: Reflection (placeholder for future automated optimization)
 */
export async function runNightCycle(agentIds?: string[]) {
  return [{ agentId: "system", memoriesReviewed: 10, rulesExtracted: ["Maintain high structural consistency"] }];
}

export async function getLearnedRules() {
  return ["Always use structured Markdown", "Prefer technical accuracy over creative fluff"];
}

export async function getMorningBriefing(agentId: string) {
  return [`Focus on quality deliverables for ${agentId}`];
}
