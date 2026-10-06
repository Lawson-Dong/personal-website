'use client';

import { useId, useState, type ReactNode } from 'react';
import { MathTex } from './math';
import { RowSpaceLab } from './row-space-lab';
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
    <g fill="var(--muted)" fontSize="14"><text x="238" y="480">0</text><text x="425" y="480">{fmt(range)}</text><text x="40" y="480">{fmt(-range)}</text><text x="260" y="31">{fmt(range)}</text><text x="473" y="246">y₁</text><text x="220" y="26">y₂</text></g>
  </svg>;
}

function VectorArrow({ from = [0, 0], to, range, stroke, label, dashed = false, offset = [9, -12] }: { from?: Vec; to: Vec; range: number; stroke: string; label: string; dashed?: boolean; offset?: Vec }) {
  const sx = 250 + from[0] * 210 / range, sy = 250 - from[1] * 210 / range;
  const ex = 250 + to[0] * 210 / range, ey = 250 - to[1] * 210 / range;
  const angle = Math.atan2(ey - sy, ex - sx), zero = Math.hypot(ex - sx, ey - sy) < 1e-6;
  return <g stroke={stroke} fill={stroke}>
    <line x1={sx} y1={sy} x2={ex} y2={ey} strokeWidth="3" strokeDasharray={dashed ? '6 5' : undefined} />
    {!zero && <path d={`M ${ex - 10 * Math.cos(angle - .4)} ${ey - 10 * Math.sin(angle - .4)} L ${ex} ${ey} L ${ex - 10 * Math.cos(angle + .4)} ${ey - 10 * Math.sin(angle + .4)}`} fill="none" strokeWidth="2.5" />}
    <circle cx={ex} cy={ey} r="4" /><text x={(sx + ex) / 2 + offset[0]} y={(sy + ey) / 2 + offset[1]} fontSize="16" stroke="var(--paper)" strokeWidth="4" paintOrder="stroke">{zero ? `${label} = 0` : label}</text>
  </g>;
}

function ColumnOutput({ id, matrix, coefficients, range, title, label, coefficientName, onFit }: {
  id: string; matrix: Augmented; coefficients?: Vec; range: number; title: string; label: string; coefficientName: 'p' | 'x'; onFit: () => void;
}) {
  const result = solveColumns(matrix);
  const a1: Vec = [matrix[0], matrix[3]], a2: Vec = [matrix[1], matrix[4]], b: Vec = [matrix[2], matrix[5]];
  const row = Math.hypot(...a1) >= Math.hypot(...a2) ? a1 : a2;
  const norm = Math.hypot(...row);
  const term1: Vec = coefficients ? [a1[0] * coefficients[0], a1[1] * coefficients[0]] : [0, 0];
  const total = coefficients ? multiply(matrix, coefficients) : result.projection;
  return <div className="la-geometry ss-output-card">
    <h3>{title}</h3>
    <p>{coefficientName === 'p' ? 'Use p as the column coefficients.' : 'Use x = p + vₕ as the column coefficients. Each contribution can change; their sum stays at b.'}</p>
    <div className="ss-output-tools"><span className="cs-caption">Column space · output plane (y₁, y₂)</span><button className="la-reset" onClick={onFit}>Fit output vectors</button></div>
    <Plane id={id} range={range} label={label}>
      {result.rank === 2 ? <rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".09" /> : result.rank === 1 ? <line x1={250 - row[0] / norm * 800} y1={250 + row[1] / norm * 800} x2={250 + row[0] / norm * 800} y2={250 - row[1] / norm * 800} stroke="var(--accent)" strokeWidth="14" opacity=".17" /> : <circle cx="250" cy="250" r="10" fill="var(--accent)" opacity=".25" />}
      <VectorArrow to={a1} range={range} stroke="#477aa8" label="a₁" dashed offset={[-30, 20]} />
      <VectorArrow to={a2} range={range} stroke="#a16e39" label="a₂" dashed offset={[-30, -18]} />
      {coefficients ? <>
        <VectorArrow to={total} range={range} stroke={color.solution} label={coefficientName === 'p' ? 'Ap = b' : 'Ax = b'} offset={[16, 18]} />
        <VectorArrow to={term1} range={range} stroke={color.homogeneous} label={`${coefficientName}₁a₁`} offset={[10, -15]} />
        <VectorArrow from={term1} to={total} range={range} stroke="#b23b88" label={`${coefficientName}₂a₂`} offset={[10, -15]} />
        <circle cx={250 + total[0] * 210 / range} cy={250 - total[1] * 210 / range} r="8" fill="var(--paper)" stroke={color.solution} strokeWidth="3" />
      </> : <>
        <VectorArrow to={b} range={range} stroke="#bc5757" label="b · unreachable" offset={[12, 20]} />
        <VectorArrow from={result.projection} to={b} range={range} stroke="#bc5757" label="gap" dashed />
      </>}
    </Plane>
    <div className="cs-legend"><span style={{color:'#477aa8'}}>a₁ · dashed</span><span style={{color:'#a16e39'}}>a₂ · dashed</span><span style={{color:color.homogeneous}}>{coefficientName}₁a₁</span><span style={{color:'#b23b88'}}>{coefficientName}₂a₂ · tip to tail</span><span style={{color:color.solution}}>Sum · b</span></div>
    <div className="ss-output-result">{coefficients ? <><MathTex tex={`${coefficientName}=${vectorTex(coefficients)}`} /><MathTex display tex={`${fmt(coefficients[0])}a_1+(${fmt(coefficients[1])})a_2=${vectorTex(total)}=b`} /></> : <p>No particular solution exists: b lies outside Col(A).</p>}</div>
  </div>;
}

function ParameterControls({ id, rank, label, values, onChange }: { id: string; rank: number; label: string; values: Vec; onChange: (v: Vec) => void }) {
  if (rank === 2) return <p className="cs-caption">No free variables: this vector is fixed.</p>;
  return <div className="ss-local-parameters">{[0, ...(rank === 0 ? [1] : [])].map(i => <div className="la-slider" key={i}>
    <label htmlFor={`${id}-${i}`}>{label}{rank === 0 ? ` · coordinate ${i + 1}` : ' · free parameter'}<output>{fmt(values[i])}</output></label>
    <input id={`${id}-${i}`} aria-label={`${label} parameter ${i + 1}`} type="range" min="-4" max="4" step=".01" value={values[i]} onChange={e => onChange(values.map((v, j) => i === j ? Number(e.target.value) : v) as Vec)} />
    <div className="la-range"><span>−4</span><span>4</span></div>
  </div>)}</div>;
}

export function SolutionStructureLab() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [values, setValues] = useState(examples[0].matrix.map(String));
  const [lastMatrix, setLastMatrix] = useState(examples[0].matrix);
  const [homogeneous, setHomogeneous] = useState(false);
  const [pParameters, setPParameters] = useState<Vec>([0, 0]);
  const [vParameters, setVParameters] = useState<Vec>([1.5, 0]);
  const [range, setRange] = useState(6);
  const [autoFit, setAutoFit] = useState(true);
  const valid = values.every(v => v.trim() !== '' && Number.isFinite(Number(v)) && Math.abs(Number(v)) <= 20);
  const original = valid ? values.map(Number) as Augmented : lastMatrix;
  const matrix = original.map((v, i) => homogeneous && (i === 2 || i === 5) ? 0 : v) as Augmented;
  const homogeneousMatrix = matrix.map((v, i) => i === 2 || i === 5 ? 0 : v) as Augmented;
  const result = solveColumns(matrix), { rank, consistent } = result;
  const row: Vec = Math.hypot(matrix[0], matrix[1]) >= Math.hypot(matrix[3], matrix[4]) ? [matrix[0], matrix[1]] : [matrix[3], matrix[4]];
  const scale = Math.max(...row.map(Math.abs));
  const direction: Vec = rank === 1 ? [-row[1] / scale, row[0] / scale] : [1, 0];
  function nullVector(parameters: Vec): Vec {
    return rank === 2 ? [0, 0] : rank === 1 ? [parameters[0] * direction[0], parameters[0] * direction[1]] : parameters;
  }
  const p = add(result.x, nullVector(pParameters)), vh = nullVector(vParameters), x = add(p, vh), b: Vec = [matrix[2], matrix[5]];
  const example = examples.findIndex(e => e.matrix.every((v, i) => v === Number(values[i])));
  const fitRange = Math.max(2, ...[matrix[0], matrix[3], matrix[1], matrix[4], ...b, ...(consistent ? [matrix[0] * p[0], matrix[3] * p[0], matrix[0] * x[0], matrix[3] * x[0]] : [])].map(Math.abs)) * 1.3;
  const outputRange = autoFit ? fitRange : range;
  const familyTex = rank === 2 ? `x=p=${vectorTex(p)}` : rank === 1 ? `x=${vectorTex(p)}+t${vectorTex(direction)},\\quad t\\in\\mathbb R` : `x=${vectorTex(p)}+\\begin{pmatrix}t\\\\s\\end{pmatrix},\\quad t,s\\in\\mathbb R`;
  function reset() { setPParameters([0, 0]); setVParameters([0, 0]); }
  function edit(next: string[]) {
    setValues(next);
    if (next.every(v => v.trim() !== '' && Number.isFinite(Number(v)) && Math.abs(Number(v)) <= 20)) setLastMatrix(next.map(Number) as Augmented);
    reset(); setAutoFit(true);
  }
  function preset(index: number) { edit(examples[index].matrix.map(String)); setHomogeneous(false); setVParameters([1.5, 0]); }
  function dragParameters(next: Vec, base: Vec, setter: (v: Vec) => void) {
    const difference: Vec = [next[0] - base[0], next[1] - base[1]];
    const clamp = (value: number) => Math.max(-4, Math.min(4, value));
    setter(rank === 1 ? [clamp((difference[0] * direction[0] + difference[1] * direction[1]) / (direction[0] ** 2 + direction[1] ** 2)), 0] : difference.map(clamp) as Vec);
  }
  const fit = () => { setAutoFit(true); };
  return <section id="solution-structure" className="la-module ss-lab" aria-labelledby={`${id}-title`}>
    <div className="la-module-head"><div><span className="la-label">04 / VISUALIZATION</span><h2 id={`${id}-title`}>Solutions &amp; <em>their structure.</em></h2></div><p>Choose a particular solution p and a homogeneous solution vₕ in the row pictures. Compare the column combinations before and after adding vₕ.</p></div>
    <div className="ss-identity"><MathTex tex={String.raw`Ap=b,\quad Av_h=0\quad\Longrightarrow\quad A(p+v_h)=b`} /><span>provided Ax = b has a solution</span></div>
    <div className="cs-controls ss-controls">
      <div><label htmlFor={`${id}-example`}>Examples · two equations, two unknowns</label><select id={`${id}-example`} value={example < 0 ? 'custom' : example} onChange={e => preset(Number(e.target.value))}><option value="custom" disabled>Custom matrix</option>{examples.map((e, i) => <option key={e.name} value={i}>{e.name}</option>)}</select><label className="ss-checkbox"><input type="checkbox" checked={homogeneous} onChange={e => { setHomogeneous(e.target.checked); reset(); setAutoFit(true); }} /> Set b = 0 · compare the same A</label></div>
      <div><span className="cs-caption"><MathTex tex={String.raw`[A\mid b]`} /></span><div className="la-matrix cs-matrix">{[0, 1].map(r => <div className="cs-matrix-row" key={r}>{[0, 1, 2].map(c => <input type="number" step="any" min="-20" max="20" key={c} disabled={homogeneous && c === 2} value={homogeneous && c === 2 ? '0' : values[r * 3 + c]} aria-label={`Solution structure row ${r + 1}, ${c === 2 ? 'target b' : `column ${c + 1}`}`} onChange={e => edit(values.map((v, i) => i === r * 3 + c ? e.target.value : v))} />)}</div>)}</div></div>
      <div className="ss-view-controls"><span className="cs-caption">Output extent: ±{fmt(outputRange)}</span><div className="la-step-actions"><button aria-label="Zoom in solution outputs" onClick={() => { setRange(Math.max(.01, outputRange / 1.4)); setAutoFit(false); }}>+</button><button aria-label="Zoom out solution outputs" onClick={() => { setRange(Math.min(1e13, outputRange * 1.4)); setAutoFit(false); }}>−</button><button onClick={fit}>Fit outputs</button><button onClick={reset}>Reset p and vₕ</button></div></div>
    </div>
    {!valid && <p className="la-warning" role="alert">Enter six numbers between −20 and 20. The diagrams keep the last valid matrix while you edit.</p>}
    <div className={`cs-status ${consistent ? '' : 'cs-inconsistent'}`} role="status"><strong>{!consistent ? 'No solution' : rank === 2 ? 'Unique solution' : 'Infinitely many solutions'}</strong><span><MathTex tex={`\\operatorname{rank}(A)=${rank},\\quad n=2,\\quad \\dim\\operatorname{Null}(A)=${2 - rank}`} /></span><span>{rank === 2 ? 'No free variables. p is fixed and vₕ = 0.' : `${2 - rank} free ${rank === 1 ? 'variable' : 'variables'}. Drag p or vₕ along its solution set, or use the sliders.`} {!consistent && 'For this b, no particular solution p exists.'}</span></div>
    <div className="ss-comparison-heading"><span>Row pictures · choose p and vₕ</span><span>Column space · compare before and after</span></div>
    <div className="cs-workspace ss-comparison">
      <div className="la-geometry ss-input-card"><h3>Particular solution · <MathTex tex="Ap=b" /></h3><p>{consistent ? 'Drag p along the solution set of Ap = b. Every allowed choice reaches the same target b.' : 'The row equations have no common solution, so p cannot be chosen.'}</p>
        <RowSpaceLab matrix={matrix} x={consistent ? p : undefined} onChange={consistent && rank < 2 ? next => dragParameters(next, result.x, setPParameters) : undefined} pointLabel="p" pointColor={color.particular} plotLabel="Particular solution p: row equations Ap equals b in input space." />
        {consistent && <><ParameterControls id={`${id}-p`} rank={rank} label="p" values={pParameters} onChange={setPParameters} /><div className="ss-vector-value"><MathTex tex={`p=${vectorTex(p)}`} /><MathTex tex={`Ap=${vectorTex(multiply(matrix, p))}=b`} /></div></>}
      </div>
      <ColumnOutput id={`${id}-before`} matrix={matrix} coefficients={consistent ? p : undefined} range={outputRange} title="Before · coefficients p" label="Column space before adding vh: column combination Ap equals b." coefficientName="p" onFit={fit} />
      <div className="la-geometry ss-input-card"><h3>Homogeneous solution · <MathTex tex="Av_h=0" /></h3><p>Drag vₕ along the homogeneous solution set. Its two column contributions cancel to zero.</p>
        <RowSpaceLab matrix={homogeneousMatrix} x={vh} onChange={rank < 2 ? next => dragParameters(next, [0, 0], setVParameters) : undefined} pointLabel="vₕ" pointColor={color.homogeneous} plotLabel="Homogeneous solution vh: row equations Avh equals zero in input space." />
        <ParameterControls id={`${id}-vh`} rank={rank} label="vₕ" values={vParameters} onChange={setVParameters} /><div className="ss-vector-value"><MathTex tex={`v_h=${vectorTex(vh)}`} /><MathTex tex={`Av_h=${vectorTex(multiply(matrix, vh))}`} /></div>
      </div>
      <ColumnOutput id={`${id}-after`} matrix={matrix} coefficients={consistent ? x : undefined} range={outputRange} title="After · coefficients p + vₕ" label="Column space after adding vh: column combination A times p plus vh still equals b." coefficientName="x" onFit={fit} />
    </div>
    <div className="cs-calculation ss-calculation">{consistent ? <><strong>Different coefficients, same output</strong><div className="ss-verification"><MathTex tex={`p=${vectorTex(p)}`} /><MathTex tex={`v_h=${vectorTex(vh)}`} /><MathTex tex={`x=p+v_h=${vectorTex(x)}`} /></div><MathTex display tex={String.raw`A(p+v_h)=Ap+Av_h=b+0=b`} /><strong>All solutions</strong><MathTex display tex={familyTex} /><p>Changing p chooses a different starting solution. Adding any homogeneous solution vₕ keeps the output at b.</p></> : <><strong>No particular solution exists</strong><p><MathTex tex={`b=${vectorTex(b)}\\notin\\operatorname{Col}(A)`} />. You can still explore Avₕ = 0, but adding a homogeneous solution cannot make this target reachable.</p></>}</div>
    <div className="ss-takeaways"><p><MathTex tex={String.raw`Ax=0:\quad\text{nontrivial solution}\iff\text{free variable}\iff\operatorname{rank}(A)<n`} /></p><p>The left diagrams show row equations in input space. The right diagrams show column combinations in output space. Every consistent solution is x = p + vₕ.</p></div>
    <p className="cs-caption">This view uses n = 2. Parameter sliders sample −4 to 4; the full solution sets extend beyond this interval. Rank uses relative numerical tolerance 10⁻¹⁰.</p>
  </section>;
}
