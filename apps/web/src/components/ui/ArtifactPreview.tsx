
import React, { useEffect, useState, useRef } from 'react';
import { createArtifactBlobUrl, revokeArtifactBlobUrl, ARTIFACT_CSP } from '../../lib/artifact-sandbox';

interface ArtifactPreviewProps {
  content: string;
  type?: 'html' | 'markdown' | 'text';
  onClose?: () => void;
}

export const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({ content, type = 'html', onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (type === 'html' && content) {
      // Basic check if it's actually HTML, if not wrap it
      const isFullHtml = content.toLowerCase().includes('<html') || content.toLowerCase().includes('<!doctype');
      const htmlToRender = isFullHtml ? content : `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; line-height: 1.6; color: #333; background: #fff; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `;
      
      const url = createArtifactBlobUrl(htmlToRender);
      setBlobUrl(url);

      return () => {
        revokeArtifactBlobUrl(url);
      };
    }
  }, [content, type]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider ml-2">
            Artifact Preview — {type}
          </span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-1 bg-white relative">
        {type === 'html' && blobUrl ? (
          <iframe
            ref={iframeRef}
            src={blobUrl}
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
            csp={ARTIFACT_CSP}
            title="Artifact Preview"
            className="w-full h-full border-none"
          />
        ) : (
          <div className="p-8 overflow-auto h-full text-slate-800">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
