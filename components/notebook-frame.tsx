'use client';
import {useEffect,useRef,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {Header} from './header';
import {Sidebar} from './sidebar';
export function NotebookFrame({children}:{children:React.ReactNode}) {
 const path=usePathname();const router=useRouter();const [leaving,setLeaving]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{setLeaving(false);return()=>{if(timer.current)clearTimeout(timer.current);};},[path]);
 function navigate(e:React.MouseEvent<HTMLDivElement>){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const link=(e.target as HTMLElement).closest('a');if(!link||link.target==='_blank'||link.hasAttribute('download'))return;
  const url=new URL(link.href,window.location.href);if(url.origin!==window.location.origin||url.pathname===path)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  e.preventDefault();if(leaving)return;setLeaving(true);router.prefetch(url.pathname);
  timer.current=setTimeout(()=>router.push(url.pathname+url.search+url.hash),160);
 }
 return <div className={`site-navigation-frame ${leaving?'is-departing':''}`} onClick={navigate}><Header/><Sidebar/><div className={`notebook-content ${path==='/'?'is-home':'is-page'}`}><div className="route-scene" key={path}>{children}</div></div></div>;
}
