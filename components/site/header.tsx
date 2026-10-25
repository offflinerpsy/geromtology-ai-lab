"use client";
import Link from './research-link';
import {usePathname} from 'next/navigation';
import {useState} from 'react';
import {Menu} from 'lucide-react';
import {Sheet,SheetContent,SheetTitle,SheetDescription,SheetTrigger} from '@/components/ui/sheet';
const links=[['Health check-ins','/tools/check-ins'],['Research tools','/tools'],['Evidence','/laboratory/evidence'],['About','/about']];
export default function Header(){
  const pathname=usePathname();const [open,setOpen]=useState(false);
  const current=(href:string)=>href==='/tools'?pathname.startsWith('/tools')&&!pathname.startsWith('/tools/check-ins'):pathname===href||pathname.startsWith(href+'/');
  return <header className="site-header shared-header">
    <Link className="wordmark" href="/" aria-label="ProAge Atlas home"><span className="brand-symbol" aria-hidden="true">a</span><span>ProAge <em>Atlas</em><small>Research for healthy aging</small></span></Link>
    <nav className="primary-navigation" aria-label="Main navigation">{links.map(([label,href])=><Link key={href} href={href} aria-current={current(href)?'page':undefined}>{label}</Link>)}</nav>
    <Link className="header-contact header-laboratory" href="/laboratory/ask" aria-current={pathname==='/laboratory/ask'?'page':undefined}>Ask AI</Link>
    <Sheet open={open} onOpenChange={setOpen}><SheetTrigger className="mobile-menu-trigger" aria-label="Open navigation"><span>Menu</span><Menu size={20}/></SheetTrigger><SheetContent className="mobile-sheet" side="right"><SheetTitle className="mobile-sheet-title">ProAge Atlas</SheetTitle><SheetDescription className="sr-only">Ask a research question, choose a health check-in or explore research tools and evidence.</SheetDescription><nav className="simple-mobile-navigation" aria-label="Mobile navigation"><Link className="mobile-main-action" href="/laboratory/ask" onClick={()=>setOpen(false)}>Ask AI</Link>{links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={current(href)?'page':undefined}>{label}</Link>)}<div className="mobile-secondary"><Link href="/laboratory" onClick={()=>setOpen(false)}>Where to start</Link><Link href="/contact" onClick={()=>setOpen(false)}>Contact</Link></div></nav></SheetContent></Sheet>
  </header>;
}
