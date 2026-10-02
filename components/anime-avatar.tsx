'use client';

import { useEffect, useRef, useState } from 'react';

type Eye = { x: number; y: number; width: number; height: number; angle: number; irisX: number; irisY: number };
const eyes: Eye[] = [
  { x: 428, y: 465, width: 95, height: 65, angle: -.10, irisX: 437, irisY: 459 },
  { x: 601, y: 435, width: 99, height: 62, angle: -.14, irisX: 595, irisY: 429 },
];

function eyeOutline(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.bezierCurveTo(-width * .22, -height * .65, width * .25, -height * .7, width / 2, -height * .1);
  ctx.bezierCurveTo(width * .22, height * .5, -width * .25, height * .5, -width / 2, 0);
  ctx.closePath();
}

// Keep the illustration's own iris texture, color, highlights and line work.
function drawEye(ctx: CanvasRenderingContext2D, art: HTMLCanvasElement, eye: Eye, x: number, y: number, blink: number) {
  ctx.save();
  ctx.translate(eye.x, eye.y);
  ctx.rotate(eye.angle);
  eyeOutline(ctx, eye.width, eye.height);
  ctx.clip();
  ctx.fillStyle = '#f5eff0';
  ctx.fillRect(-eye.width, -eye.height, eye.width * 2, eye.height * 2);
  const offsetX = x * 5;
  const offsetY = y * 3;
  ctx.save();
  ctx.translate(eye.irisX - eye.x + offsetX, eye.irisY - eye.y + offsetY);
  ctx.beginPath();
  ctx.ellipse(0, 0, 29, 36, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(art, eye.irisX - 30, eye.irisY - 37, 60, 74, -30, -37, 60, 74);
  ctx.restore();
  if (blink > 0) {
    const lid = -eye.height + blink * eye.height * 1.65;
    ctx.fillStyle = '#f8dfd3';
    ctx.fillRect(-eye.width, -eye.height * 2, eye.width * 2, lid + eye.height * 2);
    ctx.strokeStyle = '#4b3940';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-eye.width / 2, lid - 1);
    ctx.quadraticCurveTo(0, lid + 2, eye.width / 2, lid - 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function AnimeAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<'portrait' | 'full'>('full');
  const [view, setView] = useState<'portrait' | 'full'>('full');
  const [ready, setReady] = useState(false);
  const [motion, setMotion] = useState(true);
  const motionRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    let disposed = false;
    let frame = 0;
    let previous = 0;
    let x = 0, y = 0, eyeX = 0, eyeY = 0;
    let targetX = 0, targetY = 0;
    let blinkAt = 3.8;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const body = new Image();
    const head = new Image();
    const headArt = document.createElement("canvas");
    headArt.width = 1024; headArt.height = 1536;
    const headCtx = headArt.getContext("2d");
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' && event.buttons === 0) return;
      // Target relative to the face, rather than the screen center.
      const bounds = canvas.getBoundingClientRect();
      const portrait = viewRef.current === 'portrait';
      const faceX = bounds.left + bounds.width * (portrait ? .43 : .5);
      const faceY = bounds.top + bounds.height * (portrait ? .48 : .29);
      targetX = Math.tanh((event.clientX - faceX) / 350);
      targetY = Math.tanh((event.clientY - faceY) / 300);
    };
    const reset = () => { targetX = targetY = 0; };
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('pointerdown', pointer, { passive: true });
    window.addEventListener('blur', reset);
    document.documentElement.addEventListener('pointerleave', reset);

    const draw = (now: number) => {
      if (disposed) return;
      frame = requestAnimationFrame(draw);
      if (document.hidden) { previous = now; return; }
      const dt = Math.min((now - previous) / 1000 || .016, .05);
      previous = now;
      const active = !reduced.matches && motionRef.current;
      // Eyes react first; head catches up more gently, independent of refresh rate.
      const slow = 1 - Math.exp(-dt * 5);
      const fast = 1 - Math.exp(-dt * 12);
      x += ((active ? targetX : 0) - x) * slow;
      y += ((active ? targetY : 0) - y) * slow;
      eyeX += ((active ? targetX : 0) - eyeX) * fast;
      eyeY += ((active ? targetY : 0) - eyeY) * fast;
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const width = Math.round(bounds.width * dpr), height = Math.round(bounds.height * dpr);
      if (!width || !height) return;
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const portrait = viewRef.current === 'portrait';
      const sourceWidth = portrait ? 680 : 1024;
      const sourceHeight = portrait ? 900 : 1536;
      const scale = Math.min(width / sourceWidth, height / sourceHeight);
      ctx.setTransform(scale, 0, 0, scale, (width - sourceWidth * scale) / 2 - (portrait ? 220 * scale : 0), (height - sourceHeight * scale) / 2);
      const time = now / 1000;
      const breath = active ? Math.sin(time * 1.6) * .9 : 0;
      ctx.translate(x * .8, breath);
      ctx.drawImage(body, 0, 0, 1024, 1536);
      // The head is a separate layer. No UV warp, triangle mesh, or facial stretch.
      ctx.save();
      ctx.translate(512 + x * 2, 574 + y * 1.3);
      ctx.rotate(x * .026 + (active ? Math.sin(time * .8) * .002 : 0));
      ctx.translate(-512, -574);
      ctx.drawImage(headArt, 0, 0);
      let blink = 0;
      if (active) {
        if (time > blinkAt + .22) blinkAt = time + 3.5 + Math.random() * 2.8;
        const elapsed = time - blinkAt;
        if (elapsed >= 0 && elapsed <= .22) blink = Math.sin(elapsed / .22 * Math.PI);
      }
      eyes.forEach(eye => drawEye(ctx, headArt, eye, eyeX, eyeY, blink));
      ctx.restore();
    };
    Promise.all([body, head].map((image, index) => new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Character layer unavailable'));
      image.src = index === 0 ? '/images/avatar-chibi-body-v3.webp' : '/images/avatar-chibi-head-v3.webp';
    }))).then(() => {
      if (disposed) return;
      // Align the extracted head to the untouched neck and clothing layer.
      headCtx?.drawImage(head, 76, 12, 870.4, 1305.6);
      blinkAt = performance.now() / 1000 + 3.8;
      setReady(true);
      frame = requestAnimationFrame(draw);
    }).catch(() => { /* Keep the original illustration visible if an asset cannot load. */ });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      body.onload = body.onerror = head.onload = head.onerror = null;
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerdown', pointer);
      window.removeEventListener('blur', reset);
      document.documentElement.removeEventListener('pointerleave', reset);
    };
  }, []);

  return <div className="avatar-viewer">
    <div className={`avatar-stage avatar-stage-v2 ${view === 'portrait' ? 'is-portrait' : 'is-full'}`}>
      <div className="avatar-halo" aria-hidden="true" />
      {view === 'full' ? <div className="avatar-floor" aria-hidden="true" /> : null}
      <img className="avatar-fallback" src="/images/avatar-chibi-v3.webp" alt="Lawson’s chibi anime self with both hands in pockets, black hair, headphones and a guitar case" style={{ opacity: ready ? 0 : 1 }} />
      <canvas ref={canvasRef} className="avatar-canvas" role="img" aria-label="Anime character with independent head movement, cursor-following eyes and natural blinking" style={{ opacity: ready ? 1 : 0 }} />
    </div>
    <div className="avatar-controls" aria-label="Character view controls">
      {(['portrait', 'full'] as const).map(option => <button key={option} aria-pressed={view === option} onClick={() => { viewRef.current = option; setView(option); }}>{option === 'portrait' ? 'Portrait' : 'Full body'}</button>)}
      <button aria-pressed={motion} onClick={() => { motionRef.current = !motion; setMotion(!motion); }}>{motion ? 'Pause motion' : 'Resume motion'}</button>
    </div>
  </div>;
}
