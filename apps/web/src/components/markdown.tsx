import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownComponent({ children }: { children: string }) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 mt-6 text-foreground">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-3 mt-5 text-foreground">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground">
                        {children}
                    </h3>
                ),
                h4: ({ children }) => (
                    <h4 className="text-lg font-medium mb-2 mt-3 text-foreground">
                        {children}
                    </h4>
                ),
                h5: ({ children }) => (
                    <h5 className="text-base font-medium mb-1 mt-2 text-foreground">
                        {children}
                    </h5>
                ),
                h6: ({ children }) => (
                    <h6 className="text-sm font-medium mb-1 mt-2 text-foreground">
                        {children}
                    </h6>
                ),
                p: ({ children }) => (
                    <p className="leading-relaxed text-foreground">
                        {children}
                    </p>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-foreground">
                        {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-foreground">
                        {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-border pl-4 my-3 italic text-muted-foreground">
                        {children}
                    </blockquote>
                ),
                code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                        return (
                            <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-3">
                                <code className="text-sm text-foreground">
                                    {children}
                                </code>
                            </pre>
                        );
                    }
                    return (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm text-foreground">
                            {children}
                        </code>
                    );
                },
                strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">
                        {children}
                    </strong>
                ),
                em: ({ children }) => (
                    <em className="italic text-foreground">{children}</em>
                ),
                a: ({ children, href }) => (
                    <a
                        href={href}
                        className="text-primary underline hover:text-primary/80 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                ),
                hr: () => <hr className="border-border my-6" />,
                // GitHub Flavored Markdown elements
                table: ({ children }) => (
                    <div className="overflow-hidden my-4 rounded-lg border border-border">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">{children}</table>
                        </div>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-muted">{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                    <tr className="border-b border-border last:border-b-0 hover:bg-muted/50">
                        {children}
                    </tr>
                ),
                th: ({ children }) => (
                    <th className="border-r border-border last:border-r-0 px-3 py-2 text-left font-semibold text-foreground first:rounded-tl-lg last:rounded-tr-lg">
                        {children}
                    </th>
                ),
                td: ({ children }) => (
                    <td className="border-r border-border last:border-r-0 px-3 py-2 text-foreground">
                        {children}
                    </td>
                ),
                del: ({ children }) => (
                    <del className="line-through text-muted-foreground">
                        {children}
                    </del>
                ),
                input: ({ type, checked, disabled }) => {
                    if (type === "checkbox") {
                        return (
                            <input
                                type="checkbox"
                                checked={checked}
                                disabled={disabled}
                                className="mr-2 accent-primary"
                                readOnly
                            />
                        );
                    }
                    return null;
                },
                // Footnotes
                sup: ({ children }) => (
                    <sup className="text-xs text-primary">{children}</sup>
                ),
            }}
        >
            {children}
        </Markdown>
    );
}
