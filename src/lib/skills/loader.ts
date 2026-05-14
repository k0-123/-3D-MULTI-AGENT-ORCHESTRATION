import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Loads a skill's markdown content by its ID.
 * @param skillId The directory name of the skill in src/lib/skills/
 * @returns The full markdown content of the skill
 */
export async function loadSkill(skillId: string): Promise<string> {
  try {
    // In a production build with TanStack Start/Wrangler, 
    // these files should be in the public or assets directory.
    // For now, we assume we can read them from the local filesystem.
    const skillPath = join(process.cwd(), "src", "lib", "skills", skillId, "SKILL.md");
    const content = await readFile(skillPath, "utf-8");
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
