/*
 * CityRizz Footer Component
 * Design: Dark charcoal footer with logo, nav columns, social links, newsletter signup
 */

import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { categories } from "@/lib/mockData";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Newsletter bar */}
      <div className="bg-[#c0392b] py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Get CityRizz in Your Inbox
              </h3>
              <p className="text-red-100 text-sm mt-1">
                The best local stories, delivered every morning.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-4 py-2.5 text-sm text-[#1a1a2e] bg-white outline-none placeholder-gray-400"
              />
              <button
                className="px-5 py-2.5 bg-[#1a1a2e] text-white text-xs font-bold hover:bg-[#2c2c44] transition-colors whitespace-nowrap"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="no-underline">
                <div className="flex items-center mb-4">
                  <span
                    className="text-3xl font-black"
                    style={{ fontFamily: "'Playfair Display', serif", color: "white", letterSpacing: "-0.02em" }}
                  >
                    City
                  </span>
                  <span
                    className="text-3xl font-black"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#c0392b", letterSpacing: "-0.02em" }}
                  >
                    Rizz
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                CityRizz is your free source for local news, arts and culture, restaurant reviews, music, things to do, and more.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" },
                  { icon: Youtube, href: "#" },
                  { icon: Mail, href: "#" },
                ].map(({ icon: Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-[#c0392b] text-white rounded-sm transition-colors"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4
                className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/10"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Sections
              </h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="text-sm text-gray-300 hover:text-white transition-colors no-underline"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4
                className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/10"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Company
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Our Team", href: "/team" },
                  { label: "Advertise", href: "/advertise" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Careers", href: "/careers" },
                  { label: "Best Of", href: "/best-of" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4
                className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pb-2 border-b border-white/10"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Corrections", href: "/corrections" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © 2026 CityRizz. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Powered by{" "}
            <span className="text-gray-400">Next.js + WP Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
