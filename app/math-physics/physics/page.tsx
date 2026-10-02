import Link from 'next/link';
import { AudioLines } from 'lucide-react';
export const metadata = { title: 'Physics' };
export default function PhysicsFolder() { return <main className="section shell science-room physics-room"><nav className="science-breadcrumb" aria-label="Breadcrumb"><Link href="/math-physics">Math &amp; Physics</Link><span>/</span><span>Physics</span></nav><p className="eyebrow">02 / THE PHYSICS FOLDER</p><h1 className="portal-title">Physics.<br/><em>Stay curious.</em></h1><div className="physics-empty"><AudioLines aria-hidden="true"/><p>A space for future notes and experiments.</p><span className="eyebrow">NO NOTES YET / THE NEXT QUESTION IS ON ITS WAY</span></div></main>; }
