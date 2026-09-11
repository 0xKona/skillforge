import React from 'react';
import { Link, Text, View } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/styles';
import type {
    LayoutBlock,
    LayoutBody,
    LayoutHeading,
    LayoutNode,
    SectionLayout,
    TextSpan,
} from '@/lib/cv-layout';

type PdfStyles = typeof pdfStyles;

interface PdfLayoutProps {
    layout: SectionLayout;
    styles?: PdfStyles;
}

function PdfSpan({
    span,
    styles,
    textStyle,
}: {
    span: TextSpan;
    styles: PdfStyles;
    textStyle?: PdfStyles[keyof PdfStyles];
}) {
    if (span.href) {
        return (
            <Link src={span.href} style={styles.link}>
                <Text style={textStyle}>{span.text}</Text>
            </Link>
        );
    }
    return <Text style={textStyle}>{span.text}</Text>;
}

function PdfBody({ body, styles }: { body: LayoutBody; styles: PdfStyles }) {
    if (body.type === 'paragraph') {
        return <Text style={styles.description}>{body.text}</Text>;
    }

    return (
        <View style={{ marginTop: 2 }}>
            {body.items.map((line, index) => (
                <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletContent}>{line}</Text>
                </View>
            ))}
        </View>
    );
}

function PdfHeading({
    heading,
    styles,
}: {
    heading: LayoutHeading;
    styles: PdfStyles;
}) {
    const hasRow = Boolean(heading.title || heading.date);
    return (
        <>
            {hasRow && (
                <View style={styles.row}>
                    <View style={styles.leftColumn}>
                        {heading.title ? (
                            <Text style={styles.itemTitle}>
                                {heading.title}
                            </Text>
                        ) : null}
                    </View>
                    {heading.date ? (
                        <View style={styles.rightColumn}>
                            <Text style={styles.date}>{heading.date}</Text>
                        </View>
                    ) : null}
                </View>
            )}
            {heading.subtitle ? (
                <View style={styles.subtitleRow}>
                    <PdfSpan
                        span={heading.subtitle}
                        styles={styles}
                        textStyle={styles.itemSubtitle}
                    />
                </View>
            ) : null}
        </>
    );
}

function PdfBlockInner({
    block,
    styles,
}: {
    block: LayoutBlock;
    styles: PdfStyles;
}) {
    return (
        <View wrap={false}>
            <PdfHeading heading={block} styles={styles} />
            {block.body ? <PdfBody body={block.body} styles={styles} /> : null}
        </View>
    );
}

function PdfNode({ node, styles }: { node: LayoutNode; styles: PdfStyles }) {
    switch (node.type) {
        case 'header':
            return (
                <View style={styles.headerContainer}>
                    {node.name ? (
                        <Text style={styles.headerName}>{node.name}</Text>
                    ) : null}
                    {node.contacts.length > 0 ? (
                        <View style={styles.headerContact}>
                            {node.contacts.map((contact, index) => (
                                <View
                                    key={`${contact.text}-${index}`}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <PdfSpan span={contact} styles={styles} />
                                    {index < node.contacts.length - 1 ? (
                                        <Text style={styles.separator}>|</Text>
                                    ) : null}
                                </View>
                            ))}
                        </View>
                    ) : null}
                </View>
            );
        case 'block':
            return (
                <View style={styles.sectionBlock}>
                    <PdfBlockInner block={node} styles={styles} />
                </View>
            );
        case 'group':
            return (
                <View style={styles.sectionBlock}>
                    <View wrap={false}>
                        <PdfHeading heading={node.heading} styles={styles} />
                    </View>
                    {node.children.map((child, index) => (
                        <View
                            key={`${child.title ?? 'role'}-${index}`}
                            style={styles.groupChild}
                            wrap={false}
                        >
                            <PdfBlockInner block={child} styles={styles} />
                        </View>
                    ))}
                </View>
            );
        case 'labeledLine':
            return (
                <View style={styles.sectionBlock} wrap={false}>
                    <Text style={styles.description}>
                        <Text style={styles.itemTitle}>{node.label}: </Text>
                        <Text style={styles.regular}>{node.value}</Text>
                    </Text>
                </View>
            );
        default:
            return null;
    }
}

export function PdfLayout({ layout, styles = pdfStyles }: PdfLayoutProps) {
    return (
        <View>
            {layout.title ? (
                <Text style={styles.sectionTitle} minPresenceAhead={25}>
                    {layout.title}
                </Text>
            ) : null}
            {layout.nodes.map((node, index) => (
                <PdfNode
                    key={`${node.type}-${index}`}
                    node={node}
                    styles={styles}
                />
            ))}
        </View>
    );
}
