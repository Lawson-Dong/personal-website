import React, {Children, isValidElement, cloneElement, type ReactNode} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {MathTex} from './math';
function inlineMath(children:ReactNode):ReactNode {
 return Children.map(children,child=>{
  if(typeof child==='string')return child.split(/(\$[^$\n]+\$)/g).map((part,i)=>part.startsWith('$')&&part.endsWith('$')?<MathTex key={i} tex={part.slice(1,-1)}/>:part);
  if(isValidElement<{children?:ReactNode}>(child)&&child.type!=='code')return cloneElement(child,{},inlineMath(child.props.children));
  return child;
 });
}
export function ContextNotes({text}:{text:string}) {
 // Keep fenced code intact before interpreting math delimiters.
 const blocks=text.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g);
 return <div className="ch-notes">{blocks.map((block,i)=>block.startsWith('$$')?<MathTex key={i} tex={block.slice(2,-2).trim()} display/>:<Markdown key={i} remarkPlugins={[remarkGfm]} components={{p:({children})=><p>{inlineMath(children)}</p>,li:({children})=><li>{inlineMath(children)}</li>,blockquote:({children})=><blockquote>{inlineMath(children)}</blockquote>,table:({children})=><div className="ch-table-scroll"><table>{children}</table></div>,a:({href,children})=><a href={href} target="_blank" rel="noreferrer">{children} ↗</a>}}>{block}</Markdown>)}</div>;
}
