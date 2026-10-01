'use client';
import { useId, useRef, useState, type PointerEvent } from 'react';
import { solveColumns, type Augmented, type Vec } from './column-space-math';

const fmt=(n:number)=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(5)).toString();
const equation=(a:number,b:number,c:number)=>`${fmt(a)}x₁ ${b<0?'−':'+'} ${fmt(Math.abs(b))}x₂ = ${fmt(c)}`;

// Intersect an implicit line with the visible square. This also handles vertical lines.
export function equationSegment(a:number,b:number,c:number,range:number):Vec[] {
  const scale=Math.max(Math.abs(a),Math.abs(b));if(scale===0)return [];
  a/=scale;b/=scale;c/=scale;
  const points:Vec[]=[];
  const add=(x:number,y:number)=>{if(Number.isFinite(x)&&Number.isFinite(y)&&Math.abs(x)<=range*(1+1e-9)&&Math.abs(y)<=range*(1+1e-9)&&!points.some(p=>Math.hypot(p[0]-x,p[1]-y)<range*1e-9))points.push([x,y]);};
  if(b!==0){add(-range,(c+a*range)/b);add(range,(c-a*range)/b);}
  if(a!==0){add((c+b*range)/a,-range);add((c-b*range)/a,range);}
  return points.slice(0,2);
}

export function RowSpaceLab({matrix,x,onChange}:{matrix:Augmented;x?:Vec;onChange?:(v:Vec)=>void}){
  const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const drag=useRef<{pointer:number;offset:Vec}|null>(null);
  const result=solveColumns(matrix);
  const rows=[matrix.slice(0,3),matrix.slice(3,6)];
  const [extent,setExtent]=useState<number|null>(null);
  const distances=rows.map(([a,b,c])=>Math.hypot(a,b)>0?Math.abs(c)/Math.hypot(a,b):0).filter(Number.isFinite);
  const solutionFinite=result.x.every(Number.isFinite);
  const autoRange=Math.min(1e15,Math.max(4,...distances,...(x?x.map(Math.abs):[]),...(result.consistent&&solutionFinite?result.x.map(Math.abs):[]))*1.35);
  const range=extent??autoRange;
  const px=(v:number)=>250+v*210/range,py=(v:number)=>250-v*210/range;
  function coordinates(e:PointerEvent<SVGSVGElement>):Vec|null {
    const ctm=e.currentTarget.getScreenCTM();if(!ctm)return null;
    const point=new DOMPoint(e.clientX,e.clientY).matrixTransform(ctm.inverse());
    return [(point.x-250)*range/210,(250-point.y)*range/210];
  }
  const lines=rows.map(([a,b,c])=>equationSegment(a,b,c,range));
  const ordinary=rows.every(([a,b])=>a!==0||b!==0);
  const description=!result.consistent?(ordinary?'Parallel, distinct lines: no intersection and no solution.':'A zero row requires 0 to equal a nonzero value, so no solution exists.'):
    result.rank===2?'The lines intersect at one point: a unique solution.':
    result.rank===1?(ordinary?'The lines coincide: every point on their shared line is a solution.':'One equation imposes no restriction. Every point on the remaining line is a solution.'):
    'Both equations are 0 = 0. Every point in the input plane is a solution.';
  const offscreen=lines.some((line,i)=>line.length<2&&(rows[i][0]!==0||rows[i][1]!==0));
  return <div className="cs-row-equations">
    <div className={`cs-status ${result.consistent?'':'cs-inconsistent'}`} role="status"><strong>{result.consistent?'Consistent':'Inconsistent'}</strong><span>{description}</span></div>
    <div className="cs-equation-list">{rows.map(([a,b,c],i)=><p key={i} style={{color:i===0?'#477aa8':'#a16e39'}}>R{i+1}: {equation(a,b,c)}{a===0&&b===0?c===0?' · whole plane':' · empty set':''}</p>)}</div>
    <div className="la-step-actions" role="group" aria-label="Equation plot zoom"><button aria-label="Zoom in equations" onClick={()=>setExtent(Math.max(.00001,range*.8))}>+</button><button aria-label="Zoom out equations" onClick={()=>setExtent(Math.min(1e15,range*1.25))}>−</button><button onClick={()=>setExtent(null)}>Fit</button></div>
    <svg className="cs-plot" viewBox="0 0 500 500" role="img"
      onPointerDown={e=>{const v=coordinates(e);if(!x||!onChange||!v||e.button!==0||Math.hypot(v[0]-x[0],v[1]-x[1])*210/range>24)return;e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);drag.current={pointer:e.pointerId,offset:[x[0]-v[0],x[1]-v[1]]};}}
      onPointerMove={e=>{const v=coordinates(e),d=drag.current;if(!v||!d||d.pointer!==e.pointerId||!onChange)return;onChange([Math.round((v[0]+d.offset[0])*100)/100,Math.round((v[1]+d.offset[1])*100)/100]);}}
      onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}
 aria-label={`Row equations in the x1 x2 input plane. ${result.consistent?'Consistent':'Inconsistent'}. ${description}`}>
      <defs><clipPath id={id+'-clip'}><rect x="40" y="40" width="420" height="420"/></clipPath></defs>
      <g clipPath={`url(#${id}-clip)`}>
        {result.consistent&&result.rank===0&&<rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".1"/>}
        {Array.from({length:11},(_,i)=>40+i*42).map(t=><g key={t} stroke="var(--rule)" strokeWidth=".6"><line x1={t} x2={t} y1="40" y2="460"/><line x1="40" x2="460" y1={t} y2={t}/></g>)}
        <g stroke="var(--muted)"><line x1="40" x2="460" y1="250" y2="250"/><line x1="250" x2="250" y1="40" y2="460"/></g>
        {lines.map((line,i)=>line.length===2&&<line key={i} x1={px(line[0][0])} y1={py(line[0][1])} x2={px(line[1][0])} y2={py(line[1][1])} stroke={i===0?'#477aa8':'#a16e39'} strokeWidth={i===0?5:3} strokeDasharray={i===1?'10 7':undefined}/>)}
        {result.consistent&&result.rank===2&&solutionFinite&&<g><circle cx={px(result.x[0])} cy={py(result.x[1])} r="7" fill="#328577" stroke="var(--paper)" strokeWidth="2"/><text x={px(result.x[0])+10} y={py(result.x[1])-12} fill="#328577" fontSize="14" stroke="var(--paper)" strokeWidth="3" paintOrder="stroke">({fmt(result.x[0])}, {fmt(result.x[1])})</text></g>}
        {x&&<g><circle className="cs-drag-handle" cx={px(x[0])} cy={py(x[1])} r="12" fill="var(--paper)" fillOpacity=".5" stroke="var(--accent)" strokeWidth="3"><title>Drag x to change the column-combination coefficients</title></circle><text x={px(x[0])+15} y={py(x[1])+22} fill="var(--accent)" fontSize="14">x</text></g>}
      </g>
      <g fill="var(--muted)" fontSize="14"><text x="440" y="240">x₁</text><text x="260" y="54">x₂</text><text x="40" y="480">{fmt(-range)}</text><text x="245" y="480">0</text><text x="418" y="480">{fmt(range)}</text></g>
    </svg>
    <div className="cs-legend"><span style={{color:'#477aa8'}}>R1 · solid line</span><span style={{color:'#a16e39'}}>R2 · dashed line</span>{x&&<span>x · draggable coefficients</span>}</div>
    {offscreen&&<p className="cs-caption">A line is outside this view. Choose Fit or zoom out.</p>}
    <p className="cs-caption">Each row of [A | b] defines an equation in the input plane. Its coefficients form a normal vector to the line; these equation lines are not the subspace Row(A).</p>
  </div>;
}
