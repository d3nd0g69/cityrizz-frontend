/*
 * CityRizz Sidebar Component
 * Contains: Trending, Categories, Newsletter, Popular widgets
 */

import { Link } from "wouter";
import { TrendingUp, Tag } from "lucide-react";
import { posts, categories, getTrendingPosts, getCategoryColor } from "@/lib/mockData";
import PostCard from "./PostCard";

export default function Sidebar() {
  const trending = getTrendingPosts();
  const popular = posts.slice(0, 5);

  return (
    <aside className="space-y-8">
      {/* Trending widget */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#c0392b]">
          <TrendingUp size={16} className="text-[#c0392b]" />
          <h3
            className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Trending Now
          </h3>
        </div>
        <div className="space-y-4">
          {trending.map((post, i) => (
            <div key={post.id} className="flex gap-3 group">
              <span
                className="text-3xl font-black leading-none shrink-0 w-8"
                style={{ fontFamily: "'Oswald', sans-serif", color: "#e8e8e8" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <Link href={`/post/${post.slug}`} className="no-underline">
                  <h4
                    className="text-sm font-bold text-[#1a1a2e] hover:text-[#c0392b] transition-colors leading-snug"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {post.title}
                  </h4>
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-[#1a1a2e] p-5 text-white">
        <h3
          className="text-lg font-bold mb-1"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Daily Newsletter
        </h3>
        <p className="text-gray-400 text-xs mb-4">
          Get the top stories delivered to your inbox every morning.
        </p>
        <input
          type="email"
          placeholder="Your email address"
          className="w-full px-3 py-2 text-sm text-[#1a1a2e] bg-white outline-none mb-2 placeholder-gray-400"
        />
        <button
          className="w-full py-2 text-xs font-bold bg-[#c0392b] hover:bg-[#a93226] text-white transition-colors"
          style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          Subscribe Free
        </button>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#c0392b]">
          <Tag size={16} className="text-[#c0392b]" />
          <h3
            className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Browse By Topic
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-3 py-1.5 text-xs font-semibold text-white no-underline hover:opacity-80 transition-opacity"
              style={{
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                backgroundColor: cat.color,
              }}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Popular posts */}
      <div>
        <div className="mb-4 pb-2 border-b-2 border-[#c0392b]">
          <h3
            className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Most Read
          </h3>
        </div>
        <div className="space-y-0">
          {popular.map((post) => (
            <PostCard key={post.id} post={post} variant="small" />
          ))}
        </div>
      </div>

      {/* Ad placeholder */}
      <div
        className="flex items-center justify-center bg-gray-100 border border-dashed border-gray-300"
        style={{ height: "250px" }}
      >
        <div className="text-center">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Advertisement</p>
          <p className="text-xs text-gray-300 mt-1">300 × 250</p>
        </div>
      </div>
    </aside>
  );
}
