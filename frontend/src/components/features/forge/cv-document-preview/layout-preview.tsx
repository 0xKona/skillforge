import type {
    LayoutBlock,
    LayoutBody,
    LayoutHeading,
    LayoutNode,
    SectionLayout,
    TextSpan,
} from '@/lib/cv-layout';
import { cn } from '@/lib/utils';

import { previewStyles } from './styles';

function HtmlSpan({ span, className }: { span: TextSpan; className?: string }) {
    if (span.href) {
        const external = /^https?:\/\//i.test(span.href);
        return (
            <a
                href={span.href}
                className={cn(className, 'underline')}
                {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
            >
                {span.text}
            </a>
        );
    }
    return <span className={className}>{span.text}</span>;
}

function HtmlBody({ body }: { body: LayoutBody }) {
    if (body.type === 'paragraph') {
        return <p className={previewStyles.description}>{body.text}</p>;
    }

    return (
        <>
            {body.items.map((line, index) => (
                <div key={index} className={previewStyles.bullet}>
                    <span className={previewStyles.bulletDot}>•</span>
                    <span className="flex-1">{line}</span>
                </div>
            ))}
        </>
    );
}

function HtmlHeading({ heading }: { heading: LayoutHeading }) {
    const hasRow = Boolean(heading.title || heading.date);
    return (
        <>
            {hasRow && (
                <div className={previewStyles.row}>
                    <div className="min-w-0 flex-1 pr-2">
                        {heading.title ? (
                            <span className={previewStyles.itemTitle}>
                                {heading.title}
                            </span>
                        ) : null}
                    </div>
                    {heading.date ? (
                        <div className={previewStyles.date}>{heading.date}</div>
                    ) : null}
                </div>
            )}
            {heading.subtitle ? (
                <p className={previewStyles.itemSubtitle}>
                    <HtmlSpan span={heading.subtitle} />
                </p>
            ) : null}
        </>
    );
}

function HtmlBlockInner({ block }: { block: LayoutBlock }) {
    return (
        <>
            <HtmlHeading heading={block} />
            {block.body ? <HtmlBody body={block.body} /> : null}
        </>
    );
}

function HtmlNode({ node }: { node: LayoutNode }) {
    switch (node.type) {
        case 'header':
            return (
                <div className="mb-5 text-center">
                    {node.name ? (
                        <h1 className={previewStyles.headerName}>
                            {node.name}
                        </h1>
                    ) : null}
                    {node.contacts.length > 0 ? (
                        <div className={previewStyles.headerContact}>
                            {node.contacts.map((contact, index) => (
                                <span
                                    key={`${contact.text}-${index}`}
                                    className="flex items-center gap-1"
                                >
                                    <HtmlSpan span={contact} />
                                    {index < node.contacts.length - 1 && (
                                        <span className="mx-1 text-black/60">
                                            |
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            );
        case 'block':
            return (
                <div className={previewStyles.sectionBlock}>
                    <HtmlBlockInner block={node} />
                </div>
            );
        case 'group':
            return (
                <div className={previewStyles.sectionBlock}>
                    <HtmlHeading heading={node.heading} />
                    {node.children.map((child, index) => (
                        <div
                            key={`${child.title ?? 'role'}-${index}`}
                            className="mt-2"
                        >
                            <HtmlBlockInner block={child} />
                        </div>
                    ))}
                </div>
            );
        case 'labeledLine':
            return (
                <div className={previewStyles.sectionBlock}>
                    <p className={previewStyles.description}>
                        <span className={previewStyles.itemTitle}>
                            {node.label}:{' '}
                        </span>
                        {node.value}
                    </p>
                </div>
            );
        default:
            return null;
    }
}

export function LayoutPreview({ layout }: { layout: SectionLayout }) {
    return (
        <section className="mt-4 first:mt-0">
            {layout.title ? (
                <h2 className={previewStyles.sectionTitle}>{layout.title}</h2>
            ) : null}
            {layout.nodes.map((node, index) => (
                <HtmlNode key={`${node.type}-${index}`} node={node} />
            ))}
        </section>
    );
}
