/*
 * CityRizz Header Component
 * Design: CityBeat-inspired three-row layout
 *   Row 1 (dark): utility bar — hamburger + nav links left, utility links right
 *   Row 2 (white): social icons left | logo center | newsletter + search right
 *   Row 3 (white, border-top): full category navigation with dropdowns
 *
 * Features:
 *   - Functional hamburger menu with full mobile drawer
 *   - Dropdown submenus on category nav items
 *   - Search bar toggle
 *   - Sticky header
 */

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Search, Menu, X, ChevronDown,
  Facebook, Instagram, Twitter, Youtube,
} from "lucide-react";

const utilityLinks = [
  { label: "About Us", href: "/about" },
  { label: "Advertise", href: "/advertise" },
  { label: "Contact Us", href: "/contact" },
  { label: "Support Us", href: "/support" },
];

// Category nav with optional dropdown items
const categoryNav = [
  {
    label: "News",
    href: "/category/news",
    sub: [
      { label: "Local News", href: "/category/news" },
      { label: "Politics", href: "/category/politics" },
      { label: "Education", href: "/category/news" },
      { label: "Business", href: "/category/news" },
    ],
  },
  {
    label: "Arts & Culture",
    href: "/category/arts",
    sub: [
      { label: "Visual Arts", href: "/category/arts" },
      { label: "Theater", href: "/category/arts" },
      { label: "Film", href: "/category/arts" },
    ],
  },
  {
    label: "Food & Drink",
    href: "/category/food",
    sub: [
      { label: "Restaurants", href: "/category/food" },
      { label: "Bars & Breweries", href: "/category/food" },
      { label: "Recipes", href: "/category/food" },
    ],
  },
  {
    label: "Music",
    href: "/category/music",
    sub: [
      { label: "Live Music", href: "/category/music" },
      { label: "New Releases", href: "/category/music" },
      { label: "Venues", href: "/category/music" },
    ],
  },
  {
    label: "Things To Do",
    href: "/category/things-to-do",
    sub: [
      { label: "Events", href: "/events" },
      { label: "Outdoors", href: "/category/things-to-do" },
      { label: "Family", href: "/category/things-to-do" },
    ],
  },
  {
    label: "Sports",
    href: "/category/sports",
    sub: [
      { label: "MSU Bulldogs", href: "/category/sports" },
      { label: "High School", href: "/category/sports" },
      { label: "Outdoors", href: "/category/sports" },
    ],
  },
  {
    label: "Home & Garden",
    href: "/category/home-garden",
    sub: [
      { label: "Interior Design", href: "/category/home-garden" },
      { label: "Gardening", href: "/category/home-garden" },
      { label: "Real Estate", href: "/category/home-garden" },
    ],
  },
  {
    label: "Opinion",
    href: "/category/opinion",
    sub: [
      { label: "Editorials", href: "/category/opinion" },
      { label: "Letters", href: "/category/opinion" },
      { label: "Columns", href: "/category/opinion" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-nav-dropdown]")) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDropdownEnter(label: string) {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  return (
    <header className="w-full z-50 sticky top-0 bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

      {/* ── Row 1: Dark utility bar ─────────────────────────────────────────── */}
      <div className="bg-[#3a3a3a] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-9">

          {/* Left: hamburger + utility nav */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {mobileOpen ? "Close" : "Menu"}
              </span>
            </button>

            {/* Desktop hamburger (opens full overlay) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hidden lg:flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              <span
                className="text-xs font-semibold tracking-widest uppercase"
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
                  className="text-xs text-gray-300 hover:text-white transition-colors no-underline"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: placeholder */}
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

      {/* ── Row 3: Category navigation with dropdowns ───────────────────────── */}
      <div className="bg-white border-b border-gray-200 hidden lg:block">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center gap-0">
          {categoryNav.map((item) => (
            <div
              key={item.href}
              className="relative"
              data-nav-dropdown="true"
              onMouseEnter={() => handleDropdownEnter(item.label)}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={item.href}
                className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold text-[#3a3a3a] hover:text-[#c0392b] transition-colors whitespace-nowrap no-underline relative group"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                {item.label}
                {item.sub && item.sub.length > 0 && (
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${activeDropdown === item.label ? "rotate-180" : ""}`}
                  />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#c0392b] group-hover:w-full transition-all duration-200" />
              </Link>

              {/* Dropdown menu */}
              {item.sub && activeDropdown === item.label && (
                <div
                  className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg z-50 min-w-[180px]"
                  onMouseEnter={() => handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2.5 text-xs text-[#3a3a3a] hover:text-[#c0392b] hover:bg-gray-50 transition-colors no-underline border-b border-gray-50 last:border-0"
                      style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────────── */}
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
        <div
          className="fixed inset-0 z-40 lg:z-40"
          style={{ top: "calc(36px + 72px)" }} // below utility bar + logo row
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute left-0 top-0 w-80 max-w-full h-full bg-white shadow-2xl overflow-y-auto">
            {/* Category nav with accordion */}
            <nav className="divide-y divide-gray-100">
              {categoryNav.map((item) => (
                <div key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 py-3 px-5 text-sm font-semibold text-[#1a1a2e] hover:text-[#c0392b] no-underline"
                      style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      {item.label}
                    </Link>
                    {item.sub && item.sub.length > 0 && (
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="px-4 py-3 text-gray-400 hover:text-[#c0392b] transition-colors"
                        aria-label={`Expand ${item.label}`}
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${mobileExpanded === item.label ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Accordion submenu */}
                  {item.sub && mobileExpanded === item.label && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {item.sub.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block py-2.5 pl-8 pr-5 text-xs text-gray-600 hover:text-[#c0392b] no-underline border-b border-gray-100 last:border-0"
                          style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
                        >
                          → {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Utility links */}
            <div className="bg-[#3a3a3a] px-5 py-4 mt-2">
              <p
                className="text-xs text-gray-400 uppercase tracking-widest mb-3"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                More
              </p>
              <div className="flex flex-col gap-2">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white no-underline"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="px-5 py-4 bg-[#c0392b]">
              <Link
                href="/newsletter"
                className="block text-center text-sm font-bold text-white no-underline"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Subscribe to Newsletters →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
