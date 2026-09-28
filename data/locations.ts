export type LocationImage = {
  src: string;
  alt: string;
  position?: string;
  mobilePosition?: string;
};
export type LocationText = { text: string; source: string };
export type LocationChapter = { label: string; body: LocationText; image: LocationImage };
export const ROCKSTAR_PLACES_SOURCE = "https://www.rockstargames.com/VI/only-in-leonida";
export const ROCKSTAR_SCREENSHOTS_SOURCE = "https://www.rockstargames.com/VI/media/screenshots";

export type Location = {
  id: string;
  slug: string;
  name: string;
  displayName?: string;
  index: string;
  type: string;
  description: string;
  primaryImage: LocationImage;
  secondaryImages: readonly LocationImage[];
  treatment: string;
  introduction: LocationText;
  chapters: readonly [LocationChapter, LocationChapter];
  reportStyle: "city" | "islands" | "wetlands" | "roadside" | "industrial" | "highlands";
};

const placeImage = (slug: string, number: string) => `/media/places/${slug}/${number}.webp`;
const observed = (text: string): LocationText => ({ text, source: ROCKSTAR_SCREENSHOTS_SOURCE });
const official = (text: string): LocationText => ({ text, source: ROCKSTAR_PLACES_SOURCE });

export const locations: readonly Location[] = [
  {
    id: "vice-city",
    slug: "vice-city",
    name: "Vice City",
    index: "01",
    type: "CITY / COAST",
    description: "A skyline caught between daylight and city lights.",
    primaryImage: { src: placeImage("vice-city", "11"), alt: "Vice City skyline and waterfront beneath a dusk sky", position: "center center", mobilePosition: "60% center" },
    secondaryImages: [
      { src: placeImage("vice-city", "10"), alt: "High-rise buildings beside the water in Vice City" },
      { src: placeImage("vice-city", "01"), alt: "Illuminated coastal buildings as an aircraft passes overhead" },
    ],
    treatment: "city",
    reportStyle: "city",
    introduction: official("Rockstar introduces Leonida through Vice City's neon streets. The official images move from its waterfront towers in daylight to the city lights after dark."),
    chapters: [
      { label: "THE WATERFRONT", body: observed("Daylight reveals towers along the water's edge, with boats tracing the open channel below. The view gives the city's coast its scale."), image: { src: placeImage("vice-city", "10"), alt: "High-rise buildings and boats beside the water in Vice City" } },
      { label: "AFTER DARK", body: observed("At night, an illuminated complex and Ferris wheel fill the foreground while the city lights recede into the distance."), image: { src: placeImage("vice-city", "08"), alt: "Vice City waterfront complex and Ferris wheel illuminated at night" } },
    ],
  },
  {
    id: "leonida-keys",
    slug: "leonida-keys",
    name: "Leonida Keys",
    index: "02",
    type: "ISLANDS / OPEN WATER",
    description: "Open water, islands, and the road between them.",
    primaryImage: { src: placeImage("leonida-keys", "01"), alt: "A causeway crossing turquoise water and islands in the Leonida Keys", position: "center center", mobilePosition: "58% center" },
    secondaryImages: [
      { src: placeImage("leonida-keys", "05"), alt: "Boats gathered on the water in the Leonida Keys" },
      { src: placeImage("leonida-keys", "04"), alt: "Divers and sea life beneath the surface" },
    ],
    treatment: "keys",
    reportStyle: "islands",
    introduction: official("The Leonida Keys appear in Rockstar's official material as a chain of islands and open water. Jason works here for local drug runners; Brian's boat yard is also in the Keys."),
    chapters: [
      { label: "ON THE WATER", body: observed("Boats gather in the shallows. Beyond them, the horizon opens into a broad stretch of sea and sky."), image: { src: placeImage("leonida-keys", "05"), alt: "Boats gathered on the water in the Leonida Keys" } },
      { label: "BELOW THE SURFACE", body: observed("A second view moves beneath the surface, where divers and sea life replace the roads and islands above."), image: { src: placeImage("leonida-keys", "04"), alt: "Divers and sea life beneath the surface" } },
    ],
  },
  {
    id: "grassrivers",
    slug: "grassrivers",
    name: "Grassrivers",
    index: "03",
    type: "WETLANDS / INLAND",
    description: "Wetlands with the city on the horizon.",
    primaryImage: { src: placeImage("grassrivers", "05"), alt: "Wetlands and waterside buildings with a distant skyline", position: "center center", mobilePosition: "60% center" },
    secondaryImages: [
      { src: placeImage("grassrivers", "04"), alt: "Airboats crossing open wetlands" },
      { src: placeImage("grassrivers", "03"), alt: "An airboat seen from above in dark water" },
    ],
    treatment: "grassrivers",
    reportStyle: "wetlands",
    introduction: observed("Rockstar's Grassrivers images open onto wide wetlands and dark waterways. Airboats cut through the landscape while the built world sits far off on the horizon."),
    chapters: [
      { label: "OPEN WATER", body: observed("An airboat cuts through the shallow water as a helicopter passes above. The wetland stretches out in every direction."), image: { src: placeImage("grassrivers", "04"), alt: "An airboat and helicopter crossing open wetlands" } },
      { label: "THE CHANNEL", body: observed("Seen from above, a single airboat travels through dark water, turning the landscape into an almost abstract pattern."), image: { src: placeImage("grassrivers", "03"), alt: "An airboat seen from above in dark water" } },
    ],
  },
  {
    id: "port-gellhorn",
    slug: "port-gellhorn",
    name: "Port Gellhorn",
    index: "04",
    type: "TOWN / DUSK",
    description: "Low streets under the last light.",
    primaryImage: { src: placeImage("port-gellhorn", "06"), alt: "Port Gellhorn streets and rooftops in warm evening light", position: "center center", mobilePosition: "62% center" },
    secondaryImages: [
      { src: placeImage("port-gellhorn", "01"), alt: "A motel sign and roadside buildings after dark" },
      { src: placeImage("port-gellhorn", "04"), alt: "A brightly lit street at night in Port Gellhorn" },
    ],
    treatment: "gellhorn",
    reportStyle: "roadside",
    introduction: observed("Port Gellhorn shifts the view to lower streets, roadside signs and pools of artificial light. Its official images move from the last warmth of day into night."),
    chapters: [
      { label: "ROADSIDE", body: observed("A motel sign stands over low buildings after dark. The frame trades the wide skyline for a much closer street-level view."), image: { src: placeImage("port-gellhorn", "01"), alt: "A motel sign and roadside buildings after dark", mobilePosition: "24% center" } },
      { label: "NIGHT STREET", body: observed("Signs and storefront light define the road. The surrounding darkness makes the lit stretch feel momentary."), image: { src: placeImage("port-gellhorn", "04"), alt: "A brightly lit street at night in Port Gellhorn", mobilePosition: "73% center" } },
    ],
  },
  {
    id: "ambrosia",
    slug: "ambrosia",
    name: "Ambrosia",
    index: "05",
    type: "INDUSTRIAL / INLAND",
    description: "Industry beneath a fading sky.",
    primaryImage: { src: placeImage("ambrosia", "04"), alt: "Power lines and industrial land in Ambrosia at sunset", position: "center center", mobilePosition: "44% center" },
    secondaryImages: [
      { src: placeImage("ambrosia", "02"), alt: "Industrial lights beneath storm clouds at night" },
      { src: placeImage("ambrosia", "01"), alt: "Motorcyclists on a road in Ambrosia" },
    ],
    treatment: "ambrosia",
    reportStyle: "industrial",
    introduction: observed("Ambrosia's official views pair roads and industrial structures with heavy skies. Power lines, machinery and distant lights give the place a harder edge."),
    chapters: [
      { label: "THE LIGHTS", body: observed("Industrial lights puncture the darkness beneath storm clouds. The landscape is defined as much by the sky as by its structures."), image: { src: placeImage("ambrosia", "02"), alt: "Industrial lights beneath storm clouds at night" } },
      { label: "ON THE ROAD", body: observed("Motorcyclists move through the road scene, adding a human scale to the surrounding industrial land."), image: { src: placeImage("ambrosia", "01"), alt: "Motorcyclists on a road in Ambrosia" } },
    ],
  },
  {
    id: "mount-kalaga",
    slug: "mount-kalaga",
    name: "Mount Kalaga National Park",
    displayName: "Mount Kalaga",
    index: "06",
    type: "HIGHLANDS / WOODLAND",
    description: "A road cuts through wooded high ground.",
    primaryImage: { src: placeImage("mount-kalaga-national-park", "04"), alt: "A road winding through a rocky, wooded valley", position: "center center", mobilePosition: "52% center" },
    secondaryImages: [
      { src: placeImage("mount-kalaga-national-park", "02"), alt: "A helicopter above a wooded hillside" },
      { src: placeImage("mount-kalaga-national-park", "05"), alt: "Deer at a stream beneath a canopy of trees" },
    ],
    treatment: "kalaga",
    reportStyle: "highlands",
    introduction: observed("The Mount Kalaga National Park images leave the coast behind. Wooded slopes, rocky roads and wildlife establish a quieter, higher landscape."),
    chapters: [
      { label: "ABOVE THE TREES", body: observed("A helicopter passes over the wooded hillside. Its scale makes the sweep of forest feel larger still."), image: { src: placeImage("mount-kalaga-national-park", "02"), alt: "A helicopter above a wooded hillside" } },
      { label: "AT THE STREAM", body: observed("Deer gather at a stream beneath dense trees. The view slows to a small, sheltered part of the park."), image: { src: placeImage("mount-kalaga-national-park", "05"), alt: "Deer at a stream beneath a canopy of trees" } },
    ],
  },
] as const;

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
