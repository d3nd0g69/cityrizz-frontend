/*
 * CityRizz Category Archive Page
 */

import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import { getAllCategories, getPostsByCategory, getCategoryBadgeClass, type Post, type Category } from "@/lib/api";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [catPosts, setCatPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      getAllCategories(),
      getPostsByCategory(slug, 20),
    ]).then(([cats, posts]) => {
      setCategory(cats.find(c => c.slug === slug));
      setCatPosts(posts);
      setLoading(false);
    });
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a2e]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Category Not Found
          </h1>
          <Link href="/" className="mt-6 inline-block px-5 py-2.5 bg-[#c0392b] text-white text-sm font-bold no-underline">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const [hero, ...rest] = catPosts;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Category header */}
      <div className="border-b border-gray-100 py-2 bg-gray-50">
        <div className="container flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-[#c0392b] transition-colors no-underline">Home</Link>
          <ChevronRight size={12} />
          <span className="text-gray-600">{category.name}</span>
        </div>
      </div>

      <div
        className="py-8"
        style={{ borderBottom: `4px solid ${category.color}` }}
      >
        <div className="container">
          <h1
            className="text-4xl font-black text-[#1a1a2e]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.02em", textTransform: "uppercase" }}
          >
            {category.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{category.count} stories</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Hero post */}
            {hero && (
              <div className="mb-8">
                <PostCard post={hero} variant="large" />
              </div>
            )}

            {/* Grid of remaining */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} variant="medium" showExcerpt />
              ))}
            </div>

            {catPosts.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-gray-400">No stories in this category yet.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
