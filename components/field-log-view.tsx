"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { locations } from "@/data/locations";
import { people } from "@/data/people";
import { allFieldEntries, fieldHref, fieldKey, resolveFieldEntry, type FieldEntry } from "@/data/field-log";
import { resetFieldLog, useFieldLog } from "@/components/field-log-store";

const item = (entry: FieldEntry) => entry.kind === "place" ? locations.find((place) => place.id === entry.id) : people.find((person) => person.id === entry.id);

export function FieldLogView() {
  const log = useFieldLog();
  const router = useRouter();
  const [confirmReset, setConfirmReset] = useState(false);
  const [departing, setDeparting] = useState(false);
  const discovered = new Set(log.discovered);
  const saved = new Set(log.saved);
  const randomEntry = () => {
    if (departing) return;
    const unseen = allFieldEntries.filter((entry) => !discovered.has(fieldKey(entry)));
    const pool = unseen.length ? unseen : allFieldEntries;
    const target = pool[Math.floor(Math.random() * pool.length)];
    setDeparting(true);
    window.setTimeout(() => router.push(fieldHref(target)), 320);
  };
  const row = (entry: FieldEntry) => {
    const record = item(entry);
    if (!record) return null;
    const key = fieldKey(entry);
    return <li key={key}><Link href={fieldHref(entry)}><span className="field-log__row-index">{record.index}</span><strong>{record.name}</strong><span className="field-log__row-state">{saved.has(key) ? "SAVED" : discovered.has(key) ? "DISCOVERED" : "UNSEEN"}</span><i aria-hidden="true">↗</i></Link></li>;
  };

  return <main className={`field-log ${departing ? "field-log--departing" : ""}`}>
    <header className="field-log__header"><Link href="/index">SPAWNLABDEV / 001 ↗</Link><nav aria-label="Archive"><Link href="/explore">PLACES</Link><Link href="/people">PEOPLE</Link></nav></header>
    <section className="field-log__hero"><div className="field-log__hero-photo" aria-hidden="true"><Image src="/media/places/grassrivers/05.webp" alt="" fill sizes="(max-width: 700px) 100vw, 45vw" quality={80} preload /></div><div className="field-log__hero-content"><span>EXPERIMENT 001 / PERSONAL ARCHIVE</span><h1>LEONIDA<br /><em>FIELD LOG.</em></h1><p>Every field note you open becomes part of your record. Save the ones you want to return to.</p><div className="field-log__count"><strong>{String(log.discovered.length).padStart(2, "0")}</strong><span>/ {String(allFieldEntries.length).padStart(2, "0")} FILES DISCOVERED</span></div></div></section>
    <section className="field-log__prompt"><div><span>NO ROUTE REQUIRED</span><p>{log.discovered.length === allFieldEntries.length ? "The whole archive is open. Find another way through." : "Somewhere in Leonida is still unseen."}</p></div><button type="button" onClick={randomEntry}>TAKE ME SOMEWHERE <span aria-hidden="true">↗</span></button></section>
    {log.saved.length > 0 && <section className="field-log__section"><div className="field-log__section-heading"><span>01 / KEPT CLOSE</span><h2>SAVED FILES</h2></div><ol>{allFieldEntries.filter((entry) => saved.has(fieldKey(entry))).map(row)}</ol></section>}
    <section className="field-log__section"><div className="field-log__section-heading"><span>02 / KNOWN WORLD</span><h2>PLACES</h2><small>{locations.filter((place) => discovered.has(fieldKey({ kind: "place", id: place.id }))).length} / {locations.length} DISCOVERED</small></div><ol>{locations.map(({ id }) => row({ kind: "place", id }))}</ol></section>
    <section className="field-log__section"><div className="field-log__section-heading"><span>03 / IN THE ORBIT</span><h2>PEOPLE</h2><small>{people.filter((person) => discovered.has(fieldKey({ kind: "person", id: person.id }))).length} / {people.length} DISCOVERED</small></div><ol>{people.map(({ id }) => row({ kind: "person", id }))}</ol></section>
    {log.trail.length > 0 && <section className="field-log__trail"><span>RECENT TRAIL / CONFIRMED CONNECTIONS</span><div>{log.trail.map((key, index) => { const entry = resolveFieldEntry(key); const record = entry && item(entry); return entry && record ? <Link key={`${key}-${index}`} href={fieldHref(entry)}>{record.name}<span aria-hidden="true">↗</span></Link> : null; })}</div></section>}
    <footer className="field-log__footer"><span>THIS RECORD IS STORED ON THIS DEVICE.</span>{confirmReset ? <div><span>RESET YOUR LOCAL FIELD LOG?</span><button type="button" onClick={() => { resetFieldLog(); setConfirmReset(false); }}>CONFIRM RESET</button><button type="button" onClick={() => setConfirmReset(false)}>CANCEL</button></div> : <button type="button" onClick={() => setConfirmReset(true)}>RESET FIELD LOG ↗</button>}</footer>
  </main>;
}
