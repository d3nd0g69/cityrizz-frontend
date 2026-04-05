/*
 * CityRizz Home Page
 * Design: Modern City Magazine — bold editorial, crimson accent, Playfair/Oswald/Inter
 * Performance: Single batched GraphQL query via getHomepageData() — no waterfall
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import {
  getHomepageData,
  getCategoryBadgeClass,
  type Post,
  type HomepageData,
} from "@/lib/api";

// ── Hero section ──────────────────────────────────────────────────────────────────────────────────────────────────

function HeroSection({ posts }: { posts: Post[] }) {
  const [main, ...secondary] = posts;
  if (!main) return null;

  return (
    <section className="py-6">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {/* LCP element — fetchpriority=high, eager load */}
            <PostCard post={main} variant="large" isLCP={true} />
          </div>
          <div className="flex flex-col gap-4">
            {secondary.slice(0, 2).map((post) => (
              <div key={post.id} className="post-card group relative overflow-hidden" style={{ height: "228px" }}>
                <div className="post-img absolute inset-0">
                  <img
                    src={post.featureImg}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    width={400}
                    height={228}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <span className={getCategoryBadgeClass(post.categorySlug)}>{post.category}</span>
                  <Link href={`/post/${post.slug}`} className="no-underline">
                    <h3 className="mt-1.5 text-base font-bold text-white hover:text-[#f5c6c0] transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-300 mt-1">{post.author} · {post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-[#c0392b]" />
        <h2 className="text-lg font-bold text-[#1a1a2e] uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {title}
        </h2>
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-[#c0392b] hover:text-[#a93226] transition-colors no-underline" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>
        See All <ChevronRight size={14} />
      </Link>
    </div>
  );
}

// ── Latest stories section ────────────────────────────────────────────────────

function LatestSection({ posts }: { posts: Post[] }) {
  return (
    <section className="py-8 border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SectionHeader title="Latest Stories" href="/news" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post.id} post={post} variant="medium" showExcerpt />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Category spotlight section ────────────────────────────────────────────────

function CategorySpotlight({ posts, categorySlug, categoryName, color }: {
  posts: Post[];
  categorySlug: string;
  categoryName: string;
  color: string;
}) {
  if (posts.length === 0) return null;
  const [main, ...rest] = posts;

  return (
    <section className="py-8 border-t border-gray-100">
      <div className="container">
        <SectionHeader title={categoryName} href={`/category/${categorySlug}`} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="post-card group relative overflow-hidden" style={{ height: "280px" }}>
              <div className="post-img absolute inset-0">
                <img
                  src={main.featureImg}
                  alt={main.title}
                  className="w-full h-full object-cover"
                  width={400}
                  height={280}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 text-white" style={{ fontFamily: "'Oswald', sans-serif", backgroundColor: color }}>
                  {categoryName}
                </span>
                <Link href={`/post/${main.slug}`} className="no-underline">
                  <h3 className="mt-2 text-base font-bold text-white hover:text-gray-200 transition-colors leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {main.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-300 mt-1">{main.date}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-4">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} variant="horizontal" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Promo banner ──────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <section className="py-16 relative overflow-hidden" style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663410540603/RNXUZTBUpxjK5nwfDU4q4i/cityrizz-hero-main-7dmNJ3XocoJ8goLrW33o8m.webp)`, backgroundSize: "cover", backgroundPosition: "center 40%" }}>
      <div className="absolute inset-0 bg-[#1a1a2e]/80" />
      <div className="container relative z-10 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Independent Local Journalism
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Your City Deserves Better Coverage
        </h2>
        <p className="text-gray-300 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
          CityRizz is free to read, forever. Support independent local journalism by subscribing to our newsletter or becoming a sustaining member.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/about" className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors no-underline" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Subscribe Free
          </Link>
          <Link href="/about" className="px-6 py-3 border border-white text-white text-sm font-bold hover:bg-white hover:text-[#1a1a2e] transition-colors no-underline" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            About CityRizz
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Main Home component ───────────────────────────────────────────────────────

const EMPTY_DATA: HomepageData = {
  featured: [], latest: [], arts: [], food: [], music: [], politics: [],
};

export default function Home() {
  const [data, setData] = useState<HomepageData>(EMPTY_DATA);

  useEffect(() => {
    // Single batched request — replaces 6 separate GraphQL calls
    getHomepageData().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection posts={data.featured} />
      <LatestSection posts={data.latest} />
      <CategorySpotlight posts={data.arts}     categorySlug="arts"     categoryName="Arts & Culture" color="#8e44ad" />
      <CategorySpotlight posts={data.food}     categorySlug="food"     categoryName="Food & Drink"   color="#d35400" />
      <PromoBanner />
      <CategorySpotlight posts={data.music}    categorySlug="music"    categoryName="Music"          color="#2980b9" />
      <CategorySpotlight posts={data.politics} categorySlug="politics" categoryName="Politics"       color="#2c3e50" />
      <Footer />
    </div>
  );
}
