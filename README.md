# SPAWNLABDEV / EXPERIMENT 001: LEONIDA

**We build things from games.**

Leonida is an unofficial interactive GTA VI companion and the first SPAWNLABDEV experiment. It treats the world revealed so far as material for a creative development and design study: an experience driven by images and movement rather than a conventional game database. Place and person notes use officially released material and link back to their sources.

## The experience

- A cinematic introduction with **Shift the Hour** and a transition into Leonida.
- A full screen navigator for six revealed places, with scroll, drag, keyboard and touch navigation.
- A visual People navigator and editorial Field Notes for places and people, connected where official material supports a relationship.
- Shareable Field Note URLs, plus a **Field Log** that tracks discoveries, saved notes and recent connections in local storage. No account is required.
- An archive index and a live release countdown.

## Built with

Next.js 16 (App Router), React 19 and TypeScript. Tailwind CSS 4 is configured; the visual system uses custom CSS, with transitions driven by React state and CSS motion. Next.js Image serves responsive, optimized WebP assets while the source JPEGs remain in `public/gta/`.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use `npm run lint` and `npm run build` to check a change before shipping it.

The main routes live in `app/`, experience components in `components/`, and the structured place, person and Field Log models in `data/`. Optimized imagery is in `public/media/`.

## Status and rights

**Actively evolving.** Experiment 001 is a creative development project, not an official GTA VI product.

This is an unofficial fan-made development and design experiment. It is not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Official GTA VI imagery, Grand Theft Auto, and related intellectual property belong to Rockstar Games and Take-Two Interactive and are used here only as part of this unofficial experiment.
