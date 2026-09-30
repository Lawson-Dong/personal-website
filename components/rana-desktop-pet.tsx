'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Pose = 'idle' | 'happy' | 'held' | 'wall' | 'sleep' | 'guitar';
const size = 168;
const messages: Record<Pose, string> = { idle: 'おもしれー女。', happy: 'Interesting!', held: 'にゃ？', wall: 'A wall...', sleep: 'zzz...', guitar: '♪' };

export function RanaDesktopPet() {
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [pose, setPose] = useState<Pose>('idle');
  const [bubble, setBubble] = useState(false);
  const [ready, setReady] = useState(false);
  const positionRef = useRef(position);
  const poseRef = useRef(pose);
  const activity = useRef(0);
  const dragging = useRef<{ id: number; dx: number; dy: number; moved: boolean } | null>(null);
  const poseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function changePose(next: Pose, duration?: number) {
    if (poseTimer.current) clearTimeout(poseTimer.current);
    poseRef.current = next;
    setPose(next);
    if (duration) poseTimer.current = setTimeout(() => changePose('idle'), duration);
  }
  function react(next: Pose, duration = 1800) {
    activity.current = Date.now();
    changePose(next, duration);
    setBubble(true);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(false), duration);
  }
  function move(x: number, y: number) {
    const next = { x: Math.max(0, Math.min(window.innerWidth - size, x)), y: Math.max(0, Math.min(window.innerHeight - size, y)) };
    positionRef.current = next;
    setPosition(next);
    return next;
  }
  useEffect(() => {
    positionRef.current = { x: Math.max(0, window.innerWidth - size - 36), y: Math.max(0, window.innerHeight - size - 32) };
    setPosition(positionRef.current);
    activity.current = Date.now();
    setReady(true);
    const onResize = () => {
      const { x, y } = positionRef.current;
      positionRef.current = { x: Math.max(0, Math.min(innerWidth - size, x)), y: Math.max(0, Math.min(innerHeight - size, y)) };
      setPosition(positionRef.current);
    };
    window.addEventListener('resize', onResize);
    const tick = setInterval(() => {
      if (dragging.current) return;
      const quiet = Date.now() - activity.current;
      if (quiet > 45000) { if (poseRef.current !== 'sleep') changePose('sleep'); return; }
      if (poseRef.current !== 'idle') return;
      if (quiet > 15000 && Math.random() < .25) { changePose('guitar', 5500); return; }
      if (Math.random() < .5) {
        const { x, y } = positionRef.current;
        const next = { x: Math.max(0, Math.min(innerWidth - size, x + (Math.random() - .5) * 180)), y: Math.max(0, Math.min(innerHeight - size, y + (Math.random() - .5) * 70)) };
        positionRef.current = next;
        setPosition(next);
        if (next.x < 12 || next.x > innerWidth - size - 12) changePose('wall', 2000);
      } else changePose('happy', 1400);
    }, 4200);
    return () => { clearInterval(tick); window.removeEventListener('resize', onResize); if (poseTimer.current) clearTimeout(poseTimer.current); if (bubbleTimer.current) clearTimeout(bubbleTimer.current); };
  }, []);

  return <div className={`rana-pet ${ready ? 'is-ready' : ''} ${dragging.current ? 'is-held' : ''}`} style={{ left: position.x, top: position.y }}>
    {bubble && <span className="rana-pet-bubble" aria-live="polite">{messages[pose]}</span>}
    <button type="button" className="rana-pet-button" aria-label="Interact with Rāna; drag to move her" onPointerDown={event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging.current = { id: event.pointerId, dx: event.clientX - positionRef.current.x, dy: event.clientY - positionRef.current.y, moved: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    }} onPointerMove={event => {
      const drag = dragging.current;
      if (!drag || drag.id !== event.pointerId) return;
      if (Math.abs(event.clientX - drag.dx - positionRef.current.x) + Math.abs(event.clientY - drag.dy - positionRef.current.y) > 4) drag.moved = true;
      if (drag.moved) { changePose('held'); move(event.clientX - drag.dx, event.clientY - drag.dy); }
    }} onPointerUp={event => {
      const drag = dragging.current;
      if (!drag || drag.id !== event.pointerId) return;
      dragging.current = null;
      if (drag.moved) {
        const x = positionRef.current.x;
        react(x < 12 || x > innerWidth - size - 12 ? 'wall' : 'idle', 1700);
      } else react(poseRef.current === 'sleep' ? 'happy' : poseRef.current === 'guitar' ? 'happy' : 'guitar', 4400);
    }} onPointerCancel={() => { dragging.current = null; changePose('idle'); }} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(positionRef.current.x + (event.key === 'ArrowLeft' ? -24 : 24), positionRef.current.y); react('wall', 1200); }
    }}>
      <Image src={`/images/rana-pet-${pose}.png`} alt="" fill sizes="168px" draggable={false} />
    </button>
    <span className="rana-pet-hint">drag · tap</span>
  </div>;
}
