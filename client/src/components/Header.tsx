/*
 * CityRizz Header Component
 * Design: Modern City Magazine - sticky header with top bar, logo, nav, category strip
 * Fonts: Oswald (nav), Playfair Display (logo)
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { categories } from "@/lib/mockData";

const navLinks = [
  { label: "News", href: "/category/news" },
  { label: "Arts & Culture", href: "/category/arts" },
  { label: "Food & Drink", href: "/category/food" },
  { label: "Music", href: "/category/music" },
  { label: "Politics", href: "/category/politics" },
  { label: "Sports", href: "/category/sports" },
  { label: "Things To Do", href: "/category/things-to-do" },
  { label: "Opinion", href: "/category/opinion" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full z-50 sticky top-0">
      {/* Top utility bar */}
      {!scrolled && (
        <div className="bg-[#1a1a2e] text-white text-xs py-1.5 px-4">
          <div className="container flex justify-between items-center">
            <span style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em" }}>
              Friday, April 4, 2026 — Your City, Your Stories
            </span>
            <div className="flex gap-4 items-center">
              <a href="#" className="hover:text-[#c0392b] transition-colors">Subscribe</a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-[#c0392b] transition-colors">Newsletter</a>
              <span className="opacity-30">|</span>
              <a href="#" className="hover:text-[#c0392b] transition-colors">Advertise</a>
            </div>
          </div>
        </div>
      )}

      {/* Main header */}
      <div
        className="bg-white border-b border-gray-200 transition-shadow duration-300"
        style={{ boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.1)" : "none" }}
      >
        <div className="container flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="flex items-center">
              <span
                className="text-4xl font-black tracking-tight leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#1a1a2e",
                  letterSpacing: "-0.02em",
                }}
              >
                City
              </span>
              <span
                className="text-4xl font-black tracking-tight leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#c0392b",
                  letterSpacing: "-0.02em",
                }}
              >
                Rizz
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#1a1a2e] hover:text-[#c0392b] transition-colors no-underline"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-semibold text-[#1a1a2e] hover:text-[#c0392b] transition-colors"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                More <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {navLinks.slice(6).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-[#1a1a2e] hover:bg-[#c0392b] hover:text-white transition-colors no-underline"
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#1a1a2e] hover:text-[#c0392b] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Subscribe CTA */}
            <Link
              href="/subscribe"
              className="hidden md:inline-flex items-center px-4 py-1.5 text-xs font-bold text-white bg-[#c0392b] hover:bg-[#a93226] transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Subscribe
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-[#1a1a2e]"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-gray-50 py-3">
            <div className="container">
              <div className="flex items-center gap-3 max-w-xl mx-auto">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search CityRizz..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-[#1a1a2e] placeholder-gray-400"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-xs text-gray-400 hover:text-[#c0392b]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category strip (desktop) */}
        <div className="hidden lg:block border-t border-gray-100 bg-[#1a1a2e]">
          <div className="container flex items-center gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#c0392b] transition-colors whitespace-nowrap no-underline"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 px-2 text-sm font-semibold text-[#1a1a2e] hover:text-[#c0392b] border-b border-gray-100 last:border-0 no-underline"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
