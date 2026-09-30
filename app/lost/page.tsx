import type { Metadata } from 'next';
import { LostExperience } from '@/components/lost-experience';
import './lost.css';

export const metadata: Metadata = { title: 'lost / 迷子', description: 'A personal corner of Lawson Dong’s notebook. Music, fragments, and the things that resist filing.' };
export default function Lost() { return <LostExperience />; }
