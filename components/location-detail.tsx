"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Location, LocationImage } from "@/data/locations";
import { people } from "@/data/people";
import { discover, followConnection, toggleSaved, useFieldLog } from "@/components/field-log-store";
import { allFieldEntries, fieldKey } from "@/data/field-log";

type Props = { location: Location; previousLocation: Location; nextLocation: Location; onBack: () => void; onPrevious: () => void; onNext: () => void };
const imagePosition = (image: LocationImage): CSSProperties => ({ "--detail-position": image.position ?? "center", "--detail-mobile-position": image.mobilePosition ?? image.position ?? "center" }) as CSSProperties;

export function LocationDetail({ location, previousLocation, nextLocation, onBack, onPrevious, onNext }: Props) {
  const report = useRef<HTMLElement>(null);
  const backButton = useRef<HTMLButtonElement>(null);
  const [wideChapter, studyChapter] = location.chapters;
  const relatedPeople = people.filter((person) => person.kind === "person" && person.places.some((place) => place.locationId === location.id));
  const log = useFieldLog();
  const isSaved = log.saved.includes(fieldKey({ kind: "place", id: location.id }));

  useEffect(() => {
    discover({ kind: "place", id: location.id });
    backButton.current?.focus({ preventScroll: true });
    const root = report.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }, { root, rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    root.querySelectorAll(".location-detail__reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [location.id]);

  return <article ref={report} className={`location-detail location-detail--${location.reportStyle}`} aria-label={`${location.name} field note`} onScroll={(event) => event.currentTarget.classList.toggle("location-detail--scrolled", event.currentTarget.scrollTop > 80)}>
    <header className="location-detail__top"><Link className="location-detail__brand" href="/archive">SPAWNLABDEV <span>/</span> FIELD NOTE {location.index} ↗</Link><button ref={backButton} type="button" onClick={onBack}>BACK TO LEONIDA <span aria-hidden="true">↗</span></button></header>

    <section className="location-detail__opening" data-treatment={location.treatment} style={imagePosition(location.primaryImage)}>
      <Image className="location-detail__opening-image" src={location.primaryImage.src} alt={location.primaryImage.alt} fill sizes="100vw" quality={85} preload />
      <div className="location-detail__lead"><span>FIELD NOTE / {location.index}.01</span><h2>{location.name}</h2><p>{location.description}</p><button className="location-detail__save" type="button" onClick={() => toggleSaved({ kind: "place", id: location.id })} aria-pressed={isSaved}>{isSaved ? "SAVED TO FIELD LOG" : "SAVE TO FIELD LOG"} <span aria-hidden="true">{isSaved ? "✓" : "+"}</span></button><span className="location-detail__discovered" aria-live="polite">{log.discovered.includes(fieldKey({ kind: "place", id: location.id })) ? `FILE DISCOVERED / ${String(log.discovered.length).padStart(2, "0")} OF ${allFieldEntries.length}` : "\u00a0"}</span></div>
      <span className="location-detail__scroll">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span>
    </section>

    <section className="location-detail__interlude location-detail__reveal" aria-label="Field note introduction"><div className="location-detail__interlude-index">{location.index} <span>/</span> {location.type}</div><div className="location-detail__interlude-line" aria-hidden="true" /><p>{location.introduction.text}</p><a className="location-detail__interlude-cue" href={location.introduction.source} target="_blank" rel="noopener noreferrer">SOURCE / ROCKSTAR GAMES ↗</a></section>

    <section className="location-detail__wide location-detail__reveal" aria-label={`${location.name} field note ${location.index}.02`}>
      <div className="location-detail__wide-frame" style={imagePosition(wideChapter.image)}><Image src={wideChapter.image.src} alt={wideChapter.image.alt} fill sizes="100vw" quality={85} /><div className="location-detail__wide-caption"><span>FIELD NOTE / {location.index}.02</span><span>{wideChapter.label}</span></div></div>
      <div className="location-detail__chapter-copy"><span>{location.index}.02 / {wideChapter.label}</span><p>{wideChapter.body.text}</p><a href={wideChapter.body.source} target="_blank" rel="noopener noreferrer">SOURCE / OFFICIAL SCREENSHOTS ↗</a></div>
    </section>

    <section className="location-detail__study location-detail__reveal" aria-label={`${location.name} field note ${location.index}.03`}>
      <div className="location-detail__study-side"><span>FIELD NOTE / {location.index}.03</span><div className="location-detail__study-rule" aria-hidden="true" /><p>{studyChapter.label}</p><span className="location-detail__study-body">{studyChapter.body.text}</span><a href={studyChapter.body.source} target="_blank" rel="noopener noreferrer">SOURCE / OFFICIAL SCREENSHOTS ↗</a></div>
      <div className="location-detail__study-frame" style={imagePosition(studyChapter.image)}><Image src={studyChapter.image.src} alt={studyChapter.image.alt} fill sizes="(max-width: 640px) 100vw, 65vw" quality={85} /></div>
    </section>

    {relatedPeople.length > 0 && <section className="location-detail__people location-detail__reveal" aria-label={`People connected to ${location.name}`}><div><span>FIELD NOTE / {location.index}.04</span><h3>PEOPLE<br /><em>OF THIS PLACE.</em></h3><p>Connections confirmed in Rockstar&apos;s official Leonida material.</p></div><div className="location-detail__people-list">{relatedPeople.map((person) => <Link key={person.id} href={`/people/${person.slug}`} onClick={() => followConnection({ kind: "place", id: location.id }, { kind: "person", id: person.id })}><span>PERSON / {person.index}</span><strong>{person.name}</strong><small>{person.places.find((place) => place.locationId === location.id)?.context}</small><i aria-hidden="true">↗</i></Link>)}</div></section>}

    <section className="location-detail__transfer location-detail__reveal" aria-label="Continue exploring Leonida" style={imagePosition(nextLocation.primaryImage)}><Image src={nextLocation.primaryImage.src} alt="" fill sizes="100vw" quality={85} /><div className="location-detail__transfer-content"><span>CONTINUE THROUGH LEONIDA</span><div className="location-detail__transfer-navigation"><button className="location-detail__previous" type="button" onClick={onPrevious}><span>← PREVIOUS FIELD NOTE / {previousLocation.index}</span><strong>{previousLocation.displayName ?? previousLocation.name}</strong></button><button className="location-detail__next" type="button" onClick={onNext}><span>NEXT FIELD NOTE / {nextLocation.index}</span><strong>{nextLocation.displayName ?? nextLocation.name}<i aria-hidden="true">↗</i></strong></button></div></div></section>
    <footer className="location-detail__legal">Unofficial fan-made project. Not affiliated with or endorsed by Rockstar Games. Grand Theft Auto and related properties belong to Rockstar Games and Take-Two Interactive.</footer>
  </article>;
}
