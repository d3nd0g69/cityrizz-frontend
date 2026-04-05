/*
 * CityRizz Header Component
 * Design: CityBeat-inspired three-row layout
 *   Row 1 (dark): utility bar — hamburger + nav links left, utility links right
 *   Row 2 (white): social icons left | logo center | newsletter + search right
 *   Row 3 (white, border-top): full category navigation
 * No breaking news bar.
 */

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Menu, X, ChevronDown,
  Facebook, Instagram, Twitter, Youtube,
} from "lucide-react";
import { categories } from "@/lib/mockData";

const utilityLinks = [
  { label: "About Us", href: "/about" },
  { label: "Advertise", href: "/advertise" },
  { label: "Contact Us", href: "/contact" },
  { label: "Support Us", href: "/support" },
];

const categoryNav = [
  { label: "News", href: "/category/news" },
  { label: "Arts & Culture", href: "/category/arts" },
  { label: "Food & Drink", href: "/category/food" },
  { label: "Music", href: "/category/music" },
  { label: "Things To Do", href: "/category/things-to-do" },
  { label: "Sports", href: "/category/sports" },
  { label: "Home & Garden", href: "/category/home-garden" },
  { label: "Opinion", href: "/category/opinion" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false); }, [location]);

  return (
    <header className="w-full z-50 sticky top-0 bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* ── Row 1: Dark utility bar ─────────────────────────────────────────── */}
      <div className="bg-[#3a3a3a] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-9">

          {/* Left: hamburger + utility nav */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              <span
                className="text-xs font-semibold tracking-widest uppercase hidden sm:inline"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Menu
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-5">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-gray-300 hover:text-white transition-colors no-underline flex items-center gap-1"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}
                >
                  {link.label}
                  {link.label === "About Us" && <ChevronDown size={11} />}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: placeholder for future utility items */}
          <div />
        </div>
      </div>

      {/* ── Row 2: Logo row ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[72px]">

          {/* Left: social icons */}
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="text-[#3a3a3a] hover:text-[#c0392b] transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="text-[#3a3a3a] hover:text-[#c0392b] transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
              className="text-[#3a3a3a] hover:text-[#c0392b] transition-colors">
              <Twitter size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
              className="text-[#3a3a3a] hover:text-[#c0392b] transition-colors">
              <Youtube size={18} />
            </a>
          </div>

          {/* Center: logo */}
          <Link href="/" className="no-underline absolute left-1/2 -translate-x-1/2">
            <div className="flex items-baseline leading-none select-none">
              <span
                className="font-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.6rem",
                  color: "#1a1a2e",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                City
              </span>
              <span
                className="font-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.6rem",
                  color: "#c0392b",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Rizz
              </span>
            </div>
          </Link>

          {/* Right: newsletter button + search */}
          <div className="flex items-center gap-2">
            <Link
              href="/newsletter"
              className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-bold text-white bg-[#c0392b] hover:bg-[#a93226] transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Newsletters
            </Link>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#3a3a3a] hover:text-[#c0392b] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 3: Category navigation ──────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center gap-0">
          {categoryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2.5 text-xs font-semibold text-[#3a3a3a] hover:text-[#c0392b] transition-colors whitespace-nowrap no-underline relative group"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c0392b] group-hover:w-full transition-all duration-200" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Search bar (expands below header) ───────────────────────────────── */}
      {searchOpen && (
        <div className="bg-gray-50 border-b border-gray-200 py-3">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-3 max-w-xl mx-auto">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search CityRizz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="flex-1 bg-transparent text-sm outline-none text-[#1a1a2e] placeholder-gray-400"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="text-xs text-gray-400 hover:text-[#c0392b] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile menu drawer ───────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl">
          {/* Category nav */}
          <nav className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col divide-y divide-gray-100">
            {categoryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-sm font-semibold text-[#3a3a3a] hover:text-[#c0392b] no-underline"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Utility links */}
          <div className="bg-gray-50 px-4 py-3 flex flex-wrap gap-4 border-t border-gray-100">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-[#c0392b] no-underline"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
