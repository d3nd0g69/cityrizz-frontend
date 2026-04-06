/*
 * CityRizz Advertise Page
 * Design: CityBeat-inspired — bold editorial, crimson accent, Playfair/Oswald/Inter
 */

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Mail, Phone, BarChart2, Users, Globe, Zap } from "lucide-react";

const adPackages = [
  {
    name: "Starter",
    price: "$299",
    period: "/month",
    description: "Perfect for local businesses getting started with digital advertising.",
    features: [
      "Leaderboard banner (728×90) on all pages",
      "50,000 monthly impressions",
      "Basic analytics dashboard",
      "1-month minimum commitment",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    price: "$599",
    period: "/month",
    description: "Our most popular package for businesses ready to grow their reach.",
    features: [
      "Leaderboard + rectangle banners",
      "150,000 monthly impressions",
      "Category page sponsorship (1 category)",
      "Newsletter mention (1×/month)",
      "Advanced analytics + click tracking",
      "3-month minimum commitment",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$1,199",
    period: "/month",
    description: "Maximum visibility across all CityRizz platforms and newsletters.",
    features: [
      "All ad placements site-wide",
      "Unlimited impressions",
      "All category page sponsorships",
      "Weekly newsletter sponsorship",
      "Sponsored content article (1×/month)",
      "Social media shoutout",
      "Dedicated account manager",
      "No minimum commitment",
    ],
    highlight: false,
  },
];

const adFormats = [
  {
    icon: <Globe size={28} className="text-[#c0392b]" />,
    title: "Display Advertising",
    desc: "Leaderboard (728×90), Medium Rectangle (300×250), and Half Page (300×600) placements across all pages.",
  },
  {
    icon: <Mail size={28} className="text-[#c0392b]" />,
    title: "Newsletter Sponsorship",
    desc: "Reach our engaged subscriber base directly in their inbox. The Daily Rizz goes out to 5,000+ subscribers every morning.",
  },
  {
    icon: <Zap size={28} className="text-[#c0392b]" />,
    title: "Sponsored Content",
    desc: "Work with our editorial team to craft a story about your business, event, or product — written in CityRizz's voice.",
  },
  {
    icon: <BarChart2 size={28} className="text-[#c0392b]" />,
    title: "Category Sponsorship",
    desc: "Own a category. Your brand appears as the exclusive sponsor of News, Food & Drink, Music, or any other section.",
  },
];

const stats = [
  { value: "45,000+", label: "Monthly Unique Visitors" },
  { value: "180,000+", label: "Monthly Page Views" },
  { value: "5,000+", label: "Newsletter Subscribers" },
  { value: "12,000+", label: "Social Media Followers" },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="bg-[#1a1a2e] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase text-[#c0392b] mb-3"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Reach Northeast Mississippi
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Advertise with CityRizz
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect your brand with the most engaged local audience in Northeast Mississippi.
            From Starkville to Tupelo, CityRizz readers are active, local, and ready to discover what you offer.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:advertise@cityrizz.com"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              <Mail size={16} />
              Get in Touch
            </a>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 px-8 py-3 border border-white text-white text-sm font-bold hover:bg-white hover:text-[#1a1a2e] transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              View Packages
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[#c0392b] py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-black"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-white/80 mt-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad formats */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-bold text-[#1a1a2e]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Advertising Options
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Multiple formats to fit every budget and goal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adFormats.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 p-6 hover:border-[#c0392b] transition-colors">
                <div className="mb-3">{f.icon}</div>
                <h3
                  className="text-lg font-bold text-[#1a1a2e] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div id="packages" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-bold text-[#1a1a2e]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Advertising Packages
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Transparent pricing. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {adPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`border-2 p-6 flex flex-col ${
                  pkg.highlight
                    ? "border-[#c0392b] shadow-lg relative"
                    : "border-gray-200"
                }`}
              >
                {pkg.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c0392b] text-white text-xs font-bold px-4 py-1 uppercase tracking-wider"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Most Popular
                  </div>
                )}
                <div>
                  <h3
                    className="text-xl font-black text-[#1a1a2e] uppercase"
                    style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.06em" }}
                  >
                    {pkg.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2 mb-3">
                    <span
                      className="text-4xl font-black text-[#c0392b]"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {pkg.price}
                    </span>
                    <span className="text-gray-400 text-sm">{pkg.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#c0392b] mt-0.5 shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto">
                  <a
                    href="mailto:advertise@cityrizz.com"
                    className={`block text-center py-3 text-sm font-bold tracking-wider uppercase transition-colors no-underline ${
                      pkg.highlight
                        ? "bg-[#c0392b] text-white hover:bg-[#a93226]"
                        : "border border-[#1a1a2e] text-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white"
                    }`}
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Get Started
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-xs mt-6">
            Custom packages available for events, political campaigns, and non-profits. Contact us for details.
          </p>
        </div>
      </div>

      {/* Audience section */}
      <div className="py-16 bg-[#1a1a2e] text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase text-[#c0392b] mb-3"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Our Audience
              </p>
              <h2
                className="text-3xl font-bold mb-5"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Who Reads CityRizz?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                CityRizz readers are engaged, local, and community-minded. They're the people who go out to eat,
                attend local events, support small businesses, and care deeply about what's happening in their city.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><span className="text-[#c0392b]">→</span> Ages 25–54 (primary demographic)</li>
                <li className="flex items-center gap-2"><span className="text-[#c0392b]">→</span> Northeast Mississippi residents</li>
                <li className="flex items-center gap-2"><span className="text-[#c0392b]">→</span> College-educated, higher income</li>
                <li className="flex items-center gap-2"><span className="text-[#c0392b]">→</span> Active in local dining, arts, and events</li>
                <li className="flex items-center gap-2"><span className="text-[#c0392b]">→</span> Mobile-first readers (68% mobile)</li>
              </ul>
            </div>
            <div className="space-y-4">
              {[
                { label: "Local Readers", pct: 94 },
                { label: "Return Visitors", pct: 72 },
                { label: "Newsletter Open Rate", pct: 38 },
                { label: "Mobile Traffic", pct: 68 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span style={{ fontFamily: "'Oswald', sans-serif" }}>{item.label}</span>
                    <span>{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#c0392b] rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold text-[#1a1a2e] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Advertise?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Our team will work with you to find the right advertising solution for your budget and goals.
            Reach out today and we'll get back to you within one business day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:advertise@cityrizz.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              <Mail size={16} />
              advertise@cityrizz.com
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-[#1a1a2e] text-[#1a1a2e] text-sm font-bold hover:bg-[#1a1a2e] hover:text-white transition-colors no-underline"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}
            >
              Contact Form
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
