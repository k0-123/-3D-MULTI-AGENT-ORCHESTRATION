
/**
 * Utility to create a sandboxed blob URL for HTML/CSS/JS artifacts.
 * This prevents the artifact from accessing the main window's cookies or DOM.
 */
export function createArtifactBlobUrl(html: string): string {
  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
}

export function revokeArtifactBlobUrl(url: string) {
  URL.revokeObjectURL(url);
}

export const ARTIFACT_CSP = "default-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com https://fonts.gstatic.com; img-src * data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;";
