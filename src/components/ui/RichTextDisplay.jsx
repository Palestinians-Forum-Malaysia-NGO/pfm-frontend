import React from "react";

const RichTextDisplay = ({ html, className = "" }) => {
  if (!html) return null;

  return (
    <div
      className={`prose prose-sm max-w-none text-slate-700
        prose-headings:font-semibold prose-headings:text-slate-900
        prose-p:leading-relaxed
        prose-a:text-green prose-a:underline hover:prose-a:text-green/80
        prose-ul:list-disc prose-ul:pl-4
        prose-ol:list-decimal prose-ol:pl-4
        prose-strong:font-semibold prose-strong:text-slate-900
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextDisplay;
