import { IDENTITY_CHARTER } from "./identity";
import { loadSkill, stripFrontmatter } from "@repo/skills";
import { parseDesignMd, DESIGN_SYSTEMS } from "@repo/design-systems";
import { getAllBlueprints } from "../blueprints";

export interface PromptLayers {
  designSystemId?: string;
  skillId?: string;
  agentPersona: string;
  taskContext: string;
  includeBlueprints?: boolean;
}

/**
 * Composites multiple prompt layers into a single system instruction.
 */
export async function composePromptStack(layers: PromptLayers): Promise<string> {
  const stack = [];

  // Layer 1: Identity (Quality Charter)
  stack.push("--- LAYER 1: QUALITY CHARTER ---");
  stack.push(IDENTITY_CHARTER);

  // Layer 2: Design System (if selected)
  if (layers.designSystemId) {
    try {
      const dsMd = DESIGN_SYSTEMS[layers.designSystemId];
      if (dsMd) {
        const tokens = parseDesignMd(dsMd);
        
        stack.push("--- LAYER 2: DESIGN SYSTEM TOKENS ---");
        stack.push(`Use the following brand tokens for this mission:`);
        stack.push(JSON.stringify(tokens, null, 2));
      }
    } catch (e) {
      console.warn(`[Composer] Failed to load design system: ${layers.designSystemId}`);
    }
  }

  // Layer 3: Skill (if selected)
  if (layers.skillId) {
    try {
      const skillMd = await loadSkill(layers.skillId);
      if (skillMd) {
        stack.push("--- LAYER 3: SKILL-SPECIFIC INSTRUCTIONS ---");
        stack.push(stripFrontmatter(skillMd));
      }
    } catch (e) {
      console.warn(`[Composer] Failed to load skill: ${layers.skillId}`);
    }
  }

  // Layer 4: Blueprint Library (NEW)
  if (layers.includeBlueprints) {
    const blueprints = getAllBlueprints();
    stack.push("--- LAYER 4: PREMIUM DESIGN BLUEPRINTS ---");
    stack.push("You have access to the following high-end design blueprints. SELECT ONE that fits the mission best.");
    stack.push(blueprints.map(b => `- ${b.id}: ${b.name} (${b.description})`).join("\n"));
    stack.push("\nYour goal is to ADAPT the selected blueprint to the user's specific mission data.");
  }

  // Layer 5: Agent Persona
  stack.push("--- LAYER 5: AGENT PERSONA ---");
  stack.push(layers.agentPersona);

  // Layer 6: Task Context
  stack.push("--- LAYER 6: TASK CONTEXT ---");
  stack.push(layers.taskContext);

  return stack.join("\n\n");
}
