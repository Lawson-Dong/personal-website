'use client';
import { useId, useState, type PointerEvent } from 'react';
import { multiply, solveColumns, type Vec, type Augmented } from './column-space-math';

const examples:{name:string;m:Augmented}[]=[
  {name:'Rank 2 · entire plane',m:[2,1,3,1,2,2]},
  {name:'Rank 1 · b on the line',m:[1,2,3,1,2,3]},
  {name:'Rank 1 · b off the line',m:[1,2,3,1,2,1]},
  {name:'Rank 1 · zero first column',m:[0,2,4,0,1,2]},
  {name:'Rank 0 · b = 0',m:[0,0,0,0,0,0]},
  {name:'Rank 0 · b ≠ 0',m:[0,0,2,0,0,1]},
];
const fmt=(n:number)=>Number.isFinite(n)?(Math.abs(n)<1e-10?'0':Number(n.toPrecision(5)).toString()):'Outside numeric range';
const pair=(v:Vec)=>`(${fmt(v[0])}, ${fmt(v[1])})`;

function Plot({id,range,children,onDrag,label}:{id:string;range:number;children:React.ReactNode;onDrag?:(v:Vec)=>void;label:string}){
  const [drag,setDrag]=useState(false);
  function move(e:PointerEvent<SVGSVGElement>){
    const ctm=e.currentTarget.getScreenCTM(); if(!ctm||!onDrag)return;
    const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(ctm.inverse());
    const clamp=(n:number)=>Math.max(-range,Math.min(range,n));
    onDrag([clamp((pt.x-250)*range/210),clamp((250-pt.y)*range/210)]);
  }
  return <svg className="cs-plot" viewBox="0 0 500 500" role="img" aria-label={label} style={{touchAction:onDrag?'none':'auto'}}
    onPointerDown={e=>{if(onDrag){e.currentTarget.setPointerCapture(e.pointerId);setDrag(true);move(e);}}}
    onPointerMove={e=>{if(drag)move(e);}} onPointerUp={()=>setDrag(false)} onPointerCancel={()=>setDrag(false)}>
    <defs><clipPath id={`${id}-clip`}><rect x="40" y="40" width="420" height="420"/></clipPath></defs>
    <g clipPath={`url(#${id}-clip)`}>{Array.from({length:11},(_,i)=>40+i*42).map(t=><g key={t} stroke="var(--rule)" strokeWidth="0.6"><line x1={t} x2={t} y1="40" y2="460"/><line x1="40" x2="460" y1={t} y2={t}/></g>)}{children}</g>
    <g stroke="var(--muted)"><line x1="40" y1="250" x2="460" y2="250"/><line x1="250" y1="40" x2="250" y2="460"/></g>
    <g fill="var(--muted)" fontSize="14"><text x="245" y="480">0</text><text x="435" y="480">{fmt(range)}</text><text x="40" y="480">{fmt(-range)}</text><text x="260" y="32">{fmt(range)}</text></g>
  </svg>;
}

function Arrow({v,from=[0,0],range,color,label,dashed=false}:{v:Vec;from?:Vec;range:number;color:string;label:string;dashed?:boolean}){
  const x=(n:number)=>250+n*210/range,y=(n:number)=>250-n*210/range;
  if(![...v,...from].every(Number.isFinite))return null;
  const end:Vec=[from[0]+v[0],from[1]+v[1]],angle=Math.atan2(-v[1],v[0]);
  const ex=x(end[0]),ey=y(end[1]);
  return <g stroke={color} fill={color}><line x1={x(from[0])} y1={y(from[1])} x2={ex} y2={ey} strokeWidth="2.5" strokeDasharray={dashed?'7 5':undefined}/>
    {Math.hypot(...v)>0&&<path d={`M ${ex-10*Math.cos(angle-.4)} ${ey-10*Math.sin(angle-.4)} L ${ex} ${ey} L ${ex-10*Math.cos(angle+.4)} ${ey-10*Math.sin(angle+.4)}`} fill="none" strokeWidth="2.5"/>}
    <circle cx={ex} cy={ey} r="4"/><text x={ex+8} y={ey-9} stroke="none" fontSize="14" paintOrder="stroke" style={{stroke:'var(--paper)',strokeWidth:3}}>{label}</text></g>;
}

export function ColumnSpaceLab(){
  const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const [mode,setMode]=useState<'explore'|'matrix'>('explore');
  const [values,setValues]=useState(examples[1].m.map(String));
  const [x,setX]=useState<Vec>([1,1]);
  const [range,setRange]=useState(6);
  const valid=values.every(v=>v.trim()!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v))<=1e12);
  const m=values.map(Number) as Augmented, result=solveColumns(valid?m:examples[1].m);
  const coefficients=mode==='matrix'?result.x:x;
  const ax=multiply(m,coefficients),a1:Vec=[m[0],m[3]],a2:Vec=[m[1],m[4]],target:Vec=[m[2],m[5]];
  const term1:Vec=[a1[0]*coefficients[0],a1[1]*coefficients[0]],term2:Vec=[a2[0]*coefficients[1],a2[1]*coefficients[1]];
  const finite=[...ax,...coefficients].every(Number.isFinite);
  function preset(i:number){setValues(examples[i].m.map(String));setX([1,1]);setRange(6);}
  function setTarget(v:Vec){setValues(old=>old.map((n,i)=>i===2?String(v[0]):i===5?String(v[1]):n));}
  const line=a1.some(n=>n!==0)?a1:a2, norm=Math.hypot(...line);
  const unit:Vec=norm?[line[0]/norm,line[1]/norm]:[0,0];
  const same=finite&&Math.hypot(ax[0]-target[0],ax[1]-target[1])<=1e-8*Math.max(1,Math.hypot(...target));
  const drawn=[...a1,...a2,...target,...ax,...term1].filter(Number.isFinite);
  const clipped=drawn.some(n=>Math.abs(n)>range);
  return <section id="column-space" className="la-module cs-lab" aria-labelledby="cs-title">
    <div className="la-module-head"><div><span className="la-label">03 / VISUALIZATION</span><h2 id="cs-title">Column space &amp; <em>consistency.</em></h2></div><p>Can the columns of A combine to reach b? Explore the geometry or enter an augmented matrix.</p></div>
    <div className="cs-equivalence"><strong>b is a linear combination of columns of A</strong><span>⇔ Ax = b has a solution</span><span>⇔ Ax = b is consistent</span></div>
    <div className="la-tabs" role="tablist" aria-label="Column space mode">{(['explore','matrix'] as const).map(t=><button key={t} id={`${id}-${t}-tab`} role="tab" aria-selected={mode===t} aria-controls={`${id}-panel`} onClick={()=>setMode(t)}>{t==='explore'?'Explore Mode':'Matrix Mode'}</button>)}</div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${mode}-tab`}>
      <div className="cs-controls"><div><label htmlFor={`${id}-example`}>Examples</label><select id={`${id}-example`} value="" onChange={e=>preset(Number(e.target.value))}><option value="" disabled>Choose a rank example</option>{examples.map((p,i)=><option key={i} value={i}>{p.name}</option>)}</select></div>
      <div><span className="cs-caption">[A | b]</span><div className="la-matrix cs-matrix">{[0,1].map(row=><div className="cs-matrix-row" key={row}>{[0,1,2].map(col=><input key={col} type="number" step="any" value={values[row*3+col]} aria-label={`Row ${row+1}, ${col===2?'target b':`column ${col+1}`}`} onChange={e=>setValues(old=>old.map((n,i)=>i===row*3+col?e.target.value:n))}/>)}</div>)}</div></div>
      <div className="cs-zoom"><label htmlFor={`${id}-zoom`}>Plot extent: ±{fmt(range)}</label><input id={`${id}-zoom`} type="range" min="1" max="20" step=".5" value={Math.min(20,range)} onChange={e=>setRange(Number(e.target.value))}/><button className="la-reset" onClick={()=>setRange(Math.max(2,...drawn.map(Math.abs))*1.25)}>Fit vectors</button></div></div>
      {!valid?<p role="alert" className="la-warning">Enter six finite numbers between −10¹² and 10¹² to display the system.</p>:<>
        <div className={`cs-status ${result.consistent?'':'cs-inconsistent'}`} role="status"><strong>{result.consistent?'Consistent':'Inconsistent'}</strong><span>{result.consistent?'b is a linear combination of the columns of A':'b is not a linear combination of the columns of A'}</span><span>rank(A) = {result.rank} · Col(A) = {result.rank===2?'ℝ²':result.rank===1?'a line through the origin':'{0}'}</span></div>
        <p className="cs-explanation">{result.rank===2?'The columns span the entire plane. Every target b is reachable.':result.rank===1?'The columns span one line. Ax always stays on this line; b is reachable exactly when it lies on the line.':'Both columns are zero. Every Ax equals zero; only b = 0 is reachable.'}</p>
        <div className={`cs-workspace ${mode==='matrix'?'cs-matrix-mode':''}`}>
          {mode==='explore'&&<div className="la-geometry"><h3>Input space · x = (x₁, x₂)</h3><p>Drag in the input plane or adjust the coefficients.</p><div className="la-step-actions"><button onClick={()=>setTarget(ax)}>Set b = Ax</button><button disabled={!result.consistent || !result.x.every(Number.isFinite)} onClick={()=>setX(result.x)}>Use a solution for b</button></div><Plot id={`${id}-input`} range={6} label="Input plane. Drag to set x1 and x2." onDrag={setX}><Arrow v={x} range={6} color="var(--accent)" label="x"/></Plot>{[0,1].map(i=><div className="cs-coefficient" key={i}><label htmlFor={`${id}-x${i}`}>x{i===0?'₁':'₂'} = {fmt(x[i])}</label><input id={`${id}-x${i}`} type="range" min={Math.min(-6,x[i])} max={Math.max(6,x[i])} step=".01" value={x[i]} onChange={e=>setX(old=>old.map((n,j)=>i===j?Number(e.target.value):n) as Vec)}/></div>)}</div>}
          <div className="la-geometry"><h3>Output space · Ax and b</h3><p>{mode==='explore'?'Drag in this plane to move b. The status describes whether any x can reach b.':'The system automatically draws a solution when one exists.'}</p>
            <Plot id={`${id}-output`} range={range} label="Output plane showing column space, columns, target and vector combination." onDrag={mode==='explore'?setTarget:undefined}>
              {result.rank===2?<rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".09"/>:result.rank===1?<line x1={250-unit[0]*700} y1={250+unit[1]*700} x2={250+unit[0]*700} y2={250-unit[1]*700} stroke="var(--accent)" strokeWidth="14" opacity=".19"/>:<circle cx="250" cy="250" r="10" fill="var(--accent)" opacity=".3"/>}
              <Arrow v={a1} range={range} color="#477aa8" label="a₁"/><Arrow v={a2} range={range} color="#a16e39" label="a₂"/>
              {(mode==='explore'||result.consistent)&&finite&&<><Arrow v={term1} range={range} color="#8464ac" label="x₁a₁" dashed/><Arrow v={term2} from={term1} range={range} color="#8464ac" label="x₂a₂" dashed/><Arrow v={ax} range={range} color="#328577" label="Ax"/></>}
              {!result.consistent&&<Arrow v={[target[0]-result.projection[0],target[1]-result.projection[1]]} from={result.projection} range={range} color="#bc5757" label="unreachable gap" dashed/>}
              <Arrow v={target} range={range} color="#bc5757" label="b"/>
            </Plot>
            <div className="cs-legend"><span style={{color:'#477aa8'}}>a₁</span><span style={{color:'#a16e39'}}>a₂</span><span style={{color:'#8464ac'}}>Scaled columns · head to tail</span><span style={{color:'#328577'}}>Ax</span><span style={{color:'#bc5757'}}>b</span><span>Shading · Col(A)</span></div>
            {clipped&&<p className="cs-caption">Some vectors extend beyond this view. Use “Fit vectors” to see them.</p>}
          </div>
        </div>
        <div className="cs-calculation">{mode==='matrix'&&!result.consistent?<><strong>No solution</strong><p>b = {pair(target)} lies outside Col(A). The dashed gap shows why no combination reaches b.</p></>:!finite?<p>The solution exceeds the supported numeric range. Rescale the matrix entries.</p>:<><strong>{mode==='matrix'?'One solution':'Current coefficients'}: x₁ = {fmt(coefficients[0])}, x₂ = {fmt(coefficients[1])}</strong><p>{fmt(coefficients[0])} a₁ + {fmt(coefficients[1])} a₂ = {pair(ax)} {same?'= b':'≠ b'}</p>{mode==='explore'&&<p>{same?'These coefficients reach b.':result.consistent?'b is reachable, but the current coefficients do not reach it.':'No coefficients can reach this b.'}</p>}{mode==='matrix'&&result.rank<2&&<p>There are infinitely many solutions. This is one valid choice.</p>}</>}</div>
      </>}
      <p className="cs-caption">Rank and line membership use relative numerical tolerance 10⁻¹⁰. Extremely close cases are treated as equal at this precision.</p>
    </div>
  </section>;
}
