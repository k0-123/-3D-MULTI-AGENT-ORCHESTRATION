/**
 * HTML generation prompt template for Phase 3: Live Website Preview
 * Used when outputFormat === "html" is assigned to a step.
 */

export interface DesignTokens {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  systemName?: string;
}

/**
 * Default tokens — used when no design system is selected.
 * Clean, professional, dark-mode-friendly.
 */
export const DEFAULT_TOKENS: DesignTokens = {
  primaryColor: "#6366f1",
  backgroundColor: "#0f172a",
  textColor: "#f1f5f9",
  accentColor: "#22d3ee",
  fontFamily: "Inter",
  borderRadius: "12px",
  systemName: "Default",
};

/**
 * Design system token map — maps design system IDs to brand tokens.
 * CEO picks a system, these tokens flow into the HTML prompt.
 */
export const DS_TOKENS: Record<string, DesignTokens> = {
  stripe: {
    primaryColor: "#635BFF",
    backgroundColor: "#0A2540",
    textColor: "#F6F9FC",
    accentColor: "#00D4FF",
    fontFamily: "Inter",
    borderRadius: "8px",
    systemName: "Stripe",
  },
  linear: {
    primaryColor: "#5E6AD2",
    backgroundColor: "#0F111A",
    textColor: "#E8E8F0",
    accentColor: "#A78BFA",
    fontFamily: "Inter",
    borderRadius: "6px",
    systemName: "Linear",
  },
  apple: {
    primaryColor: "#0071E3",
    backgroundColor: "#FFFFFF",
    textColor: "#1D1D1F",
    accentColor: "#34C759",
    fontFamily: "SF Pro Display, -apple-system, sans-serif",
    borderRadius: "14px",
    systemName: "Apple",
  },
  notion: {
    primaryColor: "#000000",
    backgroundColor: "#FFFFFF",
    textColor: "#37352F",
    accentColor: "#EB5757",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    borderRadius: "4px",
    systemName: "Notion",
  },
  vercel: {
    primaryColor: "#FFFFFF",
    backgroundColor: "#000000",
    textColor: "#EDEDED",
    accentColor: "#888888",
    fontFamily: "Geist, Inter, sans-serif",
    borderRadius: "8px",
    systemName: "Vercel",
  },
  shadcn: {
    primaryColor: "#18181B",
    backgroundColor: "#09090B",
    textColor: "#FAFAFA",
    accentColor: "#A1A1AA",
    fontFamily: "Inter, sans-serif",
    borderRadius: "6px",
    systemName: "shadcn/ui",
  },
};

/**
 * Returns the design tokens for a given design system ID.
 * Falls back to DEFAULT_TOKENS if not found.
 */
export function getTokensForSystem(dsId?: string | null): DesignTokens {
  if (!dsId) return DEFAULT_TOKENS;
  return DS_TOKENS[dsId.toLowerCase()] ?? DEFAULT_TOKENS;
}

/**
 * Builds the HTML generation prompt.
 * Injected into the worker's system prompt when outputFormat === "html".
 */
export function getHtmlPrompt(tokens: DesignTokens, taskDescription: string): string {
  return `You are building a LIVE, INTERACTIVE web page. Your output must be a COMPLETE, SELF-CONTAINED HTML document.

TASK: ${taskDescription}

DESIGN TOKENS (use these EXACTLY):
- Primary Color: ${tokens.primaryColor}
- Background Color: ${tokens.backgroundColor}
- Text Color: ${tokens.textColor}
- Accent Color: ${tokens.accentColor}
- Font: ${tokens.fontFamily} (load from Google Fonts CDN if not a system font)
- Border Radius: ${tokens.borderRadius}
- Design System: ${tokens.systemName}

CRITICAL REQUIREMENTS:
1. Start with EXACTLY: <!DOCTYPE html>
2. All CSS in <style> tags — no external CSS files
3. All JavaScript in <script> tags — no external JS files
4. Load Google Fonts via: <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
5. Include <meta name="viewport" content="width=device-width, initial-scale=1">
6. Must be FULLY FUNCTIONAL when opened standalone in a browser
7. Use the design tokens for ALL colors, fonts, and spacing
8. Make it BEAUTIFUL — this is a professional deliverable, not a demo

QUALITY BAR:
- Smooth hover transitions (0.2s ease)
- Subtle shadows and depth
- Responsive layout (works on mobile)
- Minimum 3 sections of content
- Real, meaningful content — not lorem ipsum

FORBIDDEN:
- Do NOT use any external CDN for CSS frameworks (no Tailwind CDN, no Bootstrap CDN)
- Do NOT reference any local files
- Do NOT output anything before <!DOCTYPE html> or after </html>
- Do NOT wrap in markdown code fences

OUTPUT FORMAT:
Respond with EXACTLY this format:
ACTION: [one sentence describing the page you built]
RESULT:
<!DOCTYPE html>
<html lang="en">
...complete page...
</html>`;
}
