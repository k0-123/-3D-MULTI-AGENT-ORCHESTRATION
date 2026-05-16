import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { RoadmapStep, audit, sanitizeResponse } from "@repo/shared";
import { AgentState } from "../state";
import { resilientInvoke } from "../models/resilient-invoke";

import { SKILLS_REGISTRY } from "@repo/skills";

export async function ceoNode(state: AgentState): Promise<Partial<AgentState>> {
  console.log("[CEO] Designing Roadmap for:", state.task);

  const skillIds = SKILLS_REGISTRY.map(s => s.id).join(", ");
  const agentIds = "ceo, senior, intern, offer, growth, funnel, designer, deck_master";
  const dsIndex = "Standard, Minimalist, Corporate, Cyberpunk, Neo-Brutalism"; 

  const systemPrompt = `You are the CEO Agent. Your job is to decompose a complex user request into a step-by-step roadmap for a team of specialized agents.

MISSION GOAL: ${state.task}

AVAILABLE AGENTS (ONLY USE THESE IDs):
${agentIds}

AVAILABLE SKILLS (ONLY USE THESE IDs):
${skillIds}

PARALLEL RULES:
1. If steps can run independently, assign them the SAME GROUP (A, B, C).
2. Steps in Group B wait for all steps in Group A to finish.
3. Keep it efficient but safe.

Respond with EXACTLY this format:
DESIGN_SYSTEM: [suggested system from index]
ROADMAP:
1. [agentId]: [task description] (SKILL: skill-id, GROUP: A, COMPLEXITY: fast, REVIEW: yes, FORMAT: html/markdown)
TOOLS: search, github:read`;

  const { content, tokenCost } = await resilientInvoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(state.task),
  ], state, "glm", state.env);

  const sanitized = sanitizeResponse(content);
  
  const designSystemMatch = sanitized.match(/DESIGN_SYSTEM:\s*([\w-]+)/i);
  const activeDesignSystem = designSystemMatch ? designSystemMatch[1].trim() : null;

  const roadmapLines = sanitized.split("\n").filter(l => l.includes(":") && l.match(/^\d/));
  let roadmap: RoadmapStep[] = roadmapLines.map(line => {
    // Parsing logic...
    const parts = line.split(":");
    let idPart = parts[0].replace(/^\d+\.\s*/, "").toLowerCase().trim();
    
    // Normalize IDs to match shared constants
    if (idPart.includes("senior")) idPart = "senior";
    else if (idPart.includes("intern")) idPart = "intern";
    else if (idPart.includes("offer")) idPart = "offer";
    else if (idPart.includes("growth")) idPart = "growth";
    else if (idPart.includes("funnel")) idPart = "funnel";
    else if (idPart.includes("designer")) idPart = "designer";
    else if (idPart.includes("deck")) idPart = "deck_master";
    else if (idPart.includes("ceo") || idPart.includes("karan")) idPart = "ceo";

    const taskWithSkill = parts.slice(1).join(":").trim();
    
    const skillMatch = taskWithSkill.match(/\(SKILL:\s*([\w-]+)/i);
    const groupMatch = taskWithSkill.match(/GROUP:\s*([\w-]+)/i);
    const complexityMatch = taskWithSkill.match(/COMPLEXITY:\s*(fast|deep)/i);
    const reviewMatch = taskWithSkill.match(/REVIEW:\s*(yes|no)/i);
    const formatMatch = taskWithSkill.match(/FORMAT:\s*(html|markdown|text)/i);
    
    return { 
      agentId: idPart as any, 
      task: taskWithSkill.replace(/\(.*?\)/g, "").trim(),
      status: "pending", 
      skillId: skillMatch?.[1],
      group: groupMatch?.[1] || "A",
      complexity: (complexityMatch?.[1] || "deep") as "fast" | "deep",
      reviewRequired: reviewMatch?.[1] === "yes",
      outputFormat: (formatMatch?.[1] || "markdown") as any
    };
  });

  if (roadmap.length === 0) {
    roadmap = [{ agentId: "senior", task: state.task, status: "pending" }];
  }

  return {
    roadmap: roadmap.slice(0, 5),
    currentStepIndex: 0,
    activeDesignSystem,
    budget: { ...state.budget, spent: state.budget.spent + tokenCost },
    auditLog: [audit("ceo", `Roadmap created: ${roadmap.length} steps.`)],
    agentUpdates: [{ agentId: "ceo", newStatus: "working", actionLog: "Mission Roadmap Designed." }],
  };
}
