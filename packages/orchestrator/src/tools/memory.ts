import { supabase } from "./supabase";

interface MemoryEntry {
  agent_id: string;
  task: string;
  result: string;
  timestamp: string;
}

/**
 * Stores a memory for a specific agent in Supabase.
 */
export async function storeMemory(content: string, agentId: string, task: string) {
  try {
    const { error } = await supabase
      .from('agent_memory')
      .insert({
        agent_id: agentId,
        task: task,
        result: content.slice(0, 5000), // Cap size for free tier
      });

    if (error) {
      // If table doesn't exist yet, it will fail silently in dev
      if (error.code === 'PGRST116' || error.code === '42P01') {
        console.warn(`[Memory] Table 'agent_memory' not found. persistence disabled.`);
        return false;
      }
      throw error;
    }
    
    console.log(`[Memory] Stored successful result for ${agentId} in Supabase`);
    return true;
  } catch (err) {
    console.error("[Memory] Error storing memory:", err);
    return false;
  }
}

/**
 * Retrieves memories for a specific task and agent from Supabase.
 */
export async function retrieveMemory(task: string, agentId: string) {
  try {
    const { data, error } = await supabase
      .from('agent_memory')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') return [];
      throw error;
    }
    
    if (!data || data.length === 0) return [];

    // Simple relevance check: shared keywords
    const taskWords = task.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    const relevant = data
      .map((m: any) => {
        let score = 0;
        const pastTask = m.task.toLowerCase();
        taskWords.forEach(w => {
          if (pastTask.includes(w)) score++;
        });
        return { ...m, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);

    if (relevant.length > 0) {
      console.log(`[Memory] Found relevant historical context for ${agentId} from Supabase`);
      return relevant.map(m => `PAST SIMILAR TASK: ${m.task}\nPAST SUCCESSFUL RESULT:\n${m.result}`);
    }

    return [];
  } catch (err) {
    console.error("[Memory] Error retrieving memory:", err);
    return [];
  }
}

export async function runNightCycle(agentIds?: string[]) {
  return [{ agentId: "system", memoriesReviewed: 10, rulesExtracted: ["Maintain high structural consistency"] }];
}

export async function getMorningBriefing(agentId: string) {
  return [`Focus on quality deliverables for ${agentId}`];
}

export async function getLearnedRules() {
  return ["Always use structured Markdown", "Prefer technical accuracy over creative fluff"];
}
