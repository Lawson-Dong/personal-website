'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { RanaDesktopPet } from './rana-desktop-pet';

const fragments = [
  { title: 'A place for the unfiled', text: 'Some things are easier to understand when they aren’t organized yet.', mark: '01 / fragment' },
  { title: 'The interesting ones', text: 'Some questions feel less like a problem and more like a sound you keep following.', mark: '02 / fragment' },
  { title: 'Still looking', text: 'I think getting lost can sometimes be a way of paying attention.', mark: '03 / fragment' },
];
const notes = [329.63, 392, 440, 523.25, 587.33];
const interestingSites = [
  { title: 'GIRLS BAND CRY', source: 'Official anime website', description: 'Togenashi Togeari, music, and the world of Girls Band Cry.', url: 'https://girls-band-cry.com/tv/' },
  { title: "BanG Dream! It's MyGO!!!!!", source: 'Official anime website', description: 'The story, characters, and music of MyGO!!!!!.', url: 'https://anime.bang-dream.com/mygo/' },
  { title: 'Anti-Glass', source: 'xkcd · comic 1251', description: 'A small piece of technology satire.', url: 'https://xkcd.com/1251/' },
  { title: 'Dr French’s physics notes', source: 'The Eclecticon', description: 'A delightfully sprawling index of physics notes.', url: 'https://eclecticon.info/physics_notes.htm' },
  { title: 'lvy-neko', source: 'lvyovo-wiki.tech', description: 'Another place worth wandering into.', url: 'https://lvyovo-wiki.tech/' },
];

export function LostExperience() {
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState(0);
  const [played, setPlayed] = useState<number | null>(null);
  const [lights, setLights] = useState(true);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const audio = useRef<AudioContext | null>(null);
  const noteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (noteTimeout.current) clearTimeout(noteTimeout.current); void audio.current?.close(); }, []);
  function playNote(index: number) {
    const ctx = audio.current ?? new AudioContext();
    audio.current = ctx;
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(notes[index], t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.15, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(t);
    oscillator.stop(t + 1.25);
    setPlayed(index);
    if (noteTimeout.current) clearTimeout(noteTimeout.current);
    noteTimeout.current = setTimeout(() => setPlayed(null), 520);
  }
  return <main className={`lost-experience ${lights ? 'lights-on' : 'lights-off'}`} onPointerMove={event => {
    if (event.pointerType !== 'mouse') return;
    setCursor({ x: (event.clientX / window.innerWidth - .5) * 18, y: (event.clientY / window.innerHeight - .5) * 18 });
  }}>
    <div className="lost-grain" aria-hidden="true" />
    <div className="lost-beam" aria-hidden="true" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} />
    <div className="lost-shell">
      <div className="lost-topline"><span>UNFILED / AFTER HOURS</span><span>MYGO!!!!! · FAN SPACE</span><button type="button" onClick={() => setLights(value => !value)} aria-pressed={lights} aria-label={lights ? 'Dim the stage lights' : 'Turn on the stage lights'}>{lights ? 'DIM THE LIGHTS ◌' : 'LIGHTS ON ◌'}</button></div>
      <section className="lost-stage" aria-labelledby="lost-title">
        <div className="lost-portrait" style={{ transform: `translate(${cursor.x * -.35}px, ${cursor.y * -.35}px)` }}>
          <Image src="/images/rana-night.jpg" alt="Original fan illustration of Kaname Rāna with a guitar under blue live-house lights" fill priority sizes="(max-width: 800px) 100vw, 54vw" />
          <span className="portrait-credit">要 楽奈 / RĀNA KANAME · FAN ART</span>
        </div>
        <div className="lost-titleblock"><div className="lost-kicker"><span className="lost-pulse" /> somewhere after the last train</div><h1 id="lost-title">lost<span className="lost-slash"> / </span><em>迷子</em><span className="lost-period">.</span></h1><p>things that don’t belong on a CV</p><div className="lost-rule" /><p className="lost-whisper">“Interesting.”<span>— the stray cat, probably</span></p></div>
        <div className="lost-stage-index">SIDE B <span>↘</span> ANOTHER SIDE OF THE NOTEBOOK</div>
      </section>
      <section className="lost-interaction" aria-label="Interactive notebook fragments"><div className="lost-interaction-heading"><span>01 / PICK A FRAGMENT</span><span>click to turn the page ↗</span></div><div className="lost-fragment-layout"><div className="lost-fragment-controls" role="group" aria-label="Choose a fragment">{fragments.map((fragment, index) => <button key={fragment.mark} type="button" className={active === index ? 'selected' : ''} onClick={() => setActive(index)} aria-pressed={active === index}><span>0{index + 1}</span>{fragment.title}<span aria-hidden="true">↗</span></button>)}</div><div className="lost-fragment" key={active}><span>{fragments[active].mark}</span><p>{fragments[active].text}</p><div className="lost-scribble" aria-hidden="true">still listening…</div></div></div></section>
      <section className="lost-play" aria-label="A little guitar"><div className="lost-play-header"><span>02 / FIVE NOTES AFTER MIDNIGHT</span><span>sound on · tap a string</span></div><div className="lost-strings">{notes.map((_, index) => <button key={index} type="button" className={played === index ? 'sounding' : ''} onClick={() => playNote(index)} aria-label={`Play guitar note ${index + 1}`}><span aria-hidden="true" className="string-line" /><span aria-hidden="true" className="string-number">0{index + 1}</span></button>)}</div><p>No song here. Just a few notes to find your own way through.</p></section>
      <section className="lost-cat-section"><div><span className="lost-section-label">03 / A STRAY CAT APPEARS</span><h2>Catch her<br/><em>if you can.</em></h2><p>Rāna wanders in and out of the story on her own terms. Tap the little cat; she might decide to move.</p></div><div className="lost-cat-field"><button type="button" className={`lost-cat cat-${cat}`} onClick={() => setCat(value => (value + 1) % 5)} aria-label="Move the wandering cat"><span aria-hidden="true">=＾● ⋏ ●＾=</span></button><span className="cat-caption">{cat === 0 ? 'a familiar presence…' : ['there she goes', 'a little further', 'almost', 'found you', 'a familiar presence…'][cat]}</span></div></section>
      <section className="lost-sites" aria-labelledby="lost-sites-title"><div className="lost-sites-heading"><div><span className="lost-section-label">04 / FOUND ALONG THE WAY</span><h2 id="lost-sites-title">Interesting <em>Websites.</em></h2></div><p>Places worth wandering into. More will appear here later.</p></div><div className="lost-sites-list">{interestingSites.map((site, index) => <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" aria-label={`${site.title}, opens in a new tab`}><span className="lost-site-number">0{index + 1}</span><span className="lost-site-info"><small>{site.source}</small><strong>{site.title}</strong><span>{site.description}</span></span><span className="lost-site-arrow" aria-hidden="true">↗</span></a>)}</div></section>
      <footer className="lost-footer"><div><span>END OF SIDE B</span><p>Some things can stay unfinished.</p></div><Link href="/">← back to the research notebook</Link><span className="lost-footer-star" aria-hidden="true">✳</span></footer>
    </div>
    <RanaDesktopPet />
  </main>;
}
