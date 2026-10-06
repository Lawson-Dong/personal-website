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

const same = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= 1e-8 * Math.max(1, Math.hypot(...a), Math.hypot(...b));
function exampleVectors(matrix: Augmented): {p: Vec; v: Vec} {
  const result = solveColumns(matrix);
  const row: Vec = Math.hypot(matrix[0], matrix[1]) >= Math.hypot(matrix[3], matrix[4]) ? [matrix[0], matrix[1]] : [matrix[3], matrix[4]];
  const scale = Math.max(...row.map(Math.abs));
  return {p: result.x, v: result.rank === 2 ? [0, 0] : result.rank === 1 ? [-1.5 * row[1] / scale, 1.5 * row[0] / scale] : [1.5, 0]};
}

function ColumnOutput({ id, matrix, coefficients, range, title, label, coefficientName, p, v, onFit }: {
  id: string; matrix: Augmented; coefficients: Vec; range: number; title: string; label: string; coefficientName: 'p' | 'x'; p: Vec; v: Vec; onFit: () => void;
}) {
  const result = solveColumns(matrix);
  const a1: Vec = [matrix[0], matrix[3]], a2: Vec = [matrix[1], matrix[4]], b: Vec = [matrix[2], matrix[5]];
  const column = Math.hypot(...a1) >= Math.hypot(...a2) ? a1 : a2, norm = Math.hypot(...column);
  const term1: Vec = [a1[0] * coefficients[0], a1[1] * coefficients[0]];
  const total = multiply(matrix, coefficients), ap = multiply(matrix, p), av = multiply(matrix, v), matches = same(total, b);
  return <div className="la-geometry ss-output-card">
    <h3>{title}</h3>
    <p>{coefficientName === 'p' ? 'The columns a₁, a₂ and target b stay fixed. Moving p changes only the scaled columns and their sum Ap.' : 'The same columns a₁, a₂ and target b stay fixed. Adding v changes the output by Av; compare A(p + v) with Ap.'}</p>
    <div className="ss-output-tools"><span className="cs-caption">Column space · fixed axes (y₁, y₂)</span><button className="la-reset" onClick={onFit}>Fit output vectors</button></div>
    <div className="cs-caption">Fixed references · independent of p and v</div>
    <div className="ss-vector-value" aria-label="Fixed column vectors and target">
      <span style={{color:'#477aa8'}}><MathTex tex={`a_1=${vectorTex(a1)}`} /></span>
      <span style={{color:'#a16e39'}}><MathTex tex={`a_2=${vectorTex(a2)}`} /></span>
      <span style={{color:'#bc5757'}}><MathTex tex={`b=${vectorTex(b)}`} /></span>
    </div>
    <Plane id={id} range={range} label={label}>
      {result.rank === 2 ? <rect x="40" y="40" width="420" height="420" fill="var(--accent)" opacity=".09" /> : result.rank === 1 ? <line x1={250 - column[0] / norm * 800} y1={250 + column[1] / norm * 800} x2={250 + column[0] / norm * 800} y2={250 - column[1] / norm * 800} stroke="var(--accent)" strokeWidth="14" opacity=".17" /> : <circle cx="250" cy="250" r="10" fill="var(--accent)" opacity=".25" />}
      <VectorArrow to={total} range={range} stroke={color.solution} label={`${coefficientName === 'p' ? 'Ap' : 'Ax'}${matches ? ' = b' : ''}`} offset={[16, 18]} />
      <VectorArrow to={term1} range={range} stroke={color.homogeneous} label={`${coefficientName}₁a₁`} offset={[10, -15]} />
      <VectorArrow from={term1} to={total} range={range} stroke="#b23b88" label={`${coefficientName}₂a₂`} offset={[10, -15]} />
      {coefficientName === 'x' && <><VectorArrow to={ap} range={range} stroke={color.particular} label="Ap" dashed offset={[-35, 20]} /><VectorArrow from={ap} to={total} range={range} stroke={color.homogeneous} label="Av" dashed offset={[14, -30]} /></>}
      <circle cx={250 + total[0] * 210 / range} cy={250 - total[1] * 210 / range} r="8" fill="var(--paper)" stroke={color.solution} strokeWidth="3" />
      <g role="group" aria-label="Fixed reference vectors: first column a1, second column a2, and target b">
        <title>a₁, a₂, and b stay fixed when p or v moves.</title>
        <VectorArrow to={a1} range={range} stroke="#477aa8" label="a₁" dashed offset={[-30, 20]} />
        <VectorArrow to={a2} range={range} stroke="#a16e39" label="a₂" dashed offset={[-30, -18]} />
        <VectorArrow to={b} range={range} stroke="#bc5757" label="b · target" dashed offset={[12, 22]} />
      </g>
    </Plane>
    <div className="cs-legend"><span style={{color:'#477aa8'}}>a₁ · fixed column, dashed</span><span style={{color:'#a16e39'}}>a₂ · fixed column, dashed</span><span style={{color:color.homogeneous}}>{coefficientName}₁a₁</span><span style={{color:'#b23b88'}}>{coefficientName}₂a₂ · tip to tail</span><span style={{color:color.solution}}>Current output</span><span style={{color:'#bc5757'}}>b · fixed target, dashed</span>{coefficientName === 'x' && <span>Dashed Av · change from Ap to Ax</span>}</div>
    <div className="ss-output-result"><MathTex tex={`b=${vectorTex(b)}`} /><MathTex tex={`${coefficientName}=${vectorTex(coefficients)}`} /><MathTex display tex={`${fmt(coefficients[0])}a_1+(${fmt(coefficients[1])})a_2=${vectorTex(total)}${matches ? '=' : String.raw`\ne `}b`} />{coefficientName === 'x' && <MathTex display tex={`Av=${vectorTex(av)}`} />}<p className={matches ? 'cs-match' : ''}>{matches ? 'The current output reaches b.' : 'The current output does not reach b.'}</p></div>
  </div>;
}

function VectorControls({ id, label, values, onChange }: { id: string; label: string; values: Vec; onChange: (v: Vec) => void }) {
  return <div className="ss-local-parameters">{[0, 1].map(i => <div className="cs-coefficient" key={i}>
    <label htmlFor={`${id}-${i}`}><MathTex tex={`${label}_${i + 1}=${fmt(values[i])}`} /></label>
    <input className="cs-number" type="number" step=".1" aria-label={`${label} coordinate ${i + 1}`} key={`${i}-${values[i]}`} defaultValue={Number(values[i].toPrecision(8))} onKeyDown={e => {if(e.key === 'Enter') e.currentTarget.blur();}} onBlur={e => {const n = Number(e.target.value); if(e.target.value.trim() !== '' && Number.isFinite(n)) onChange(values.map((v,j)=>j===i?n:v) as Vec); else e.target.value=fmt(values[i]);}} />
    <input id={`${id}-${i}`} aria-label={`${label} coordinate ${i + 1} slider`} type="range" min={Math.min(-6,values[i])} max={Math.max(6,values[i])} step=".01" value={values[i]} onChange={e => onChange(values.map((v,j)=>i===j?Number(e.target.value):v) as Vec)} />
  </div>)}</div>;
}

export function SolutionStructureLab() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [values, setValues] = useState(examples[0].matrix.map(String));
  const [lastMatrix, setLastMatrix] = useState(examples[0].matrix);
  const [homogeneous, setHomogeneous] = useState(false);
  const [p, setP] = useState<Vec>([1, 1]), [v, setV] = useState<Vec>([-1.5, 1.5]);
  const [range, setRange] = useState(6);
  const valid = values.every(n => n.trim() !== '' && Number.isFinite(Number(n)) && Math.abs(Number(n)) <= 20);
  const original = valid ? values.map(Number) as Augmented : lastMatrix;
  const matrix = original.map((n, i) => homogeneous && (i === 2 || i === 5) ? 0 : n) as Augmented;
  const homogeneousMatrix = matrix.map((n, i) => i === 2 || i === 5 ? 0 : n) as Augmented;
  const result = solveColumns(matrix), {rank, consistent} = result;
  const x = add(p, v), b: Vec = [matrix[2], matrix[5]], ap = multiply(matrix, p), av = multiply(matrix, v), ax = multiply(matrix, x);
  const pMatches = same(ap, b), vMatches = same(av, [0, 0]), xMatches = same(ax, b);
  const row: Vec = Math.hypot(matrix[0], matrix[1]) >= Math.hypot(matrix[3], matrix[4]) ? [matrix[0], matrix[1]] : [matrix[3], matrix[4]];
  const scale = Math.max(...row.map(Math.abs));
  const direction: Vec = rank === 1 ? [-row[1] / scale, row[0] / scale] : [1, 0];
  const familyTex = rank === 2 ? `x=${vectorTex(result.x)}` : rank === 1 ? `x=${vectorTex(result.x)}+t${vectorTex(direction)},\\quad t\\in\\mathbb R` : String.raw`x=\begin{pmatrix}t\\s\end{pmatrix},\quad t,s\in\mathbb R`;
  const example = examples.findIndex(e => e.matrix.every((n,i) => n === Number(values[i])));
  const fitRange = Math.max(2, ...[matrix[0],matrix[3],matrix[1],matrix[4],...b,...ap,...av,...ax,matrix[0]*p[0],matrix[3]*p[0],matrix[0]*x[0],matrix[3]*x[0]].filter(Number.isFinite).map(Math.abs)) * 1.3;
  const outputRange = range;
  function resetVectors(m: Augmented) {const next=exampleVectors(m);setP(next.p);setV(next.v);}
  function edit(next: string[]) {
    setValues(next);
    if(next.every(n => n.trim() !== '' && Number.isFinite(Number(n)) && Math.abs(Number(n)) <= 20)) {
      const m=next.map(Number) as Augmented;setLastMatrix(m);resetVectors(m.map((n,i)=>homogeneous&&(i===2||i===5)?0:n) as Augmented);
    }
    setRange(6);
  }
  function preset(index: number) {const m=examples[index].matrix;setValues(m.map(String));setLastMatrix(m);setHomogeneous(false);resetVectors(m);setRange(6);}
  const fit=()=>setRange(fitRange);
  return <section id="solution-structure" className="la-module ss-lab" aria-labelledby={`${id}-title`}>
    <div className="la-module-head"><div><span className="la-label">04 / VISUALIZATION</span><h2 id={`${id}-title`}>Solutions &amp; <em>their structure.</em></h2></div><p>Move p and v freely anywhere in the input plane. Watch Ap, Av, and A(p + v) change, and test when adding v preserves the output.</p></div>
    <div className="ss-identity"><MathTex tex={String.raw`Ap=b,\quad Av=0\quad\Longrightarrow\quad A(p+v)=b`} /><span>The conditions are tested; neither point is constrained. Dragging keeps b, a₁, a₂, and the output axes fixed.</span></div>
    <div className="cs-controls ss-controls">
      <div><label htmlFor={`${id}-example`}>Examples · two equations, two unknowns</label><select id={`${id}-example`} value={example<0?'custom':example} onChange={e=>preset(Number(e.target.value))}><option value="custom" disabled>Custom matrix</option>{examples.map((e,i)=><option key={e.name} value={i}>{e.name}</option>)}</select><label className="ss-checkbox"><input type="checkbox" checked={homogeneous} onChange={e=>{setHomogeneous(e.target.checked);resetVectors(original.map((n,i)=>e.target.checked&&(i===2||i===5)?0:n) as Augmented);setRange(6);}} /> Set b = 0 · compare the same A</label></div>
      <div><span className="cs-caption"><MathTex tex={String.raw`[A\mid b]`} /></span><div className="la-matrix cs-matrix">{[0,1].map(r=><div className="cs-matrix-row" key={r}>{[0,1,2].map(c=><input type="number" step="any" min="-20" max="20" key={c} disabled={homogeneous&&c===2} value={homogeneous&&c===2?'0':values[r*3+c]} aria-label={`Solution structure row ${r+1}, ${c===2?'target b':`column ${c+1}`}`} onChange={e=>edit(values.map((n,i)=>i===r*3+c?e.target.value:n))} />)}</div>)}</div></div>
      <div className="ss-view-controls"><span className="cs-caption">Fixed output extent: ±{fmt(outputRange)}</span><div className="la-step-actions"><button aria-label="Zoom in solution outputs" onClick={()=>{setRange(Math.max(.01,outputRange/1.4));}}>+</button><button aria-label="Zoom out solution outputs" onClick={()=>{setRange(Math.min(1e18,outputRange*1.4));}}>−</button><button onClick={fit}>Fit outputs</button><button onClick={()=>resetVectors(matrix)}>Reset p and v</button></div></div>
    </div>
    {!valid&&<p className="la-warning" role="alert">Enter six numbers between −20 and 20. The diagrams keep the last valid matrix while you edit.</p>}
    <div className={`cs-status ${consistent?'':'cs-inconsistent'}`} role="status"><strong>{!consistent?'System has no solution':rank===2?'System has a unique solution':'System has infinitely many solutions'}</strong><span><MathTex tex={`\\operatorname{rank}(A)=${rank},\\quad\\dim\\operatorname{Null}(A)=${2-rank}`} /></span><span>Both p and v move freely in two dimensions, regardless of rank. The equation lines show where the conditions hold.</span></div>
    <div className="ss-comparison-heading"><span>Row pictures · move p and v freely</span><span>Column space · compare before and after</span></div>
    <div className="cs-workspace ss-comparison">
      <div className="la-geometry ss-input-card"><h3>Input vector p · test <MathTex tex="Ap=b" /></h3><p>Left-click and drag p anywhere. It is a particular solution exactly when it satisfies both row equations.</p>
        <RowSpaceLab matrix={matrix} x={p} onChange={setP} pointLabel="p" pointColor={color.particular} plotLabel="Free input vector p: row equations Ap equals b in input space." dragAnywhere />
        <VectorControls id={`${id}-p`} label="p" values={p} onChange={setP} />
        <div className={`cs-status ${pMatches?'':'cs-inconsistent'}`} role="status"><strong>{pMatches?'Ap = b · p is a particular solution':'Ap ≠ b · p is not a particular solution'}</strong></div>
        <div className="ss-vector-value"><MathTex tex={`p=${vectorTex(p)}`} /><MathTex tex={`Ap=${vectorTex(ap)}`} /></div>
        <div className="la-step-actions"><button disabled={!consistent} onClick={()=>setP(result.x)}>Use a particular solution</button></div>
      </div>
      <ColumnOutput id={`${id}-before`} matrix={matrix} coefficients={p} p={p} v={v} range={outputRange} title="Before · coefficients p" label="Column space before adding v: current output Ap and target b." coefficientName="p" onFit={fit} />
      <div className="la-geometry ss-input-card"><h3>Input vector v · test <MathTex tex="Av=0" /></h3><p>Left-click and drag v anywhere. It is a homogeneous solution exactly when it lies on both zero-target row equations.</p>
        <RowSpaceLab matrix={homogeneousMatrix} x={v} onChange={setV} pointLabel="v" pointColor={color.homogeneous} plotLabel="Free input vector v: row equations Av equals zero in input space." dragAnywhere />
        <VectorControls id={`${id}-v`} label="v" values={v} onChange={setV} />
        <div className={`cs-status ${vMatches?'':'cs-inconsistent'}`} role="status"><strong>{vMatches?'Av = 0 · v is a homogeneous solution':'Av ≠ 0 · v changes the output'}</strong></div>
        <div className="ss-vector-value"><MathTex tex={`v=${vectorTex(v)}`} /><MathTex tex={`Av=${vectorTex(av)}`} /></div>
        <div className="la-step-actions"><button onClick={()=>setV(exampleVectors(matrix).v)}>Use a homogeneous solution</button></div>
      </div>
      <ColumnOutput id={`${id}-after`} matrix={matrix} coefficients={x} p={p} v={v} range={outputRange} title="After · coefficients p + v" label="Column space after adding v: output A times p plus v and change Av." coefficientName="x" onFit={fit} />
    </div>
    <div className="cs-calculation ss-calculation"><strong>{xMatches?'Current x = p + v reaches b':'Current x = p + v does not reach b'}</strong><div className="ss-verification"><MathTex tex={`p=${vectorTex(p)}`} /><MathTex tex={`v=${vectorTex(v)}`} /><MathTex tex={`x=p+v=${vectorTex(x)}`} /></div><MathTex display tex={`A(p+v)=Ap+Av=${vectorTex(ap)}+${vectorTex(av)}=${vectorTex(ax)}`} /><p>{vMatches?'Av = 0: adding v preserves the output Ap.':'Av is nonzero: adding v changes the output by Av.'} {pMatches?'p currently reaches b.':'p currently does not reach b.'}</p>{consistent?<><strong>All actual solutions of Ax = b</strong><MathTex display tex={familyTex} /><p>A particular solution plus any homogeneous solution gives another solution. The points above are free to move off these solution sets.</p></>:<p>No particular solution exists for this b. You can still move both input vectors and explore their outputs.</p>}</div>
    <div className="ss-takeaways"><p><MathTex tex={String.raw`Ax=0:\quad\text{nontrivial solution}\iff\text{free variable}\iff\operatorname{rank}(A)<n`} /></p><p>The left diagrams show row equations in input space. The right diagrams show column combinations in output space. For any p and v, A(p + v) = Ap + Av; the output stays unchanged exactly when Av = 0.</p></div>
    <p className="cs-caption">Zoom out to explore more of the input plane, or enter coordinates directly. Output axes stay fixed while dragging; use Fit outputs to include vectors outside the view. Condition comparisons use relative numerical tolerance 10⁻⁸; rank uses 10⁻¹⁰.</p>
  </section>;
}
