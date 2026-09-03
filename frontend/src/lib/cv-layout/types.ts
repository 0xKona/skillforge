export interface TextSpan {
    text: string;
    href?: string;
}

export type LayoutBody =
    { type: 'paragraph'; text: string } | { type: 'bullets'; items: string[] };

export interface LayoutHeading {
    title?: string;
    date?: string;
    subtitle?: TextSpan;
}

export type LayoutBlock = LayoutHeading & {
    type: 'block';
    body?: LayoutBody;
};

export type LayoutNode =
    | { type: 'header'; name: string; contacts: TextSpan[] }
    | LayoutBlock
    | {
          type: 'group';
          heading: LayoutHeading;
          children: LayoutBlock[];
      }
    | { type: 'labeledLine'; label: string; value: string };

export interface SectionLayout {
    title: string | null;
    nodes: LayoutNode[];
}
