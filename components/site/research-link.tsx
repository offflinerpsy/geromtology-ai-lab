import type { ComponentPropsWithRef } from 'react';
type Props = Omit<ComponentPropsWithRef<'a'>, 'href'> & { href: string };
/** Native document navigation gives every route the same reliable global shell. */
export function DocumentLink(props: Props) { return <a {...props}/>; }
export default function ResearchLink(props: Props) { return <DocumentLink {...props}/>; }
