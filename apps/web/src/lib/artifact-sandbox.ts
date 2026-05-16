
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

export const ARTIFACT_CSP = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://* http://*; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://* http://*; style-src 'self' 'unsafe-inline' https://* http://*; img-src * data: blob:; media-src * data: blob:; font-src 'self' https://* http://*; connect-src *;";
