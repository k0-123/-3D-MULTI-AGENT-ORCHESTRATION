import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Broadcast result to all agents (Supabase Realtime)
export const broadcastResult = (fromAgentId: string, taskId: string, result: string) => {
  const channel = supabase.channel("agent-comms");
  channel.send({
    type: "broadcast",
    event: "task-complete",
    payload: { fromAgentId, taskId, result, timestamp: Date.now() },
  });
};

// Subscribe to other agents' results
export const subscribeToComms = (
  onResult: (payload: { fromAgentId: string; taskId: string; result: string }) => void
) => {
  return supabase
    .channel("agent-comms")
    .on("broadcast", { event: "task-complete" }, ({ payload }) => {
      onResult(payload);
    })
    .subscribe();
};
