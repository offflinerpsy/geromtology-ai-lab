"use client";

import Link from './research-link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {NavigationMenu} from 'radix-ui';
import {Menu} from 'lucide-react';
import {Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger} from '@/components/ui/sheet';

const groups = [
  {
    label: 'Health check-ins', href: '/tools/check-ins', title: 'Make space for a check-in.',
    description: 'A few questions to help you describe how you feel. Private, and at your own pace.',
    action: 'See all 11 check-ins',
    links: [
      ['Mood', '/tools/check-ins/mood', 'Reflect on the past two weeks.'],
      ['Anxiety', '/tools/check-ins/anxiety', 'Put worries into words.'],
      ['Sleep', '/tools/check-ins/sleep', 'Look at your rest and routine.'],
      ['Muscle function', '/tools/check-ins/muscle-function', 'Consider strength in everyday life.'],
    ],
  },
  {
    label: 'Research tools', href: '/tools', title: 'A question. A method. A clearer view.',
    description: 'Choose the tool that fits your research question, with its assumptions in view.',
    action: 'Explore all tools',
    links: [
      ['PhenoAge Explorer', '/tools/phenoage', 'Explore a published clinical age model.'],
      ['Study Planner', '/tools/study-planner', 'Work through sample-size assumptions.'],
      ['Evidence Copilot', '/laboratory/ask', 'Ask a focused question with sources.'],
      ['Measurement methods', '/laboratory/biomarkers', 'Understand what each measure captures.'],
    ],
  },
  {
    label: 'About', href: '/about', title: 'Software for a longer view.',
    description: 'Meet the project, understand its scientific context and see what comes next.',
    action: 'About ProAge Atlas',
    links: [
      ['Product roadmap', '/roadmap', 'What works today. What we are building.'],
      ['People & institute', '/people', 'The people and their distinct roles.'],
      ['For investors', '/investors', 'Our product thesis and direction.'],
      ['Contact', '/contact', 'Research, collaboration and enquiries.'],
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState('');
  const current = (href: string) => href === '/tools'
    ? pathname.startsWith('/tools') && !pathname.startsWith('/tools/check-ins')
    : pathname === href || pathname.startsWith(href + '/');
  const groupItem = (group: typeof groups[number]) => <NavigationMenu.Item value={group.href} key={group.href}>
    <NavigationMenu.Trigger className="atlas-nav-text" data-current={current(group.href) || group.links.some(([,href]) => current(href))}>
      <span>{group.label}</span><i className="nav-disclosure" aria-hidden="true"/>
    </NavigationMenu.Trigger>
    <NavigationMenu.Content className="atlas-mega-content">
      <div className="atlas-mega-intro"><p>{group.title}</p><span>{group.description}</span><NavigationMenu.Link asChild><Link href={group.href} className="mega-all">{group.action}</Link></NavigationMenu.Link></div>
      <div className="atlas-mega-links">{group.links.map(([label, href, description]) => <NavigationMenu.Link key={href} asChild active={current(href)}><Link href={href}><strong>{label}</strong><span>{description}</span></Link></NavigationMenu.Link>)}</div>
    </NavigationMenu.Content>
  </NavigationMenu.Item>;

  return <header className={`site-header shared-header ${pathname === '/' ? 'header-home' : ''}`} data-menu-open={Boolean(menu)}>
    <Link className="wordmark" href="/" aria-label="ProAge Atlas home"><span className="brand-symbol" aria-hidden="true">a</span><span>ProAge <em>Atlas</em><small>Research for healthy aging</small></span></Link>
    <NavigationMenu.Root className="atlas-navigation" aria-label="Main navigation" value={menu} onValueChange={setMenu} delayDuration={160} skipDelayDuration={250}>
      <NavigationMenu.List className="atlas-nav-list">
        {groupItem(groups[0])}{groupItem(groups[1])}
        <NavigationMenu.Item><NavigationMenu.Link asChild active={current('/laboratory/evidence')}><Link className="atlas-nav-text" href="/laboratory/evidence" aria-current={current('/laboratory/evidence') ? 'page' : undefined}><span>Evidence</span></Link></NavigationMenu.Link></NavigationMenu.Item>
        {groupItem(groups[2])}
      </NavigationMenu.List>
      <div className="atlas-mega-position"><NavigationMenu.Viewport className="atlas-mega-viewport"/></div>
    </NavigationMenu.Root>
    <Link className="header-contact header-laboratory" href="/laboratory/ask" aria-current={pathname === '/laboratory/ask' ? 'page' : undefined}>Ask AI</Link>
    <Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation"><span>Menu</span><Menu size={20}/></SheetTrigger><SheetContent className="mobile-sheet" side="right"><SheetTitle className="mobile-sheet-title">ProAge Atlas</SheetTitle><SheetDescription className="sr-only">Research tools, private health check-ins, evidence and the project.</SheetDescription><nav className="mobile-atlas-navigation" aria-label="Mobile navigation">
      <Link className="mobile-main-action" href="/laboratory/ask" onClick={() => setOpen(false)}>Ask AI</Link>
      {groups.map(group => <details className="mobile-nav-group" key={group.href}><summary>{group.label}<span aria-hidden="true">+</span></summary><Link href={group.href} onClick={() => setOpen(false)}>{group.action}</Link>{group.links.map(([label, href]) => <Link key={href} href={href} aria-current={current(href) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}</details>)}
      <Link className="mobile-evidence-link" href="/laboratory/evidence" onClick={() => setOpen(false)}>Evidence library</Link>
    </nav></SheetContent></Sheet>
    <noscript><nav className="header-nojs" aria-label="Navigation without JavaScript"><Link href="/tools/check-ins">Health check-ins</Link><Link href="/tools">Research tools</Link><Link href="/laboratory/evidence">Evidence</Link><Link href="/about">About</Link><Link href="/laboratory/ask">Ask AI</Link></nav></noscript>
  </header>;
}
