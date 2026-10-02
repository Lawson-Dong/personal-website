'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const sections = [{href:'/research',name:'Research',index:'01'}, {href:'/coding',name:'Coding and AI Engineering',index:'02'}, {href:'/highlights',name:'Highlighting Blogs & Articles',index:'03'}, {href:'/math-physics',name:'Math & Physics',index:'04'},{href:'/about',name:'About the website',index:'05'}];
export function Sidebar() {
 const pathname=usePathname();
 if(pathname!=='/')return null;
 return <aside className="notebook-sidebar"><Link className="sidebar-home" href="/">Lawson’s<br/><em>field notes.</em></Link><span className="sidebar-label">CONTENTS</span><nav aria-label="Contents">{sections.map(s=><Link key={s.href} href={s.href} className={pathname.startsWith(s.href)?'selected':''} aria-current={pathname.startsWith(s.href)?'page':undefined}><span>{s.index}</span>{s.name}</Link>)}</nav><div className="sidebar-foot"><span>PHYSICS × INTELLIGENCE</span><p>Learning, experimenting,<br/>and making things.</p><Link href="/lost">A quieter corner ♪</Link></div></aside>;
}
