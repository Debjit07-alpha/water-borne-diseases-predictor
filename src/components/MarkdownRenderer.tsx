"use client";

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown-like formatting for chat messages
  const formatText = (text: string) => {
    return text
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks ```code```
      .replace(/```([\s\S]*?)```/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Inline code `code`
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  };

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
    />
  );
}