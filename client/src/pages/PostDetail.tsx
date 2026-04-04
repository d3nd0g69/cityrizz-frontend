/*
 * CityRizz Post Detail Page
 * Design: Full article view with sidebar, author bio, related posts
 */

import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { Clock, User, Tag, Facebook, Twitter, Link2, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { getPostBySlug, getPostsByCategory, getCategoryBadgeClass, type Post } from "@/lib/api";

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug).then(async (p) => {
      setPost(p);
      if (p) {
        const rel = await getPostsByCategory(p.categorySlug, 4);
        setRelated(rel.filter(r => r.id !== p.id).slice(0, 3));
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a2e]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Story Not Found
          </h1>
          <p className="text-gray-500 mt-3 mb-6">This article may have been moved or removed.</p>
          <Link href="/" className="px-5 py-2.5 bg-[#c0392b] text-white text-sm font-bold no-underline hover:bg-[#a93226] transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const badgeClass = getCategoryBadgeClass(post.categorySlug);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-2">
        <div className="container flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#c0392b] transition-colors no-underline">Home</Link>
          <ChevronRight size={12} />
          <Link href={`/category/${post.categorySlug}`} className="hover:text-[#c0392b] transition-colors no-underline">{post.category}</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600 truncate max-w-xs">{post.title}</span>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Category + headline */}
            <span className={badgeClass}>{post.category}</span>
            <h1
              className="mt-3 text-3xl md:text-4xl font-bold text-[#1a1a2e] leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div>
                  <Link
                    href={`/author/${post.authorSlug}`}
                    className="text-sm font-semibold text-[#1a1a2e] hover:text-[#c0392b] transition-colors no-underline"
                  >
                    {post.author}
                  </Link>
                </div>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-400">{post.date}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <Clock size={13} /> {post.readTime}
              </span>

              {/* Share */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Share</span>
                {[
                  { icon: Facebook, color: "#1877f2" },
                  { icon: Twitter, color: "#1da1f2" },
                  { icon: Link2, color: "#555" },
                ].map(({ icon: Icon, color }, i) => (
                  <button
                    key={i}
                    className="w-7 h-7 flex items-center justify-center border border-gray-200 hover:border-transparent hover:text-white transition-all"
                    style={{ color }}
                    onClick={() => {}}
                  >
                    <Icon size={13} />
                  </button>
                ))}
              </div>
            </div>

            {/* Feature image */}
            <div className="mt-5 overflow-hidden">
              <img
                src={post.featureImg}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: "460px" }}
              />
              <p className="text-xs text-gray-400 mt-1.5 italic">Photo credit: CityRizz</p>
            </div>

            {/* Article body */}
            <div
              className="mt-6 prose prose-lg max-w-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                lineHeight: "1.8",
                color: "#333344",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag size={14} className="text-gray-400" />
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-600 hover:bg-[#c0392b] hover:text-white transition-colors no-underline"
                      style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author bio */}
            <div className="mt-8 p-5 bg-gray-50 border-l-4 border-[#c0392b]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center shrink-0">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <Link
                    href={`/author/${post.authorSlug}`}
                    className="text-base font-bold text-[#1a1a2e] hover:text-[#c0392b] transition-colors no-underline"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {post.author}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{post.authorBio}</p>
                </div>
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && (
              <div className="mt-10">
                <div className="flex items-center gap-3 mb-5 pb-2 border-b-2 border-[#c0392b]">
                  <div className="w-1 h-5 bg-[#c0392b]" />
                  <h3
                    className="text-base font-bold text-[#1a1a2e] uppercase tracking-wider"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    More in {post.category}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <PostCard key={p.id} post={p} variant="medium" />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
