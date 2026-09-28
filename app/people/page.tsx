import { PeopleExperience } from "@/components/people-experience";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "People of Leonida — SPAWNLABDEV 001" };

export default async function PeoplePage({ searchParams }: PageProps<"/people">) {
  const query = await searchParams;
  const person = typeof query.person === "string" ? query.person : undefined;
  return <PeopleExperience key={`${person ?? "first"}:${query.note === "1"}`} initialPersonId={person} openInitialDetail={query.note === "1"} />;
}
