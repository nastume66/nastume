import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose max-w-none prose-zinc dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold">{children}</h2>,
          p: ({ children }) => <p className="leading-8">{children}</p>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-amber-700 underline dark:text-amber-400">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src || ""} alt={alt || ""} className="my-4 max-h-[420px] rounded-xl border border-zinc-200 object-contain dark:border-zinc-700" />
          ),
          code: ({ children }) => <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">{children}</code>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
