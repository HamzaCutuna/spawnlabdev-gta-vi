"use client";

import { useState } from "react";

export function HeroLightControl() {
  const [hour, setHour] = useState(50);
  const hourLabel = hour < 34 ? "GOLDEN HOUR" : hour < 70 ? "BLUE HOUR" : "NIGHT";

  return (
    <div className="light-control">
      <div className="light-control__heading">
        <span>SHIFT THE HOUR</span>
        <span aria-live="off">{hourLabel}</span>
      </div>
      <div className="light-control__track">
        <span>DUSK</span>
        <input
          aria-label="Shift the coastal scene from golden hour to night"
          aria-valuetext={hourLabel}
          type="range"
          min="0"
          max="100"
          value={hour}
          onChange={(event) => {
            const nextHour = Number(event.target.value);
            setHour(nextHour);
            event.currentTarget.closest<HTMLElement>(".hero")?.style.setProperty("--hour", String(nextHour / 100));
          }}
        />
        <span>NIGHT</span>
      </div>
    </div>
  );
}
