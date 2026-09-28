export type PersonImage = { src: string; alt: string; position?: string; mobilePosition?: string };
export type SourcedText = { text: string; source: string };
export type PersonChapter = { label: string; body: SourcedText; image?: PersonImage };
export type PersonConnection = { personId: string; context: string; source: string };
export type PersonPlace = { locationId: string; context: string; source: string };
export type PersonVisual = {
  id: string; index: string; name: string; lines: readonly [string, string?]; kind: "person" | "pair";
  tone: string; alignment: "left" | "right"; lead: PersonImage; studies: readonly PersonImage[]; images: readonly string[];
};
export type Person = PersonVisual & {
  slug: string;
  firstName?: string;
  lastName?: string;
  members?: readonly string[];
  descriptor: string;
  descriptorSource: string;
  introduction: SourcedText;
  chapters: readonly PersonChapter[];
  connections: readonly PersonConnection[];
  places: readonly PersonPlace[];
  organization?: SourcedText;
};
export const ROCKSTAR_PEOPLE_SOURCE = "https://www.rockstargames.com/VI/only-in-leonida";
export const ROCKSTAR_VI_SOURCE = "https://www.rockstargames.com/VI";
const path = (slug: string, number: number) => `/media/people/${slug}/${String(number).padStart(2, "0")}.webp`;
const images = (slug: string, count: number) => Array.from({ length: count }, (_, index) => path(slug, index + 1));
const photo = (slug: string, number: number, alt: string, position?: string, mobilePosition?: string): PersonImage => ({ src: path(slug, number), alt, position, mobilePosition });

// Names and imagery follow the official material in public/gta/People.
// Position and tone describe the photographs' framing; they are not character metadata.
const peopleVisuals: readonly PersonVisual[] = [
  { id: "lucia-caminos", index: "01", name: "Lucia Caminos", lines: ["LUCIA", "CAMINOS"], kind: "person", tone: "#2b1720", alignment: "left",
    lead: photo("lucia-caminos", 3, "Lucia on a motorcycle outside a neon-lit storefront", "54% 50%", "28% 50%"),
    studies: [photo("lucia-caminos", 2, "Close portrait of Lucia by a pool", "43% 43%"), photo("lucia-caminos", 10, "Lucia seen through a car window at night", "51% 44%")], images: images("lucia-caminos", 10) },
  { id: "jason-duval", index: "02", name: "Jason Duval", lines: ["JASON", "DUVAL"], kind: "person", tone: "#293327", alignment: "right",
    lead: photo("jason-duval", 1, "Jason standing beside a motorcycle in daylight", "46% 50%", "73% 50%"),
    studies: [photo("jason-duval", 2, "Close portrait of Jason seated in a car", "52% 46%", "28% 46%"), photo("jason-duval", 4, "Jason standing outside beneath palm trees at night", "54% 50%")], images: images("jason-duval", 10) },
  { id: "jason-and-lucia", index: "03", name: "Jason and Lucia", lines: ["JASON", "& LUCIA"], kind: "pair", tone: "#3c3030", alignment: "left",
    lead: photo("jason-and-lucia", 13, "Jason and Lucia together by the water at sunset", "50% 50%", "50% 50%"),
    studies: [photo("jason-and-lucia", 1, "Jason and Lucia together in daylight", "50% 50%"), photo("jason-and-lucia", 3, "Lucia leaning against a car with Jason nearby", "51% 50%")], images: images("jason-and-lucia", 13) },
  { id: "cal-hampton", index: "04", name: "Cal Hampton", lines: ["CAL", "HAMPTON"], kind: "person", tone: "#263126", alignment: "right",
    lead: photo("cal-hampton", 1, "Cal outdoors in a floral shirt", "49% 50%", "78% 50%"),
    studies: [photo("cal-hampton", 2, "Cal in a pool hall under pink light", "50% 50%"), photo("cal-hampton", 3, "Cal relaxing by a pool", "50% 50%")], images: images("cal-hampton", 4) },
  { id: "boobie-ike", index: "05", name: "Boobie Ike", lines: ["BOOBIE", "IKE"], kind: "person", tone: "#302a30", alignment: "left",
    lead: photo("boobie-ike", 2, "Boobie Ike standing beside a car outside a club", "53% 50%", "28% 50%"),
    studies: [photo("boobie-ike", 1, "Boobie Ike seated in an office", "49% 50%"), photo("boobie-ike", 3, "Close portrait of Boobie Ike in purple light", "51% 46%")], images: images("boobie-ike", 4) },
  { id: "drequan-priest", index: "06", name: "Dre'Quan Priest", lines: ["DRE’QUAN", "PRIEST"], kind: "person", tone: "#242d3c", alignment: "right",
    lead: photo("drequan-priest", 2, "Dre'Quan Priest in a blue suit outdoors at night", "51% 50%", "76% 50%"),
    studies: [photo("drequan-priest", 3, "Dre'Quan Priest under blue and purple light", "50% 50%"), photo("drequan-priest", 4, "Dre'Quan Priest in a recording studio", "50% 50%")], images: images("drequan-priest", 4) },
  { id: "real-dimez", index: "07", name: "Real Dimez", lines: ["REAL", "DIMEZ"], kind: "pair", tone: "#332535", alignment: "left",
    lead: photo("real-dimez", 4, "Real Dimez together in a recording studio", "51% 50%", "50% 50%"),
    studies: [photo("real-dimez", 3, "Real Dimez together in a car", "50% 50%"), photo("real-dimez", 2, "Real Dimez beside a car", "50% 50%")], images: images("real-dimez", 4) },
  { id: "raul-bautista", index: "08", name: "Raul Bautista", lines: ["RAUL", "BAUTISTA"], kind: "person", tone: "#3d3026", alignment: "right",
    lead: photo("raul-bautista", 3, "Raul Bautista standing beside a boat at sunset", "47% 50%", "64% 50%"),
    studies: [photo("raul-bautista", 1, "Raul Bautista on the phone", "50% 45%"), photo("raul-bautista", 4, "Raul Bautista in a light suit at night", "52% 50%")], images: images("raul-bautista", 4) },
  { id: "brian-heder", index: "09", name: "Brian Heder", lines: ["BRIAN", "HEDER"], kind: "person", tone: "#343024", alignment: "left",
    lead: photo("brian-heder", 1, "Brian Heder leaning from a vehicle in daylight", "51% 50%", "51% 50%"),
    studies: [photo("brian-heder", 2, "Brian Heder in a bar at night", "50% 50%"), photo("brian-heder", 3, "Brian Heder outdoors with a notebook", "50% 50%")], images: images("brian-heder", 4) },
];

const sourced = (text: string, source = ROCKSTAR_PEOPLE_SOURCE): SourcedText => ({ text, source });
const connected = (personId: string, context: string, source = ROCKSTAR_PEOPLE_SOURCE): PersonConnection => ({ personId, context, source });
const place = (locationId: string, context: string): PersonPlace => ({ locationId, context, source: ROCKSTAR_PEOPLE_SOURCE });

const stories: Record<string, Omit<Person, keyof PersonVisual | "slug" | "descriptorSource">> = {
  "lucia-caminos": {
    firstName: "Lucia", lastName: "Caminos", descriptor: "A plan beyond prison.",
    introduction: sourced("Lucia learned to fight from her father while she was young. Defending her family led to time in Leonida Penitentiary; now free, she is determined to make more deliberate choices and build the life her mother once imagined."),
    chapters: [
      { label: "FAMILY", body: sourced("Her father taught her to fight, and a fight for her family eventually led to her imprisonment."), image: peopleVisuals[0].studies[0] },
      { label: "A WAY FORWARD", body: sourced("Her mother dreamed of a better life during their days in Liberty City. Lucia has left prison with a plan to change her circumstances rather than wait for them to change."), image: peopleVisuals[0].studies[1] },
    ],
    connections: [connected("jason-duval", "Their futures are closely tied."), connected("jason-and-lucia", "A shared story across Leonida.", ROCKSTAR_VI_SOURCE)], places: [],
  },
  "jason-duval": {
    firstName: "Jason", lastName: "Duval", descriptor: "Looking for a different life in the Keys.",
    introduction: sourced("Jason grew up around grifters and criminals and spent time in the Army after a troubled adolescence. In the Leonida Keys, he found work with local drug runners. Meeting Lucia has made the next step far less certain."),
    chapters: [
      { label: "BEFORE LEONIDA", body: sourced("An Army stint was an attempt to move beyond his troubled teens and the people he grew up around."), image: peopleVisuals[1].studies[0] },
      { label: "THE KEYS", body: sourced("Jason is working for local drug runners in the Keys. Brian lets him stay at one of his properties in exchange for help with local shakedowns."), image: peopleVisuals[1].studies[1] },
    ],
    connections: [connected("lucia-caminos", "A central part of his uncertain future."), connected("cal-hampton", "His friend."), connected("brian-heder", "Provides Jason a place to stay in return for work.")],
    places: [place("leonida-keys", "Living and working in the Keys.")],
  },
  "jason-and-lucia": {
    members: ["Jason Duval", "Lucia Caminos"], descriptor: "Two lives, one uncertain path.",
    introduction: sourced("An easy score goes wrong, leaving Jason and Lucia caught in a criminal conspiracy that stretches across Leonida. Rockstar's story places their reliance on each other at its center.", ROCKSTAR_VI_SOURCE),
    chapters: [
      { label: "THE TURN", body: sourced("A score that looked straightforward sets the pair on a more dangerous path across the state.", ROCKSTAR_VI_SOURCE), image: peopleVisuals[2].studies[0] },
      { label: "TOGETHER", body: sourced("Their ability to make it through depends on trusting one another as events unfold.", ROCKSTAR_VI_SOURCE), image: peopleVisuals[2].studies[1] },
    ],
    connections: [connected("jason-duval", "One half of this shared story.", ROCKSTAR_VI_SOURCE), connected("lucia-caminos", "One half of this shared story.", ROCKSTAR_VI_SOURCE)], places: [],
  },
  "cal-hampton": {
    firstName: "Cal", lastName: "Hampton", descriptor: "At home, listening to the coast.",
    introduction: sourced("Cal is Jason's friend and another associate of Brian. He spends much of his time at home following Coast Guard communications, with a suspicious view of the world beyond his door."),
    chapters: [
      { label: "HIS ORBIT", body: sourced("Cal feels safest at home, tracking Coast Guard traffic and following his own theories online."), image: peopleVisuals[3].studies[0] },
      { label: "THE CIRCLE", body: sourced("He knows both Jason and Brian. Rockstar contrasts Cal's comfort in his routines with Jason's larger plans."), image: peopleVisuals[3].studies[1] },
    ],
    connections: [connected("jason-duval", "His friend."), connected("brian-heder", "A fellow associate of Brian's.")], places: [],
  },
  "boobie-ike": {
    firstName: "Boobie", lastName: "Ike", descriptor: "Business, music, Vice City.",
    introduction: sourced("Boobie is an established Vice City figure who turned his street history into businesses spanning real estate, a strip club and a recording studio. His partnership with Dre'Quan Priest at Only Raw Records is where his next ambition lies."),
    chapters: [
      { label: "THE BUSINESS", body: sourced("His businesses span property, nightlife and recording. He takes the work seriously even when the atmosphere around him is easygoing."), image: peopleVisuals[4].studies[0] },
      { label: "ONLY RAW", body: sourced("Boobie is invested in building Only Raw Records with Dre'Quan. The label still needs a hit."), image: peopleVisuals[4].studies[1] },
    ],
    connections: [connected("drequan-priest", "Partner at Only Raw Records.")], places: [place("vice-city", "An established figure in Vice City.")],
    organization: sourced("Only Raw Records"),
  },
  "drequan-priest": {
    firstName: "Dre'Quan", lastName: "Priest", descriptor: "Music was always the goal.",
    introduction: sourced("Dre'Quan worked the streets to make ends meet, but his goal was always music. With Boobie Ike, he is building Only Raw Records; signing Real Dimez could move him further into Vice City's music scene."),
    chapters: [
      { label: "THE AMBITION", body: sourced("Even while dealing on the streets, Dre'Quan wanted a future in music rather than in that work."), image: peopleVisuals[5].studies[0] },
      { label: "THE LABEL", body: sourced("He has partnered with Boobie on Only Raw Records and signed Real Dimez. Rockstar places him between Boobie's club and the wider Vice City scene."), image: peopleVisuals[5].studies[1] },
    ],
    connections: [connected("boobie-ike", "Partner at Only Raw Records."), connected("real-dimez", "Signed to his label.")], places: [place("vice-city", "Working toward the Vice City music scene.")],
    organization: sourced("Only Raw Records"),
  },
  "real-dimez": {
    members: ["Bae-Luxe", "Roxy"], descriptor: "Bae-Luxe + Roxy / Real Dimez.",
    introduction: sourced("Bae-Luxe and Roxy have been friends since high school. As Real Dimez, they turned sharp rap tracks and a persistent social media presence into an audience; after an earlier hit, they are now signed to Only Raw Records."),
    chapters: [
      { label: "TWO VOICES", body: sourced("Bae-Luxe and Roxy built Real Dimez together, pairing their music with a strong online presence."), image: peopleVisuals[6].studies[0] },
      { label: "THE NEXT RECORD", body: sourced("An early single with local rapper DWNPLY raised their profile. Five years later, they have signed to Only Raw Records and are looking for another breakthrough."), image: peopleVisuals[6].studies[1] },
    ],
    connections: [connected("drequan-priest", "Signed to his label.")], places: [], organization: sourced("Only Raw Records"),
  },
  "raul-bautista": {
    firstName: "Raul", lastName: "Bautista", descriptor: "Experience counts when the stakes rise.",
    introduction: sourced("Raul is an experienced bank robber with the confidence to recruit people for high-risk work. His appetite for bigger rewards keeps raising the stakes for the crew around him."),
    chapters: [
      { label: "EXPERIENCE", body: sourced("Rockstar presents Raul as a seasoned bank robber whose confidence, charm and cunning help him find capable people."), image: peopleVisuals[7].studies[0] },
      { label: "THE RISK", body: sourced("His increasingly reckless approach means each score asks more of his crew."), image: peopleVisuals[7].studies[1] },
    ],
    connections: [], places: [],
  },
  "brian-heder": {
    firstName: "Brian", lastName: "Heder", descriptor: "A long history in the Leonida Keys.",
    introduction: sourced("Brian has run drugs through the Keys since an earlier era of smuggling. He still moves product through his boat yard with his wife Lori, while leaving much of the difficult work to others."),
    chapters: [
      { label: "THE BOAT YARD", body: sourced("Brian's boat yard remains part of his operation in the Leonida Keys. Lori, his third wife, works alongside him."), image: peopleVisuals[8].studies[0] },
      { label: "JASON'S ARRANGEMENT", body: sourced("Jason lives rent-free at one of Brian's properties in exchange for helping with local shakedowns."), image: peopleVisuals[8].studies[1] },
    ],
    connections: [connected("jason-duval", "Stays at one of Brian's properties."), connected("cal-hampton", "An associate of Brian's.")], places: [place("leonida-keys", "His boat yard and operation are in the Keys.")],
  },
};

export const people: readonly Person[] = peopleVisuals.map((visual) => ({ ...visual, slug: visual.id, descriptorSource: visual.id === "jason-and-lucia" ? ROCKSTAR_VI_SOURCE : ROCKSTAR_PEOPLE_SOURCE, ...stories[visual.id] }));
export const getPerson = (slug: string) => people.find((person) => person.slug === slug);
export const peopleCollections = people.map(({ id, name, kind, images }) => ({ id, name, kind, images }));
