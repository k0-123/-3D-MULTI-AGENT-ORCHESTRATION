import { useRef, useCallback, useEffect } from "react";
import { useAgentStore } from "../store/agentStore";

export const useAgentWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const { setAgentStatus, setAgentResult } = useAgentStore();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/agent.worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { agentId, status, result, error } = e.data;
      if (status) setAgentStatus(agentId, status);
      if (result) setAgentResult(agentId, result);
      if (error) console.error(`Agent ${agentId} error:`, error);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const dispatch = useCallback((
    agentId: string,
    messages: { role: string; content: string }[],
    taskType = "general"
  ) => {
    workerRef.current?.postMessage({ agentId, messages, taskType });
  }, []);

  return { dispatch };
};
