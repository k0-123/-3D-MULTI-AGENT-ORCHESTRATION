import { SKILL_REGISTRY } from "./index";

/**
 * Loads a skill's markdown content by its ID.
 * @param skillId The directory name of the skill
 * @returns The full markdown content of the skill
 */
export async function loadSkill(skillId: string): Promise<string> {
  try {
    const content = SKILL_REGISTRY[skillId];
    if (!content) {
      throw new Error(`Skill ${skillId} not found in registry`);
    }
    return content;
  } catch (error) {
    console.error(`[SkillsLoader] Failed to load skill: ${skillId}`, error);
    return "";
  }
}

/**
 * Strips frontmatter from a skill markdown string.
 */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\n*/, "");
}
