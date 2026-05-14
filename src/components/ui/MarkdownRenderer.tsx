
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple rendering for now, could be enhanced with react-markdown later
  return (
    <div className="prose prose-invert max-w-none prose-sm prose-slate">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 text-white border-b border-slate-700 pb-2">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-semibold mb-3 text-slate-200">{line.slice(3)}</h2>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-slate-300">{line.slice(2)}</li>;
        if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mb-2 text-white">{line.slice(2, -2)}</p>;
        return <p key={i} className="mb-3 text-slate-400 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};
