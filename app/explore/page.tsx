import { ExploreRoute } from "@/components/explore-route";

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const query = await searchParams;
  return <ExploreRoute initialLocationId={typeof query.place === "string" ? query.place : undefined} openInitialDetail={query.note === "1"} />;
}
