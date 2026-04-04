/*
 * CityRizz About Page
 */

import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const team = [
  { name: "Marcus Webb", role: "Senior Staff Writer", beat: "City Hall & Development", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Sofia Reyes", role: "Arts & Culture Editor", beat: "Arts, Music & Nightlife", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { name: "James Thornton", role: "Food & Dining Critic", beat: "Restaurants & Food", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  { name: "Derek Haines", role: "Sports Reporter", beat: "Local & Pro Sports", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "Dr. Priya Nair", role: "Contributing Columnist", beat: "Urban Policy & Opinion", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
  { name: "Amara Johnson", role: "Events & Lifestyle Editor", beat: "Things To Do", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <div className="bg-[#1a1a2e] py-16 text-white text-center">
        <div className="container">
          <p
            className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-3"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            About Us
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your City, Your Stories
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            CityRizz was born with a simple idea: every city deserves an independent voice to tell the stories of its communities.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 pb-2 border-b-2 border-[#c0392b] inline-block">
            <h2
              className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Our Mission
            </h2>
          </div>
          <h2
            className="text-2xl font-bold text-[#1a1a2e] mt-4 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Independent Journalism That Serves the Community
          </h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>
              CityRizz is a free, independent digital news magazine covering local news, arts and culture, food and drink, music, politics, and everything in between. We believe that strong local journalism is the foundation of a healthy community.
            </p>
            <p>
              We are not owned by a hedge fund, a national media conglomerate, or a political organization. We answer only to our readers and our community. Our reporters live in the neighborhoods they cover, eat at the restaurants they review, and attend the shows they write about.
            </p>
            <p>
              CityRizz is free to read, always. We sustain our work through advertising, events, and the generous support of readers who believe in what we do.
            </p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-50 py-16">
        <div className="container">
          <div className="text-center mb-10">
            <div className="mb-4 pb-2 border-b-2 border-[#c0392b] inline-block">
              <h2
                className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Our Team
              </h2>
            </div>
            <h2
              className="text-3xl font-bold text-[#1a1a2e] mt-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              The People Behind the Stories
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white p-5 flex gap-4 items-start shadow-sm">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-14 h-14 object-cover rounded-full shrink-0"
                />
                <div>
                  <h3
                    className="font-bold text-[#1a1a2e]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#c0392b] mt-0.5" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{member.beat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container py-16 text-center">
        <h2
          className="text-2xl font-bold text-[#1a1a2e] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Want to Get in Touch?
        </h2>
        <p className="text-gray-500 mb-6">Tips, story ideas, advertising inquiries, or just to say hello.</p>
        <Link
          href="/contact"
          className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors no-underline"
          style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          Contact Us
        </Link>
      </div>

      <Footer />
    </div>
  );
}
