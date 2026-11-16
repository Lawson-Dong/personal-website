import Link from 'next/link';
import { HomeRing } from '@/components/home-ring';
import {BandTime} from '@/components/band-time';
import {MusicCorner} from '@/components/music-corner';
export default function Home(){return <main className="portal-home"><div className="home-top"><p className="eyebrow">A PERSONAL NOTEBOOK / UC SAN DIEGO</p><span>PHYSICS · CODE · CURIOSITY</span></div><div className="home-intro"><h1>Between questions<br/><em>and the next experiment.</em></h1><p>Research, programming notes, and things worth reading.<br/>A small corner of the internet, with the bands I love.</p></div><BandTime/><MusicCorner/><HomeRing/><footer className="portal-footer" id="about"><span>LAWSON DONG / AN UNFINISHED NOTEBOOK</span><Link href="/about">About the website</Link></footer></main>;}
