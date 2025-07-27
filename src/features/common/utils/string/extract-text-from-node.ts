/* eslint-disable @typescript-eslint/no-explicit-any */
import { isValidElement, ReactNode } from 'react';

export function extractText(node: ReactNode): string | undefined {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (isValidElement(node)) {
    return extractText((node.props as any).children);
  }
  return;
}
