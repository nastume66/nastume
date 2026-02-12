import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  const looksLikeHtml = /<\s*[a-z][\s\S]*>/i.test(content);

  if (looksLikeHtml) {
    return (
      <div
        className="prose max-w-none prose-zinc dark:prose-invert [&_a]:font-medium [&_a]:text-sky-600 [&_a]:underline [&_a]:decoration-sky-400 [&_a]:underline-offset-2 hover:[&_a]:text-sky-700 dark:[&_a]:text-sky-400 dark:[&_a]:decoration-sky-500 [&_img]:my-4 [&_img]:max-h-[420px] [&_img]:rounded-xl [&_img]:border [&_img]:border-zinc-200 [&_img]:object-contain dark:[&_img]:border-zinc-700"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="prose max-w-none prose-zinc dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => <h2 className="mt-6 text-xl font-semibold">{children}</h2>,
          p: ({ children }) => <p className="leading-8">{children}</p>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-sky-600 underline decoration-sky-400 underline-offset-2 hover:text-sky-700 dark:text-sky-400 dark:decoration-sky-500"
            >
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
