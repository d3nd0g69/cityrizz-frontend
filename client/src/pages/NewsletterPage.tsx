/*
 * CityRizz Newsletter Page
 * Design: Modern City Magazine — crimson accent, Playfair/Oswald/Inter
 * Backend: tRPC newsletter.subscribe endpoint with SendGrid confirmation
 */

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setSubmitted(true);
        toast.success(data.message);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribe.mutate({ email, name: name || undefined, source: "newsletter-page" });
  }

  const newsletters = [
    {
      title: "The Daily Rizz",
      freq: "Every morning",
      desc: "Start your day with the top stories from Northeast Mississippi — news, events, and what's happening in your community.",
      icon: "☀️",
    },
    {
      title: "Food & Drink Weekly",
      freq: "Every Thursday",
      desc: "The best new restaurants, recipes, and food events across Starkville, Columbus, and Tupelo.",
      icon: "🍽️",
    },
    {
      title: "Things To Do",
      freq: "Every Friday",
      desc: "Your weekend guide — concerts, festivals, outdoor adventures, and family-friendly events in NE Mississippi.",
      icon: "🎉",
    },
    {
      title: "Sports Roundup",
      freq: "Every Monday",
      desc: "MSU Bulldogs, local high school sports, and everything on the field, court, and diamond.",
      icon: "🏈",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="bg-[#1a1a2e] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p
            className="text-xs font-bold tracking-widest uppercase text-[#c0392b] mb-3"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Stay Informed
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            CityRizz Newsletters
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            The best of Northeast Mississippi, delivered straight to your inbox. Free, always.
          </p>
        </div>
      </div>

      {/* Signup form */}
      <div className="bg-[#c0392b] py-10">
        <div className="max-w-xl mx-auto px-4 text-center">
          {submitted ? (
            <div className="text-white">
              <p className="text-3xl mb-2" aria-hidden>🎉</p>
              <p className="text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                You're in!
              </p>
              <p className="text-white/80">
                Thanks for subscribing. Check your inbox for a confirmation email from CityRizz.
              </p>
            </div>
          ) : (
            <>
              <p className="text-white font-semibold text-lg mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Subscribe to all newsletters with one click
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="flex-1 px-4 py-3 text-gray-900 text-sm outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-4 py-3 text-gray-900 text-sm outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribe.isPending}
                  className="w-full px-6 py-3 bg-[#1a1a2e] text-white text-sm font-bold tracking-wider uppercase hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {subscribe.isPending ? "Subscribing..." : "Subscribe Free"}
                </button>
              </form>
              <p className="text-white/60 text-xs mt-3">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>

      {/* Newsletter cards */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-2xl font-bold text-[#1a1a2e] mb-8 text-center"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What You'll Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsletters.map((nl) => (
              <div
                key={nl.title}
                className="border border-gray-200 p-6 hover:border-[#c0392b] transition-colors"
              >
                <div className="text-3xl mb-3">{nl.icon}</div>
                <h3
                  className="text-lg font-bold text-[#1a1a2e] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {nl.title}
                </h3>
                <p
                  className="text-xs font-semibold text-[#c0392b] uppercase tracking-wider mb-3"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {nl.freq}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {nl.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
