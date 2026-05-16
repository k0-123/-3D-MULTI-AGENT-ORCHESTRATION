import { useAgentStore } from "../store/useAgentStore";

const STATUS_COLOR: Record<string, string> = {
  idle:     "#4a9eff",
  walking:  "#22c55e",
  thinking: "#f59e0b",
  working:  "#8b5cf6",
  done:     "#10b981",
  error:    "#ef4444",
};

export const AgentHUD = () => {
  const agents = useAgentStore((s) => s.agents);

  return (
    <div style={{
      position: "absolute",
      top: 16,
      right: 16,
      zIndex: 50,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      pointerEvents: "none",
    }}>
      {agents.map(agent => (
        <div key={agent.id} style={{
          background: "rgba(10,14,26,0.88)",
          border: `1px solid ${STATUS_COLOR[agent.status]}44`,
          borderLeft: `3px solid ${STATUS_COLOR[agent.status]}`,
          borderRadius: 8,
          padding: "8px 12px",
          minWidth: 200,
          backdropFilter: "blur(8px)",
          fontFamily: "monospace",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: STATUS_COLOR[agent.status],
              boxShadow: `0 0 6px ${STATUS_COLOR[agent.status]}`,
            }} />
            <span style={{ color: "#e2e8f5", fontSize: 12, fontWeight: 600 }}>
              {agent.name}
            </span>
            <span style={{ color: STATUS_COLOR[agent.status], fontSize: 10, marginLeft: "auto" }}>
              {agent.status.toUpperCase()}
            </span>
          </div>
          <div style={{ color: "#4a6fa5", fontSize: 10, marginTop: 4 }}>
            {agent.role} · {agent.tasksCompleted} tasks done
          </div>
          {agent.currentTask && (
            <div style={{ color: "#7eb3f0", fontSize: 10, marginTop: 3, opacity: 0.8 }}>
              ▶ {agent.currentTask.slice(0, 50)}
            </div>
          )}
          {agent.lastResult && (
            <div style={{
              color: "#94b4d0", fontSize: 10, marginTop: 4,
              borderTop: "1px solid #1a2438", paddingTop: 4,
            }}>
              {agent.lastResult.slice(0, 80)}
              {agent.lastResult.length > 80 && "..."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
