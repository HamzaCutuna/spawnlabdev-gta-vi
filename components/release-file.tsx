"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { release } from "@/data/release";

const target = () => new Date(release.date.year, release.date.month - 1, release.date.day).getTime();
const remaining = () => Math.max(0, target() - Date.now());
const two = (number: number) => String(number).padStart(2, "0");

export function ReleaseFile() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setLeft(remaining());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pieces = left === null ? null : [
    { value: Math.floor(left / 86400000), label: "DAYS" },
    { value: Math.floor((left / 3600000) % 24), label: "HOURS" },
    { value: Math.floor((left / 60000) % 60), label: "MINUTES" },
    { value: Math.floor((left / 1000) % 60), label: "SECONDS" },
  ];

  return <main className="release-file">
    <div className="release-file__image"><Image src="/media/places/vice-city/08.webp" alt="Vice City lights and waterfront at night" fill sizes="(max-width: 700px) 100vw, 60vw" quality={85} preload /></div>
    <header className="release-file__header"><Link href="/index" aria-label="Open SPAWNLABDEV archive index"><span>SPAWNLABDEV / 001 ↗</span><strong>RELEASE FILE</strong></Link><Link href="/explore">LEONIDA <span aria-hidden="true">↗</span></Link></header>
    <div className="release-file__body"><span className="release-file__kicker">03 / THE RELEASE FILE</span><h1><span>19</span><span>NOV</span><span>2026</span></h1><p>Grand Theft Auto VI<br />Confirmed release date.</p></div>
    <div className="release-file__bottom"><div className="release-file__count"><span>COUNTDOWN <i>/</i> LOCAL TIME</span>{left === 0 ? <strong className="release-file__reached">RELEASE DATE REACHED</strong> : <div className="release-file__digits" aria-label={pieces ? `${pieces[0].value} days, ${pieces[1].value} hours, ${pieces[2].value} minutes and ${pieces[3].value} seconds until the release date` : "Loading countdown"}>{pieces?.map((piece) => <div key={piece.label}><strong>{piece.label === "DAYS" ? piece.value : two(piece.value)}</strong><small>{piece.label}</small></div>) ?? <span>—</span>}</div>}</div><div className="release-file__platforms"><span>ANNOUNCED PLATFORMS</span><strong>{release.platforms.join("  /  ")}</strong><a href={release.source} target="_blank" rel="noopener noreferrer">SOURCE / ROCKSTAR GAMES ↗</a></div></div>
    <footer className="release-file__footer">Countdown reaches the start of November 19 in your local time. Rockstar has not specified a launch hour.</footer>
  </main>;
}
