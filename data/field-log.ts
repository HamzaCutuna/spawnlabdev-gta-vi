import { locations } from "@/data/locations";
import { people } from "@/data/people";

export const FIELD_LOG_KEY = "spawnlab:experiment-001";
export type FieldKind = "place" | "person";
export type FieldEntry = { kind: FieldKind; id: string };
export type FieldLog = {
  version: 1;
  discovered: string[];
  saved: string[];
  trail: string[];
};

export const emptyFieldLog = (): FieldLog => ({ version: 1, discovered: [], saved: [], trail: [] });
export const fieldKey = (entry: FieldEntry) => `${entry.kind}:${entry.id}`;
export const allFieldEntries: readonly FieldEntry[] = [
  ...locations.map(({ id }) => ({ kind: "place" as const, id })),
  ...people.map(({ id }) => ({ kind: "person" as const, id })),
];
const validKeys = new Set(allFieldEntries.map(fieldKey));

export function parseFieldLog(raw: string | null): FieldLog {
  if (!raw) return emptyFieldLog();
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || !("version" in value) || value.version !== 1) return emptyFieldLog();
    const record = value as Record<string, unknown>;
    const clean = (name: string, limit: number, dedupe = true) => Array.isArray(record[name])
      ? (dedupe ? [...new Set(record[name].filter((item): item is string => typeof item === "string" && validKeys.has(item)))] : record[name].filter((item): item is string => typeof item === "string" && validKeys.has(item))).slice(-limit)
      : [];
    return { version: 1, discovered: clean("discovered", validKeys.size), saved: clean("saved", validKeys.size), trail: clean("trail", 8, false) };
  } catch { return emptyFieldLog(); }
}

export function resolveFieldEntry(key: string): FieldEntry | undefined {
  return allFieldEntries.find((entry) => fieldKey(entry) === key);
}

export function fieldHref(entry: FieldEntry): string {
  return entry.kind === "place" ? `/places/${entry.id}` : `/people/${entry.id}`;
}
