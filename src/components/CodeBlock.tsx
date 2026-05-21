import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'tsx' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Custom simple highlighter for TSX/JS
  const highlightCode = (rawCode: string) => {
    // 1. Escape HTML entities
    let html = rawCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Identify and temporarily hide comments (so they don't get inner highlighted)
    const commentPlaceholder = '___COMMENT_PLACEHOLDER_';
    const comments: string[] = [];
    
    // Line comments: // ...
    html = html.replace(/(\/\/.*)/g, (match) => {
      comments.push(match);
      return `${commentPlaceholder}${comments.length - 1}___`;
    });

    // 3. Highlight Strings (double, single, backtick quotes)
    html = html.replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-600 dark:text-emerald-400">$1$2$1</span>');

    // 4. Highlight Keywords
    const keywords = [
      'import', 'export', 'default', 'const', 'let', 'var', 'function', 'return',
      'class', 'extends', 'interface', 'type', 'async', 'await', 'try', 'catch',
      'if', 'else', 'switch', 'case', 'from', 'as', 'new', 'throw', 'true', 'false',
      'null', 'undefined', 'void', 'typeof', 'instanceof', 'boolean', 'string', 'number'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    html = html.replace(keywordRegex, '<span class="text-indigo-600 dark:text-indigo-400 font-semibold">$1</span>');

    // 5. Highlight React Hooks
    const hooks = [
      'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useReducer',
      'useContext', 'useTransition', 'useDeferredValue', 'useLayoutEffect'
    ];
    const hooksRegex = new RegExp(`\\b(${hooks.join('|')})\\b`, 'g');
    html = html.replace(hooksRegex, '<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>');

    // 6. Highlight Function calls
    html = html.replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="text-sky-600 dark:text-sky-400">$1</span>');

    // 7. Highlight JSX Tags (opening tags: &lt;div, closing tags: &lt;/div&gt;, fragments: &lt;&gt;)
    html = html.replace(/&lt;([a-zA-Z0-9]+)/g, '&lt;<span class="text-rose-600 dark:text-rose-400 font-medium">$1</span>');
    html = html.replace(/&lt;\/([a-zA-Z0-9]+)&gt;/g, '&lt;/<span class="text-rose-600 dark:text-rose-400 font-medium">$1</span>&gt;');
    html = html.replace(/&lt;&gt;/g, '&lt;<span class="text-rose-600 dark:text-rose-400">&lt;&gt;</span>');
    html = html.replace(/&lt;\/&gt;/g, '&lt;/<span class="text-rose-600 dark:text-rose-400">&gt;</span>');

    // 8. Restore comments and wrap them in a comment class
    html = html.replace(/___COMMENT_PLACEHOLDER_(\d+)___/g, (_, idx) => {
      const originalComment = comments[Number(idx)];
      return `<span class="text-zinc-400 dark:text-zinc-500 font-normal italic">${originalComment}</span>`;
    });

    return html;
  };

  return (
    <div className="relative group border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50 shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-mono tracking-wider text-zinc-500 select-none">
        <span>{language.toUpperCase()}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors py-1 px-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-900"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-600 dark:text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-100 select-text">
        <pre className="whitespace-pre overflow-x-auto" dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </div>
    </div>
  );
};
