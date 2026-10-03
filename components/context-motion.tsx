'use client';
import {useEffect,useRef,type PointerEvent,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';

export function ContextMotion({children}:{children:ReactNode}) {
 const root=useRef<HTMLDivElement>(null);
 const pointerFrame=useRef<number|null>(null);
 const path=usePathname();
 useEffect(()=>{
  const host=root.current;
  if(!host)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame:number|null=null;
  const updateProgress=()=>{
   const range=document.documentElement.scrollHeight-window.innerHeight;
   host.style.setProperty('--reading-progress',String(range>0?Math.min(1,window.scrollY/range):0));
   scrollFrame=null;
  };
  const onScroll=()=>{if(scrollFrame===null)scrollFrame=requestAnimationFrame(updateProgress);};
  updateProgress();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
  let observer:IntersectionObserver|null=null;
  const elements=Array.from(host.querySelectorAll<HTMLElement>('.ch-chapter-card,.ch-lab,.ch-clarification,.ch-note-section,.ch-quiz,.ch-source,.ch-feature'));
  if(!reduced.matches){
   observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.setAttribute('data-revealed','true');observer?.unobserve(entry.target);}}},{threshold:.06});
   elements.forEach((element,i)=>{
    element.style.setProperty('--reveal-delay',`${Math.min(i%2*90,90)}ms`);
    element.setAttribute('data-revealed',element.getBoundingClientRect().top<window.innerHeight?'true':'false');
    observer?.observe(element);
   });
  }
  return ()=>{observer?.disconnect();window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(scrollFrame!==null)cancelAnimationFrame(scrollFrame);if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);pointerFrame.current=null;elements.forEach(el=>el.removeAttribute('data-revealed'));};
 },[path]);
 function move(event:PointerEvent<HTMLDivElement>){
  if(event.pointerType!=='mouse'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const element=(event.target as Element).closest<HTMLElement>('.ch-chapter-card,.ch-feature,.ch-lab');
  if(!element)return;
  const {clientX,clientY}=event;
  if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);
  pointerFrame.current=requestAnimationFrame(()=>{
   const bounds=element.getBoundingClientRect();
   const x=clientX-bounds.left,y=clientY-bounds.top;
   element.style.setProperty('--pointer-x',`${x}px`);element.style.setProperty('--pointer-y',`${y}px`);
   element.style.setProperty('--tilt-x',`${(y/bounds.height-.5)*-3}deg`);element.style.setProperty('--tilt-y',`${(x/bounds.width-.5)*3}deg`);
   pointerFrame.current=null;
  });
 }
 return <div ref={root} className="ch-motion" onPointerMove={move}><div className="ch-reading-progress" aria-hidden="true"/>{children}</div>;
}
