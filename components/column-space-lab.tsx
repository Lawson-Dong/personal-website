'use client';
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import { RowSpaceLab } from './row-space-lab';
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

function Plot({id,range,children,onDrag,point,label,onZoom}:{id:string;range:number;children:React.ReactNode;onDrag?:(v:Vec)=>void;point?:Vec;label:string;onZoom?:(factor:number)=>void}){
  const drag=useRef<{pointer:number;offset:Vec}|null>(null);
  const svg=useRef<SVGSVGElement>(null);
  useEffect(()=>{
    const element=svg.current;if(!element||!onZoom)return;
    function wheel(event:WheelEvent){
      event.preventDefault();
      if(drag.current)return;
      const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?500:1);
      onZoom!(Math.exp(Math.max(-160,Math.min(160,pixels))*.004));
    }
    element.addEventListener('wheel',wheel,{passive:false});
    return ()=>element.removeEventListener('wheel',wheel);
  },[onZoom]);
  function coordinates(e:PointerEvent<SVGSVGElement>):Vec|null{
    const ctm=e.currentTarget.getScreenCTM(); if(!ctm)return null;
    const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(ctm.inverse());
    return [(pt.x-250)*range/210,(250-pt.y)*range/210];
  }
  return <svg ref={svg} className="cs-plot" viewBox="0 0 500 500" role="img" aria-label={label}
    onPointerDown={e=>{const v=coordinates(e);if(!onDrag||!point||!v||e.button!==0)return;
      if(Math.hypot(v[0]-point[0],v[1]-point[1])*210/range>24)return;
      e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);
      drag.current={pointer:e.pointerId,offset:[point[0]-v[0],point[1]-v[1]]};
    }}
    onPointerMove={e=>{const v=coordinates(e),d=drag.current;if(!v||!d||d.pointer!==e.pointerId||!onDrag)return;
      const clamp=(n:number)=>Math.max(-range,Math.min(range,n));onDrag([clamp(v[0]+d.offset[0]),clamp(v[1]+d.offset[1])]);
    }} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
    <defs><clipPath id={`${id}-clip`}><rect x="40" y="40" width="420" height="420"/></clipPath></defs>
    <g clipPath={`url(#${id}-clip)`}>{Array.from({length:11},(_,i)=>40+i*42).map(t=><g key={t} stroke="var(--rule)" strokeWidth="0.6"><line x1={t} x2={t} y1="40" y2="460"/><line x1="40" x2="460" y1={t} y2={t}/></g>)}
      <g stroke="var(--muted)"><line x1="40" y1="250" x2="460" y2="250"/><line x1="250" y1="40" x2="250" y2="460"/></g>{children}
      {onDrag&&point&&<circle className="cs-drag-handle" cx={250+point[0]*210/range} cy={250-point[1]*210/range} r="13" fill="var(--paper)" fillOpacity=".45" stroke={id.endsWith('input')?'var(--accent)':'#bc5757'} strokeWidth="3"><title>{id.endsWith('input')?'Drag x':'Drag b'}</title></circle>}
    </g>
    <g fill="var(--muted)" fontSize="14"><text x="245" y="480">0</text><text x="435" y="480">{fmt(range)}</text><text x="40" y="480">{fmt(-range)}</text><text x="260" y="32">{fmt(range)}</text></g>
  </svg>;
}

function Arrow({v,from=[0,0],range,color,label,dashed=false,offset=[8,-9],highlight=false,labelAtMiddle=false}:{v:Vec;from?:Vec;range:number;color:string;label:string;dashed?:boolean;offset?:Vec;highlight?:boolean;labelAtMiddle?:boolean}){
  const x=(n:number)=>250+n*210/range,y=(n:number)=>250-n*210/range;
  if(![...v,...from].every(Number.isFinite))return null;
  const end:Vec=[from[0]+v[0],from[1]+v[1]],angle=Math.atan2(-v[1],v[0]);
  const ex=x(end[0]),ey=y(end[1]);
  const labelX=labelAtMiddle?(x(from[0])+ex)/2:ex,labelY=labelAtMiddle?(y(from[1])+ey)/2:ey;
  return <g stroke={color} fill={color} aria-label={`${label}: ${pair(v)}`}>
    {highlight&&<line x1={x(from[0])} y1={y(from[1])} x2={ex} y2={ey} stroke="var(--paper)" strokeWidth="8"/>}<line x1={x(from[0])} y1={y(from[1])} x2={ex} y2={ey} strokeWidth={highlight?4:2.5} strokeDasharray={dashed?'7 5':undefined}/>
    {Math.hypot(...v)>0&&<path d={`M ${ex-10*Math.cos(angle-.4)} ${ey-10*Math.sin(angle-.4)} L ${ex} ${ey} L ${ex-10*Math.cos(angle+.4)} ${ey-10*Math.sin(angle+.4)}`} fill="none" strokeWidth="2.5"/>}
    <circle cx={ex} cy={ey} r="4"/><text x={labelX+offset[0]} y={labelY+offset[1]} stroke="none" fontSize="14" paintOrder="stroke" style={{stroke:'var(--paper)',strokeWidth:3}}>{label}</text></g>;
}

export function ColumnSpaceLab(){
  const id=useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const [mode,setMode]=useState<'explore'|'matrix'>('explore');
  const [values,setValues]=useState(examples[1].m.map(String));
  const [x,setX]=useState<Vec>([1,1]);
  const [lastMatrix,setLastMatrix]=useState<Augmented>(examples[1].m);
  const [range,setRange]=useState(6);
  const [autoFit,setAutoFit]=useState(true);
  function zoomOutput(factor:number){setAutoFit(false);setRange(previous=>Math.max(.05,Math.min(1e13,previous*factor)));}
  const [snap,setSnap]=useState(true);
  const [showColumns,setShowColumns]=useState(true);
  const valid=values.every(v=>v.trim()!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v))<=1e12);
  const m=valid?values.map(Number) as Augmented:lastMatrix, result=solveColumns(m);
  function editMatrix(next:string[]){setValues(next);if(next.every(v=>v.trim()!==''&&Number.isFinite(Number(v))&&Math.abs(Number(v))<=1e12))setLastMatrix(next.map(Number) as Augmented);}
  const coefficients=mode==='matrix'?result.x:x;
  const ax=multiply(m,coefficients),a1:Vec=[m[0],m[3]],a2:Vec=[m[1],m[4]],target:Vec=[m[2],m[5]];
  const term1:Vec=[a1[0]*coefficients[0],a1[1]*coefficients[0]],term2:Vec=[a2[0]*coefficients[1],a2[1]*coefficients[1]];
  const finite=[...ax,...coefficients].every(Number.isFinite);
  function updateX(next:Vec){
    setX(next);
    const total=multiply(m,next),first:Vec=[m[0]*next[0],m[3]*next[0]];
    const extent=Math.max(2,...[...total,...first,...a1,...a2,...target].filter(Number.isFinite).map(Math.abs));
    if(autoFit)setRange(previous=>extent>previous*.86?extent*1.25:previous);
  }
  function preset(i:number){editMatrix(examples[i].m.map(String));setX([1,1]);setRange(6);setAutoFit(true);}
  function setTarget(v:Vec){editMatrix(values.map((n,i)=>i===2?String(v[0]):i===5?String(v[1]):n));}
  const line=a1.some(n=>n!==0)?a1:a2, norm=Math.hypot(...line);
  const unit:Vec=norm?[line[0]/norm,line[1]/norm]:[0,0];
  function dragTarget(v:Vec){
    if(snap&&result.rank===1){const t=v[0]*unit[0]+v[1]*unit[1];const projected:Vec=[t*unit[0],t*unit[1]];
      if(Math.hypot(v[0]-projected[0],v[1]-projected[1])*210/range<12){setTarget(projected);return;}}
    if(snap&&Math.hypot(...v)*210/range<12){setTarget([0,0]);return;}
    setTarget(v.map(n=>Math.round(n*100)/100) as Vec);
  }
  function changeMode(next:'explore'|'matrix'){
    if(next==='explore'&&mode==='matrix'&&valid&&result.consistent&&result.x.every(Number.isFinite))updateX(result.x);
    setMode(next);
  }
  const example=examples.findIndex(e=>e.m.every((n,i)=>n===Number(values[i])));
  const same=finite&&Math.hypot(ax[0]-target[0],ax[1]-target[1])<=1e-8*Math.max(1,Math.hypot(...target));
  const drawn=[...a1,...a2,...target,...ax,...term1].filter(Number.isFinite);
  const clipped=drawn.some(n=>Math.abs(n)>range);
  function fitOutput(){setRange(Math.max(2,...drawn.map(Math.abs))*1.25);setAutoFit(true);}
  return <section id="column-space" className="la-module cs-lab" aria-labelledby="cs-title">
    <div className="la-module-head"><div><span className="la-label">03 / VISUALIZATION</span><h2 id="cs-title">Column space &amp; <em>consistency.</em></h2></div><p>Edit the augmented matrix [A | b]. Watch the column combinations in output space and the two row equations in input space describe the same system.</p></div>
    <div className="cs-equivalence"><strong>b is a linear combination of columns of A</strong><span>⇔ Ax = b has a solution</span><span>⇔ Ax = b is consistent</span></div>
    <div className="la-tabs" role="tablist" aria-label="Column space mode">{(['explore','matrix'] as const).map(t=><button key={t} id={`${id}-${t}-tab`} role="tab" aria-selected={mode===t} aria-controls={`${id}-panel`} onClick={()=>changeMode(t)}>{t==='explore'?'Explore Mode':'Matrix Mode'}</button>)}</div>
    <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${mode}-tab`}>
      <div className="cs-controls"><div><label htmlFor={`${id}-example`}>Examples</label><select id={`${id}-example`} value={example<0?"custom":String(example)} onChange={e=>preset(Number(e.target.value))}><option value="custom" disabled>Custom matrix</option>{examples.map((p,i)=><option key={i} value={i}>{p.name}</option>)}</select></div>
      <div><span className="cs-caption">[A | b]</span><div className="la-matrix cs-matrix">{[0,1].map(row=><div className="cs-matrix-row" key={row}>{[0,1,2].map(col=><input key={col} type="number" step="any" value={values[row*3+col]} aria-label={`Row ${row+1}, ${col===2?'target b':`column ${col+1}`}`} onChange={e=>editMatrix(values.map((n,i)=>i===row*3+col?e.target.value:n))}/>)}</div>)}</div></div>
      <div className="cs-zoom"><label htmlFor={`${id}-zoom`}>Plot extent: ±{fmt(range)}</label><input id={`${id}-zoom`} type="range" min=".05" max={Math.max(20,Math.ceil(range))} step=".05" value={range} onChange={e=>{setAutoFit(false);setRange(Number(e.target.value));}}/><button className="la-reset" onClick={fitOutput}>Fit vectors</button></div></div>
      {!valid&&<p role="alert" className="la-warning">Finish entering six finite numbers between −10¹² and 10¹². The plot keeps the last valid matrix while you edit.</p>}<>
        <div className={`cs-status ${result.consistent?'':'cs-inconsistent'}`} role="status"><strong>{result.consistent?'Consistent':'Inconsistent'}</strong><span>{result.consistent?'b is a linear combination of the columns of A':'b is not a linear combination of the columns of A'}</span><span>rank(A) = {result.rank} · Col(A) = {result.rank===2?'ℝ²':result.rank===1?'a line through the origin':'{0}'}</span></div>
        <p className="cs-explanation">{result.rank===2?'The columns span the entire plane. Every target b is reachable.':result.rank===1?'The columns span one line. Ax always stays on this line; b is reachable exactly when it lies on the line.':'Both columns are zero. Every Ax equals zero; only b = 0 is reachable.'}</p>
        <div className="cs-workspace">
          {mode==='explore'&&<div className="la-geometry"><h3>Row picture · equations in input space</h3><p>Each row gives a line in the (x₁, x₂) plane. A shared point solves both equations. Drag x or adjust x₁ and x₂ below to explore column combinations.</p><div className="la-step-actions"><button onClick={()=>setTarget(ax)}>Set b = Ax</button><button disabled={!result.consistent || !result.x.every(Number.isFinite)} onClick={()=>updateX(result.x)}>Use a solution for b</button></div><RowSpaceLab matrix={m} x={x} onChange={updateX} />{[0,1].map(i=><div className="cs-coefficient" key={i}><label htmlFor={`${id}-x${i}`}>x{i===0?'₁':'₂'} = {fmt(x[i])}</label><input aria-label={`Coefficient x${i+1}`} className="cs-number" type="number" step=".1" key={`${i}-${x[i]}`} defaultValue={Number(x[i].toPrecision(6))} title="Press Enter to apply" onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();}} onBlur={e=>{if(e.target.value!==''&&Number.isFinite(Number(e.target.value))&&Math.abs(Number(e.target.value))<=1e6)updateX(x.map((n,j)=>i===j?Number(e.target.value):n) as Vec);else e.target.value=fmt(x[i]);}}/><input id={`${id}-x${i}`} type="range" min={Math.min(-6,x[i])} max={Math.max(6,x[i])} step=".01" value={x[i]} onChange={e=>updateX(x.map((n,j)=>i===j?Number(e.target.value):n) as Vec)}/></div>)}</div>}
          {mode==='matrix'&&<div className="la-geometry"><h3>Row picture · equations in input space</h3><RowSpaceLab matrix={m} /></div>}
          <div className="la-geometry"><h3>Output space · Ax and b</h3><p>{mode==='explore'?'Drag the red b handle to test which targets are reachable.':'The system automatically draws a solution when one exists.'}</p>
            <div className="cs-plot-options"><label><input type="checkbox" checked={showColumns} onChange={e=>setShowColumns(e.target.checked)}/> Show original columns</label>{mode==='explore'&&<label><input type="checkbox" checked={snap} onChange={e=>setSnap(e.target.checked)}/> Snap b to the line and origin</label>}</div><div style={{position:'relative'}}><div role="group" aria-label="Output space zoom" style={{position:'absolute',top:8,right:8,zIndex:2,display:'flex',gap:5,background:'var(--paper)',padding:4,border:'1px solid var(--rule)'}}>
              <button type="button" className="la-reset" aria-label="Zoom in output space" title="Zoom in" style={{minWidth:44,minHeight:44,fontSize:20}} onClick={()=>zoomOutput(1/1.25)}>+</button>
              <button type="button" className="la-reset" aria-label="Zoom out output space" title="Zoom out" style={{minWidth:44,minHeight:44,fontSize:20}} onClick={()=>zoomOutput(1.25)}>−</button>
              <button type="button" className="la-reset" aria-label="Fit output space vectors" style={{minHeight:44,fontSize:14}} onClick={fitOutput}>Fit</button>
            </div><Plot id={`${id}-output`} range={range} point={target} onZoom={zoomOutput} label="Output plane showing column space, columns, target and vector combination." onDrag={mode==='explore'?dragTarget:undefined}>
              {result.rank===2?<rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".09"/>:result.rank===1?<line x1={250-unit[0]*700} y1={250+unit[1]*700} x2={250+unit[0]*700} y2={250-unit[1]*700} stroke="var(--accent)" strokeWidth="14" opacity=".19"/>:<circle cx="250" cy="250" r="10" fill="var(--accent)" opacity=".3"/>}
              {showColumns&&<><Arrow v={a1} range={range} color="#477aa8" label="a₁" offset={[-26,20]}/><Arrow v={a2} range={range} color="#a16e39" label="a₂" offset={[-26,20]}/></>}
              {!result.consistent&&<Arrow v={[target[0]-result.projection[0],target[1]-result.projection[1]]} from={result.projection} range={range} color="#bc5757" label="unreachable gap" dashed/>}
              {!same&&<Arrow v={target} range={range} color="#bc5757" label="b" offset={[12,24]}/>}
              {(mode==='explore'||result.consistent)&&finite&&<>
                <Arrow v={ax} range={range} color="#328577" label={same?'Ax = b':'Ax'} offset={[10,-12]}/>
                <Arrow v={term1} range={range} color="#8464ac" label={Math.hypot(...term1)===0?'x₁a₁ = 0':'x₁a₁'} offset={[-48,26]} highlight labelAtMiddle/>
                <Arrow v={term2} from={term1} range={range} color="#b23b88" label={Math.hypot(...term2)===0?'x₂a₂ = 0':'x₂a₂'} offset={[10,26]} highlight labelAtMiddle/>
                <circle cx={250+term1[0]*210/range} cy={250-term1[1]*210/range} r="5" fill="var(--paper)" stroke="#b23b88" strokeWidth="2"/>
              </>}

            </Plot></div>
            <p className="cs-caption">Scroll over this canvas to zoom, or use + / −. Zoom is centered on the origin. {autoFit?'Auto-fit follows x.':'Manual zoom stays fixed while x moves. Choose Fit to resume auto-fit.'}</p>
            <div className="cs-legend"><span style={{color:'#477aa8'}}>a₁</span><span style={{color:'#a16e39'}}>a₂</span><span style={{color:'#8464ac'}}>x₁a₁</span><span style={{color:'#b23b88'}}>x₂a₂ · starts at the tip of x₁a₁</span><span style={{color:'#328577'}}>Ax</span><span style={{color:'#bc5757'}}>b</span><span>Shading · Col(A)</span></div>
            {clipped&&<p className="cs-caption">Some vectors extend beyond this view. Use “Fit vectors” to see them.</p>}
          </div>
        </div>
        <div className="cs-calculation">{mode==='matrix'&&!result.consistent?<><strong>No solution</strong><p>b = {pair(target)} lies outside Col(A). The dashed gap shows why no combination reaches b.</p></>:!finite?<p>The solution exceeds the supported numeric range. Rescale the matrix entries.</p>:<><strong>{mode==='matrix'?'One solution':'Current coefficients'}: x₁ = {fmt(coefficients[0])}, x₂ = {fmt(coefficients[1])}</strong><p>{fmt(coefficients[0])} a₁ + {fmt(coefficients[1])} a₂ = {pair(ax)} {same?'= b':'≠ b'}</p>{mode==='explore'&&<p className={same?'cs-match':''}>{same?'These coefficients reach b.':result.consistent?'b is reachable, but the current coefficients do not reach it.':'No coefficients can reach this b.'}</p>}{mode==='matrix'&&result.rank<2&&<p>There are infinitely many solutions. This is one valid choice.</p>}</>}</div>
      </>
      <p className="cs-caption">Rank and line membership use relative numerical tolerance 10⁻¹⁰. Extremely close cases are treated as equal at this precision.</p>
    </div>
  </section>;
}
