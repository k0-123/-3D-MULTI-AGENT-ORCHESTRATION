import { create } from "zustand";
import { parseDesignMd, DesignTokens, tokensToCssVars } from "../lib/design-systems/parser";

interface DesignStore {
  activeSystem: string;
  tokens: DesignTokens | null;
  systems: string[];
  setSystem: (systemId: string) => Promise<void>;
  loadSystems: () => Promise<void>;
}

export const useDesignStore = create<DesignStore>((set, get) => ({
  activeSystem: "default",
  tokens: null,
  systems: ["default", "stripe", "linear", "vercel", "apple"], // Initial list, will be populated by loadSystems

  setSystem: async (systemId) => {
    try {
      const response = await fetch(`/design-systems/${systemId}/DESIGN.md`);
      console.log(`[DesignStore] Fetching system: ${systemId}`, response.status);
      if (!response.ok) throw new Error(`Failed to load design system: ${response.statusText}`);
      
      const content = await response.text();
      console.log(`[DesignStore] Parsed content length: ${content.length}`);
      const tokens = parseDesignMd(content);
      console.log(`[DesignStore] Tokens extracted:`, Object.keys(tokens.colors).length, "colors");
      
      // Apply CSS variables to root
      const vars = tokensToCssVars(tokens);
      Object.entries(vars).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
      console.log(`[DesignStore] CSS variables applied to root`);

      set({ activeSystem: systemId, tokens });
    } catch (err) {
      console.error("Error setting design system:", err);
    }
  },

  loadSystems: async () => {
    // This would ideally crawl the directory, but for now we'll hardcode some popular ones
    // or fetch a manifest.
    set({ systems: ["stripe", "linear-app", "vercel", "apple", "airbnb", "github", "discord", "notion"] });
  }
}));
