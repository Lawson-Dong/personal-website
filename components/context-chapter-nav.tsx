'use client';
import Link from 'next/link';
import {useEffect,useRef} from 'react';
export function ContextChapterNav({items,active}:{items:{title:string;href:string}[];active:number}){
 const current=useRef<HTMLAnchorElement>(null);
 useEffect(()=>{const link=current.current;if(!link)return;const nav=link.parentElement;if(nav)nav.scrollLeft=Math.max(0,link.offsetLeft-nav.offsetLeft-nav.clientWidth/2+link.clientWidth/2);},[active]);
 return <nav className="ch-tabs" aria-label="Notebook chapters">{items.map((item,i)=><Link key={item.href} ref={i===active?current:undefined} href={item.href} className={i===active?'active':''} aria-current={i===active?'page':undefined}><span>{String(i).padStart(2,'0')}</span>{item.title}</Link>)}</nav>;
}
