
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
  
  if (t.includes("web3") || t.includes("crypto") || t.includes("protocol") || t.includes("nft") || t.includes("defi")) {
    return getBlueprintById("web3-immersive")!;
  }

  if (t.includes("bento") || t.includes("grid") || t.includes("dashboard") || t.includes("analytics") || t.includes("saas")) {
    return getBlueprintById("saas-bento-grid")!;
  }

  if (t.includes("ecommerce") || t.includes("store") || t.includes("shop") || t.includes("lookbook") || t.includes("fashion") || t.includes("luxury")) {
    return getBlueprintById("ecommerce-lookbook")!;
  }

  if (t.includes("editorial") || t.includes("magazine") || t.includes("blog") || t.includes("article") || t.includes("news") || t.includes("serif")) {
    return getBlueprintById("editorial-magazine")!;
  }
  
  if (t.includes("space") || t.includes("future") || t.includes("cinematic") || t.includes("mars")) {
    return getBlueprintById("cinematic-space")!;
  }
  
  if (t.includes("portfolio") || t.includes("creative") || t.includes("agency") || t.includes("jack") || t.includes("studio")) {
    return getBlueprintById("jack-3d-creator")!;
  }
  
  if (t.includes("email") || t.includes("client") || t.includes("app") || t.includes("inbox")) {
    return getBlueprintById("aura-email")!;
  }
  
  if (t.includes("minimal") || t.includes("clean") || t.includes("velorah") || t.includes("simple")) {
    return getBlueprintById("minimalist-hero")!;
  }

  // Default fallback
  return getBlueprintById("cinematic-space")!;
}
