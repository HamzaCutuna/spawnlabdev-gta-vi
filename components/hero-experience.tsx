"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroImage } from "@/content/site";
import { HeroLightControl } from "@/components/hero-light-control";
import { WorldNavigator } from "@/components/world-navigator";

type Phase = "intro" | "entering" | "entered" | "leaving";

export function HeroExperience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const initialReady = useRef(false);
  const minimumPassed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterButton = useRef<HTMLButtonElement>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function enterLeonida() {
    if (phase !== "intro") return;
    initialReady.current = false;
    minimumPassed.current = false;
    setPhase("entering");
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 680;
    timer.current = setTimeout(() => {
      timer.current = null;
      minimumPassed.current = true;
      if (initialReady.current) setPhase((current) => current === "entering" ? "entered" : current);
    }, duration);
  }

  function returnToIntro() {
    if (timer.current) clearTimeout(timer.current);
    setPhase("leaving");
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 620;
    timer.current = setTimeout(() => {
      timer.current = null;
      setPhase("intro");
      requestAnimationFrame(() => enterButton.current?.focus());
    }, duration);
  }

  function onInitialReady() {
    initialReady.current = true;
    if (minimumPassed.current) setPhase((current) => current === "entering" ? "entered" : current);
  }

  return (
    <main
      className={`hero hero--${phase}`}
      id="top"
    >
      <div className="hero__scene">
        <Image className="hero__image" src={heroImage.src} alt={heroImage.alt} fill sizes="100vw" quality={85} fetchPriority="high" />
        <div className="hero__warmth" aria-hidden="true" />
        <Image className="hero__night-grade" src={heroImage.src} alt="" aria-hidden="true" fill sizes="100vw" quality={85} />
        <Image className="hero__lights" src={heroImage.src} alt="" aria-hidden="true" fill sizes="100vw" quality={85} />
      </div>
      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__intro-layer" inert={phase !== "intro"}>
        <header className="site-header">
          <Link className="site-brand" href="/archive" aria-label="Open SPAWNLABDEV archive index">
            <span className="site-brand__mark" aria-hidden="true">S<span>∕</span>L</span>
            <span className="site-brand__text">SPAWNLABDEV<span>EXPERIMENT 001</span></span>
          </Link>
          <div className="site-header__edition"><span>AN UNOFFICIAL</span><span>WORLD COMPANION</span><Link href="/archive">INDEX ↗</Link></div>
        </header>

        <div className="hero__body">
          <div className="hero__eyebrow"><span className="hero__eyebrow-line" aria-hidden="true" />WELCOME TO THE WORLD OF GTA VI</div>
          <h1 className="hero__title">LEONIDA<span>.</span></h1>
          <div className="hero__intro">
            <p>A digital window into a world<br />we have yet to explore.</p>
            <div className="hero__entry-block">
              <span className="hero__chapter">01 <span aria-hidden="true">/</span> THE FIRST LOOK</span>
              <button ref={enterButton} className="hero__enter" type="button" onClick={enterLeonida}>
                <span>ENTER LEONIDA</span><span className="hero__enter-arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>
        </div>

        <div className="hero__bottom">
          <div className="hero__caption"><span>FIELD NOTE — 001</span><p>An unofficial interactive companion to the world of Grand Theft Auto VI.</p></div>
          <HeroLightControl />
        </div>
        <footer className="site-footer">
          <span>© SPAWNLABDEV / 2026</span>
          <span>Unofficial fan-made project. Not affiliated with or endorsed by Rockstar Games. Grand Theft Auto and related properties belong to Rockstar Games and Take-Two Interactive.</span>
        </footer>
      </div>

      {phase !== "intro" && <WorldNavigator visible={phase === "entered"} onInitialReady={onInitialReady} onReturn={returnToIntro} />}
    </main>
  );
}
