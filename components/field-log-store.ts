"use client";

import { useSyncExternalStore } from "react";
import { emptyFieldLog, FIELD_LOG_KEY, fieldKey, parseFieldLog, type FieldEntry, type FieldLog } from "@/data/field-log";

const listeners = new Set<() => void>();
const serverSnapshot = emptyFieldLog();
let current = serverSnapshot;
let loaded = false;

function notify() { listeners.forEach((listener) => listener()); }
function read() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try { current = parseFieldLog(window.localStorage.getItem(FIELD_LOG_KEY)); } catch { current = emptyFieldLog(); }
  }
  return current;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== FIELD_LOG_KEY) return;
    current = parseFieldLog(event.newValue);
    loaded = true;
    notify();
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
function commit(next: FieldLog) {
  current = next;
  loaded = true;
  try { window.localStorage.setItem(FIELD_LOG_KEY, JSON.stringify(next)); } catch { /* Browsing still works without storage. */ }
  notify();
}

export function useFieldLog() { return useSyncExternalStore(subscribe, read, () => serverSnapshot); }
export function discover(entry: FieldEntry) {
  const log = read();
  const key = fieldKey(entry);
  if (log.discovered.includes(key)) return false;
  commit({ ...log, discovered: [...log.discovered, key] });
  return true;
}
export function toggleSaved(entry: FieldEntry) {
  const log = read();
  const key = fieldKey(entry);
  commit({ ...log, saved: log.saved.includes(key) ? log.saved.filter((item) => item !== key) : [...log.saved, key] });
}
export function followConnection(from: FieldEntry, to: FieldEntry) {
  const log = read();
  const source = fieldKey(from);
  const destination = fieldKey(to);
  const tail = log.trail.at(-1) === source ? log.trail : [...log.trail, source];
  commit({ ...log, trail: [...tail, destination].slice(-8) });
}
export function resetFieldLog() { commit(emptyFieldLog()); }
