"use client";

import { useRouter } from "next/navigation";
import { WorldNavigator } from "@/components/world-navigator";

export function ExploreRoute({ initialLocationId, openInitialDetail }: { initialLocationId?: string; openInitialDetail?: boolean }) {
  const router = useRouter();
  return <main className="explore-route"><WorldNavigator key={`${initialLocationId ?? "first"}:${openInitialDetail}`} visible initialLocationId={initialLocationId} openInitialDetail={openInitialDetail} onInitialReady={() => undefined} onReturn={() => router.push("/")} /></main>;
}
