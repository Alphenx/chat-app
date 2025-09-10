/* eslint-disable @typescript-eslint/no-unused-vars */
import { cloneElement, Fragment, isValidElement, ReactNode } from 'react';

type Enrichment = {
  tag: string;
  wrapper: (children: ReactNode[]) => ReactNode;
};

// SUPPORTED ENRICHMENTS
// Add more enrichments as needed
// Ensure that the tag names are unique and do not conflict with HTML tags
const enrichments: Enrichment[] = [
  { tag: 'bold', wrapper: (text) => <strong>{text}</strong> },
  { tag: 'italic', wrapper: (text) => <em>{text}</em> },
  { tag: 'underline', wrapper: (text) => <u>{text}</u> },
];

const TAGS = enrichments.map((e) => e.tag).join('|');
const TAG_REGEX = new RegExp(`<(${TAGS})>([\\s\\S]*?)<\\/\\1>`, 'g');

const WRAPPER_MAP: Record<string, Enrichment['wrapper']> = {};
for (const { tag, wrapper } of enrichments) {
  WRAPPER_MAP[tag] = wrapper;
}

export function applyRichText(text: string): ReactNode[] {
  if (text.indexOf('<') === -1) {
    return [text]; // No tags, return as plain text
  }

  TAG_REGEX.lastIndex = 0;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = TAG_REGEX.exec(text))) {
    const [_, tag, inner] = match;
    const idx = match.index;

    if (idx > lastIndex) {
      nodes.push(<Fragment key={keyIndex++}>{text.slice(lastIndex, idx)}</Fragment>);
    }

    const children = applyRichText(inner);

    const wrap = WRAPPER_MAP[tag];
    const wrapped = wrap ? wrap(children) : children;

    if (isValidElement(wrapped)) {
      nodes.push(cloneElement(wrapped, { key: keyIndex++ }));
    } else {
      nodes.push(<Fragment key={keyIndex++}>{wrapped}</Fragment>);
    }

    lastIndex = TAG_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={keyIndex++}>{text.slice(lastIndex)}</Fragment>);
  }

  return nodes;
}
