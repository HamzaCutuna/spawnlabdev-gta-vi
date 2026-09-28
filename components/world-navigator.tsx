"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type TouchEvent, type WheelEvent, type PointerEvent } from "react";
import { locations, type Location } from "@/data/locations";
import { LocationDetail } from "@/components/location-detail";
import { usePathname, useRouter } from "next/navigation";

type WorldNavigatorProps = {
  visible: boolean;
  onInitialReady: () => void;
  onReturn: () => void;
  initialLocationId?: string;
  openInitialDetail?: boolean;
};

type Move = { to: number; direction: 1 | -1; ready: boolean };
const wrap = (value: number) => (value + locations.length) % locations.length;

export function WorldNavigator({ visible, onInitialReady, onReturn, initialLocationId, openInitialDetail = false }: WorldNavigatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const initialIndex = Math.max(0, locations.findIndex((location) => location.id === initialLocationId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [move, setMove] = useState<Move | null>(null);
  const [detailIndex, setDetailIndex] = useState<number | null>(openInitialDetail ? initialIndex : null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const activeRef = useRef(initialIndex);
  const movingRef = useRef(false);
  const queuedRef = useRef<{ to: number; direction: 1 | -1 } | null>(null);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealFrame = useRef<number | null>(null);
  const wheelAt = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);

  useEffect(() => () => {
    if (moveTimer.current) clearTimeout(moveTimer.current);
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current);
  }, []);

  useEffect(() => {
    if (visible && detailIndex === null) root.current?.focus({ preventScroll: true });
  }, [visible, detailIndex]);

  function navigate(to: number, direction?: 1 | -1) {
    if (!visible || detailIndex !== null) return;
    const target = wrap(to);
    if (target === activeRef.current && !movingRef.current) return;
    const travel = direction ?? (target > activeRef.current ? 1 : -1);
    if (movingRef.current) {
      queuedRef.current = { to: target, direction: travel };
      return;
    }
    movingRef.current = true;
    setMove({ to: target, direction: travel, ready: false });
  }

  function onIncomingReady(target: number) {
    if (!movingRef.current || moveTimer.current || revealFrame.current !== null) return;
    // Give the decoded incoming scene a painted starting frame before animating it.
    revealFrame.current = requestAnimationFrame(() => {
      revealFrame.current = requestAnimationFrame(() => {
        revealFrame.current = null;
        if (!movingRef.current) return;
        setMove((current) => current?.to === target ? { ...current, ready: true } : current);
        const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 580;
        moveTimer.current = setTimeout(() => {
          activeRef.current = target;
          setActiveIndex(target);
          setMove(null);
          movingRef.current = false;
          moveTimer.current = null;
          const queued = queuedRef.current;
          queuedRef.current = null;
          if (queued && queued.to !== target) {
            requestAnimationFrame(() => {
              movingRef.current = true;
              setMove({ to: queued.to, direction: queued.direction, ready: false });
            });
          }
        }, duration);
      });
    });
  }

  useEffect(() => {
    if (!visible) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && detailIndex !== null) {
        setDetailIndex(null);
        if (pathname.startsWith("/places/")) router.push(`/explore?place=${locations[detailIndex].slug}`);
      } else if (detailIndex === null && (event.key === "ArrowRight" || event.key === "ArrowDown")) {
        event.preventDefault();
        navigate(activeRef.current + 1, 1);
      } else if (detailIndex === null && (event.key === "ArrowLeft" || event.key === "ArrowUp")) {
        event.preventDefault();
        navigate(activeRef.current - 1, -1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // Navigation reads current refs; rebind when visibility or detail state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, detailIndex, pathname, router]);

  function onWheel(event: WheelEvent<HTMLElement>) {
    if (!visible || detailIndex !== null || Math.abs(event.deltaY) < 14) return;
    const now = performance.now();
    if (now - wheelAt.current < 560) return;
    wheelAt.current = now;
    navigate(activeRef.current + (event.deltaY > 0 ? 1 : -1), event.deltaY > 0 ? 1 : -1);
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (!touchStart.current || detailIndex !== null) return;
    const dx = event.changedTouches[0].clientX - touchStart.current.x;
    const dy = event.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      suppressClickUntil.current = performance.now() + 400;
      navigate(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    }
  }

  function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== "mouse" || !root.current) return;
    const bounds = root.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    root.current.style.setProperty("--cursor-x", `${x}px`);
    root.current.style.setProperty("--cursor-y", `${y}px`);
    root.current.style.setProperty("--pan-x", `${((x / bounds.width) - .5) * -14}px`);
    root.current.style.setProperty("--pan-y", `${((y / bounds.height) - .5) * -10}px`);
  }

  function sceneStyle(location: Location): CSSProperties {
    return { "--scene-position": location.primaryImage.position ?? "center", "--scene-position-mobile": location.primaryImage.mobilePosition ?? "center" } as CSSProperties;
  }

  const active = locations[activeIndex];
  const display = move?.ready ? locations[move.to] : active;
  const next = locations[wrap(activeIndex + 1)];
  const openCurrent = () => {
    const index = move?.ready ? move.to : activeRef.current;
    setDetailIndex(index);
    router.push(`/places/${locations[index].slug}`, { scroll: false });
  };
  const openAdjacentDetail = (index: number) => {
    const adjacent = wrap(index);
    activeRef.current = adjacent;
    setActiveIndex(adjacent);
    setDetailIndex(adjacent);
    router.push(`/places/${locations[adjacent].slug}`, { scroll: false });
  };

  return (
    <section
      ref={root}
      tabIndex={-1}
      className={`world-nav ${visible ? "world-nav--visible" : ""} ${move ? `world-nav--travel-${move.direction > 0 ? "next" : "previous"}` : ""} ${move?.ready ? "world-nav--moving" : ""}`}
      aria-label="Explore Leonida"
      aria-hidden={!visible}
      inert={!visible}
      onWheel={onWheel}
      onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={onTouchEnd}
    >
      <div className="world-nav__viewport" inert={detailIndex !== null}>
        <div key={active.id} className="world-nav__scene world-nav__scene--current" data-treatment={active.treatment} style={sceneStyle(active)}>
          <Image className="world-nav__photo" src={active.primaryImage.src} alt={active.primaryImage.alt} fill sizes="100vw" quality={85} onLoad={onInitialReady} />
        </div>
        {move && (
          <div key={locations[move.to].id} className="world-nav__scene world-nav__scene--incoming" data-treatment={locations[move.to].treatment} style={sceneStyle(locations[move.to])}>
            <Image className="world-nav__photo" src={locations[move.to].primaryImage.src} alt={locations[move.to].primaryImage.alt} fill sizes="100vw" quality={85} loading="eager" onLoad={(event) => {
              event.currentTarget.decode().catch(() => undefined).then(() => onIncomingReady(move.to));
            }} />
          </div>
        )}
        {!move && detailIndex === null && <div className="world-nav__preload" aria-hidden="true"><Image src={next.primaryImage.src} alt="" fill sizes="100vw" quality={85} loading="eager" /></div>}
        <button
          type="button"
          className="world-nav__scene-hit"
          aria-label={`Open ${active.name} field note`}
          tabIndex={-1}
          onClick={() => {
            if (performance.now() < suppressClickUntil.current) return;
            openCurrent();
          }}
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse") return;
            pointerStart.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!pointerStart.current || event.pointerType !== "mouse") return;
            const dx = event.clientX - pointerStart.current.x;
            pointerStart.current = null;
            if (Math.abs(dx) > 58) {
              suppressClickUntil.current = performance.now() + 400;
              navigate(activeRef.current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
            }
          }}
          onPointerMove={onPointerMove}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") setCursorVisible(true); }}
          onPointerLeave={() => setCursorVisible(false)}
        />
      </div>

      <div className="world-nav__top" inert={detailIndex !== null}>
        <Link className="world-nav__identity" href="/index" aria-label="Open SPAWNLABDEV archive index"><span>SPAWNLABDEV / 001 ↗</span><strong>LEONIDA</strong></Link>
        <div className="world-nav__top-actions"><Link className="world-nav__mode-link" href="/people">PEOPLE <span aria-hidden="true">↗</span></Link><button className="world-nav__return" type="button" onClick={onReturn}>BACK TO INTRO <span aria-hidden="true">↗</span></button></div>
      </div>

      <div className="world-nav__rail" aria-label="Choose a location" inert={detailIndex !== null}>
        {locations.map((location, index) => (
          <button type="button" key={location.id} className={index === (move?.ready ? move.to : activeIndex) ? "is-active" : ""} onClick={() => navigate(index)} aria-label={`Go to ${location.name}`} aria-current={index === (move?.ready ? move.to : activeIndex) ? "true" : undefined}>
            <span className="world-nav__rail-number">{location.index}</span><span className="world-nav__rail-rule" aria-hidden="true" /><span className="world-nav__rail-name">{location.displayName ?? location.name}</span>
          </button>
        ))}
      </div>

      <div className="world-nav__bottom" inert={detailIndex !== null}>
        <div className="world-nav__location" key={display.id}>
          <span className="world-nav__kicker">LOCATION {display.index} <span>/</span> {String(locations.length).padStart(2, "0")} <span className="world-nav__type">{display.type}</span></span>
          <h2>{display.displayName ?? display.name}</h2>
          <p>{display.description}</p>
        </div>
        <div className="world-nav__actions">
          <button className="world-nav__open" type="button" onClick={openCurrent}>EXPLORE LOCATION <span aria-hidden="true">↗</span></button>
          <div className="world-nav__steps">
            <button type="button" onClick={() => navigate(activeRef.current - 1, -1)} aria-label="Previous location">←</button>
            <span>{display.index} / {String(locations.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => navigate(activeRef.current + 1, 1)} aria-label="Next location">→</button>
          </div>
        </div>
      </div>

      <div className={`world-nav__cursor ${cursorVisible && detailIndex === null ? "is-visible" : ""}`} aria-hidden="true"><span />OPEN FIELD NOTE</div>
      <span className="world-nav__hint">DRAG THE WORLD / SCROLL TO MOVE</span>

      {detailIndex !== null && (
        <LocationDetail
          key={locations[detailIndex].id}
          location={locations[detailIndex]}
          previousLocation={locations[wrap(detailIndex - 1)]}
          nextLocation={locations[wrap(detailIndex + 1)]}
          onBack={() => { setDetailIndex(null); if (pathname.startsWith("/places/")) router.push(`/explore?place=${locations[detailIndex].slug}`); }}
          onPrevious={() => openAdjacentDetail(detailIndex - 1)}
          onNext={() => openAdjacentDetail(detailIndex + 1)}
        />
      )}
    </section>
  );
}
