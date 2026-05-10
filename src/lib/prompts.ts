export type PromptCategory =
  | "Marketing"
  | "Restaurants"
  | "Real Estate"
  | "Ecommerce"
  | "Iraqi Dialect"
  | "Luxury Brands"
  | "Viral Hooks"
  | "Photography"
  | "Branding"
  | "Video";

export type Prompt = {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  body: string;
  isNew?: boolean;
  isPro?: boolean;
  readTime?: string;
  gradient: [string, string];
};

export const CATEGORIES: PromptCategory[] = [
  "Marketing",
  "Restaurants",
  "Real Estate",
  "Ecommerce",
  "Iraqi Dialect",
  "Luxury Brands",
  "Viral Hooks",
  "Photography",
  "Branding",
  "Video"
];

export const PROMPTS: Prompt[] = [
  {
    id: "p-001",
    title: "Luxury Cinematic Product Ad",
    description: "Generate a 15-second cinematic product ad in the language of Apple's product launches.",
    category: "Marketing",
    body:
      "You are a senior art director. Write a 15-second cinematic product advertisement script for {product}. Tone: minimal, slow, elegant. Include frame-by-frame description, narration (10 words max), and final logo beat. Output JSON with keys: scenes[], narration, endframe.",
    gradient: ["#7C8CFF", "#5CE1E6"],
    isNew: true,
    readTime: "1 min"
  },
  {
    id: "p-002",
    title: "Restaurant Signature Story",
    description: "Craft the origin story of a signature dish for menus and social.",
    category: "Restaurants",
    body:
      "Write the origin story of the signature dish {dish} at {restaurant}. Voice: warm, confident, cinematic. Length: 80-110 words. Include one sensory detail and one cultural reference. Avoid clichés (e.g., 'passion', 'love').",
    gradient: ["#F59E0B", "#7C8CFF"],
    readTime: "1 min"
  },
  {
    id: "p-003",
    title: "Premium Real Estate Listing",
    description: "High-conversion listing copy that reads like architectural journalism.",
    category: "Real Estate",
    body:
      "Draft a premium listing for {address}. Structure: hook (1 line), narrative paragraph (60 words), 5-bullet feature list (max 8 words each), closing CTA. Tone: quiet luxury. No exclamation marks.",
    gradient: ["#5CE1E6", "#7C8CFF"],
    isPro: true,
    readTime: "2 min"
  },
  {
    id: "p-004",
    title: "Ecommerce PDP Rewrite",
    description: "Rewrite a product detail page to feel like a boutique magazine spread.",
    category: "Ecommerce",
    body:
      "Rewrite the PDP copy for {product}. Output three variants: (1) Editorial, (2) Technical, (3) Conversion. Each 120 words. Constraints: no superlatives, no filler adjectives, include one concrete benefit per paragraph.",
    gradient: ["#EC4899", "#7C8CFF"],
    readTime: "2 min"
  },
  {
    id: "p-005",
    title: "Iraqi Dialect Caption Pack",
    description: "Ten short, natural-sounding captions in modern Iraqi dialect.",
    category: "Iraqi Dialect",
    body:
      "اكتب لي عشر كابشنات قصيرة باللهجة العراقية الحديثة لـ {topic}. كل واحدة ما تتجاوز ١٥ كلمة، بنبرة راقية وواقعية، تجنب الكليشهات، وخلي واحدة منهن سؤال مفتوح.",
    gradient: ["#7C8CFF", "#F59E0B"],
    isNew: true,
    readTime: "1 min"
  },
  {
    id: "p-006",
    title: "Luxury Brand Manifesto",
    description: "A one-page founder manifesto for a luxury brand launch.",
    category: "Luxury Brands",
    body:
      "Write a 220-word brand manifesto for {brand}. Style: calm, declarative, first-person plural. Structure: 3 movements — Origin, Belief, Horizon. No marketing clichés. End on a two-word line.",
    gradient: ["#5CE1E6", "#EC4899"],
    isPro: true,
    readTime: "3 min"
  },
  {
    id: "p-007",
    title: "Viral Hook Generator",
    description: "Generate 20 scroll-stopping hooks optimized for short-form video.",
    category: "Viral Hooks",
    body:
      "Generate 20 scroll-stopping hooks (max 9 words each) for a video about {topic}. Mix: curiosity (5), contrarian (5), tension (5), reveal (5). Rank by predicted 3s retention and output as a numbered list.",
    gradient: ["#EC4899", "#5CE1E6"],
    readTime: "1 min"
  },
  {
    id: "p-008",
    title: "Cinematic Portrait Brief",
    description: "Photographer brief inspired by Deakins and Khondji.",
    category: "Photography",
    body:
      "Write a cinematic portrait brief for {subject}. Include: wardrobe direction, lighting setup (key/fill/rim), lens (mm and stop), palette (3 hex values), mood board references (3), and final frame description. Tone: restrained, directorial.",
    gradient: ["#7C8CFF", "#111827"],
    readTime: "2 min"
  },
  {
    id: "p-009",
    title: "Identity System Starter",
    description: "A complete brand identity system brief for a design team.",
    category: "Branding",
    body:
      "Design a minimal identity system for {brand}. Deliver: positioning (1 line), voice pillars (3), logotype direction, type pairing, color palette (5 hex), motion principle (1 sentence), and 3 misuse rules.",
    gradient: ["#5CE1E6", "#F59E0B"],
    isPro: true,
    readTime: "3 min"
  },
  {
    id: "p-010",
    title: "Launch Film Shot List",
    description: "A 12-shot list for a product launch film.",
    category: "Video",
    body:
      "Produce a 12-shot list for a 45-second product launch film for {product}. For each shot: number, frame description, duration (seconds), camera movement, lens. End with one hero beat.",
    gradient: ["#7C8CFF", "#5CE1E6"],
    isNew: true,
    readTime: "2 min"
  },
  {
    id: "p-011",
    title: "Restaurant Grand Opening Plan",
    description: "A 14-day opening runway, content + comms.",
    category: "Restaurants",
    body:
      "Plan a 14-day grand opening runway for {restaurant}. Output a table: day, content theme, deliverable, channel, success metric. Keep tone warm and confident. No emojis.",
    gradient: ["#F59E0B", "#EC4899"],
    readTime: "3 min"
  },
  {
    id: "p-012",
    title: "Founder Story — Long Form",
    description: "A founder story that reads like a New Yorker profile.",
    category: "Marketing",
    body:
      "Write a 600-word founder story for {founder}. Structure: scene, backstory, turning point, philosophy, forward-look. Voice: literary journalism. No quotes from the founder; show, don't tell.",
    gradient: ["#111827", "#7C8CFF"],
    isPro: true,
    readTime: "4 min"
  }
];

export function getPromptById(id: string) {
  return PROMPTS.find((p) => p.id === id);
}
