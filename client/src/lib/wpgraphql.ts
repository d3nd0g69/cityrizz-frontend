/*
 * CityRizz — WP Engine / WPGraphQL Data Layer
 * ============================================
 * This file replaces the mock data in mockData.ts once your WP Engine
 * WordPress site has WPGraphQL installed.
 *
 * SETUP:
 * 1. Install WPGraphQL plugin on your WP Engine WordPress site
 * 2. Set VITE_WORDPRESS_API_URL in your .env file:
 *    VITE_WORDPRESS_API_URL=https://your-site.wpengine.com/graphql
 * 3. Import functions from this file instead of mockData.ts
 *
 * WP ENGINE CORS:
 * Add this to your WordPress theme's functions.php:
 *
 *   add_action('init', function() {
 *     header('Access-Control-Allow-Origin: https://cityrizz.com');
 *     header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
 *     header('Access-Control-Allow-Headers: Content-Type');
 *   });
 */

const WP_API_URL = import.meta.env.VITE_WORDPRESS_API_URL || "https://your-site.wpengine.com/graphql";

// ─── Core fetch utility ───────────────────────────────────────────────────────

async function fetchAPI<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    console.error("WPGraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message || "WPGraphQL error");
  }

  return json.data as T;
}

// ─── GraphQL Fragments ────────────────────────────────────────────────────────

const POST_FIELDS = `
  id
  slug
  title
  excerpt
  date
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories {
    nodes {
      name
      slug
    }
  }
  author {
    node {
      name
      slug
      description
    }
  }
  tags {
    nodes {
      name
      slug
    }
  }
`;

// ─── Query: All Posts ─────────────────────────────────────────────────────────

export async function getAllPosts(limit = 20) {
  const data = await fetchAPI<{ posts: { nodes: WPPost[] } }>(`
    query GetAllPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH }) {
        nodes {
          ${POST_FIELDS}
        }
      }
    }
  `, { first: limit });

  return data.posts.nodes.map(normalizePost);
}

// ─── Query: Single Post by Slug ───────────────────────────────────────────────

export async function getPostBySlugFromWP(slug: string) {
  const data = await fetchAPI<{ post: WPPost | null }>(`
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${POST_FIELDS}
        content
      }
    }
  `, { slug });

  return data.post ? normalizePost(data.post) : null;
}

// ─── Query: Posts by Category ─────────────────────────────────────────────────

export async function getPostsByCategoryFromWP(categorySlug: string, limit = 12) {
  const data = await fetchAPI<{ posts: { nodes: WPPost[] } }>(`
    query GetPostsByCategory($slug: String!, $first: Int!) {
      posts(
        first: $first
        where: { status: PUBLISH, categoryName: $slug }
      ) {
        nodes {
          ${POST_FIELDS}
        }
      }
    }
  `, { slug: categorySlug, first: limit });

  return data.posts.nodes.map(normalizePost);
}

// ─── Query: All Categories ────────────────────────────────────────────────────

export async function getAllCategories() {
  const data = await fetchAPI<{ categories: { nodes: WPCategory[] } }>(`
    query GetAllCategories {
      categories(first: 20, where: { hideEmpty: true }) {
        nodes {
          name
          slug
          count
        }
      }
    }
  `);

  return data.categories.nodes;
}

// ─── Query: Featured Posts (using sticky posts) ───────────────────────────────

export async function getFeaturedPostsFromWP(limit = 3) {
  const data = await fetchAPI<{ posts: { nodes: WPPost[] } }>(`
    query GetFeaturedPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH, onlySticky: true }) {
        nodes {
          ${POST_FIELDS}
        }
      }
    }
  `, { first: limit });

  return data.posts.nodes.map(normalizePost);
}

// ─── Query: Search Posts ──────────────────────────────────────────────────────

export async function searchPosts(query: string, limit = 10) {
  const data = await fetchAPI<{ posts: { nodes: WPPost[] } }>(`
    query SearchPosts($search: String!, $first: Int!) {
      posts(first: $first, where: { search: $search, status: PUBLISH }) {
        nodes {
          ${POST_FIELDS}
        }
      }
    }
  `, { search: query, first: limit });

  return data.posts.nodes.map(normalizePost);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface WPPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  categories?: {
    nodes: Array<{ name: string; slug: string }>;
  };
  author?: {
    node: {
      name: string;
      slug: string;
      description?: string;
    };
  };
  tags?: {
    nodes: Array<{ name: string; slug: string }>;
  };
}

interface WPCategory {
  name: string;
  slug: string;
  count: number;
}

// ─── Normalizer: WP → CityRizz Post shape ────────────────────────────────────

function normalizePost(wp: WPPost) {
  const category = wp.categories?.nodes[0];
  const author = wp.author?.node;

  return {
    id: wp.id,
    slug: wp.slug,
    title: decodeHtmlEntities(wp.title),
    excerpt: wp.excerpt ? stripHtml(wp.excerpt) : "",
    content: wp.content || "",
    category: category?.name || "Uncategorized",
    categorySlug: category?.slug || "uncategorized",
    author: author?.name || "CityRizz Staff",
    authorSlug: author?.slug || "staff",
    authorBio: author?.description || "",
    date: formatDate(wp.date),
    readTime: estimateReadTime(wp.content || ""),
    featureImg: wp.featuredImage?.node.sourceUrl || "/placeholder.jpg",
    trending: false,
    featured: false,
    tags: wp.tags?.nodes.map(t => t.name) || [],
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content: string): string {
  const wordCount = stripHtml(content).split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}
