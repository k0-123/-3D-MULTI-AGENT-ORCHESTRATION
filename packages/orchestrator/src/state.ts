import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { Issue, AgentUpdate, Budget, RoadmapStep } from "@repo/shared";

export const AgentStateSchema = Annotation.Root({
  task: Annotation<string>(),
  messages: Annotation<BaseMessage[]>({ reducer: (a, b) => [...a, ...b], default: () => [] }),
  auditLog: Annotation<string[]>({ reducer: (a, b) => [...a, ...b], default: () => [] }),
  activeIssues: Annotation<Issue[]>({ reducer: (_, b) => b, default: () => [] }),
  agentUpdates: Annotation<AgentUpdate[]>({ reducer: (a, b) => [...a, ...b], default: () => [] }),
  budget: Annotation<Budget>({ reducer: (_, b) => b, default: () => ({ limit: 10.0, spent: 0.0 }) }),
  roadmap: Annotation<RoadmapStep[]>({ reducer: (_, b) => b, default: () => [] }),
  currentStepIndex: Annotation<number>({ reducer: (_, b) => b, default: () => 0 }),
  workerOutput: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  reviewFeedback: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
  result: Annotation<string>({ reducer: (_, b) => b, default: () => "" }),
  retryCount: Annotation<number>({ reducer: (_, b) => b, default: () => 0 }),
  error: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
  useOpenDesign: Annotation<boolean>({ reducer: (_, b) => b, default: () => false }),
  activeDesignSystem: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
  stepResults: Annotation<Record<string, string>>({ reducer: (a, b) => ({ ...a, ...b }), default: () => ({}) }),
  userId: Annotation<string | null>({ reducer: (_, b) => b, default: () => null }),
  env: Annotation<any>({ reducer: (_, b) => b, default: () => ({}) }),
});

export type AgentState = typeof AgentStateSchema.State;
