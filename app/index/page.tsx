import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveProgress } from "@/components/archive-progress";

export const metadata: Metadata = { title: "Archive Index — SPAWNLABDEV 001" };

const entries = [
  { number: "00", name: "INTRO", href: "/", description: "The first look at Leonida." },
  { number: "01", name: "PLACES", href: "/explore", description: "Move through the known world." },
  { number: "02", name: "PEOPLE", href: "/people", description: "Meet the people who inhabit it." },
  { number: "03", name: "FIELD LOG", href: "/field-log", description: "The places and people you have discovered." },
  { number: "04", name: "RELEASE", href: "/release", description: "The confirmed date, in view." },
] as const;

export default function IndexPage() {
  return <main className="archive-index">
    <header><span>SPAWNLABDEV / EXPERIMENT 001</span><strong>ARCHIVE INDEX</strong></header>
    <div className="archive-index__intro"><span>001 / GRAND THEFT AUTO VI</span><p>An unofficial interactive archive of Leonida&apos;s confirmed places and people.</p><ArchiveProgress /></div>
    <nav aria-label="Archive sections"><ol>{entries.map((entry) => <li key={entry.number}><Link href={entry.href}><span>{entry.number}</span><strong>{entry.name}</strong><small>{entry.description}</small><i aria-hidden="true">↗</i></Link></li>)}</ol></nav>
    <footer><span>WE BUILD THINGS FROM GAMES.</span><span>UNOFFICIAL FAN PROJECT / NOT AFFILIATED WITH ROCKSTAR GAMES.</span></footer>
  </main>;
}
