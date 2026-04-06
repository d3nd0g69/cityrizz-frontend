/*
 * CityRizz — Unified Data API
 * ============================
 * Uses live WPGraphQL from WP Engine when VITE_WORDPRESS_API_URL is set,
 * otherwise falls back to local mock data for development.
 *
 * Performance: getHomepageData() fires a SINGLE batched GraphQL query
 * instead of 6 separate requests, dramatically reducing waterfall latency.
 *
 * All page components should import from this file only.
 */

const WP_API_URL = import.meta.env.VITE_WORDPRESS_API_URL as string | undefined;
const USE_LIVE = !!WP_API_URL;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  authorSlug: string;
  authorBio: string;
  date: string;
  readTime: string;
  featureImg: string;
  trending?: boolean;
  featured?: boolean;
  tags: string[];
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  color: string;
}

export interface HomepageData {
  featured: Post[];
  latest: Post[];
  arts: Post[];
  food: Post[];
  music: Post[];
  politics: Post[];
}

// ── Category color map ────────────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  news:           "#c0392b",
  arts:           "#8e44ad",
  "arts-culture": "#8e44ad",
  food:           "#d35400",
  "food-drink":   "#d35400",
  music:          "#2980b9",
  politics:       "#2c3e50",
  sports:         "#16a085",
  opinion:        "#7f8c8d",
  "things-to-do": "#27ae60",
  "home-garden":   "#2ecc71",
};

export function getCategoryColor(slug: string): string {
  return CATEGORY_COLORS[slug] || "#c0392b";
}

export function getCategoryBadgeClass(slug: string): string {
  const map: Record<string, string> = {
    news:           "cat-badge-news",
    arts:           "cat-badge-arts",
    "arts-culture": "cat-badge-arts",
    food:           "cat-badge-food",
    "food-drink":   "cat-badge-food",
    music:          "cat-badge-music",
    politics:       "cat-badge-politics",
    sports:         "cat-badge-sports",
    opinion:        "cat-badge-opinion",
    "things-to-do": "cat-badge-culture",
  };
  return `cat-badge ${map[slug] || "cat-badge-news"}`;
}

// ── GraphQL fetch ─────────────────────────────────────────────────────────────

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(WP_API_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`WPGraphQL ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message);
  return json.data as T;
}

// ── Normalizer ────────────────────────────────────────────────────────────────

// Pick the best pre-generated WP image size for a given target width
function pickImageSize(node: any, targetWidth: number): string {
  if (!node) return "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80";
  const sizes: Array<{ name: string; sourceUrl: string; width: string }> =
    node.mediaDetails?.sizes || [];
  if (sizes.length === 0) return node.sourceUrl || "";
  // Sort ascending by width, pick smallest that is >= targetWidth
  const sorted = [...sizes]
    .filter((s) => s.sourceUrl)
    .sort((a, b) => parseInt(a.width) - parseInt(b.width));
  const fit = sorted.find((s) => parseInt(s.width) >= targetWidth);
  return (fit || sorted[sorted.length - 1]).sourceUrl;
}

function normalizeWPPost(wp: any, imgWidth = 768): Post {
  const cat = wp.categories?.nodes?.[0];
  const author = wp.author?.node;
  const rawSlug = cat?.slug || "uncategorized";
  const slugMap: Record<string, string> = {
    "arts-culture":    "arts",
    "food-drink":      "food",
    "home-and-garden": "home-garden",
  };
  const catSlug = slugMap[rawSlug] || rawSlug;

  const content = wp.content || "";
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return {
    id: wp.id,
    slug: wp.slug,
    title: decodeEntities(wp.title || ""),
    excerpt: stripHtml(wp.excerpt || ""),
    content,
    category: cat?.name || "Uncategorized",
    categorySlug: catSlug,
    author: author?.name || "CityRizz Staff",
    authorSlug: author?.slug || "staff",
    authorBio: author?.description || "",
    date: new Date(wp.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    readTime,
    featureImg: pickImageSize(wp.featuredImage?.node, imgWidth),
    trending: false,
    featured: wp.isSticky || false,
    tags: wp.tags?.nodes?.map((t: any) => t.name) || [],
  };
}

function stripHtml(html: string) { return html.replace(/<[^>]*>/g, "").trim(); }
function decodeEntities(str: string) {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, " ");
}

// ── Shared post fields fragment ───────────────────────────────────────────────

const POST_FIELDS = `
  id slug title excerpt date isSticky
  featuredImage {
    node {
      altText
      sourceUrl
      mediaDetails {
        sizes {
          name
          sourceUrl
          width
          height
        }
      }
    }
  }
  categories { nodes { name slug } }
  author { node { name slug description } }
  tags { nodes { name slug } }
`;

// ── BATCHED homepage query (single round-trip) ────────────────────────────────

export async function getHomepageData(): Promise<HomepageData> {
  if (!USE_LIVE) {
    const { posts, getFeaturedPosts, getPostsByCategory } = await import("./mockData");
    return {
      featured: getFeaturedPosts() as Post[],
      latest:   (posts as Post[]).slice(0, 12),
      arts:     getPostsByCategory("arts") as Post[],
      food:     getPostsByCategory("food") as Post[],
      music:    getPostsByCategory("music") as Post[],
      politics: getPostsByCategory("politics") as Post[],
    };
  }

  const data = await gql<any>(`
    query HomepageData {
      latest: posts(first: 12, where: { status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
      }
      arts: posts(first: 4, where: { status: PUBLISH, categoryName: "arts-culture" }) {
        nodes { ${POST_FIELDS} }
      }
      food: posts(first: 4, where: { status: PUBLISH, categoryName: "food-drink" }) {
        nodes { ${POST_FIELDS} }
      }
      music: posts(first: 4, where: { status: PUBLISH, categoryName: "music" }) {
        nodes { ${POST_FIELDS} }
      }
      politics: posts(first: 4, where: { status: PUBLISH, categoryName: "politics" }) {
        nodes { ${POST_FIELDS} }
      }
    }
  `);

  // Image width strategy per placement:
  // featured hero (large card, 665px wide on desktop): 768px
  // latest grid (medium card, 400px wide): 600px
  // category spotlights thumbnails: 300px
  const normalizeHero  = (wp: any) => normalizeWPPost(wp, 768);
  const normalizeMed   = (wp: any) => normalizeWPPost(wp, 600);
  const normalizeThumb = (wp: any) => normalizeWPPost(wp, 300);

  // Use first 3 latest posts as hero featured posts (no sticky dependency)
  return {
    featured: data.latest.nodes.slice(0, 3).map(normalizeHero),
    latest:   data.latest.nodes.map(normalizeMed),
    arts:     (data.arts.nodes || []).map((wp: any, i: number) => i === 0 ? normalizeMed(wp) : normalizeThumb(wp)),
    food:     (data.food.nodes || []).map((wp: any, i: number) => i === 0 ? normalizeMed(wp) : normalizeThumb(wp)),
    music:    (data.music.nodes || []).map((wp: any, i: number) => i === 0 ? normalizeMed(wp) : normalizeThumb(wp)),
    politics: (data.politics.nodes || []).map((wp: any, i: number) => i === 0 ? normalizeMed(wp) : normalizeThumb(wp)),
  };
}

// ── Individual query functions (used by inner pages) ─────────────────────────

export async function getAllPosts(limit = 20): Promise<Post[]> {
  if (!USE_LIVE) {
    const { posts } = await import("./mockData");
    return posts as Post[];
  }
  const data = await gql<any>(`
    query GetAllPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
      }
    }`, { first: limit });
  return data.posts.nodes.map(normalizeWPPost);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  if (!USE_LIVE) {
    const { getPostBySlug: mockGet } = await import("./mockData");
    return mockGet(slug) as Post | undefined;
  }
  const data = await gql<any>(`
    query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) { ${POST_FIELDS} content }
    }`, { slug });
  return data.post ? normalizeWPPost(data.post) : undefined;
}

export async function getPostsByCategory(categorySlug: string, limit = 12): Promise<Post[]> {
  if (!USE_LIVE) {
    const { getPostsByCategory: mockGet } = await import("./mockData");
    return mockGet(categorySlug) as Post[];
  }
  const nameMap: Record<string, string> = {
    arts:          "arts-culture",
    food:          "food-drink",
    "home-garden": "home-garden",
    // music, opinion, sports, things-to-do use same slug in WP
  };
  const wpSlug = nameMap[categorySlug] || categorySlug;
  const data = await gql<any>(`
    query GetByCategory($slug: String!, $first: Int!) {
      posts(first: $first, where: { status: PUBLISH, categoryName: $slug }) {
        nodes { ${POST_FIELDS} }
      }
    }`, { slug: wpSlug, first: limit });
  return data.posts.nodes.map(normalizeWPPost);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  if (!USE_LIVE) {
    const { getFeaturedPosts: mockGet } = await import("./mockData");
    return mockGet() as Post[];
  }
  const data = await gql<any>(`
    query GetFeatured($first: Int!) {
      posts(first: $first, where: { status: PUBLISH, onlySticky: true }) {
        nodes { ${POST_FIELDS} }
      }
    }`, { first: limit });
  if (!data.posts.nodes.length) return getAllPosts(limit);
  return data.posts.nodes.map(normalizeWPPost);
}

export async function getAllCategories(): Promise<Category[]> {
  if (!USE_LIVE) {
    const { categories } = await import("./mockData");
    return categories as Category[];
  }
  const data = await gql<any>(`
    query GetCategories {
      categories(first: 20, where: { hideEmpty: true }) {
        nodes { name slug count }
      }
    }`);
  const slugNorm: Record<string, string> = {
    "arts-culture":    "arts",
    "food-drink":      "food",
    "home-and-garden": "home-garden",
    "home-garden":     "home-garden",
  };
  return data.categories.nodes.map((c: any) => {
    const slug = slugNorm[c.slug] || c.slug;
    return {
      name:  c.name,
      slug,
      count: c.count || 0,
      color: getCategoryColor(slug),
    };
  });
}

export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  if (!USE_LIVE) {
    const { posts } = await import("./mockData");
    const q = query.toLowerCase();
    return (posts as Post[]).filter(p =>
      p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    ).slice(0, limit);
  }
  const data = await gql<any>(`
    query Search($search: String!, $first: Int!) {
      posts(first: $first, where: { search: $search, status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
      }
    }`, { search: query, first: limit });
  return data.posts.nodes.map(normalizeWPPost);
}
