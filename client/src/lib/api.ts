/*
 * CityRizz — Unified Data API
 * ============================
 * Uses live WPGraphQL from WP Engine when VITE_WORDPRESS_API_URL is set,
 * otherwise falls back to local mock data for development.
 *
 * All page components should import from this file, not from mockData.ts
 * or wpgraphql.ts directly.
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

// ── Category color map (used for both live and mock) ──────────────────────────

export const CATEGORY_COLORS: Record<string, string> = {
  news:          "#c0392b",
  arts:          "#8e44ad",
  "arts-culture":"#8e44ad",
  food:          "#d35400",
  "food-drink":  "#d35400",
  music:         "#2980b9",
  politics:      "#2c3e50",
  sports:        "#16a085",
  opinion:       "#7f8c8d",
  "things-to-do":"#27ae60",
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

function normalizeWPPost(wp: any): Post {
  const cat = wp.categories?.nodes?.[0];
  const author = wp.author?.node;
  const rawSlug = cat?.slug || "uncategorized";
  // Normalize WP category slugs to our internal slugs
  const slugMap: Record<string, string> = {
    "arts-culture": "arts",
    "food-drink": "food",
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
    featureImg: wp.featuredImage?.node?.sourceUrl || "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    trending: false,
    featured: wp.isSticky || false,
    tags: wp.tags?.nodes?.map((t: any) => t.name) || [],
  };
}

function stripHtml(html: string) { return html.replace(/<[^>]*>/g, "").trim(); }
function decodeEntities(str: string) {
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, " ");
}

// ── GraphQL queries ───────────────────────────────────────────────────────────

const POST_FIELDS = `
  id slug title excerpt date isSticky
  featuredImage { node { sourceUrl altText } }
  categories { nodes { name slug } }
  author { node { name slug description } }
  tags { nodes { name slug } }
`;

// ── Public API ────────────────────────────────────────────────────────────────

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
  // Map our internal slugs back to WP category names for the query
  const nameMap: Record<string, string> = {
    arts: "arts-culture",
    food: "food-drink",
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
  // If no sticky posts, fall back to latest
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
  return data.categories.nodes.map((c: any) => ({
    name: c.name,
    slug: c.slug,
    count: c.count || 0,
    color: getCategoryColor(c.slug),
  }));
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
