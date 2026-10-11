'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const COLORS = [
  { id: 'sky', name: 'Light blue', hex: '#a6d8ff' },
  { id: 'blue', name: 'Blue', hex: '#6c9fff' },
  { id: 'lavender', name: 'Lavender', hex: '#bdabff' },
  { id: 'pink', name: 'Pink', hex: '#f6b0d3' },
  { id: 'rose', name: 'Rose', hex: '#f58fa3' },
  { id: 'peach', name: 'Peach', hex: '#ffc29c' },
  { id: 'yellow', name: 'Yellow', hex: '#ffe28b' },
  { id: 'lime', name: 'Lime', hex: '#c8e990' },
  { id: 'mint', name: 'Mint', hex: '#9ae5c0' },
  { id: 'teal', name: 'Teal', hex: '#7bd5d5' },
  { id: 'white', name: 'White', hex: '#f5f7ff' },
  { id: 'slate', name: 'Slate', hex: '#9baec4' },
] as const;

const STORAGE_KEY = 'lawson-cursor-color';
const COLUMNS = 4;

export function SiteCursor() {
  const [selected, setSelected] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const index = COLORS.findIndex(color => color.id === saved);
      if (index >= 0) setSelected(index);
    } catch { /* The default cursor also works without browser storage. */ }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--site-cursor', `url("/cursors/${COLORS[selected].id}.svg") 3 2, default`);
    return () => { document.documentElement.style.removeProperty('--site-cursor'); };
  }, [selected]);

  function choose(index: number) {
    setSelected(index);
    try { localStorage.setItem(STORAGE_KEY, COLORS[index].id); } catch { /* Optional persistence. */ }
  }

  function close(restoreFocus = true) {
    if (restoreFocus && panel.current?.contains(document.activeElement)) {
      previousFocus.current?.focus({ preventScroll: true });
    }
    setPosition(null);
  }

  useEffect(() => {
    function open(event: MouseEvent) {
      // Shift + right-click keeps the browser's own context menu available.
      if (event.shiftKey || !window.matchMedia('(any-pointer: fine)').matches) return;
      event.preventDefault();
      if (!panel.current?.contains(document.activeElement)) {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      }
      setPosition({ x: event.clientX, y: event.clientY });
    }
    window.addEventListener('contextmenu', open);
    return () => window.removeEventListener('contextmenu', open);
  }, []);

  useLayoutEffect(() => {
    if (!position || !panel.current) return;
    const { width, height } = panel.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(position.x, window.innerWidth - width - 8));
    const y = Math.max(8, Math.min(position.y, window.innerHeight - height - 8));
    if (x !== position.x || y !== position.y) setPosition({ x, y });
    swatches.current[selected]?.focus({ preventScroll: true });
  }, [position, selected]);

  useEffect(() => {
    if (!position) return;
    function onKey(event: KeyboardEvent) {
      let next = selected;
      const rowStart = Math.floor(selected / COLUMNS) * COLUMNS;
      switch (event.key) {
        case 'ArrowRight': next = rowStart + (selected % COLUMNS + 1) % COLUMNS; break;
        case 'ArrowLeft': next = rowStart + (selected % COLUMNS + COLUMNS - 1) % COLUMNS; break;
        case 'ArrowDown': next = (selected + COLUMNS) % COLORS.length; break;
        case 'ArrowUp': next = (selected + COLORS.length - COLUMNS) % COLORS.length; break;
        case 'Home': next = 0; break;
        case 'End': next = COLORS.length - 1; break;
        case 'Enter': case 'Escape':
          event.preventDefault();
          event.stopImmediatePropagation();
          close();
          return;
        case 'Tab': close(false); return;
        default: return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      choose(next);
    }
    function onOutside(event: PointerEvent) {
      if (event.button === 0 && !panel.current?.contains(event.target as Node)) close();
    }
    function onViewportChange() { close(); }
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('pointerdown', onOutside);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('pointerdown', onOutside);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }, [position, selected]);

  if (!position) return null;

  return (
    <div ref={panel} className="cursor-palette" style={{ left: position.x, top: position.y }}>
      <div className="cursor-palette-heading">
        <span id="cursor-palette-title">Cursor color</span>
        <button type="button" aria-label="Close cursor colors" onClick={() => close()}>×</button>
      </div>
      <div className="cursor-palette-grid" role="radiogroup" aria-labelledby="cursor-palette-title" aria-describedby="cursor-palette-help">
        {COLORS.map((color, index) => (
          <button
            key={color.id}
            ref={element => { swatches.current[index] = element; }}
            type="button"
            role="radio"
            aria-label={color.name}
            aria-checked={selected === index}
            tabIndex={selected === index ? 0 : -1}
            title={color.name}
            onClick={() => choose(index)}
            className="cursor-palette-swatch"
            style={{ backgroundColor: color.hex }}
          >
            {selected === index && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <p className="cursor-palette-color" aria-live="polite">{COLORS[selected].name}</p>
      <p id="cursor-palette-help">↑ ↓ ← → choose · Enter / Esc close</p>
      <p className="cursor-palette-native">Shift + right-click: browser menu</p>
    </div>
  );
}
