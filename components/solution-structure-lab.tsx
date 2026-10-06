'use client';

import { useId, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { MathTex } from './math';
import { multiply, solveColumns, type Augmented, type Vec } from './column-space-math';

const examples: { name: string; matrix: Augmented }[] = [
  { name: 'Infinitely many · a translated line', matrix: [1, 1, 2, 2, 2, 4] },
  { name: 'Unique solution · a single point', matrix: [2, 1, 3, 1, 2, 3] },
  { name: 'No solution · incompatible equations', matrix: [1, 1, 2, 2, 2, 5] },
  { name: 'Rank zero · the whole plane', matrix: [0, 0, 0, 0, 0, 0] },
  { name: 'Rank zero · no solution', matrix: [0, 0, 1, 0, 0, 0] },
];
const fmt = (n: number) => Math.abs(n) < 1e-9 ? '0' : String(Number(n.toPrecision(4)));
const vectorTex = (v: Vec) => String.raw`\begin{pmatrix}${fmt(v[0])}\\${fmt(v[1])}\end{pmatrix}`;
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1]];
const color = { homogeneous: '#8464ac', particular: '#477aa8', solution: '#328577' };

function Plane({ id, range, label, children }: { id: string; range: number; label: string; children: ReactNode }) {
  return <svg className="ss-plot" viewBox="0 0 500 500" role="img" aria-label={label}>
    <defs><clipPath id={`${id}-clip`}><rect x="40" y="40" width="420" height="420" /></clipPath></defs>
    <g clipPath={`url(#${id}-clip)`}>
      {Array.from({ length: 11 }, (_, i) => 40 + 42 * i).map(c => <g key={c} stroke="var(--rule)" strokeWidth=".6"><line x1={c} x2={c} y1="40" y2="460" /><line x1="40" x2="460" y1={c} y2={c} /></g>)}
      <g stroke="var(--muted)"><line x1="40" x2="460" y1="250" y2="250" /><line x1="250" x2="250" y1="40" y2="460" /></g>
      {children}
    </g>
    <g fill="var(--muted)" fontSize="14"><text x="238" y="480">0</text><text x="425" y="480">{fmt(range)}</text><text x="40" y="480">{fmt(-range)}</text><text x="260" y="31">{fmt(range)}</text><text x="473" y="246">x₁</text><text x="220" y="26">x₂</text></g>
  </svg>;
}

function SolutionSet({ rank, origin, direction, range, stroke }: { rank: number; origin: Vec; direction: Vec; range: number; stroke: string }) {
  const x = 250 + origin[0] * 210 / range, y = 250 - origin[1] * 210 / range;
  const norm = Math.hypot(...direction);
  if (rank === 0) return <rect x="40" y="40" width="420" height="420" fill={stroke} opacity=".12" />;
  if (rank === 2) return <circle cx={x} cy={y} r="10" fill={stroke} opacity=".3" />;
  // Extend far enough to intersect the view even when p lies outside it.
  const extent = 800 + Math.hypot(x - 250, y - 250);
  const dx = direction[0] / norm * extent, dy = -direction[1] / norm * extent;
  return <><line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={stroke} strokeWidth="12" opacity=".16" /><line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={stroke} strokeWidth="1.5" /></>;
}

function VectorArrow({ from = [0, 0], to, range, stroke, label, dashed = false }: { from?: Vec; to: Vec; range: number; stroke: string; label: string; dashed?: boolean }) {
  const sx = 250 + from[0] * 210 / range, sy = 250 - from[1] * 210 / range;
  const ex = 250 + to[0] * 210 / range, ey = 250 - to[1] * 210 / range;
  const angle = Math.atan2(ey - sy, ex - sx), zero = Math.hypot(ex - sx, ey - sy) < 1e-6;
  return <g stroke={stroke} fill={stroke}>
    <line x1={sx} y1={sy} x2={ex} y2={ey} strokeWidth="3" strokeDasharray={dashed ? '6 5' : undefined} />
    {!zero && <path d={`M ${ex - 10 * Math.cos(angle - .4)} ${ey - 10 * Math.sin(angle - .4)} L ${ex} ${ey} L ${ex - 10 * Math.cos(angle + .4)} ${ey - 10 * Math.sin(angle + .4)}`} fill="none" strokeWidth="2.5" />}
    <circle cx={ex} cy={ey} r="4" /><text x={(sx + ex) / 2 + 9} y={(sy + ey) / 2 - 12} fontSize="16" stroke="var(--paper)" strokeWidth="4" paintOrder="stroke">{zero ? `${label} = 0` : label}</text>
  </g>;
}

export function SolutionStructureLab() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [values, setValues] = useState(examples[0].matrix.map(String));
  const [lastMatrix, setLastMatrix] = useState(examples[0].matrix);
  const [homogeneous, setHomogeneous] = useState(false);
  const [t, setT] = useState(1), [s, setS] = useState(0);
  const [range, setRange] = useState(5);
  const valid = values.every(v => v.trim() !== '' && Number.isFinite(Number(v)) && Math.abs(Number(v)) <= 20);
  const original = valid ? values.map(Number) as Augmented : lastMatrix;
  const matrix = original.map((v, i) => homogeneous && (i === 2 || i === 5) ? 0 : v) as Augmented;
  const result = solveColumns(matrix), { rank, consistent } = result;
  const row: Vec = Math.hypot(matrix[0], matrix[1]) >= Math.hypot(matrix[3], matrix[4]) ? [matrix[0], matrix[1]] : [matrix[3], matrix[4]];
  const scale = Math.max(...row.map(Math.abs));
  const direction: Vec = rank === 1 ? [-row[1] / scale, row[0] / scale] : [1, 0];
  const vh: Vec = rank === 2 ? [0, 0] : rank === 1 ? [t * direction[0], t * direction[1]] : [t, s];
  const p = result.x, x = add(p, vh), b: Vec = [matrix[2], matrix[5]];
  const example = examples.findIndex(e => e.matrix.every((v, i) => v === Number(values[i])));
  const drag = useRef<number | null>(null);
  function edit(next: string[]) {
    setValues(next);
    if (next.every(v => v.trim() !== '' && Number.isFinite(Number(v)) && Math.abs(Number(v)) <= 20)) setLastMatrix(next.map(Number) as Augmented);
    setT(0); setS(0);
  }
  function preset(index: number) { edit(examples[index].matrix.map(String)); setHomogeneous(false); setT(1); setRange(5); }
  function fit() { setRange(Math.max(2, ...[...vh, ...(consistent ? [...p, ...x] : [])].map(Math.abs)) * 1.3); }
  function move(event: PointerEvent<SVGCircleElement>) {
    if (drag.current !== event.pointerId || !consistent || rank === 2) return;
    const transform = event.currentTarget.ownerSVGElement?.getScreenCTM();
    if (!transform) return;
    const cursor = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse());
    const next: Vec = [(cursor.x - 250) * range / 210 - p[0], (250 - cursor.y) * range / 210 - p[1]];
    const clamp = (value: number) => Math.max(-4, Math.min(4, value));
    setT(clamp(rank === 1 ? (next[0] * direction[0] + next[1] * direction[1]) / (direction[0] ** 2 + direction[1] ** 2) : next[0]));
    if (rank === 0) setS(clamp(next[1]));
  }
  const familyTex = rank === 2 ? `x=p=${vectorTex(p)}` : rank === 1 ? `x=${vectorTex(p)}+t${vectorTex(direction)},\\quad t\\in\\mathbb R` : String.raw`x=\begin{pmatrix}t\\s\end{pmatrix},\quad t,s\in\mathbb R`;
  return <section id="solution-structure" className="la-module ss-lab" aria-labelledby={`${id}-title`}>
    <div className="la-module-head"><div><span className="la-label">04 / VISUALIZATION</span><h2 id={`${id}-title`}>Solutions &amp; <em>their structure.</em></h2></div><p>A homogeneous system always has the zero solution. When Ax = b is consistent, every solution is one particular solution plus a solution of Ax = 0.</p></div>
    <div className="ss-identity"><MathTex tex={String.raw`\{x:Ax=b\}=p+\operatorname{Null}(A)`} /><span>provided Ax = b has a solution</span></div>
    <div className="cs-controls ss-controls">
      <div><label htmlFor={`${id}-example`}>Examples · two equations, two unknowns</label><select id={`${id}-example`} value={example < 0 ? 'custom' : example} onChange={e => preset(Number(e.target.value))}><option value="custom" disabled>Custom matrix</option>{examples.map((e, i) => <option key={e.name} value={i}>{e.name}</option>)}</select><label className="ss-checkbox"><input type="checkbox" checked={homogeneous} onChange={e => { setHomogeneous(e.target.checked); setT(0); setS(0); }} /> Set b = 0 · compare the same A</label></div>
      <div><span className="cs-caption"><MathTex tex={String.raw`[A\mid b]`} /></span><div className="la-matrix cs-matrix">{[0, 1].map(r => <div className="cs-matrix-row" key={r}>{[0, 1, 2].map(c => <input type="number" step="any" min="-20" max="20" key={c} disabled={homogeneous && c === 2} value={homogeneous && c === 2 ? '0' : values[r * 3 + c]} aria-label={`Solution structure row ${r + 1}, ${c === 2 ? 'target b' : `column ${c + 1}`}`} onChange={e => edit(values.map((v, i) => i === r * 3 + c ? e.target.value : v))} />)}</div>)}</div></div>
      <div className="ss-view-controls"><span className="cs-caption">View extent: ±{fmt(range)}</span><div className="la-step-actions"><button aria-label="Zoom in solution plots" onClick={() => setRange(r => Math.max(.01, r / 1.4))}>+</button><button aria-label="Zoom out solution plots" onClick={() => setRange(r => Math.min(1e13, r * 1.4))}>−</button><button onClick={fit}>Fit points</button><button onClick={() => { setT(0); setS(0); }}>Reset parameters</button></div></div>
    </div>
    {!valid && <p className="la-warning" role="alert">Enter six numbers between −20 and 20. The diagrams keep the last valid matrix while you edit.</p>}
    <div className={`cs-status ${consistent ? '' : 'cs-inconsistent'}`} role="status"><strong>{!consistent ? 'No solution' : rank === 2 ? 'Unique solution' : 'Infinitely many solutions'}</strong><span><MathTex tex={`\\operatorname{rank}(A)=${rank},\\quad n=2,\\quad \\dim\\operatorname{Null}(A)=${2 - rank}`} /></span><span>{rank === 2 ? 'No free variables. The homogeneous solution is only 0.' : `${2 - rank} free ${rank === 1 ? 'variable' : 'variables'}. Ax = 0 has nontrivial solutions.`} {!consistent && 'For this b, the equations are incompatible.'}</span></div>
    <div className="ss-parameters">
      {rank < 2 ? <>{[0, ...(rank === 0 ? [1] : [])].map(i => <div className="la-slider" key={i}><label htmlFor={`${id}-parameter-${i}`}>{i === 0 ? 't' : 's'} · free parameter<output>{fmt(i === 0 ? t : s)}</output></label><input id={`${id}-parameter-${i}`} aria-label={`Free parameter ${i === 0 ? 't' : 's'}`} type="range" min="-4" max="4" step=".01" value={i === 0 ? t : s} onChange={e => (i === 0 ? setT : setS)(Number(e.target.value))} /><div className="la-range"><span>−4</span><span>4</span></div></div>)}<p>Move a parameter to explore the homogeneous solution. {consistent ? 'Drag the green point to explore x = p + vₕ.' : 'The left diagram remains valid even when Ax = b has no solution.'} The sliders show a finite sample of the full solution set.</p></> : <p>The matrix has a pivot in every column. No free parameter remains: vₕ = 0 and x = p.</p>}
    </div>
    <div className="cs-workspace ss-workspace">
      <div className="la-geometry"><h3>Homogeneous · <MathTex tex="Av_h=0" /></h3><p>{rank === 2 ? 'Only the origin solves the system.' : rank === 1 ? 'A line through the origin. Every point on it maps to zero.' : 'The entire plane. A is zero, so every vector maps to zero.'}</p>
        <Plane id={`${id}-homogeneous`} range={range} label="Homogeneous solution set in the x1, x2 plane, always containing the origin."><SolutionSet rank={rank} origin={[0, 0]} direction={direction} range={range} stroke={color.homogeneous} /><VectorArrow to={vh} range={range} stroke={color.homogeneous} label="vₕ" /></Plane>
        <div className="ss-vector-value"><MathTex tex={`v_h=${vectorTex(vh)}`} /><MathTex tex={`Av_h=${vectorTex(multiply(matrix, vh))}`} /></div>
      </div>
      <div className="la-geometry"><h3>{homogeneous ? 'Same system' : 'Target system'} · <MathTex tex="Ax=b" /></h3><p>{!consistent ? 'The solution set is empty. There is no particular solution p to translate from.' : rank === 2 ? 'A single point p. Adding the zero vector leaves it unchanged.' : rank === 1 ? 'Translate the entire null-space line by p. Its direction stays the same.' : 'With A = 0 and b = 0, every point is a solution.'}</p>
        <Plane id={`${id}-target`} range={range} label={consistent ? 'Target solution set showing the vector sum x equals p plus vh.' : 'Empty solution set: Ax equals b is inconsistent.'}>
          {consistent ? <><SolutionSet rank={rank} origin={p} direction={direction} range={range} stroke={color.solution} /><VectorArrow to={vh} range={range} stroke={color.homogeneous} label="vₕ" dashed /><VectorArrow to={p} range={range} stroke={color.particular} label="p" /><VectorArrow from={p} to={x} range={range} stroke={color.homogeneous} label="vₕ" /><circle cx={250 + x[0] * 210 / range} cy={250 - x[1] * 210 / range} r="10" fill="var(--paper)" stroke={color.solution} strokeWidth="3" className={rank < 2 ? 'ss-handle' : undefined} onPointerDown={e => { if (rank === 2 || e.button !== 0) return; e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = e.pointerId; }} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}><title>{rank < 2 ? 'Drag x along the solution set; keyboard users can use the parameter sliders.' : 'Unique solution x = p'}</title></circle><text x={250 + x[0] * 210 / range + 14} y={250 - x[1] * 210 / range + 22} fill={color.solution} fontSize="16" stroke="var(--paper)" strokeWidth="4" paintOrder="stroke">x</text></> : <g fill="var(--ink)" textAnchor="middle"><rect x="90" y="187" width="320" height="110" fill="var(--paper)" stroke="var(--rule)" /><text x="250" y="233" fontSize="26">∅</text><text x="250" y="272" fontSize="16">No x reaches this b</text></g>}
        </Plane>
        <div className="cs-legend"><span style={{ color: color.particular }}>Blue · particular solution p</span><span style={{ color: color.homogeneous }}>Purple · homogeneous solution vₕ</span><span style={{ color: color.solution }}>Green · solution x</span></div>
      </div>
    </div>
    <div className="cs-calculation ss-calculation">{consistent ? <><strong>All solutions</strong><MathTex display tex={familyTex} /><div className="ss-verification"><MathTex tex={`Ap=${vectorTex(b)}`} /><MathTex tex={`Av_h=${vectorTex(multiply(matrix, vh))}`} /><MathTex tex={`Ax=A(p+v_h)=b=${vectorTex(multiply(matrix, x))}`} /></div><p>Here p is one convenient choice. Any particular solution gives the same translated solution set.</p></> : <><strong>No particular solution exists</strong><p><MathTex tex={`b=${vectorTex(b)}\\notin\\operatorname{Col}(A)`} />. The formula x = p + vₕ applies only to consistent systems.</p></>}</div>
    <div className="ss-takeaways"><p><MathTex tex={String.raw`Ax=0:\quad\text{nontrivial solution}\iff\text{free variable}\iff\operatorname{rank}(A)<n`} /></p><p>If Ax = b is consistent, its solution set is a translate of Null(A). For b = 0 it passes through the origin; for b ≠ 0 it does not.</p></div>
    <p className="cs-caption">This view uses n = 2. The same structure holds in any dimension. Rank uses relative numerical tolerance 10⁻¹⁰; nearly dependent rows are treated as dependent.</p>
  </section>;
}
