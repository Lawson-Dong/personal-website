'use client';

import { useEffect, useRef, useState } from 'react';

type Eye = { x: number; y: number; width: number; height: number; angle: number };
const eyes: Eye[] = [
  { x: 485, y: 196.5, width: 31, height: 15, angle: -.02 },
  { x: 543, y: 181, width: 32, height: 18, angle: -.25 },
];

function eyeOutline(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.bezierCurveTo(-width * .22, -height * .65, width * .25, -height * .7, width / 2, -height * .1);
  ctx.bezierCurveTo(width * .22, height * .5, -width * .25, height * .5, -width / 2, 0);
  ctx.closePath();
}

function drawEye(ctx: CanvasRenderingContext2D, eye: Eye, x: number, y: number, blink: number) {
  ctx.save();
  ctx.translate(eye.x, eye.y);
  ctx.rotate(eye.angle);
  eyeOutline(ctx, eye.width, eye.height);
  ctx.clip();
  ctx.fillStyle = "#eae3e1";
  ctx.fillRect(-eye.width, -eye.height, eye.width * 2, eye.height * 2);
  const irisX = x * 2.1;
  const irisY = y * 1.2 - .8;
  const gradient = ctx.createRadialGradient(irisX, irisY - 3, 1, irisX, irisY, 8);
  gradient.addColorStop(0, '#37475c');
  gradient.addColorStop(.55, '#718b9e');
  gradient.addColorStop(1, '#9eafba');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(irisX, irisY, 8.6, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#425061';
  ctx.lineWidth = .8;
  ctx.stroke();
  ctx.fillStyle = '#263040';
  ctx.beginPath();
  ctx.ellipse(irisX, irisY - 1.3, 2.4, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f7f6f0';
  ctx.beginPath();
  ctx.ellipse(irisX - 2.4, irisY - 3.8, 2, 1.4, -.3, 0, Math.PI * 2);
  ctx.fill();
  if (blink > 0) {
    const lid = -eye.height + blink * eye.height * 1.65;
    ctx.fillStyle = '#eaccc3';
    ctx.fillRect(-eye.width, -eye.height * 2, eye.width * 2, lid + eye.height * 2);
    ctx.strokeStyle = '#4b3940';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-eye.width / 2, lid - 1);
    ctx.quadraticCurveTo(0, lid + 2, eye.width / 2, lid - 2);
    ctx.stroke();
  }
  ctx.restore();
}

export function AnimeAvatar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<'portrait' | 'full'>('portrait');
  const [view, setView] = useState<'portrait' | 'full'>('portrait');
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
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' && event.buttons === 0) return;
      // Target relative to the face, rather than the screen center.
      const bounds = canvas.getBoundingClientRect();
      const portrait = viewRef.current === 'portrait';
      const faceX = bounds.left + bounds.width * (portrait ? .45 : .51);
      const faceY = bounds.top + bounds.height * (portrait ? .21 : .13);
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
      ctx.translate(530 + x * 2, 259 + y * 1.3);
      ctx.rotate(x * .026 + (active ? Math.sin(time * .8) * .002 : 0));
      ctx.translate(-530, -259);
      // The extracted head was exported at double scale; align it to the neck.
      ctx.drawImage(head, 265, 48, 512, 768);
      let blink = 0;
      if (active) {
        if (time > blinkAt + .22) blinkAt = time + 3.5 + Math.random() * 2.8;
        const elapsed = time - blinkAt;
        if (elapsed >= 0 && elapsed <= .22) blink = Math.sin(elapsed / .22 * Math.PI);
      }
      eyes.forEach(eye => drawEye(ctx, eye, eyeX, eyeY, blink));
      ctx.restore();
    };
    Promise.all([body, head].map((image, index) => new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Character layer unavailable'));
      image.src = index === 0 ? '/images/avatar-body-v2.webp' : '/images/avatar-head-v2.webp';
    }))).then(() => {
      if (disposed) return;
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
      <img className="avatar-fallback" src="/images/anime-self.webp" alt="Lawson’s anime self: black hair, headphones, techwear and a guitar case" style={{ opacity: ready ? 0 : 1 }} />
      <canvas ref={canvasRef} className="avatar-canvas" role="img" aria-label="Anime character with independent head movement, cursor-following eyes and natural blinking" style={{ opacity: ready ? 1 : 0 }} />
    </div>
    <div className="avatar-controls" aria-label="Character view controls">
      {(['portrait', 'full'] as const).map(option => <button key={option} aria-pressed={view === option} onClick={() => { viewRef.current = option; setView(option); }}>{option === 'portrait' ? 'Portrait' : 'Full body'}</button>)}
      <button aria-pressed={motion} onClick={() => { motionRef.current = !motion; setMotion(!motion); }}>{motion ? 'Pause motion' : 'Resume motion'}</button>
    </div>
  </div>;
}
