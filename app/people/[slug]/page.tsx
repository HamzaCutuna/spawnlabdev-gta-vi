import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PeopleExperience } from "@/components/people-experience";
import { getPerson, people } from "@/data/people";

export const generateStaticParams = () => people.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  return { title: person ? `${person.name} — Leonida Field Note` : "Leonida Field Note" };
}
export default async function PersonPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  if (!getPerson(slug)) notFound();
  return <PeopleExperience key={slug} initialPersonId={slug} openInitialDetail />;
}
