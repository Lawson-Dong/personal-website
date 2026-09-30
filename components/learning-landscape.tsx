'use client';

import { useEffect, useMemo, useState } from 'react';

const CX = 224;
const CY = 125;
const SCALE = 48;
const ANGLE = Math.PI / 6;
const COS = Math.cos(ANGLE);
const SIN = Math.sin(ANGLE);
const FAST = 1.8;
const SLOW = 0.28;
const STEPS = 26;
const PRESETS = [0.1, 0.25, 0.4, 0.9, 1.2];
type Point = { x: number; y: number };

function gradient({ x, y }: Point): Point {
  const u = COS * x + SIN * y;
  const v = -SIN * x + COS * y;
  return { x: COS * FAST * u - SIN * SLOW * v, y: SIN * FAST * u + COS * SLOW * v };
}
function trajectory(rate: number): Point[] {
  const points = [{ x: -2.35, y: -1.1 }];
  for (let i = 0; i < STEPS; i++) {
    const p = points[points.length - 1];
    const g = gradient(p);
    points.push({ x: p.x - rate * g.x, y: p.y - rate * g.y });
  }
  return points;
}
function screen({ x, y }: Point) { return { x: CX + x * SCALE, y: CY - y * SCALE }; }
function path(points: Point[]) { return points.map((point, i) => { const p = screen(point); return `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`; }).join(' '); }

export function LearningLandscape() {
  const [rate, setRate] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [replay, setReplay] = useState(0);
  const [customRate, setCustomRate] = useState('');
  const [inputError, setInputError] = useState('');
  const points = useMemo(() => trajectory(rate), [rate]);
  const visibleCount = Math.min(STEPS, Math.floor(progress * STEPS));
  const current = screen(points[visibleCount]);
  const status = rate > 2 / FAST ? 'diverges' : rate >= 0.85 ? 'oscillates toward minimum' : rate <= 0.25 ? 'converges slowly' : 'converges';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { const id = requestAnimationFrame(() => setProgress(1)); return () => cancelAnimationFrame(id); }
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      setProgress(Math.min(1, (now - started) / 2400));
      if (now - started < 2400) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [rate, replay]);

  function updateRate(next: number) { setRate(next); setInputError(''); setProgress(0); setReplay(v => v + 1); }
  function confirmCustom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = Number(customRate);
    if (!customRate.trim() || !Number.isFinite(next) || next < 0.01 || next > 1.3) {
      setInputError('Enter a learning rate from 0.01 to 1.30.');
      return;
    }
    updateRate(next);
  }

  return <div className="landscape-panel" aria-label="Interactive gradient descent simulation on a fixed loss landscape">
    <div className="landscape-heading"><span>FIXED LOSS LANDSCAPE</span><span>GRADIENT DESCENT / SGD</span></div>
    <div className="landscape-plot"><svg viewBox="0 0 448 250" role="img" aria-label={`Contour plot of the same quadratic loss landscape. Learning rate ${rate.toFixed(2)} ${status}.`}>
      <defs><clipPath id="loss-chart-clip"><rect x="2" y="2" width="444" height="246"/></clipPath></defs>
      <g className="landscape-grid"><path d="M56 0V250M112 0V250M168 0V250M224 0V250M280 0V250M336 0V250M392 0V250M0 50H448M0 100H448M0 150H448M0 200H448"/></g>
      <g clipPath="url(#loss-chart-clip)"><g className="loss-contours" transform={`rotate(${-ANGLE * 180 / Math.PI} ${CX} ${CY})`}>{[0.1,0.3,0.65,1.1,1.7,2.5,3.5,5.0].map(level => <ellipse key={level} cx={CX} cy={CY} rx={SCALE * Math.sqrt(2 * level / FAST)} ry={SCALE * Math.sqrt(2 * level / SLOW)} />)}</g>
      <path className="loss-complete" d={path(points)} />
      <path className="loss-trail" d={path(points.slice(0, visibleCount + 1))} />
      {points.slice(0, visibleCount + 1).filter((_, i) => i % 3 === 0 && i < 18).map((point,i) => { const p=screen(point); return <circle className="loss-step" key={i} cx={p.x} cy={p.y} r="2"/>; })}
      <circle className="loss-cursor" cx={current.x} cy={current.y} r="5" />
      </g><circle className="loss-minimum" cx={CX} cy={CY} r="3"/><text className="loss-min-label" x={CX + 9} y={CY - 8}>min L</text><text className="loss-start-label" x="20" y="190">start θ₀</text>
    </svg></div>
    <div className="landscape-controls"><div className="landscape-slider-heading"><label htmlFor="learning-rate">LEARNING RATE <span>η</span></label><output>{rate.toFixed(2)}</output></div><select id="learning-rate" className="landscape-select" value={PRESETS.includes(rate) ? String(rate) : 'custom'} onChange={event => updateRate(Number(event.target.value))} aria-label="Choose a learning rate"><option value="custom" disabled>{PRESETS.includes(rate) ? 'Choose a learning rate' : `Custom: ${rate.toFixed(2)}`}</option>{PRESETS.map(value => <option key={value} value={value}>η = {value.toFixed(2)}</option>)}</select><form className="landscape-custom" onSubmit={confirmCustom}><input type="number" inputMode="decimal" min="0.01" max="1.3" step="any" value={customRate} onChange={event => { setCustomRate(event.target.value); setInputError(''); }} placeholder="Or enter a rate" aria-label="Custom learning rate" aria-describedby={inputError ? 'rate-error' : undefined} /><button type="submit">Confirm</button></form>{inputError && <p id="rate-error" className="landscape-error" role="alert">{inputError}</p>}<div className="landscape-caption"><span>{status} · {visibleCount}/{STEPS} steps</span><button type="button" onClick={() => { setProgress(0); setReplay(v => v + 1); }} aria-label="Replay gradient descent animation">↻ replay</button></div><p>Illustrative 2D quadratic loss · same contours and start point for every rate.</p></div>
  </div>;
}
