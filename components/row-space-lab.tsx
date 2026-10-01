'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { solveColumns, type Augmented, type Vec } from './column-space-math';

type Matrix = [number, number, number, number];
const number=(n:number)=>Math.abs(n)<1e-10?'0':Number(n.toPrecision(5)).toString();
const vector=(v:Vec)=>'('+v.map(number).join(', ')+')';

function RowArrow({v,from=[0,0],range,color,label,middle=false,thick=false,dashed=false,offset=[10,-12]}:{
  v:Vec;from?:Vec;range:number;color:string;label:string;middle?:boolean;thick?:boolean;dashed?:boolean;offset?:Vec;
}){
  const px=(n:number)=>250+n*210/range,py=(n:number)=>250-n*210/range;
  const end:Vec=[from[0]+v[0],from[1]+v[1]];
  const ex=px(end[0]),ey=py(end[1]),angle=Math.atan2(-v[1],v[0]);
  const tx=middle?(px(from[0])+ex)/2:ex,ty=middle?(py(from[1])+ey)/2:ey;
  return <g aria-label={label+': '+vector(v)} fill={color} stroke={color}>
    {thick&&<line x1={px(from[0])} y1={py(from[1])} x2={ex} y2={ey} stroke="var(--paper)" strokeWidth="8"/>}
    <line x1={px(from[0])} y1={py(from[1])} x2={ex} y2={ey} strokeWidth={thick?4:2} strokeDasharray={dashed?'7 5':undefined}/>
    {Math.hypot(...v)>0&&<path d={'M '+(ex-11*Math.cos(angle-.4))+' '+(ey-11*Math.sin(angle-.4))+' L '+ex+' '+ey+' L '+(ex-11*Math.cos(angle+.4))+' '+(ey-11*Math.sin(angle+.4))} fill="none" strokeWidth="2.5"/>}
    <circle cx={ex} cy={ey} r="4"/>
    <text x={tx+offset[0]} y={ty+offset[1]} fontSize="14" stroke="var(--paper)" strokeWidth="3" paintOrder="stroke">{label}</text>
  </g>;
}

export function RowSpaceLab({matrix}:{matrix:Matrix}){
  const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const [weights,setWeights]=useState<Vec>([1,1]);
  const [showNull,setShowNull]=useState(true);
  const [nullWeight,setNullWeight]=useState(2);
  const [extent,setExtent]=useState(8);
  const [manual,setManual]=useState(false);
  const svg=useRef<SVGSVGElement>(null);
  const row1:Vec=[matrix[0],matrix[1]],row2:Vec=[matrix[2],matrix[3]];
  const transpose:Augmented=[matrix[0],matrix[2],0,matrix[1],matrix[3],0];
  const rank=solveColumns(transpose).rank;
  const first:Vec=[row1[0]*weights[0],row1[1]*weights[0]];
  const second:Vec=[row2[0]*weights[1],row2[1]*weights[1]];
  const sum:Vec=[first[0]+second[0],first[1]+second[1]];
  const base=Math.hypot(...row1)>=Math.hypot(...row2)?row1:row2,length=Math.hypot(...base);
  const direction:Vec=length?[base[0]/length,base[1]/length]:[0,0];
  const normal:Vec=[-direction[1],direction[0]];
  const n:Vec=rank===1?[normal[0]*nullWeight,normal[1]*nullWeight]:[0,0];
  const autoExtent=Math.max(2,...[...row1,...row2,...first,...sum,...(showNull?n:[])].map(Math.abs))*1.25;
  const range=manual?extent:autoExtent;
  const zoom=(factor:number)=>{setExtent(previous=>Math.max(.05,Math.min(1e8,(manual?previous:autoExtent)*factor)));setManual(true);};
  useEffect(()=>{
    const element=svg.current;if(!element)return;
    const wheel=(event:WheelEvent)=>{event.preventDefault();const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?500:1);zoom(Math.exp(Math.max(-160,Math.min(160,delta))*.004));};
    element.addEventListener('wheel',wheel,{passive:false});
    return ()=>element.removeEventListener('wheel',wheel);
  },[manual,autoExtent]);
  const px=(v:number)=>250+v*210/range,py=(v:number)=>250-v*210/range;
  const hidden=[...row1,...row2,...first,...sum,...(showNull?n:[])].some(v=>Math.abs(v)>range);
  return <section id="row-space" className="cs-row-space" aria-labelledby="row-space-title">
    <h3 id="row-space-title" className="cs-subtitle">Row space &amp; null space</h3><p className="cs-explanation">The same matrix A from above, viewed through its rows. Edit A in the column-space controls to update both views; changing b does not change either space.</p>
    <div className="cs-equivalence"><strong>Row(A) = span&#123;r₁, r₂&#125; = Col(Aᵀ)</strong><span>Row(A) ⟂ Null(A)</span></div>
    <div className="cs-status"><strong>rank(A) = {rank}</strong><span>Row(A) = {rank===2?'ℝ²':rank===1?'a line through the origin':'{0}'}</span><span>dim Row(A) = {rank} · dim Null(A) = {2-rank}</span></div>
    <div className="cs-workspace" style={{marginTop:24}}>
      <div className="la-geometry">
        <h3>Rows as vectors</h3>
        <p>For this 2 × 2 matrix, both rows have two entries, so we can draw them in the input coordinate plane.</p>
        <div className="la-matrix" aria-label="Shared matrix A">{[0,1].map(row=><div key={row} className="cs-shared-matrix-row"><span>r{row===0?'₁':'₂'}</span>{[0,1].map(col=><span key={col}>{number(matrix[row*2+col])}</span>)}</div>)}</div>
        <p className="cs-caption">A is shared with the column-space view above.</p>
        <p style={{fontFamily:'monospace'}}>r₁ = {vector(row1)}<br/>r₂ = {vector(row2)}</p>
        {[0,1].map(i=><div key={i} className="la-slider"><label htmlFor={id+'-y'+i}>y{i===0?'₁':'₂'} <output>{number(weights[i])}</output></label><input id={id+'-y'+i} type="range" min="-4" max="4" step=".05" value={weights[i]} onChange={e=>setWeights(old=>old.map((v,j)=>i===j?Number(e.target.value):v) as Vec)}/></div>)}
        <div className="cs-plot-options"><label><input type="checkbox" checked={showNull} onChange={e=>setShowNull(e.target.checked)}/> Show Null(A)</label></div>
        {showNull&&rank===1&&<div className="la-slider"><label htmlFor={id+'-null'}>Move n along Null(A)<output>{number(nullWeight)}</output></label><input id={id+'-null'} type="range" min="-4" max="4" step=".05" value={nullWeight} onChange={e=>setNullWeight(Number(e.target.value))}/></div>}
        <p>{rank===2?'Independent rows span the whole plane. Null(A) contains only the zero vector.':rank===1?'Dependent rows span a line. Every vector perpendicular to that line is sent to zero by A.':'Both rows are zero. Row(A) contains only zero, and every input vector belongs to Null(A).'}</p>
      </div>
      <div className="la-geometry">
        <h3>y₁r₁ + y₂r₂</h3><p>Adjust y₁ and y₂ to combine the rows. Scroll over the canvas to zoom.</p>
        <div role="group" aria-label="Row space zoom" className="la-step-actions" style={{margin:'12px 0'}}><button aria-label="Zoom in row space" onClick={()=>zoom(.8)}>+</button><button aria-label="Zoom out row space" onClick={()=>zoom(1.25)}>−</button><button onClick={()=>setManual(false)}>Fit</button></div>
        <svg ref={svg} className="cs-plot" viewBox="0 0 500 500" role="img" aria-label={'Row space rank '+rank+'. Row vectors and their linear combination, with optional perpendicular null space.'}>
          <defs><clipPath id={id+'-clip'}><rect x="40" y="40" width="420" height="420"/></clipPath></defs>
          <g clipPath={'url(#'+id+'-clip)'}>
            {rank===2&&<rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".12"/>}
            {showNull&&rank===0&&<rect x="40" y="40" width="420" height="420" fill="#c48b3a" opacity=".12"/>}
            {Array.from({length:11},(_,i)=>40+i*42).map(t=><g key={t} stroke="var(--rule)" strokeWidth=".6"><line x1={t} x2={t} y1="40" y2="460"/><line x1="40" x2="460" y1={t} y2={t}/></g>)}
            <g stroke="var(--muted)"><line x1="40" x2="460" y1="250" y2="250"/><line x1="250" x2="250" y1="40" y2="460"/></g>
            {rank===1&&<line x1={250-direction[0]*700} y1={250+direction[1]*700} x2={250+direction[0]*700} y2={250-direction[1]*700} stroke="var(--accent)" opacity=".22" strokeWidth="14"/>}
            {showNull&&rank===1&&<><line x1={250-normal[0]*700} y1={250+normal[1]*700} x2={250+normal[0]*700} y2={250-normal[1]*700} stroke="#c48b3a" strokeWidth="3" strokeDasharray="8 6"/><RowArrow v={n} range={range} color="#c48b3a" label="n ∈ Null(A)" offset={[10,-25]} dashed/></>}
            {rank===0&&<circle cx="250" cy="250" r="9" fill="var(--accent)"/>}
            {showNull&&rank===2&&<circle cx="250" cy="250" r="7" fill="#c48b3a"/>}
            <RowArrow v={row1} range={range} color="#477aa8" label="r₁" offset={[-28,-12]}/>
            <RowArrow v={row2} range={range} color="#a16e39" label="r₂" offset={[-28,-12]}/>
            <RowArrow v={sum} range={range} color="#328577" label="Aᵀy" offset={[10,-16]}/>
            <RowArrow v={first} range={range} color="#8464ac" label={Math.hypot(...first)===0?'y₁r₁ = 0':'y₁r₁'} offset={[-42,26]} thick middle/>
            <RowArrow v={second} from={first} range={range} color="#b23b88" label={Math.hypot(...second)===0?'y₂r₂ = 0':'y₂r₂'} offset={[10,26]} thick middle/>
            <circle cx={px(first[0])} cy={py(first[1])} r="5" fill="var(--paper)" stroke="#b23b88" strokeWidth="2"/>
          </g>
          <g fill="var(--muted)" fontSize="14"><text x="40" y="480">{number(-range)}</text><text x="245" y="480">0</text><text x="420" y="480">{number(range)}</text><text x="260" y="30">{number(range)}</text></g>
        </svg>
        <div className="cs-legend"><span style={{color:'#477aa8'}}>r₁</span><span style={{color:'#a16e39'}}>r₂</span><span style={{color:'#8464ac'}}>y₁r₁</span><span style={{color:'#b23b88'}}>y₂r₂ · head to tail</span><span style={{color:'#328577'}}>Aᵀy</span>{showNull&&<span style={{color:'#c48b3a'}}>Null(A)</span>}</div>
        {hidden&&<p className="cs-caption">Some vectors are outside the view. Choose Fit to see them.</p>}
      </div>
    </div>
    <div className="cs-calculation"><strong>{number(weights[0])} r₁ + {number(weights[1])} r₂ = {vector(sum)} = Aᵀy</strong>
      <p>Rows are drawn as coordinate vectors. This combination always lies in Row(A).</p>
      {showNull&&rank===1&&<p>n = {vector(n)} · r₁ · n = {number(row1[0]*n[0]+row1[1]*n[1])} · r₂ · n = {number(row2[0]*n[0]+row2[1]*n[1])}<br/>An = {vector([row1[0]*n[0]+row1[1]*n[1],row2[0]*n[0]+row2[1]*n[1]])}</p>}
    </div>
    <p className="cs-caption">For an m × n matrix, Row(A) lives in ℝⁿ (input coordinates); Col(A) lives in ℝᵐ (output coordinates). Row rank equals column rank. Rank uses relative numerical tolerance 10⁻¹⁰.</p>
  </section>;
}
