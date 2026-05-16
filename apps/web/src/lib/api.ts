import { supabase } from "./supabase";

export const api = {
  orchestrate: async (payload: {
    mission: string;
    priority?: "low" | "medium" | "high";
    mode?: "auto" | "manual";
    designSystemId?: string;
    userId?: string;
  }) => {
    return fetch("/api/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  getIssues: async (userId: string) => {
    return supabase
      .from('issues')
      .select('*')
      .eq('user_id', userId);
  },

  getDeliverables: async (userId: string) => {
    return supabase
      .from('deliverables')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
  },
};
