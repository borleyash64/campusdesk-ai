import React from 'react';

export function formatChatMessage(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 my-2 space-y-1 text-slate-800">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInline = (lineText: string): React.ReactNode[] => {
    // Basic inline formatting: **bold**, *italic*, `code`, [link](url)
    const tokens: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(lineText)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(lineText.substring(lastIndex, match.index));
      }
      const matched = match[0];
      if (matched.startsWith('**') && matched.endsWith('**')) {
        tokens.push(
          <strong key={`b-${lastIndex}`} className="font-semibold text-slate-900">
            {matched.slice(2, -2)}
          </strong>
        );
      } else if (matched.startsWith('`') && matched.endsWith('`')) {
        tokens.push(
          <code key={`c-${lastIndex}`} className="px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-xs text-indigo-700">
            {matched.slice(1, -1)}
          </code>
        );
      } else if (matched.startsWith('[') && matched.includes('](')) {
        const linkText = matched.substring(1, matched.indexOf(']('));
        const linkUrl = matched.substring(matched.indexOf('](') + 2, matched.length - 1);
        tokens.push(
          <a
            key={`a-${lastIndex}`}
            href={linkUrl}
            target={linkUrl.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline font-medium"
          >
            {linkText}
          </a>
        );
      }
      lastIndex = match.index + matched.length;
    }

    if (lastIndex < lineText.length) {
      tokens.push(lineText.substring(lastIndex));
    }

    return tokens;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${index}`} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
          {parseInline(trimmed.substring(4))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={`h4-${index}`} className="text-sm font-bold text-slate-800 mt-2.5 mb-1 text-indigo-950">
          {parseInline(trimmed.substring(5))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('---')) {
      flushList();
      elements.push(<hr key={`hr-${index}`} className="my-3 border-slate-200" />);
      return;
    }

    // Bullet list items
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const content = trimmed.substring(2);
      listItems.push(
        <li key={`li-${index}`} className="text-sm text-slate-700 leading-relaxed">
          {parseInline(content)}
        </li>
      );
      return;
    }

    // Numbered list items: e.g. "1. "
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      flushList();
      elements.push(
        <div key={`ol-${index}`} className="flex items-start gap-2 text-sm text-slate-700 my-1">
          <span className="font-semibold text-indigo-600 shrink-0 w-5">{numMatch[1]}.</span>
          <span className="leading-relaxed">{parseInline(numMatch[2])}</span>
        </div>
      );
      return;
    }

    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-sm text-slate-700 leading-relaxed my-1.5">
        {parseInline(trimmed)}
      </p>
    );
  });

  flushList();
  return <div className="space-y-1">{elements}</div>;
}
