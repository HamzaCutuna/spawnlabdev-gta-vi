"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type TouchEvent, type WheelEvent } from "react";
import { people, type Person, type PersonImage } from "@/data/people";
import { PersonFieldNote } from "@/components/person-field-note";
import { usePathname, useRouter } from "next/navigation";

type Move = { to: number; direction: 1 | -1; ready: boolean };
const wrap = (value: number) => (value + people.length) % people.length;
const imageStyle = (image: PersonImage): CSSProperties => ({ "--person-position": image.position ?? "center", "--person-mobile-position": image.mobilePosition ?? image.position ?? "center" }) as CSSProperties;

function Portrait({ person, onLoad, eager = false }: { person: Person; onLoad?: (image: HTMLImageElement) => void; eager?: boolean }) {
  return <Image src={person.lead.src} alt={person.lead.alt} fill sizes="(max-width: 700px) 100vw, 72vw" quality={85} preload={eager} loading="eager" onLoad={(event) => onLoad?.(event.currentTarget)} />;
}

export function PeopleExperience({ initialPersonId, openInitialDetail = false }: { initialPersonId?: string; openInitialDetail?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const initialIndex = Math.max(0, people.findIndex((person) => person.id === initialPersonId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [move, setMove] = useState<Move | null>(null);
  const [detailIndex, setDetailIndex] = useState<number | null>(openInitialDetail ? initialIndex : null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const activeRef = useRef(initialIndex);
  const movingRef = useRef(false);
  const queuedRef = useRef<{ to: number; direction: 1 | -1 } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const wheelAt = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const root = useRef<HTMLElement>(null);
  const directoryClose = useRef<HTMLButtonElement>(null);

  const navigate = useCallback((to: number, direction?: 1 | -1) => {
    const target = wrap(to);
    if (detailIndex !== null) return;
    if (target === activeRef.current && !movingRef.current) return;
    const travel = direction ?? (target > activeRef.current ? 1 : -1);
    if (movingRef.current) { queuedRef.current = { to: target, direction: travel }; return; }
    movingRef.current = true;
    setMove({ to: target, direction: travel, ready: false });
  }, [detailIndex]);

  function onIncomingReady(target: number, image: HTMLImageElement) {
    if (!movingRef.current || frameRef.current !== null || timerRef.current) return;
    image.decode().catch(() => undefined).then(() => {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          setMove((current) => current?.to === target ? { ...current, ready: true } : current);
          timerRef.current = setTimeout(() => {
            activeRef.current = target;
            setActiveIndex(target);
            setMove(null);
            movingRef.current = false;
            timerRef.current = null;
            const queued = queuedRef.current;
            queuedRef.current = null;
            if (queued && queued.to !== target) navigate(queued.to, queued.direction);
          }, 610);
        });
      });
    });
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (directoryOpen) { setDirectoryOpen(false); event.preventDefault(); }
        else if (detailIndex !== null) { setDetailIndex(null); if (pathname.startsWith("/people/")) router.push(`/people?person=${people[detailIndex].slug}`); event.preventDefault(); }
        return;
      }
      if (detailIndex !== null || directoryOpen) return;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); navigate(activeRef.current + 1, 1); }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); navigate(activeRef.current - 1, -1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, detailIndex, directoryOpen, pathname, router]);

  useEffect(() => { if (directoryOpen) directoryClose.current?.focus({ preventScroll: true }); }, [directoryOpen]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  function onWheel(event: WheelEvent<HTMLElement>) {
    if (detailIndex !== null || directoryOpen || Math.abs(event.deltaY) < 14) return;
    const now = performance.now();
    if (now - wheelAt.current < 510) return;
    wheelAt.current = now;
    navigate(activeRef.current + (event.deltaY > 0 ? 1 : -1), event.deltaY > 0 ? 1 : -1);
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!touchStart.current || detailIndex !== null || directoryOpen) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      suppressClickUntil.current = performance.now() + 400;
      navigate(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  }

  function onPointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current || event.pointerType !== "mouse") return;
    const dx = event.clientX - dragStart.current.x;
    dragStart.current = null;
    if (Math.abs(dx) > 55) {
      suppressClickUntil.current = performance.now() + 400;
      navigate(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  }

  const active = people[activeIndex];
  const display = move?.ready ? people[move.to] : active;
  const openCurrent = () => {
    if (performance.now() < suppressClickUntil.current || movingRef.current) return;
    setDetailIndex(activeRef.current);
    router.push(`/people/${people[activeRef.current].slug}`, { scroll: false });
  };
  const openAdjacent = (index: number) => {
    const target = wrap(index);
    activeRef.current = target;
    setActiveIndex(target);
    setDetailIndex(target);
    router.push(`/people/${people[target].slug}`, { scroll: false });
  };

  return <main ref={root} className={`people ${move ? `people--travel-${move.direction > 0 ? "next" : "previous"}` : ""} ${move?.ready ? "people--moving" : ""}`} aria-label="People of Leonida" onWheel={onWheel} onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={onTouchEnd} style={{ "--people-tone": display.tone } as CSSProperties}>
    <div className="people__navigator" inert={detailIndex !== null || directoryOpen}>
      <div className="people__canvas" aria-hidden="true">
        <div key={active.id} className={`people__portrait people__portrait--current people__portrait--${active.alignment}`} style={imageStyle(active.lead)}><Portrait person={active} eager={activeIndex === 0} /></div>
        {move && <div key={people[move.to].id} className={`people__portrait people__portrait--incoming people__portrait--${people[move.to].alignment}`} style={imageStyle(people[move.to].lead)}><Portrait person={people[move.to]} onLoad={(image) => onIncomingReady(move.to, image)} /></div>}
        {!move && detailIndex === null && <div className="people__preload"><Portrait person={people[wrap(activeIndex + 1)]} /><Portrait person={people[wrap(activeIndex - 1)]} /></div>}
      </div>
      <button className="people__image-hit" type="button" onClick={openCurrent} onPointerDown={(event) => { if (event.pointerType === "mouse") dragStart.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={onPointerUp} aria-label={`Open ${active.name} field note`} />
      <header className="people__header">
        <Link className="people__identity" href="/archive" aria-label="Open SPAWNLABDEV archive index"><span>SPAWNLABDEV / 001 ↗</span><strong>PEOPLE</strong></Link>
        <nav aria-label="Experience"><Link href="/explore"><span className="people__link-context">LEONIDA / </span>PLACES <span className="people__link-arrow" aria-hidden="true">↗</span></Link><button type="button" onClick={() => setDirectoryOpen(true)}>INDEX <span aria-hidden="true">↗</span></button></nav>
      </header>
      <div key={display.id} className={`people__subject people__subject--${display.alignment}`}>
        <div className="people__eyebrow"><span>PERSON / {display.index}</span><span className="people__eyebrow-rule" /><span>{display.kind === "pair" ? "TOGETHER" : "FIELD NOTE"}</span></div>
        <h1>{display.lines[0]}{display.lines[1] && <><br /><em>{display.lines[1]}</em></>}</h1>
        <p className="people__descriptor">{display.descriptor}</p>
        <button className="people__open" type="button" onClick={openCurrent}>OPEN FIELD NOTE <span aria-hidden="true">↗</span></button>
      </div>
      <div className="people__footer"><span>CHARACTER INDEX <i>/</i> {display.index} OF {String(people.length).padStart(2, "0")}</span><span className="people__gesture">DRAG OR SCROLL TO DISCOVER</span><div className="people__steps"><button type="button" onClick={() => navigate(activeRef.current - 1, -1)} aria-label="Previous person">←</button><span>{display.index} / {String(people.length).padStart(2, "0")}</span><button type="button" onClick={() => navigate(activeRef.current + 1, 1)} aria-label="Next person">→</button></div></div>
    </div>
    {directoryOpen && <div className="people__directory" role="dialog" aria-modal="true" aria-label="People index"><header><Link href="/archive">SPAWNLABDEV / ARCHIVE ↗</Link><button ref={directoryClose} type="button" onClick={() => setDirectoryOpen(false)}>CLOSE <span aria-hidden="true">×</span></button></header><ol>{people.map((person, index) => <li key={person.id}><button type="button" onClick={() => { setDirectoryOpen(false); navigate(index); }}><span>{person.index}</span><strong>{person.name}</strong><span aria-hidden="true">↗</span></button></li>)}</ol></div>}
    {detailIndex !== null && <PersonFieldNote key={people[detailIndex].id} person={people[detailIndex]} previous={people[wrap(detailIndex - 1)]} next={people[wrap(detailIndex + 1)]} onBack={() => { setDetailIndex(null); if (pathname.startsWith("/people/")) router.push(`/people?person=${people[detailIndex].slug}`); }} onPrevious={() => openAdjacent(detailIndex - 1)} onNext={() => openAdjacent(detailIndex + 1)} />}
  </main>;
}
