
import { BLUEPRINT_REGISTRY, Blueprint } from "./registry";

export * from "./registry";

/**
 * Returns a list of all available blueprints for the Designer Agent.
 */
export function getAllBlueprints(): Blueprint[] {
  return BLUEPRINT_REGISTRY;
}

/**
 * Returns a specific blueprint by its ID.
 */
export function getBlueprintById(id: string): Blueprint | undefined {
  return BLUEPRINT_REGISTRY.find(b => b.id === id);
}

/**
 * Suggests a blueprint based on the mission task.
 */
export function suggestBlueprint(task: string): Blueprint {
  const t = task.toLowerCase();
  
  if (t.includes("space") || t.includes("future") || t.includes("cinematic")) {
    return getBlueprintById("cinematic-space")!;
  }
  
  if (t.includes("portfolio") || t.includes("creative") || t.includes("jack")) {
    return getBlueprintById("jack-3d-creator")!;
  }
  
  if (t.includes("email") || t.includes("saas") || t.includes("app")) {
    return getBlueprintById("aura-email")!;
  }
  
  if (t.includes("minimal") || t.includes("clean") || t.includes("velorah")) {
    return getBlueprintById("minimalist-hero")!;
  }

  // Default to a versatile one
  return getBlueprintById("cinematic-space")!;
}
