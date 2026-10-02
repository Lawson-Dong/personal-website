import Link from 'next/link';
import { AnimeAvatar } from '../../../components/anime-avatar';
export const metadata = { title: 'My anime self · Lawson Dong' };
export default function AvatarPage(){return <main className="avatar-page"><div className="avatar-intro"><Link className="text-link" href="/about">← About the website</Link><p className="eyebrow">THE OTHER SIDE / もうひとりの僕</p><h1>My anime self.</h1><p>Hands in my pockets. Headphones on.<br/>A tiny me, with a guitar and a little daydream.</p></div><AnimeAvatar/><div className="avatar-caption"><span>MOVE YOUR CURSOR · TOUCH & DRAG</span><p>Somewhere between a notebook and a backstage daydream.</p></div></main>}
