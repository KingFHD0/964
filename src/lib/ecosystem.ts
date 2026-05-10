/**
 * Aether 964 — AI Ecosystem data libraries.
 *
 * Seed data for: tools, models, articles, courses, news, workflows, guides, business systems.
 * All rendered with the same calm/luxury language as the rest of the platform.
 */

export type Grad = readonly [string, string];

export const GRADIENTS: Grad[] = [
  ["#7C8CFF", "#5CE1E6"],
  ["#5CE1E6", "#7C8CFF"],
  ["#F59E0B", "#7C8CFF"],
  ["#EC4899", "#7C8CFF"],
  ["#5CE1E6", "#EC4899"],
  ["#7C8CFF", "#F59E0B"],
  ["#5CE1E6", "#F59E0B"],
  ["#7C8CFF", "#111827"],
  ["#111827", "#7C8CFF"]
];

/* ─────────────────────────────────── AI TOOLS ─────────────────────────────────── */

export type ToolCategory =
  | "Image AI"
  | "Video AI"
  | "Coding AI"
  | "Writing AI"
  | "Automation AI"
  | "Voice AI"
  | "Business AI"
  | "Research AI";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "Image AI",
  "Video AI",
  "Coding AI",
  "Writing AI",
  "Automation AI",
  "Voice AI",
  "Business AI",
  "Research AI"
];

export type AiTool = {
  id: string;
  name: string;
  category: ToolCategory;
  tagline: string;
  description: string;
  rating: number; // 0-5
  price: "Free" | "Freemium" | "Paid";
  useCases: string[];
  alternatives: string[];
  url: string;
  gradient: Grad;
  featured?: boolean;
};

export const TOOLS: AiTool[] = [
  {
    id: "t-midjourney",
    name: "Midjourney",
    category: "Image AI",
    tagline: "Cinematic image generation.",
    description:
      "Generate photoreal and stylized imagery with a single text prompt. Preferred by art directors for mood boards and launch films.",
    rating: 4.8,
    price: "Paid",
    useCases: ["Mood boards", "Brand visuals", "Editorial frames", "Concept art"],
    alternatives: ["Flux", "Ideogram", "DALL·E"],
    url: "https://midjourney.com",
    gradient: ["#7C8CFF", "#EC4899"],
    featured: true
  },
  {
    id: "t-runway",
    name: "Runway",
    category: "Video AI",
    tagline: "Generative video for filmmakers.",
    description:
      "Text-to-video and video-to-video models designed for motion directors. Camera control, frame-level editing, and a studio-grade pipeline.",
    rating: 4.7,
    price: "Freemium",
    useCases: ["Generative b-roll", "Motion design", "Visual effects"],
    alternatives: ["Luma", "Kling", "Pika"],
    url: "https://runwayml.com",
    gradient: ["#5CE1E6", "#7C8CFF"],
    featured: true
  },
  {
    id: "t-claude",
    name: "Claude",
    category: "Writing AI",
    tagline: "Thoughtful writing partner.",
    description:
      "Anthropic's flagship assistant. Strong at long-form, nuance, and following constraints. Excellent for manifestos, briefs, and editorial.",
    rating: 4.9,
    price: "Freemium",
    useCases: ["Long-form writing", "Strategy", "Code review"],
    alternatives: ["GPT-4o", "Gemini", "DeepSeek"],
    url: "https://claude.ai",
    gradient: ["#F59E0B", "#7C8CFF"],
    featured: true
  },
  {
    id: "t-cursor",
    name: "Cursor",
    category: "Coding AI",
    tagline: "The AI-native code editor.",
    description:
      "A VS Code fork engineered around a senior AI pair. Inline edits, agent workflows, and repository-aware refactors.",
    rating: 4.8,
    price: "Freemium",
    useCases: ["Refactoring", "Shipping features", "Reading unfamiliar code"],
    alternatives: ["Windsurf", "Zed", "Copilot"],
    url: "https://cursor.com",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "t-elevenlabs",
    name: "ElevenLabs",
    category: "Voice AI",
    tagline: "Cinematic voices on demand.",
    description:
      "High-fidelity voice synthesis and cloning. Arabic and Iraqi-dialect models in private beta; English voices rival studio takes.",
    rating: 4.7,
    price: "Freemium",
    useCases: ["Narration", "Audiobooks", "Product demos"],
    alternatives: ["PlayHT", "Suno", "Cartesia"],
    url: "https://elevenlabs.io",
    gradient: ["#EC4899", "#7C8CFF"]
  },
  {
    id: "t-n8n",
    name: "n8n",
    category: "Automation AI",
    tagline: "Fair-code workflow automation.",
    description:
      "Visual flows over 400+ services, with AI nodes baked in. Self-hostable. Favored by studios replacing three Zaps with one.",
    rating: 4.6,
    price: "Freemium",
    useCases: ["Lead routing", "Content pipelines", "Internal ops"],
    alternatives: ["Make", "Zapier", "Pipedream"],
    url: "https://n8n.io",
    gradient: ["#5CE1E6", "#F59E0B"]
  },
  {
    id: "t-perplexity",
    name: "Perplexity",
    category: "Research AI",
    tagline: "Answer engine with citations.",
    description:
      "Fast, cited answers over live web. Pro search runs deeper passes. A calmer home base than a browser tab explosion.",
    rating: 4.7,
    price: "Freemium",
    useCases: ["Due diligence", "Market scans", "Briefing prep"],
    alternatives: ["You.com", "Exa", "Kagi"],
    url: "https://perplexity.ai",
    gradient: ["#7C8CFF", "#F59E0B"]
  },
  {
    id: "t-notion",
    name: "Notion AI",
    category: "Business AI",
    tagline: "Knowledge, with a thinking layer.",
    description:
      "AI woven into your workspace. Summarize, translate, and write across pages. Ideal for studio knowledge bases.",
    rating: 4.5,
    price: "Freemium",
    useCases: ["Docs", "Meeting notes", "Internal wikis"],
    alternatives: ["Mem", "Coda", "Confluence"],
    url: "https://notion.so",
    gradient: ["#111827", "#7C8CFF"]
  },
  {
    id: "t-flux",
    name: "Flux",
    category: "Image AI",
    tagline: "Open-weight high-fidelity images.",
    description:
      "Black Forest Labs' next-gen model. Exceptional photoreal skin, hands, and typography. Runs locally or in the cloud.",
    rating: 4.8,
    price: "Freemium",
    useCases: ["Product shots", "Characters", "Typography lockups"],
    alternatives: ["Midjourney", "Ideogram"],
    url: "https://blackforestlabs.ai",
    gradient: ["#5CE1E6", "#EC4899"]
  },
  {
    id: "t-suno",
    name: "Suno",
    category: "Voice AI",
    tagline: "Full-song generation.",
    description:
      "Compose complete songs with lyrics, instrumentation, and vocals. A playground for brand sonic identity.",
    rating: 4.4,
    price: "Freemium",
    useCases: ["Jingles", "Launch music", "Mood beds"],
    alternatives: ["Udio", "Riffusion"],
    url: "https://suno.com",
    gradient: ["#EC4899", "#5CE1E6"]
  },
  {
    id: "t-v0",
    name: "v0",
    category: "Coding AI",
    tagline: "Generative UI from words.",
    description:
      "Vercel's UI generator. Produces clean React + Tailwind with shadcn/ui. Great starting point for landing pages and dashboards.",
    rating: 4.5,
    price: "Freemium",
    useCases: ["Landing pages", "Dashboards", "Prototypes"],
    alternatives: ["Lovable", "Bolt", "Builder"],
    url: "https://v0.dev",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "t-11x",
    name: "11x",
    category: "Business AI",
    tagline: "Digital workers for sales & ops.",
    description:
      "Autonomous agents that prospect, qualify, and reply around the clock. Pairs well with CRMs and outbound tooling.",
    rating: 4.3,
    price: "Paid",
    useCases: ["Outbound", "SDR replacement", "Meeting booking"],
    alternatives: ["Artisan", "Clay", "Instantly"],
    url: "https://11x.ai",
    gradient: ["#F59E0B", "#EC4899"]
  }
];

/* ─────────────────────────────────── AI MODELS ─────────────────────────────────── */

export type ModelKind =
  | "Frontier LLM"
  | "Open LLM"
  | "Image"
  | "Video"
  | "Audio"
  | "Embedding";

export type AiModel = {
  id: string;
  name: string;
  org: string;
  kind: ModelKind;
  family: string;
  contextWindow?: string;
  released: string;
  strengths: string[];
  useWhen: string;
  gradient: Grad;
};

export const MODELS: AiModel[] = [
  {
    id: "m-gpt5",
    name: "GPT-5",
    org: "OpenAI",
    kind: "Frontier LLM",
    family: "GPT",
    contextWindow: "1M tokens",
    released: "2025",
    strengths: ["Reasoning", "Tool use", "Multimodal"],
    useWhen: "You need the strongest general model for agentic, long-context work.",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "m-claude-4-opus",
    name: "Claude 4 Opus",
    org: "Anthropic",
    kind: "Frontier LLM",
    family: "Claude",
    contextWindow: "500K tokens",
    released: "2025",
    strengths: ["Long-form writing", "Code editing", "Constraint following"],
    useWhen: "Editorial, manifesto, or high-nuance content and long code reviews.",
    gradient: ["#F59E0B", "#7C8CFF"]
  },
  {
    id: "m-gemini-2-pro",
    name: "Gemini 2.0 Pro",
    org: "Google",
    kind: "Frontier LLM",
    family: "Gemini",
    contextWindow: "2M tokens",
    released: "2025",
    strengths: ["Ultra-long context", "Multimodal", "Latency"],
    useWhen: "You need to feed an entire codebase or video in one call.",
    gradient: ["#5CE1E6", "#7C8CFF"]
  },
  {
    id: "m-llama-4",
    name: "Llama 4",
    org: "Meta",
    kind: "Open LLM",
    family: "Llama",
    contextWindow: "256K tokens",
    released: "2025",
    strengths: ["Self-hostable", "Fine-tuning", "Arabic support"],
    useWhen: "You need an open, tunable base model for internal deployments.",
    gradient: ["#111827", "#7C8CFF"]
  },
  {
    id: "m-flux-pro",
    name: "Flux Pro",
    org: "Black Forest Labs",
    kind: "Image",
    family: "Flux",
    released: "2025",
    strengths: ["Photoreal", "Text rendering", "Lighting"],
    useWhen: "Product, editorial, and typography-forward image generation.",
    gradient: ["#EC4899", "#7C8CFF"]
  },
  {
    id: "m-sora-2",
    name: "Sora 2",
    org: "OpenAI",
    kind: "Video",
    family: "Sora",
    released: "2025",
    strengths: ["Photoreal video", "Camera control", "Continuity"],
    useWhen: "Cinematic short-form and b-roll with directorial control.",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "m-elevenv3",
    name: "ElevenLabs v3",
    org: "ElevenLabs",
    kind: "Audio",
    family: "Eleven",
    released: "2025",
    strengths: ["Expressive", "Multilingual", "Cloning"],
    useWhen: "Narration, audiobooks, and brand voice systems.",
    gradient: ["#EC4899", "#5CE1E6"]
  },
  {
    id: "m-text-embed-3",
    name: "text-embedding-3",
    org: "OpenAI",
    kind: "Embedding",
    family: "Embed",
    released: "2024",
    strengths: ["Semantic search", "Clustering", "RAG"],
    useWhen: "Building retrieval or classification pipelines.",
    gradient: ["#5CE1E6", "#F59E0B"]
  }
];

/* ─────────────────────────────────── ARTICLES / ENCYCLOPEDIA ─────────────────── */

export type ArticleCategory =
  | "Fundamentals"
  | "Models"
  | "Workflows"
  | "Prompting"
  | "Business"
  | "Ethics"
  | "Case Studies";

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  "Fundamentals",
  "Models",
  "Workflows",
  "Prompting",
  "Business",
  "Ethics",
  "Case Studies"
];

export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  readTime: string;
  date: string;
  author: string;
  toc: { id: string; label: string }[];
  body: string; // inline markdown-lite
  gradient: Grad;
  featured?: boolean;
};

export const ARTICLES: Article[] = [
  {
    id: "a-what-is-llm",
    slug: "what-is-an-llm",
    title: "What is a Large Language Model?",
    subtitle:
      "A calm, practical introduction to the machines shaping the next decade of work.",
    category: "Fundamentals",
    readTime: "6 min read",
    date: "May 8, 2026",
    author: "Aether Research",
    gradient: ["#7C8CFF", "#5CE1E6"],
    featured: true,
    toc: [
      { id: "definition", label: "Definition" },
      { id: "how-they-work", label: "How they work" },
      { id: "context-window", label: "Context window" },
      { id: "limits", label: "Limits and mitigations" },
      { id: "when-to-use", label: "When to use" }
    ],
    body: `
A **Large Language Model** (LLM) is a neural network trained to predict the next token in a sequence. Scaled enough, that single objective produces systems capable of translation, code generation, and structured reasoning.

## Definition
An LLM learns a probability distribution over text. Given a prompt, it samples the most likely continuations, one token at a time. The *scale* of the training corpus and parameter count produces emergent capabilities — skills that smaller models never exhibit.

## How they work
Under the hood, today's LLMs are variants of the transformer architecture. Three pieces matter most:

- **Tokenizer** — splits text into subword units.
- **Self-attention** — lets every token "look at" every other token in the context.
- **Decoder** — projects hidden states back into a vocabulary distribution.

## Context window
The **context window** is the maximum number of tokens a model can consider at once. Larger windows unlock longer documents, entire codebases, and multi-turn workflows. Frontier models in 2025 routinely support 500K–2M tokens.

## Limits and mitigations
LLMs can hallucinate, reflect training biases, and struggle with exact arithmetic. Common mitigations:

- Retrieval augmentation (RAG) for factual grounding.
- Tool use for calculators, search, and code execution.
- Structured outputs with explicit schemas.

## When to use
Use an LLM when the task is **text-shaped and fuzzy** — writing, translation, classification, extraction, synthesis. Prefer deterministic software when the task is exact and repeatable.
`.trim()
  },
  {
    id: "a-prompt-engineering",
    slug: "prompt-engineering-principles",
    title: "Prompt engineering — the five principles",
    subtitle: "How operators craft prompts that land 8 out of 10 times.",
    category: "Prompting",
    readTime: "8 min read",
    date: "May 4, 2026",
    author: "Layla H.",
    gradient: ["#F59E0B", "#7C8CFF"],
    featured: true,
    toc: [
      { id: "constraint", label: "Constraint" },
      { id: "role", label: "Role" },
      { id: "examples", label: "Examples" },
      { id: "format", label: "Output format" },
      { id: "iteration", label: "Iteration" }
    ],
    body: `
Great prompts are engineered, not wished for. Five principles separate hobbyists from operators.

## Constraint
Specify word counts, tones, and forbidden words. Constraints tighten the output space. "Write a 60-word story" always beats "write something short."

## Role
Assign a precise role. "Senior art director at an Apple-level studio" orients the model's voice far more than "marketing expert."

## Examples
Show, don't tell. Two or three in-context examples of what "good" looks like outperform pages of instructions.

## Output format
Declare the shape. JSON schema, numbered list, table — an explicit format is easier to post-process and safer to automate.

## Iteration
Prompts are software. Version them. Keep the ones that work. Retire the ones that rot.
`.trim()
  },
  {
    id: "a-rag-vs-finetune",
    slug: "rag-vs-fine-tuning",
    title: "RAG vs. fine-tuning — how to choose",
    subtitle: "A decision framework, not a horoscope.",
    category: "Workflows",
    readTime: "7 min read",
    date: "April 29, 2026",
    author: "Omar J.",
    gradient: ["#5CE1E6", "#7C8CFF"],
    toc: [
      { id: "when-rag", label: "When RAG wins" },
      { id: "when-ft", label: "When fine-tuning wins" },
      { id: "both", label: "When to do both" }
    ],
    body: `
RAG (retrieval-augmented generation) and fine-tuning solve different problems. The mistake is treating them as alternatives.

## When RAG wins
Your data changes often. You need citations. You need to answer "what does *our* policy say?" RAG is the answer 80% of the time.

## When fine-tuning wins
You need a specific *style* or *format* the base model resists. Your task has a narrow domain and high volume. You've exhausted prompt engineering and RAG.

## When to do both
Fine-tune for voice. Retrieve for facts. This combination powers most serious AI deployments in 2026.
`.trim()
  },
  {
    id: "a-arabic-ai",
    slug: "arabic-ai-state-of-the-art",
    title: "Arabic AI — the state of the art",
    subtitle:
      "From dialect modeling to voice cloning, where the region stands in 2026.",
    category: "Models",
    readTime: "10 min read",
    date: "April 22, 2026",
    author: "Aether Research",
    gradient: ["#EC4899", "#7C8CFF"],
    toc: [
      { id: "landscape", label: "Landscape" },
      { id: "dialects", label: "Dialects" },
      { id: "voice", label: "Voice" },
      { id: "roadmap", label: "Roadmap" }
    ],
    body: `
The Arabic NLP landscape has compressed more than a decade of progress into two years. This is where we stand.

## Landscape
Frontier models now achieve near-parity with English on MSA (Modern Standard Arabic). Dialect performance remains uneven but is closing fast.

## Dialects
Iraqi, Egyptian, and Gulf dialects have the most public data. Levantine and Maghrebi are under-represented. Community-sourced datasets are changing this in 2026.

## Voice
Text-to-speech for Arabic has reached cinematic quality. Cloning for dialects requires only 30 seconds of reference audio.

## Roadmap
Expect the first frontier-grade *Iraqi-native* model in late 2026. Aether will publish an evaluation framework ahead of that release.
`.trim()
  },
  {
    id: "a-agents-primer",
    slug: "ai-agents-primer",
    title: "AI agents — a primer",
    subtitle: "What they are, what they aren't, and when to reach for one.",
    category: "Fundamentals",
    readTime: "7 min read",
    date: "April 15, 2026",
    author: "Aether Research",
    gradient: ["#7C8CFF", "#F59E0B"],
    toc: [
      { id: "definition", label: "Definition" },
      { id: "loop", label: "The agent loop" },
      { id: "pitfalls", label: "Pitfalls" }
    ],
    body: `
An **agent** is an LLM that can observe, plan, and act through tools. It's not magic — it's a loop.

## Definition
LLM + tools + memory + a goal = agent. Remove any ingredient and you have something simpler.

## The agent loop
1. Observe the current state.
2. Plan the next action.
3. Call a tool.
4. Observe the result.
5. Repeat until done.

## Pitfalls
Agents fail in predictable ways: infinite loops, tool misuse, context rot. Mitigate with **step budgets**, **tool allow-lists**, and **checkpoints**.
`.trim()
  },
  {
    id: "a-ethics",
    slug: "deploying-ai-responsibly",
    title: "Deploying AI responsibly",
    subtitle: "A working operator's checklist, not a lecture.",
    category: "Ethics",
    readTime: "5 min read",
    date: "April 10, 2026",
    author: "Aether Research",
    gradient: ["#111827", "#7C8CFF"],
    toc: [
      { id: "disclose", label: "Disclose" },
      { id: "evaluate", label: "Evaluate" },
      { id: "fallback", label: "Fallback" }
    ],
    body: `
Responsible AI is a habit, not a manifesto.

## Disclose
Tell users when they are talking to or receiving content from an AI. Transparency compounds trust.

## Evaluate
Maintain a private eval set with adversarial prompts. Run it before each release.

## Fallback
Design for graceful degradation. When the model fails, a human should be one tap away.
`.trim()
  }
];

/* ─────────────────────────────────── COURSES ─────────────────────────────────── */

export type Course = {
  id: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  instructor: string;
  gradient: Grad;
  isNew?: boolean;
};

export const COURSES: Course[] = [
  {
    id: "c-prompt-craft",
    title: "Prompt Craft 101",
    subtitle: "From first prompt to production-grade instruction.",
    level: "Beginner",
    duration: "2h 40m",
    lessons: 18,
    instructor: "Layla H.",
    gradient: ["#7C8CFF", "#5CE1E6"],
    isNew: true
  },
  {
    id: "c-rag-systems",
    title: "RAG Systems for Studios",
    subtitle: "Design, ship, and maintain retrieval pipelines.",
    level: "Intermediate",
    duration: "4h 10m",
    lessons: 26,
    instructor: "Omar J.",
    gradient: ["#5CE1E6", "#7C8CFF"]
  },
  {
    id: "c-agent-arch",
    title: "Agent Architectures",
    subtitle: "Loops, tools, checkpoints, and failure modes.",
    level: "Advanced",
    duration: "5h 30m",
    lessons: 32,
    instructor: "Aether Research",
    gradient: ["#F59E0B", "#7C8CFF"]
  },
  {
    id: "c-arabic-nlp",
    title: "Arabic NLP & Dialect Modeling",
    subtitle: "Working practically with MSA and Iraqi dialect.",
    level: "Intermediate",
    duration: "3h 20m",
    lessons: 22,
    instructor: "Karim S.",
    gradient: ["#EC4899", "#7C8CFF"],
    isNew: true
  },
  {
    id: "c-motion",
    title: "Generative Motion Design",
    subtitle: "From text prompt to cinematic b-roll.",
    level: "Intermediate",
    duration: "3h 0m",
    lessons: 20,
    instructor: "Nadia R.",
    gradient: ["#5CE1E6", "#EC4899"]
  },
  {
    id: "c-ai-ops",
    title: "Running AI in Production",
    subtitle: "Monitoring, evals, cost control, and safety.",
    level: "Advanced",
    duration: "4h 50m",
    lessons: 30,
    instructor: "Aether Research",
    gradient: ["#111827", "#7C8CFF"]
  }
];

/* ─────────────────────────────────── GUIDES ─────────────────────────────────── */

export type Guide = {
  id: string;
  title: string;
  body: string;
  steps: number;
  duration: string;
  gradient: Grad;
};

export const GUIDES: Guide[] = [
  {
    id: "g-brand-launch",
    title: "Launch a brand in 7 days with AI",
    body: "A cinematic runway — identity, voice, assets, site, campaign, launch, and retro.",
    steps: 7,
    duration: "1 week",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "g-restaurant-opening",
    title: "Open a restaurant with an AI content engine",
    body: "14 days from signature stories to launch night captions.",
    steps: 14,
    duration: "2 weeks",
    gradient: ["#F59E0B", "#EC4899"]
  },
  {
    id: "g-studio-ops",
    title: "Run a creative studio on AI rails",
    body: "Clients, briefs, approvals, assets — automated without losing taste.",
    steps: 6,
    duration: "Evergreen",
    gradient: ["#5CE1E6", "#7C8CFF"]
  },
  {
    id: "g-internal-wiki",
    title: "Build an internal AI wiki",
    body: "RAG over your docs with a front door your team will actually use.",
    steps: 5,
    duration: "Weekend",
    gradient: ["#7C8CFF", "#F59E0B"]
  }
];

/* ─────────────────────────────────── NEWS ─────────────────────────────────── */

export type NewsKind = "Release" | "Research" | "Industry" | "Region";

export type NewsItem = {
  id: string;
  kind: NewsKind;
  title: string;
  body: string;
  source: string;
  date: string;
  unread?: boolean;
};

export const NEWS: NewsItem[] = [
  {
    id: "n-1",
    kind: "Release",
    title: "OpenAI ships GPT-5 with 1M-token context",
    body:
      "The new frontier model pairs reasoning improvements with ultra-long context and a cleaner agent API.",
    source: "OpenAI Blog",
    date: "May 9, 2026",
    unread: true
  },
  {
    id: "n-2",
    kind: "Region",
    title: "Baghdad names its first AI district",
    body:
      "A riverside zone in Karrada will host studios, labs, and co-working for local and regional AI teams.",
    source: "Iraq Tech Daily",
    date: "May 8, 2026",
    unread: true
  },
  {
    id: "n-3",
    kind: "Research",
    title: "New Iraqi-dialect evaluation suite published",
    body:
      "A university consortium releases a 40K-example benchmark covering conversation, news, and formal registers.",
    source: "arXiv",
    date: "May 6, 2026",
    unread: true
  },
  {
    id: "n-4",
    kind: "Release",
    title: "Anthropic's Claude 4 gains structured outputs",
    body:
      "Native JSON schema support arrives for the Opus and Sonnet tiers, simplifying agent tool use.",
    source: "Anthropic",
    date: "May 5, 2026"
  },
  {
    id: "n-5",
    kind: "Industry",
    title: "Adobe acquires a generative motion studio",
    body:
      "The deal brings a cinematic video model directly into Premiere's timeline.",
    source: "The Information",
    date: "May 3, 2026"
  },
  {
    id: "n-6",
    kind: "Research",
    title: "Flux 2.0 breaks typography benchmarks",
    body:
      "Text rendering accuracy in image generation reaches 98% for English and 92% for Arabic.",
    source: "Black Forest Labs",
    date: "May 1, 2026"
  }
];

/* ─────────────────────────────────── WORKFLOWS ─────────────────────────────────── */

export type Workflow = {
  id: string;
  title: string;
  body: string;
  steps: string[];
  tools: string[];
  duration: string;
  gradient: Grad;
};

export const WORKFLOWS: Workflow[] = [
  {
    id: "w-content-engine",
    title: "Weekly content engine",
    body: "A calm loop that produces 5 editorial posts per week, end-to-end.",
    steps: [
      "Collect research with Perplexity",
      "Draft with Claude using a brand voice prompt",
      "Refine in Aether's editorial card",
      "Generate cover frames in Flux",
      "Queue via n8n into the publishing stack"
    ],
    tools: ["Perplexity", "Claude", "Flux", "n8n"],
    duration: "4h / week",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "w-brand-ident",
    title: "Identity system sprint",
    body: "A 72-hour runway from positioning to a shippable identity kit.",
    steps: [
      "Positioning workshop (Claude + human)",
      "Voice pillars from Aether's prompt",
      "Logotype directions in Flux",
      "Motion principle draft in Runway",
      "Kit compiled in Figma"
    ],
    tools: ["Claude", "Flux", "Runway", "Figma"],
    duration: "72 hours",
    gradient: ["#F59E0B", "#7C8CFF"]
  },
  {
    id: "w-launch-film",
    title: "Launch film pipeline",
    body: "From shot list to delivered 45-second film in one week.",
    steps: [
      "Shot list from Aether's prompt",
      "B-roll in Runway / Sora",
      "Voiceover in ElevenLabs",
      "Music bed in Suno",
      "Edit in resolve or Premiere"
    ],
    tools: ["Aether", "Runway", "Sora", "ElevenLabs", "Suno"],
    duration: "1 week",
    gradient: ["#5CE1E6", "#EC4899"]
  },
  {
    id: "w-wiki-rag",
    title: "Internal knowledge base",
    body: "RAG over your docs with a friendly answer surface.",
    steps: [
      "Ingest docs (Notion / Drive)",
      "Chunk + embed with text-embedding-3",
      "Store in pgvector",
      "Answer with Claude Haiku",
      "UI surfaced inside Slack"
    ],
    tools: ["Notion", "pgvector", "Claude", "Slack"],
    duration: "Weekend",
    gradient: ["#111827", "#7C8CFF"]
  }
];

/* ─────────────────────────────────── BUSINESS SYSTEMS ─────────────────────────── */

export type BusinessSystem = {
  id: string;
  title: string;
  body: string;
  metrics: string[];
  gradient: Grad;
};

export const BUSINESS_SYSTEMS: BusinessSystem[] = [
  {
    id: "b-sales",
    title: "AI Sales OS",
    body:
      "Prospecting, qualification, and outreach across CRMs. Playbooks tuned to Gulf and Levant markets.",
    metrics: ["3× outbound capacity", "42% reply rate", "−60% cost per meeting"],
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "b-support",
    title: "AI Support Layer",
    body:
      "First-touch deflection with human escalation. Arabic + English with dialect detection.",
    metrics: ["−38% tickets to humans", "94% CSAT", "2.4× faster resolution"],
    gradient: ["#5CE1E6", "#7C8CFF"]
  },
  {
    id: "b-content",
    title: "AI Content Engine",
    body:
      "A weekly publishing pipeline from research to scheduling. Review gates included by default.",
    metrics: ["5 posts / week", "0 missed drops", "1 editor instead of 3"],
    gradient: ["#F59E0B", "#EC4899"]
  },
  {
    id: "b-ops",
    title: "AI Ops Cockpit",
    body:
      "Meeting summaries, ticket triage, and dashboard generation. A calm command center for studios.",
    metrics: ["−12h / week on admin", "100% meeting coverage", "1 dashboard per team"],
    gradient: ["#EC4899", "#7C8CFF"]
  }
];

/* ─────────────────────────────────── AUTOMATION ───────────────────────────────── */

export type Automation = {
  id: string;
  title: string;
  trigger: string;
  action: string;
  tools: string[];
  gradient: Grad;
};

export const AUTOMATIONS: Automation[] = [
  {
    id: "auto-1",
    title: "Auto-caption new drops",
    trigger: "New prompt added",
    action: "Generate caption pack and post to channel",
    tools: ["Aether", "Claude", "Slack"],
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "auto-2",
    title: "Brief → shot list",
    trigger: "New brief submitted",
    action: "Produce 12-shot list with lens + movement",
    tools: ["Aether", "Claude"],
    gradient: ["#F59E0B", "#7C8CFF"]
  },
  {
    id: "auto-3",
    title: "Research → weekly digest",
    trigger: "Friday 16:00",
    action: "Summarize the week's AI news in your voice",
    tools: ["Perplexity", "Claude", "Aether"],
    gradient: ["#5CE1E6", "#7C8CFF"]
  },
  {
    id: "auto-4",
    title: "Lead → Arabic outreach",
    trigger: "New lead in CRM",
    action: "Draft Iraqi-dialect message for review",
    tools: ["HubSpot", "Claude", "Aether"],
    gradient: ["#EC4899", "#F59E0B"]
  }
];

/* ─────────────────────────────────── EVENTS (for community) ────────────────────── */

export type Event = {
  id: string;
  title: string;
  date: string;
  format: "Online" | "Baghdad" | "Dubai" | "Hybrid";
  gradient: Grad;
};

export const EVENTS: Event[] = [
  {
    id: "e-1",
    title: "AI in Iraqi Marketing — monthly meetup",
    date: "May 22, 2026",
    format: "Baghdad",
    gradient: ["#7C8CFF", "#5CE1E6"]
  },
  {
    id: "e-2",
    title: "Prompt Craft Live (beginner)",
    date: "May 18, 2026",
    format: "Online",
    gradient: ["#F59E0B", "#7C8CFF"]
  },
  {
    id: "e-3",
    title: "Aether Studio Tour — Dubai",
    date: "June 3, 2026",
    format: "Dubai",
    gradient: ["#5CE1E6", "#EC4899"]
  }
];

/* ─────────────────────────────────── GLOBAL SEARCH INDEX ──────────────────────── */

export type SearchResultKind =
  | "prompt"
  | "tool"
  | "model"
  | "article"
  | "course"
  | "workflow"
  | "guide"
  | "news";

export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  description: string;
  href: string;
  meta?: string;
};

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
