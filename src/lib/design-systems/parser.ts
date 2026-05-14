export interface DesignTokens {
  colors: Record<string, string>;
  typography: {
    fontFamily: string;
    monoFamily: string;
    hierarchy: Record<string, any>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

export function parseDesignMd(content: string): DesignTokens {
  const tokens: DesignTokens = {
    colors: {},
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
      monoFamily: "monospace",
      hierarchy: {},
    },
    spacing: {},
    borderRadius: {},
    shadows: {},
  };

  // Basic regex-based parsing for colors
  const colorMatches = content.matchAll(/-\s*\*\*([^*]+)\*\*\s*\(`?#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})`?\)/g);
  for (const match of colorMatches) {
    const name = match[1].trim().toLowerCase().replace(/\s+/g, "-");
    const hex = `#${match[2]}`;
    tokens.colors[name] = hex;
  }

  // Also catch direct hex codes in specific sections
  const hexMatches = content.matchAll(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
  let hexCount = 0;
  for (const match of hexMatches) {
    if (hexCount < 20) { // Limit to first few colors if not found in list
      const hex = `#${match[1]}`;
      const name = `color-${hexCount++}`;
      if (!Object.values(tokens.colors).includes(hex)) {
        tokens.colors[name] = hex;
      }
    }
  }

  // Shadow extraction
  const shadowMatches = content.matchAll(/rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)\s*[^,;|\r\n]+/g);
  let shadowCount = 0;
  for (const match of shadowMatches) {
    const shadow = match[0].trim();
    tokens.shadows[`shadow-${shadowCount++}`] = shadow;
  }

  return tokens;
}

export function tokensToCssVars(tokens: DesignTokens): Record<string, string> {
  const vars: Record<string, string> = {};

  Object.entries(tokens.colors).forEach(([name, value]) => {
    vars[`--od-${name}`] = value;
  });

  // Smart mapping
  const findColor = (keywords: string[]) => {
    const entry = Object.entries(tokens.colors).find(([name]) => 
      keywords.some(k => name.includes(k))
    );
    return entry ? entry[1] : null;
  };

  const primary = findColor(["primary", "brand", "purple", "blue", "accent"]);
  const background = findColor(["background", "bg", "white", "page"]);
  const foreground = findColor(["foreground", "text", "heading", "navy", "black"]);
  const border = findColor(["border", "separator", "stroke"]);

  if (primary) {
    vars["--primary"] = primary;
    vars["--sidebar-primary"] = primary;
    vars["--ring"] = primary;
  }
  if (background) {
    vars["--background"] = background;
    vars["--card"] = background;
    vars["--sidebar"] = background;
  }
  if (foreground) {
    vars["--foreground"] = foreground;
    vars["--card-foreground"] = foreground;
    vars["--sidebar-foreground"] = foreground;
  }
  if (border) {
    vars["--border"] = border;
    vars["--sidebar-border"] = border;
  }

  return vars;
}
