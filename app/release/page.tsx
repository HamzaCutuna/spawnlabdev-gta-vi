import type { Metadata } from "next";
import { ReleaseFile } from "@/components/release-file";

export const metadata: Metadata = { title: "Release File — SPAWNLABDEV 001" };
export default function ReleasePage() { return <ReleaseFile />; }
