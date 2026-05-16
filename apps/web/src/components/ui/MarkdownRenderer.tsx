import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

// Dark theme for syntax highlighting (injected inline so no external CSS needed)
const HIGHLIGHT_STYLES = `
  .hljs { background: #0d1117; color: #e6edf3; border-radius: 8px; padding: 1rem; overflow-x: auto; font-size: 0.8rem; line-height: 1.6; }
  .hljs-keyword { color: #ff7b72; } .hljs-string { color: #a5d6ff; } .hljs-number { color: #79c0ff; }
  .hljs-comment { color: #8b949e; font-style: italic; } .hljs-function { color: #d2a8ff; }
  .hljs-title { color: #d2a8ff; } .hljs-params { color: #e6edf3; } .hljs-type { color: #ffa657; }
  .hljs-built_in { color: #ffa657; } .hljs-attr { color: #79c0ff; } .hljs-tag { color: #7ee787; }
  .hljs-variable { color: #ffa657; } .hljs-operator { color: #ff7b72; } .hljs-punctuation { color: #8b949e; }
  .hljs-literal { color: #79c0ff; } .hljs-meta { color: #79c0ff; } .hljs-selector-id { color: #79c0ff; }
  .hljs-selector-class { color: #7ee787; } .hljs-property { color: #79c0ff; }
`;

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HIGHLIGHT_STYLES }} />
      <div className="markdown-body text-[13px] leading-relaxed text-slate-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            // Headings
            h1: ({ children }) => (
              <h1 className="text-xl font-black text-white mb-4 mt-6 pb-2 border-b border-white/10 tracking-tight first:mt-0">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-base font-bold text-white mb-3 mt-5 first:mt-0">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-sm font-semibold text-slate-200 mb-2 mt-4 first:mt-0">
                {children}
              </h3>
            ),

            // Paragraph
            p: ({ children }) => (
              <p className="mb-3 text-slate-300 leading-relaxed last:mb-0">
                {children}
              </p>
            ),

            // Bold / Italic
            strong: ({ children }) => (
              <strong className="font-bold text-white">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic text-slate-200">{children}</em>
            ),

            // Lists
            ul: ({ children }) => (
              <ul className="mb-3 space-y-1 pl-4 list-none">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 space-y-1 pl-4 list-decimal marker:text-cyan-500">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-slate-300 flex gap-2 items-start">
                <span className="text-cyan-500 mt-[2px] shrink-0 select-none">▸</span>
                <span>{children}</span>
              </li>
            ),

            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-cyan-500/60 pl-4 my-3 bg-cyan-500/5 py-2 rounded-r-lg">
                <div className="text-slate-300 italic text-[12px]">{children}</div>
              </blockquote>
            ),

            // Horizontal rule
            hr: () => (
              <hr className="my-5 border-white/10" />
            ),

            // Code — inline
            code: ({ inline, className, children, ...props }: any) => {
              if (inline) {
                return (
                  <code className="bg-white/10 text-cyan-300 px-1.5 py-0.5 rounded text-[11px] font-mono">
                    {children}
                  </code>
                );
              }
              // Block code (handled by rehype-highlight via className)
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },

            // Code block wrapper
            pre: ({ children }) => (
              <pre className="my-3 rounded-lg overflow-hidden">
                {children}
              </pre>
            ),

            // Tables (GFM)
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full text-[12px] border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-white/5">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-white/5">
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className="hover:bg-white/[0.03] transition-colors">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-[0.15em] text-cyan-400/70">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-2.5 text-slate-300 align-top">
                {children}
              </td>
            ),

            // Links
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </>
  );
};
