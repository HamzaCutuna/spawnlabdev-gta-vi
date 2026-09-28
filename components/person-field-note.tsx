"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { people, type Person, type PersonImage } from "@/data/people";
import { locations } from "@/data/locations";
import { discover, followConnection, toggleSaved, useFieldLog } from "@/components/field-log-store";
import { allFieldEntries, fieldKey } from "@/data/field-log";

type Props = { person: Person; previous: Person; next: Person; onBack: () => void; onPrevious: () => void; onNext: () => void };
const imageStyle = (image: PersonImage): CSSProperties => ({ "--note-position": image.position ?? "center", "--note-mobile-position": image.mobilePosition ?? image.position ?? "center" }) as CSSProperties;

export function PersonFieldNote({ person, previous, next, onBack, onPrevious, onNext }: Props) {
  const article = useRef<HTMLElement>(null);
  const [first, second] = person.chapters;
  const log = useFieldLog();
  const isSaved = log.saved.includes(fieldKey({ kind: "person", id: person.id }));

  useEffect(() => {
    discover({ kind: "person", id: person.id });
    article.current?.focus({ preventScroll: true });
    const root = article.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }, { root, threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
    root.querySelectorAll(".person-note__reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [person.id]);

  return <article ref={article} tabIndex={-1} className={`person-note person-note--${person.id}`} aria-label={`${person.name} field note`}>
    <header className="person-note__header"><Link className="person-note__brand" href="/archive">SPAWNLABDEV <i>/</i> FIELD NOTE {person.index} ↗</Link><div><button type="button" onClick={onBack}>BACK TO PEOPLE <span aria-hidden="true">↗</span></button></div></header>

    <section className="person-note__opening" style={imageStyle(person.lead)}>
      <Image src={person.lead.src} alt={person.lead.alt} fill sizes="100vw" quality={85} preload />
      {person.id === "real-dimez" && <div className="person-note__duo-frame" aria-hidden="true"><Image src={person.lead.src} alt="" fill sizes="100vw" quality={85} /></div>}
      <div className="person-note__opening-content"><span>{person.kind === "pair" ? "PEOPLE" : "PERSON"} / {person.index}.01</span><h2>{person.lines[0]}<br /><em>{person.lines[1]}</em></h2><p>{person.descriptor}</p>{person.members && <div className="person-note__members">{person.members.join("  /  ")}</div>}<button className="person-note__save" type="button" onClick={() => toggleSaved({ kind: "person", id: person.id })} aria-pressed={isSaved}>{isSaved ? "SAVED TO FIELD LOG" : "SAVE TO FIELD LOG"} <span aria-hidden="true">{isSaved ? "✓" : "+"}</span></button><span className="person-note__discovered" aria-live="polite">{log.discovered.includes(fieldKey({ kind: "person", id: person.id })) ? `FILE DISCOVERED / ${String(log.discovered.length).padStart(2, "0")} OF ${allFieldEntries.length}` : "\u00a0"}</span></div>
      <span className="person-note__scroll">SCROLL FIELD NOTE <span aria-hidden="true">↓</span></span>
    </section>

    <section className="person-note__brief person-note__reveal" aria-label={`${person.name} introduction`}>
      <div className="person-note__brief-top"><span>{person.index} / INTRODUCTION</span><span>CONFIRMED FILE / ROCKSTAR GAMES</span></div>
      <p>{person.introduction.text}</p>
      <a href={person.introduction.source} target="_blank" rel="noopener noreferrer">SOURCE / ROCKSTAR GAMES ↗</a>
    </section>

    {first && <section className="person-note__study person-note__reveal" aria-label={`${first.label} field note`}>
      <div className="person-note__study-caption"><span>{person.index}.02 / {first.label}</span><strong>{first.label}</strong><p>{first.body.text}</p><i aria-hidden="true" /></div>
      {first.image && <div className="person-note__study-image" style={imageStyle(first.image)}><Image src={first.image.src} alt={first.image.alt} fill sizes="(max-width: 700px) 100vw, 68vw" quality={85} /><span>FIELD NOTE / {person.index}.02</span></div>}
    </section>}

    {second?.image && <section className="person-note__wide person-note__reveal" aria-label={`${second.label} field note`} style={imageStyle(second.image)}>
      <Image src={second.image.src} alt={second.image.alt} fill sizes="100vw" quality={85} />
      <div className="person-note__wide-content"><span>{person.index}.03 / {second.label}</span><strong>{second.label}</strong><p>{second.body.text}</p></div>
    </section>}

    {(person.connections.length > 0 || person.places.length > 0 || person.organization) && <section className="person-note__network person-note__reveal" aria-label="Confirmed connections">
      <div className="person-note__network-heading"><span>{person.index}.04 / CONFIRMED CONNECTIONS</span><h3>IN THE<br /><em>ORBIT.</em></h3><p>Follow the people and places confirmed in Rockstar&apos;s material.</p></div>
      <div className="person-note__network-list">
        {person.organization && <div className="person-note__organization"><span>ORGANIZATION</span><strong>{person.organization.text}</strong></div>}
        {person.connections.map((connection) => {
          const related = people.find((entry) => entry.id === connection.personId);
          if (!related) return null;
          return <Link key={connection.personId} href={`/people/${related.slug}`} onClick={() => followConnection({ kind: "person", id: person.id }, { kind: "person", id: related.id })} className="person-note__network-link"><span>PERSON / {related.index}</span><strong>{related.name}</strong><small>{connection.context}</small><i aria-hidden="true">↗</i></Link>;
        })}
        {person.places.map((connection) => {
          const related = locations.find((entry) => entry.id === connection.locationId);
          if (!related) return null;
          return <Link key={connection.locationId} href={`/places/${related.slug}`} onClick={() => followConnection({ kind: "person", id: person.id }, { kind: "place", id: related.id })} className="person-note__network-link person-note__network-link--place"><span>PLACE / {related.index}</span><strong>{related.displayName ?? related.name}</strong><small>{connection.context}</small><i aria-hidden="true">↗</i></Link>;
        })}
      </div>
    </section>}

    <section className="person-note__transfer person-note__reveal" style={imageStyle(next.lead)}><Image src={next.lead.src} alt="" fill sizes="100vw" quality={85} /><div className="person-note__transfer-content"><span>CONTINUE THROUGH PEOPLE</span><div><button type="button" onClick={onPrevious}><small>← PREVIOUS / {previous.index}</small><strong>{previous.name}</strong></button><button type="button" onClick={onNext}><small>NEXT / {next.index} ↗</small><strong>{next.name}</strong></button></div></div></section>
    <footer className="person-note__footer"><span>SPAWNLABDEV / EXPERIMENT 001</span><a href={person.introduction.source} target="_blank" rel="noopener noreferrer">SOURCE / ROCKSTAR GAMES ↗</a><span>UNOFFICIAL FAN PROJECT. NOT AFFILIATED WITH ROCKSTAR GAMES.</span></footer>
  </article>;
}
