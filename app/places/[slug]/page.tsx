import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExploreRoute } from "@/components/explore-route";
import { getLocation, locations } from "@/data/locations";

export const generateStaticParams = () => locations.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: PageProps<"/places/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocation(slug);
  return { title: location ? `${location.name} — Leonida Field Note` : "Leonida Field Note" };
}
export default async function PlacePage({ params }: PageProps<"/places/[slug]">) {
  const { slug } = await params;
  if (!getLocation(slug)) notFound();
  return <ExploreRoute initialLocationId={slug} openInitialDetail />;
}
