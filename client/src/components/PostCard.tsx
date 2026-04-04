/*
 * CityRizz PostCard Component
 * Reusable card for displaying post previews across the site
 * Variants: large (hero/LCP), medium (featured), small (list), horizontal
 *
 * Performance notes:
 * - large variant: fetchpriority="high" + eager load (it IS the LCP element)
 * - all other variants: loading="lazy" + decoding="async" to reduce main thread work
 * - explicit width/height on all images to reserve layout space and prevent CLS
 */

import { Link } from "wouter";
import { Clock, User } from "lucide-react";
import { type Post, getCategoryBadgeClass } from "@/lib/api";

interface PostCardProps {
  post: Post;
  variant?: "large" | "medium" | "small" | "horizontal";
  showExcerpt?: boolean;
  isLCP?: boolean; // true only for the very first hero image
}

export default function PostCard({ post, variant = "medium", showExcerpt = false, isLCP = false }: PostCardProps) {
  const badgeClass = getCategoryBadgeClass(post.categorySlug);

  if (variant === "large") {
    return (
      <div className="post-card relative overflow-hidden group" style={{ height: "480px" }}>
        <div className="post-img absolute inset-0">
          <img
            src={post.featureImg}
            alt={post.title}
            className="w-full h-full object-cover"
            width={800}
            height={480}
            fetchPriority={isLCP ? "high" : "auto"}
            loading={isLCP ? "eager" : "lazy"}
            decoding={isLCP ? "sync" : "async"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className={badgeClass}>{post.category}</span>
          <Link href={`/post/${post.slug}`} className="no-underline">
            <h2
              className="mt-2 text-2xl md:text-3xl font-bold text-white leading-tight hover:text-[#f5c6c0] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h2>
          </Link>
          <p className="mt-2 text-gray-300 text-sm line-clamp-2">{post.excerpt}</p>
          <div className="flex items-center gap-3 mt-3 text-gray-400 text-xs">
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author}
            </span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="post-card flex gap-3 group">
        <div className="post-img shrink-0 w-24 h-20 overflow-hidden">
          <img
            src={post.featureImg}
            alt={post.title}
            className="w-full h-full object-cover"
            width={96}
            height={80}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <span className={`${badgeClass} text-[10px] mb-1`}>{post.category}</span>
          <Link href={`/post/${post.slug}`} className="no-underline">
            <h4
              className="text-sm font-bold text-[#1a1a2e] hover:text-[#c0392b] transition-colors leading-snug line-clamp-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h4>
          </Link>
          <p className="text-xs text-gray-400 mt-1">{post.date}</p>
        </div>
      </div>
    );
  }

  if (variant === "small") {
    return (
      <div className="post-card group flex gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="post-img shrink-0 w-20 h-16 overflow-hidden">
          <img
            src={post.featureImg}
            alt={post.title}
            className="w-full h-full object-cover"
            width={80}
            height={64}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="min-w-0">
          <Link href={`/post/${post.slug}`} className="no-underline">
            <h5
              className="text-sm font-bold text-[#1a1a2e] hover:text-[#c0392b] transition-colors leading-snug line-clamp-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h5>
          </Link>
          <p className="text-xs text-gray-400 mt-1">{post.date} · {post.readTime}</p>
        </div>
      </div>
    );
  }

  // Default: medium card
  return (
    <div className="post-card group">
      <div className="post-img overflow-hidden mb-3" style={{ height: "200px" }}>
        <img
          src={post.featureImg}
          alt={post.title}
          className="w-full h-full object-cover"
          width={400}
          height={200}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className={badgeClass}>{post.category}</span>
      <Link href={`/post/${post.slug}`} className="no-underline">
        <h3
          className="mt-2 text-lg font-bold text-[#1a1a2e] hover:text-[#c0392b] transition-colors leading-snug"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {post.title}
        </h3>
      </Link>
      {showExcerpt && (
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.date}</span>
      </div>
    </div>
  );
}
