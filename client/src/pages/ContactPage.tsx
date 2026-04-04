/*
 * CityRizz Contact Page
 */

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="bg-[#1a1a2e] py-12 text-white text-center">
        <div className="container">
          <p
            className="text-xs font-bold uppercase tracking-widest text-[#c0392b] mb-2"
            style={{ fontFamily: "'Oswald', sans-serif" }}
          >
            Get In Touch
          </p>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact CityRizz
          </h1>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <div className="mb-4 pb-2 border-b-2 border-[#c0392b] inline-block">
                <h2
                  className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Contact Info
                </h2>
              </div>
            </div>
            {[
              { icon: Mail, label: "Editorial", value: "news@cityrizz.com" },
              { icon: Mail, label: "Advertising", value: "ads@cityrizz.com" },
              { icon: Phone, label: "Phone", value: "(555) 123-4567" },
              { icon: MapPin, label: "Address", value: "123 Main Street, Suite 400\nYour City, ST 00000" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 bg-[#c0392b] flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    {label}
                  </p>
                  <p className="text-sm text-[#1a1a2e] mt-0.5 whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-gray-50 border-l-4 border-[#c0392b]">
              <h3 className="font-bold text-[#1a1a2e] text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Got a news tip?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We take tips seriously. All submissions are kept confidential. Reach us securely at <strong>tips@cityrizz.com</strong>.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <div className="mb-4 pb-2 border-b-2 border-[#c0392b] inline-block">
              <h2
                className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                Send a Message
              </h2>
            </div>

            {submitted ? (
              <div className="mt-6 p-8 bg-green-50 border border-green-200 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={20} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm">We'll get back to you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#1a1a2e] outline-none focus:border-[#c0392b] transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#1a1a2e] outline-none focus:border-[#c0392b] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Subject *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#1a1a2e] outline-none focus:border-[#c0392b] transition-colors"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 text-sm text-[#1a1a2e] outline-none focus:border-[#c0392b] transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
