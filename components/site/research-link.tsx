import type { ComponentPropsWithRef } from 'react';
import NextLink from 'next/link';

type Props = Omit<ComponentPropsWithRef<'a'>, 'href'> & { href: string };

/** A document transition reinitializes the laboratory's independent motion scene. */
export function DocumentLink(props: Props) {
  return <a {...props} />;
}

/** Keep Atlas entry points independent of the client router and its prefetch cache. */
export default function ResearchLink({ href, ...props }: Props) {
  if (/^\/(?:laboratory|tools)(?:\/|[?#]|$)/.test(href)) {
    return <DocumentLink href={href} {...props} />;
  }
  return <NextLink href={href} {...props} />;
}
