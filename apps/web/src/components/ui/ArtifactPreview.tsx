
import React, { useEffect, useState, useRef } from 'react';
import { createArtifactBlobUrl, revokeArtifactBlobUrl, ARTIFACT_CSP } from '../../lib/artifact-sandbox';

interface ArtifactPreviewProps {
  content: string;
  type?: 'html' | 'markdown' | 'text';
  onClose?: () => void;
}

export const ArtifactPreview: React.FC<ArtifactPreviewProps> = ({ content, type = 'html', onClose }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState<Array<{ time: string; text: string; type: 'info' | 'warn' | 'error' }>>([
    { time: new Date().toLocaleTimeString(), text: 'Artifact sandbox initialized successfully.', type: 'info' },
    { time: new Date().toLocaleTimeString(), text: 'CDN scripts and Google Fonts loaded.', type: 'info' }
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (type === 'html' && content) {
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

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return 'w-[375px] h-[667px] shadow-2xl border border-slate-300 rounded-[2.5rem] my-auto';
      case 'tablet': return 'w-[768px] h-[1024px] shadow-2xl border border-slate-300 rounded-[2rem] my-auto';
      default: return 'w-full h-full border-none';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-2">
            Artifact Preview — {type}
          </span>
        </div>

        {type === 'html' && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewport === 'desktop' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewport === 'tablet' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${viewport === 'mobile' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Mobile
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`px-3 py-1 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${showConsole ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Logs ({logs.length})
            </button>
          </div>
        )}

        {onClose && (
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="flex-1 bg-slate-950/50 relative flex items-center justify-center overflow-auto">
        {type === 'html' && blobUrl ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <iframe
              ref={iframeRef}
              src={blobUrl}
              sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
              csp={ARTIFACT_CSP}
              title="Artifact Preview"
              className={`transition-all duration-300 bg-white ${getViewportWidth()}`}
            />
          </div>
        ) : (
          <div className="p-8 overflow-auto h-full w-full text-slate-200 bg-slate-900/50 font-mono text-sm leading-relaxed">
            <pre className="whitespace-pre-wrap">
              {content}
            </pre>
          </div>
        )}

        {showConsole && (
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-slate-950 border-t border-slate-800 flex flex-col shadow-2xl z-50 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Sandbox Console Logs</span>
              <button onClick={() => setShowConsole(false)} className="hover:text-slate-200">
                Close
              </button>
            </div>
            <div className="flex-1 p-3 overflow-auto font-mono text-xs space-y-1.5">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="text-slate-600 select-none">{log.time}</span>
                  <span className={log.type === 'error' ? 'text-red-400 font-medium' : log.type === 'warn' ? 'text-yellow-400' : 'text-slate-300'}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

