'use client';
import {useEffect,useState} from 'react';
import Image from 'next/image';
const zone='America/Los_Angeles';
export function BandTime() {
 const [now,setNow]=useState<Date|null>(null);
 const [offset,setOffset]=useState(0);
 useEffect(()=>{setNow(new Date());const timer=setInterval(()=>setNow(new Date()),1000);return ()=>clearInterval(timer);},[]);
 const parts=now?new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'numeric',day:'numeric'}).formatToParts(now):[];
 const value=(key:string)=>Number(parts.find(p=>p.type===key)?.value);
 const today=now?{year:value('year'),month:value('month')-1,day:value('day')}:null;
 const date=today?new Date(today.year,today.month+offset,1):null;
 const count=date?new Date(date.getFullYear(),date.getMonth()+1,0).getDate():0;
 const cells=date?[...Array(date.getDay()).fill(null),...Array.from({length:count},(_,i)=>i+1)]:[];
 const time=now?new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now):'—:—:—';
 return <div className="band-widgets">
  <section className="band-card mygo-calendar" aria-label="MyGO inspired calendar"><div className="band-art"><Image src="/images/mygo-calendar.webp" alt="Blue rainy-night anime band scene inspired by MyGO!!!!!" fill sizes="(max-width: 700px) 100vw, 50vw" priority/><div className="rain-lines" aria-hidden="true"/><div className="band-art-caption"><span>MYGO!!!!! / RAINY DAY NOTES</span><strong>Every day,<br/>a little forward.</strong></div></div><div className="calendar-body"><div className="calendar-heading"><button onClick={()=>setOffset(v=>v-1)} aria-label="Previous month">‹</button><h2>{date?date.toLocaleDateString('en-US',{month:'long',year:'numeric'}):'Calendar'}</h2><button onClick={()=>setOffset(v=>v+1)} aria-label="Next month">›</button></div><div className="calendar-grid" role="grid" aria-label={date?date.toLocaleDateString('en-US',{month:'long',year:'numeric'}):'Calendar'}>{['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=><span className="weekday" role="columnheader" key={d}>{d}</span>)}{cells.map((day,i)=><span role="gridcell" className={day&&offset===0&&today?.day===day?'today':''} aria-current={day&&offset===0&&today?.day===day?'date':undefined} key={i}>{day||''}</span>)}</div><button className="calendar-today" onClick={()=>setOffset(0)}>Back to today</button></div></section>
  <section className="band-card gbc-clock" aria-label="Girls Band Cry inspired clock"><div className="band-art"><Image src="/images/gbc-clock.webp" alt="Red night-city rock-band scene inspired by Girls Band Cry" fill sizes="(max-width: 700px) 100vw, 50vw" priority/><div className="stage-glow" aria-hidden="true"/><div className="band-art-caption"><span>GIRLS BAND CRY / LIVE NOW</span><strong>Make some<br/>noise.</strong></div></div><div className="clock-body"><div className="clock-meta"><span>RIGHT HERE, RIGHT NOW</span><span className="live-indicator">LIVE</span></div><time className="digital-clock" dateTime={now?.toISOString()}>{time}</time><p>{now?new Intl.DateTimeFormat('en-US',{timeZone:zone,weekday:'long',month:'long',day:'numeric'}).format(now):'Loading local time'}</p><div className="equalizer" aria-hidden="true">{Array.from({length:24},(_,i)=><i key={i} style={{animationDelay:`${(i%7)*-.17}s`,height:`${14+(i*17)%42}px`}}/>)}</div><span className="clock-zone">SAN DIEGO · PACIFIC TIME</span></div></section>
 </div>;
}
