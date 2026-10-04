"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Shared Markdown renderer for both the admin preview and the public post page.
 * Styling is inline (Tailwind) so it does not depend on a typography plugin.
 */
export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5 leading-relaxed text-ink-soft", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="text-base sm:text-lg">{children}</p>,
          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-2 text-base sm:text-lg">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-2 text-base sm:text-lg">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ember underline underline-offset-2 hover:text-flare"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-ink">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-ember/40 pl-5 italic text-ink-soft">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded-md bg-ink/5 px-1.5 py-0.5 font-mono text-sm text-ink dark:bg-white/10">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl bg-ink/90 p-5 font-mono text-sm text-white dark:bg-black/50">
              {children}
            </pre>
          ),
          hr: () => <hr className="border-ink/10 dark:border-white/10" />,
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} className="rounded-2xl" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-ink/10 bg-cream px-3 py-2 text-left font-semibold text-ink dark:border-white/10 dark:bg-white/5">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-ink/10 px-3 py-2 dark:border-white/10">{children}</td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
