import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Agent polls for next available task matching its role
export const claimNextTask = async (agentId: string, agentRole: string) => {
  const { data, error } = await supabase
    .from("task_queue")
    .select("*")
    .eq("status", "pending")
    .order("priority", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  // Claim atomically
  const { error: claimError } = await supabase
    .from("task_queue")
    .update({ status: "in_progress", assigned_agent_id: agentId, started_at: new Date().toISOString() })
    .eq("id", data.id)
    .eq("status", "pending"); // Only claim if still pending

  return claimError ? null : data;
};

export const completeTask = async (taskId: string, result: string) => {
  await supabase
    .from("task_queue")
    .update({ status: "done", result, completed_at: new Date().toISOString() })
    .eq("id", taskId);
};

export const addTask = async (description: string, taskType = "general", priority = 5) => {
  const { data } = await supabase
    .from("task_queue")
    .insert({ description, task_type: taskType, priority })
    .select()
    .single();
  return data;
};
