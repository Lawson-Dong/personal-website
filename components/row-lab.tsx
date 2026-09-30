'use client';
import { useMemo, useState } from 'react';

type Row = [number, number, number];
type Matrix = [Row, Row];
type Op = 'replace' | 'scale' | 'swap';
const START: Matrix = [[1, 1, 3], [2, -1, 0]];
const clean = (n: number) => Math.abs(n) < 1e-9 ? 0 : n;
const fmt = (n: number) => Number.isFinite(n) ? String(Number(clean(n).toFixed(3))) : '—';
const add = (a: Row, b: Row, k: number): Row => a.map((v, i) => clean(v + k * b[i])) as Row;
const scale = (a: Row, k: number): Row => a.map(v => clean(v * k)) as Row;
const det = (m: Matrix) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
function solution(m: Matrix): [number, number] | null {
  const d = det(m);
  return Math.abs(d) < 1e-9 ? null : [(m[0][2] * m[1][1] - m[0][1] * m[1][2]) / d, (m[0][0] * m[1][2] - m[0][2] * m[1][0]) / d];
}
function steps(input: Matrix): {m: Matrix, label: string, note: string}[] {
  let m: Matrix = [[...input[0]], [...input[1]]];
  const out = [{m, label: 'Start', note: 'Two rows, two constraints. Choose a nonzero pivot in the first column.'}];
  const push = (label: string, note: string) => out.push({m: [[...m[0]], [...m[1]]], label, note});
  if (Math.abs(m[0][0]) < 1e-9 && Math.abs(m[1][0]) > 1e-9) { m = [m[1], m[0]]; push('R₁ ↔ R₂', 'Swap rows to bring a nonzero pivot into the first position.'); }
  if (Math.abs(m[0][0]) > 1e-9) {
    const k = -m[1][0] / m[0][0];
    if (Math.abs(k) > 1e-9) { m = [m[0], add(m[1], m[0], k)]; push(`R₂ ← R₂ + (${fmt(k)})R₁`, 'Choose the multiplier that makes the lower-left entry zero. This is elimination.'); }
  }
  if (Math.abs(m[1][1]) < 1e-9 && Math.abs(m[0][1]) > 1e-9 && Math.abs(m[0][0]) < 1e-9) { m = [m[1], m[0]]; push('R₁ ↔ R₂', 'Move a nonzero coefficient into pivot position.'); }
  if (Math.abs(m[1][1]) > 1e-9 && Math.abs(m[1][1] - 1) > 1e-9) { const k = 1 / m[1][1]; m = [m[0], scale(m[1], k)]; push(`R₂ ← (${fmt(k)})R₂`, 'Scale the second pivot to one.'); }
  if (Math.abs(m[0][0]) > 1e-9 && Math.abs(m[0][0] - 1) > 1e-9) { const k = 1 / m[0][0]; m = [scale(m[0], k), m[1]]; push(`R₁ ← (${fmt(k)})R₁`, 'Scale the first pivot to one.'); }
  if (Math.abs(m[1][1]) > 1e-9 && Math.abs(m[0][1]) > 1e-9) { const k = -m[0][1] / m[1][1]; m = [add(m[0], m[1], k), m[1]]; push(`R₁ ← R₁ + (${fmt(k)})R₂`, 'Gauss–Jordan step: clear above the second pivot.'); }
  return out;
}
function expr(r: Row) { return `${fmt(r[0])}x ${r[1] < 0 ? '−' : '+'} ${fmt(Math.abs(r[1]))}y = ${fmt(r[2])}`; }
function line(r: Row): [number, number, number, number] | null {
  const [a,b,c] = r; if (Math.abs(a) + Math.abs(b) < 1e-8) return null;
  const pts: [number,number][] = [];
  for (const x of [-5, 5]) if (Math.abs(b) > 1e-9) pts.push([x, (c - a*x)/b]);
  for (const y of [-5, 5]) if (Math.abs(a) > 1e-9) pts.push([(c-b*y)/a, y]);
  const inside = pts.filter(([x,y]) => x >= -5.00001 && x <= 5.00001 && y >= -5.00001 && y <= 5.00001);
  if (inside.length < 2) return null;
  return [inside[0][0], inside[0][1], inside[inside.length-1][0], inside[inside.length-1][1]];
}
function Geometry({m, sol}: {m: Matrix, sol: [number,number] | null}) {
  const toX = (v:number) => 180 + 30*v, toY = (v:number) => 180 - 30*v;
  return <svg className="la-plot" viewBox="0 0 360 360" role="img" aria-label={sol ? `Two equations intersect at x equals ${fmt(sol[0])}, y equals ${fmt(sol[1])}` : 'Constraint lines without a unique intersection'}>
    <defs><pattern id="la-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--rule)" strokeWidth=".7"/></pattern></defs>
    <rect width="360" height="360" fill="url(#la-grid)"/><path d="M 0 180 H 360 M 180 0 V 360" stroke="var(--muted)" strokeWidth="1"/><text x="342" y="173">x</text><text x="188" y="17">y</text>
    {m.map((r,i) => { const l=line(r); return l && <line key={i} x1={toX(l[0])} y1={toY(l[1])} x2={toX(l[2])} y2={toY(l[3])} stroke={i ? 'var(--la-second)' : 'var(--accent)'} strokeWidth="3" className="la-geom-line"/>; })}
    {sol && Math.abs(sol[0]) <= 5 && Math.abs(sol[1]) <= 5 && <><circle cx={toX(sol[0])} cy={toY(sol[1])} r="7" fill="var(--ink)" stroke="var(--paper)" strokeWidth="3"/><text x={toX(sol[0])+12} y={toY(sol[1])-11} className="la-point-label">({fmt(sol[0])}, {fmt(sol[1])})</text></>}
  </svg>;
}
function MatrixView({m, editable, onCell}: {m: Matrix, editable?: boolean, onCell?: (i:number,j:number,value:number)=>void}) {
  return <div className="la-matrix" aria-label="Augmented matrix">{m.map((r,i) => <div className="la-matrix-row" key={i}><span className="la-row-tag">R{i+1}</span>{r.map((v,j) => editable ? <input key={j} type="number" step="any" aria-label={`Row ${i+1}, ${j === 2 ? 'right-hand side' : `coefficient ${j+1}`}`} value={v} onChange={e=>onCell?.(i,j,Number(e.target.value))}/> : <span className={j===2?'la-constant':''} key={j}>{fmt(v)}</span>)}</div>)}</div>;
}
export function RowLab() {
  const [input,setInput] = useState<Matrix>(START);
  const [op,setOp] = useState<Op>('replace');
  const [k,setK] = useState(-2);
  const [step,setStep] = useState(0);
  const sequence = useMemo(()=>steps(input),[input]);
  const sol = solution(input);
  const preview: Matrix = op === 'swap' ? [input[1],input[0]] : op === 'scale' ? [scale(input[0], k || 1),input[1]] : [input[0],add(input[1],input[0],k)];
  const active = sequence[Math.min(step,sequence.length-1)];
  function edit(i:number,j:number,v:number) { setInput(prev=>prev.map((r,ri)=>r.map((n,ci)=>ri===i && ci===j ? v : n) as Row) as Matrix); setStep(0); }
  return <div className="la-lab">
    <div className="la-input"><div><span className="la-label">SHARED EXAMPLE · AX = B</span><MatrixView m={input} editable onCell={edit}/><p>Change any of the six values; both visualizations update together.</p></div><button type="button" className="la-reset" onClick={()=>{setInput(START);setK(-2);setStep(0);setOp('replace');}}>Reset example</button></div>

    <section className="la-module" id="gaussian-elimination" aria-labelledby="la-ge-title"><div className="la-module-head"><div><span className="eyebrow">01 / VISUALIZATION</span><h2 id="la-ge-title">Gaussian <em>Elimination.</em></h2></div><p>Step through a purposeful sequence of EROs. A row changes, a line moves, and the common intersection stays fixed.</p></div>
      <div className="la-ge-layout"><div className="la-ge-controls"><span className="la-label">CURRENT OPERATION</span><h3>{active.label}</h3><p>{active.note}</p><div className="la-step-card"><span className="la-label">AUGMENTED MATRIX</span><MatrixView m={active.m}/><div className="la-equations"><span>{expr(active.m[0])}</span><span>{expr(active.m[1])}</span></div></div><div className="la-step-actions"><button type="button" onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>Previous</button><span>STEP {step+1} / {sequence.length}</span><button type="button" onClick={()=>setStep(Math.min(sequence.length-1,step+1))} disabled={step===sequence.length-1}>Next step</button></div></div><div className="la-geometry"><div className="la-geometry-head"><span className="la-label">GEOMETRY AT THIS STEP</span><span>{sol ? `Solution (${fmt(sol[0])}, ${fmt(sol[1])})` : 'No unique solution'}</span></div><Geometry m={active.m} sol={sol}/><div className="la-legend"><span><i/> Row 1</span><span><i/> Row 2</span><span>● Common solution</span></div></div></div><p className="la-module-foot">The step that clears below the first pivot is Gaussian elimination. Clearing above a pivot afterward is the Gauss–Jordan extension.</p>
    </section>

    <section className="la-module" id="elementary-row-operations" aria-labelledby="la-ero-title"><div className="la-module-head"><div><span className="eyebrow">02 / VISUALIZATION</span><h2 id="la-ero-title">Elementary Row <em>Operations.</em></h2></div><p>Explore the three moves independently. Gaussian elimination uses these same moves, choosing multipliers that make selected coefficients zero.</p></div>
      <div className="la-tabs" role="tablist" aria-label="Elementary row operation">{([['replace','Add a multiple'],['scale','Scale a row'],['swap','Swap rows']] as [Op,string][]).map(([key,label])=><button role="tab" aria-selected={op===key} key={key} onClick={()=>setOp(key)}>{label}</button>)}</div>
      <div className="la-workspace"><div className="la-control-panel"><span className="la-label">CURRENT MOVE</span><h3>{op==='replace'?'R₂ ← R₂ + cR₁':op==='scale'?'R₁ ← cR₁':'R₁ ↔ R₂'}</h3><p>{op==='replace'?'Add a multiple of row 1 to row 2. Move c until a coefficient becomes zero.':op==='scale'?'Multiply the entire first equation by a nonzero number. Its line stays in place.':'Exchange the equations. Their lines stay in place; only the row labels trade positions.'}</p>{op!=='swap' && <div className="la-slider"><label htmlFor="la-coeff">Multiplier c <output>{fmt(op==='scale' ? (k || 1) : k)}</output></label><input id="la-coeff" type="range" min="-4" max="4" step="0.05" value={k} onChange={e=>setK(Number(e.target.value))}/><div className="la-range"><span>−4</span><span>0</span><span>4</span></div>{op==='replace' && Math.abs(input[0][0])>1e-9 && <button type="button" className="la-pivot" onClick={()=>setK(-input[1][0]/input[0][0])}>Choose c = {fmt(-input[1][0]/input[0][0])} to eliminate x</button>}{op==='scale' && k===0 && <p className="la-warning">Scaling by zero is not an ERO; the preview uses c = 1.</p>}</div>}<div className="la-result-matrix"><span className="la-label">RESULTING MATRIX</span><MatrixView m={preview}/><div className="la-equations"><span>{expr(preview[0])}</span><span>{expr(preview[1])}</span></div></div></div><div className="la-geometry"><div className="la-geometry-head"><span className="la-label">GEOMETRY OF THE NEW ROWS</span><span>{sol ? `Solution (${fmt(sol[0])}, ${fmt(sol[1])})` : 'No unique solution'}</span></div><Geometry m={preview} sol={sol}/><div className="la-legend"><span><i/> Row 1</span><span><i/> Row 2</span><span>● Common solution</span></div></div></div>
    </section>
  </div>;
}
