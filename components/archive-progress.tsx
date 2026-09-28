"use client";

import { useFieldLog } from "@/components/field-log-store";
import { allFieldEntries } from "@/data/field-log";

export function ArchiveProgress() {
  const log = useFieldLog();
  return <span className="archive-index__progress" aria-label={`${log.discovered.length} of ${allFieldEntries.length} field notes discovered`}>{String(log.discovered.length).padStart(2, "0")} / {String(allFieldEntries.length).padStart(2, "0")} FILES DISCOVERED</span>;
}
