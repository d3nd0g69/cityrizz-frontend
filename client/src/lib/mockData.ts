/*
 * CityRizz Mock Data
 * This data simulates what would come from WP Engine via WPGraphQL.
 * In production, replace these with GraphQL queries to your WP Engine endpoint.
 */

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

export const categories: Category[] = [
  { name: "News", slug: "news", count: 48, color: "#c0392b" },
  { name: "Arts & Culture", slug: "arts", count: 32, color: "#8e44ad" },
  { name: "Food & Drink", slug: "food", count: 27, color: "#d35400" },
  { name: "Music", slug: "music", count: 21, color: "#2980b9" },
  { name: "Politics", slug: "politics", count: 19, color: "#2c3e50" },
  { name: "Sports", slug: "sports", count: 15, color: "#16a085" },
  { name: "Opinion", slug: "opinion", count: 12, color: "#7f8c8d" },
  { name: "Things To Do", slug: "things-to-do", count: 34, color: "#27ae60" },
];

export const posts: Post[] = [
  {
    id: "1",
    slug: "downtown-revitalization-project-breaks-ground",
    title: "Downtown Revitalization Project Breaks Ground After Years of Planning",
    excerpt: "City officials and developers gathered Thursday morning to celebrate the official groundbreaking of the $240 million downtown redevelopment project that promises to transform the urban core.",
    content: `<p>City officials and developers gathered Thursday morning to celebrate the official groundbreaking of the $240 million downtown redevelopment project that promises to transform the urban core with new housing, retail, and public green space over the next five years.</p><p>Mayor Sandra Williams called it "the most significant investment in our downtown in a generation," noting that the project will bring an estimated 1,200 permanent jobs and 800 new residential units to the area.</p><p>The development, a public-private partnership between the city and Meridian Development Group, will span four city blocks and include a 22-story mixed-use tower, a renovated historic market hall, and a new 2-acre riverside park.</p>`,
    category: "News",
    categorySlug: "news",
    author: "Marcus Webb",
    authorSlug: "marcus-webb",
    authorBio: "Marcus Webb is a senior staff writer covering city hall, development, and urban policy for CityRizz.",
    date: "April 4, 2026",
    readTime: "4 min read",
    featureImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663410540603/RNXUZTBUpxjK5nwfDU4q4i/cityrizz-feature-news-Umxqz9WCpxJXuS8TG38t5k.webp",
    trending: true,
    featured: true,
    tags: ["development", "downtown", "city hall", "housing"],
  },
  {
    id: "2",
    slug: "new-jazz-venue-opens-in-arts-district",
    title: "New Jazz Venue Opens in Arts District, Bringing Live Music Back to the Neighborhood",
    excerpt: "The Blue Room, a 300-seat jazz club and listening lounge, opened its doors this weekend in the heart of the arts district, filling a void left by three venue closures since 2022.",
    content: `<p>The Blue Room, a 300-seat jazz club and listening lounge, opened its doors this weekend in the heart of the arts district, filling a void left by three venue closures since 2022.</p><p>Owner and jazz pianist Denise Okafor spent two years renovating the 1940s-era warehouse space, preserving its original brick walls and steel beams while installing state-of-the-art acoustics and a custom-built stage.</p>`,
    category: "Arts & Culture",
    categorySlug: "arts",
    author: "Sofia Reyes",
    authorSlug: "sofia-reyes",
    authorBio: "Sofia Reyes covers arts, culture, and nightlife for CityRizz.",
    date: "April 3, 2026",
    readTime: "3 min read",
    featureImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663410540603/RNXUZTBUpxjK5nwfDU4q4i/cityrizz-feature-arts-VnCQDnozqm2qRMuRiTDHRG.webp",
    trending: true,
    featured: true,
    tags: ["jazz", "music", "arts district", "nightlife"],
  },
  {
    id: "3",
    slug: "best-new-restaurants-spring-2026",
    title: "The 10 Best New Restaurants to Try This Spring",
    excerpt: "From a wood-fired Neapolitan pizza spot to an intimate omakase counter, these are the dining destinations that have our critics most excited this season.",
    content: `<p>Spring has arrived, and with it a fresh crop of restaurants that are already generating buzz across the city. Our critics spent the past two months eating their way through dozens of new openings to bring you the definitive list of where to eat right now.</p>`,
    category: "Food & Drink",
    categorySlug: "food",
    author: "James Thornton",
    authorSlug: "james-thornton",
    authorBio: "James Thornton is CityRizz's food and dining critic.",
    date: "April 2, 2026",
    readTime: "6 min read",
    featureImg: "https://d2xsxph8kpxj0f.cloudfront.net/310519663410540603/RNXUZTBUpxjK5nwfDU4q4i/cityrizz-feature-food-Q3q2zijUk4dsAFHK2yUfsB.webp",
    trending: false,
    featured: true,
    tags: ["restaurants", "food", "dining", "spring"],
  },
  {
    id: "4",
    slug: "city-council-votes-on-transit-expansion",
    title: "City Council Votes Tonight on $1.2B Transit Expansion Plan",
    excerpt: "The proposal, which would add 18 miles of light rail and 40 new bus rapid transit stops, faces opposition from suburban council members concerned about cost overruns.",
    content: `<p>The city council is set to vote tonight on the most ambitious public transit expansion in the city's history — a $1.2 billion plan that would add 18 miles of light rail and 40 new bus rapid transit stops over the next decade.</p>`,
    category: "Politics",
    categorySlug: "politics",
    author: "Marcus Webb",
    authorSlug: "marcus-webb",
    authorBio: "Marcus Webb is a senior staff writer covering city hall, development, and urban policy for CityRizz.",
    date: "April 4, 2026",
    readTime: "5 min read",
    featureImg: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    trending: true,
    featured: false,
    tags: ["transit", "politics", "city council", "transportation"],
  },
  {
    id: "5",
    slug: "local-band-signs-major-label-deal",
    title: "Local Indie Band The Hollow Stems Signs Major Label Deal After Viral Moment",
    excerpt: "The four-piece from the Eastside neighborhood went from playing 200-capacity clubs to inking a deal with Atlantic Records after a TikTok clip racked up 12 million views.",
    content: `<p>It was the kind of overnight success story that rarely happens anymore — and yet here we are. The Hollow Stems, a four-piece indie rock band from the Eastside, have signed a deal with Atlantic Records after a clip of their song "Glass Ceiling" went viral on TikTok last month.</p>`,
    category: "Music",
    categorySlug: "music",
    author: "Sofia Reyes",
    authorSlug: "sofia-reyes",
    authorBio: "Sofia Reyes covers arts, culture, and nightlife for CityRizz.",
    date: "April 1, 2026",
    readTime: "4 min read",
    featureImg: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["music", "indie", "record deal", "local bands"],
  },
  {
    id: "6",
    slug: "city-marathon-record-broken",
    title: "City Marathon Record Shattered as Kenyan Runner Blazes to Victory",
    excerpt: "Kipchoge Mutai crossed the finish line in 2:03:44, breaking the course record by nearly three minutes in front of a crowd of 50,000 spectators.",
    content: `<p>Kipchoge Mutai made history Sunday morning, crossing the finish line of the City Marathon in 2 hours, 3 minutes, and 44 seconds — shattering the previous course record by nearly three minutes.</p>`,
    category: "Sports",
    categorySlug: "sports",
    author: "Derek Haines",
    authorSlug: "derek-haines",
    authorBio: "Derek Haines covers sports for CityRizz.",
    date: "March 31, 2026",
    readTime: "3 min read",
    featureImg: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["marathon", "sports", "running", "records"],
  },
  {
    id: "7",
    slug: "opinion-housing-crisis-demands-bold-action",
    title: "Opinion: The Housing Crisis Demands Bold Action, Not Half Measures",
    excerpt: "After a decade of incremental policy tweaks, it's time for city leaders to acknowledge that the housing affordability crisis requires transformational change.",
    content: `<p>For the past decade, city leaders have responded to the housing affordability crisis with a series of incremental policy tweaks — a zoning variance here, a density bonus there — while the problem has grown steadily worse.</p>`,
    category: "Opinion",
    categorySlug: "opinion",
    author: "Dr. Priya Nair",
    authorSlug: "priya-nair",
    authorBio: "Dr. Priya Nair is a professor of urban planning and a contributing columnist for CityRizz.",
    date: "March 30, 2026",
    readTime: "5 min read",
    featureImg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["opinion", "housing", "policy", "affordability"],
  },
  {
    id: "8",
    slug: "weekend-guide-spring-festivals",
    title: "Your Weekend Guide: 12 Spring Festivals and Events Not to Miss",
    excerpt: "From a craft beer festival in the park to an outdoor film screening series, here's everything worth doing this weekend across the city.",
    content: `<p>Spring has finally arrived, and the city is celebrating with a packed calendar of festivals, markets, and outdoor events. Here's our curated guide to the best things happening this weekend.</p>`,
    category: "Things To Do",
    categorySlug: "things-to-do",
    author: "Amara Johnson",
    authorSlug: "amara-johnson",
    authorBio: "Amara Johnson is CityRizz's events and lifestyle editor.",
    date: "April 3, 2026",
    readTime: "4 min read",
    featureImg: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["events", "weekend", "festivals", "things to do"],
  },
  {
    id: "9",
    slug: "school-board-election-results",
    title: "School Board Election Results: Reformers Sweep All Three Contested Seats",
    excerpt: "A slate of candidates backed by the teachers union and parent advocacy groups won decisive victories Tuesday, flipping the board's ideological balance.",
    content: `<p>Three reform-backed candidates swept to victory in Tuesday's school board election, winning by margins that surprised even their most optimistic supporters.</p>`,
    category: "News",
    categorySlug: "news",
    author: "Marcus Webb",
    authorSlug: "marcus-webb",
    authorBio: "Marcus Webb is a senior staff writer covering city hall, development, and urban policy for CityRizz.",
    date: "April 2, 2026",
    readTime: "4 min read",
    featureImg: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["education", "elections", "school board", "politics"],
  },
  {
    id: "10",
    slug: "street-art-mural-festival-announced",
    title: "City Announces Third Annual Street Art Mural Festival for This Summer",
    excerpt: "Twenty international and local artists will transform 15 blank walls across three neighborhoods over a two-week period in July.",
    content: `<p>The city's arts commission announced Tuesday that the third annual Street Art Mural Festival will return this July, bringing 20 artists from around the world to paint large-scale murals across three neighborhoods.</p>`,
    category: "Arts & Culture",
    categorySlug: "arts",
    author: "Sofia Reyes",
    authorSlug: "sofia-reyes",
    authorBio: "Sofia Reyes covers arts, culture, and nightlife for CityRizz.",
    date: "April 1, 2026",
    readTime: "3 min read",
    featureImg: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["street art", "murals", "arts", "summer"],
  },
  {
    id: "11",
    slug: "best-coffee-shops-remote-work",
    title: "The 8 Best Coffee Shops for Remote Work in the City Right Now",
    excerpt: "Fast wifi, ample outlets, and a vibe that won't make you feel guilty for nursing a single latte for four hours — these spots have it all.",
    content: `<p>Whether you're a freelancer, a remote employee, or just someone who can't focus at home, finding the right coffee shop to work from is a serious business.</p>`,
    category: "Food & Drink",
    categorySlug: "food",
    author: "James Thornton",
    authorSlug: "james-thornton",
    authorBio: "James Thornton is CityRizz's food and dining critic.",
    date: "March 29, 2026",
    readTime: "5 min read",
    featureImg: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["coffee", "remote work", "cafes", "food"],
  },
  {
    id: "12",
    slug: "city-fc-playoff-push",
    title: "City FC Makes Dramatic Playoff Push with Five-Game Winning Streak",
    excerpt: "After a dismal start to the season, the local soccer club has rattled off five straight wins to climb back into playoff contention with six games remaining.",
    content: `<p>Nobody saw this coming. After losing their first four games of the season and sitting at the bottom of the table, City FC has gone on a remarkable five-game winning streak that has put them right back in the playoff picture.</p>`,
    category: "Sports",
    categorySlug: "sports",
    author: "Derek Haines",
    authorSlug: "derek-haines",
    authorBio: "Derek Haines covers sports for CityRizz.",
    date: "March 28, 2026",
    readTime: "3 min read",
    featureImg: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80",
    trending: false,
    featured: false,
    tags: ["soccer", "sports", "playoffs", "City FC"],
  },
];

export const trendingHeadlines = [
  "Breaking: City Council Approves Emergency Housing Measure",
  "Local Chef Named James Beard Award Finalist",
  "New Light Rail Line to Open Six Months Ahead of Schedule",
  "Record Turnout Expected for Saturday's Climate March",
  "City's Unemployment Rate Drops to 15-Year Low",
];

export function getPostsByCategory(slug: string): Post[] {
  return posts.filter(p => p.categorySlug === slug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(p => p.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter(p => p.featured);
}

export function getTrendingPosts(): Post[] {
  return posts.filter(p => p.trending);
}

export function getRecentPosts(limit = 6): Post[] {
  return posts.slice(0, limit);
}

export function getCategoryColor(slug: string): string {
  const cat = categories.find(c => c.slug === slug);
  return cat?.color || "#c0392b";
}

export function getCategoryBadgeClass(slug: string): string {
  const map: Record<string, string> = {
    news: "cat-badge-news",
    arts: "cat-badge-arts",
    food: "cat-badge-food",
    music: "cat-badge-music",
    politics: "cat-badge-politics",
    sports: "cat-badge-sports",
    opinion: "cat-badge-opinion",
    "things-to-do": "cat-badge-culture",
  };
  return `cat-badge ${map[slug] || "cat-badge-news"}`;
}
