import { IDENTITY_CHARTER } from "./identity";
import { loadSkill, stripFrontmatter } from "../lib/skills/loader";
import { parseDesignMd } from "../lib/design-systems/parser";
import { readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface PromptLayers {
  designSystemId?: string;
  skillId?: string;
  agentPersona: string;
  taskContext: string;
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
      const dsPath = join(__dirname, "..", "lib", "design-systems", layers.designSystemId, "DESIGN.md");
      const dsMd = await readFile(dsPath, "utf-8");
      const tokens = parseDesignMd(dsMd);
      
      stack.push("--- LAYER 2: DESIGN SYSTEM TOKENS ---");
      stack.push(`Use the following brand tokens for this mission:`);
      stack.push(JSON.stringify(tokens, null, 2));
    } catch (e) {
      console.warn(`[Composer] Failed to load design system: \${layers.designSystemId}`);
    }
  }

  // Layer 3: Skill (if selected)
  if (layers.skillId) {
    const skillMd = await loadSkill(layers.skillId);
    if (skillMd) {
      stack.push("--- LAYER 3: SKILL-SPECIFIC INSTRUCTIONS ---");
      stack.push(stripFrontmatter(skillMd));
    }
  }

  // Layer 4: Agent Persona
  stack.push("--- LAYER 4: AGENT PERSONA ---");
  stack.push(layers.agentPersona);

  // Layer 5: Task Context
  stack.push("--- LAYER 5: TASK CONTEXT ---");
  stack.push(layers.taskContext);

  return stack.join("\n\n");
}
