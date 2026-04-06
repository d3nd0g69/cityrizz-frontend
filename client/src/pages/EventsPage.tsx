/*
 * CityRizz Events Page
 * Design: Modern City Magazine — bold editorial, crimson accent, Playfair/Oswald/Inter
 * Data: Live from tRPC events router backed by MySQL database
 */

import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Clock, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventRecord {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  eventDate: string;
  eventTime: string | null;
  venue: string | null;
  location: string | null;
  category: string | null;
  price: string | null;
  imageUrl: string | null;
  externalUrl: string | null;
  featured: boolean;
  status: string;
}

const EVENT_CATEGORIES = ["All", "Music", "Sports", "Food & Drink", "Arts & Culture", "Things To Do", "Home & Garden"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// ── Featured Event Card ───────────────────────────────────────────────────────

function FeaturedEventCard({ event }: { event: EventRecord }) {
  const fallbackImg = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
  return (
    <div className="relative overflow-hidden group cursor-pointer" style={{ height: "320px" }}>
      <img
        src={event.imageUrl || fallbackImg}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-widest bg-[#c0392b] text-white px-2 py-0.5 mb-2"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {event.category || "Event"}
        </span>
        <h3
          className="text-xl font-bold text-white leading-snug mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-gray-300">
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(event.eventDate)}
          </span>
          {event.eventTime && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {event.eventTime}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {event.venue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Event List Item ───────────────────────────────────────────────────────────

function EventListItem({ event }: { event: EventRecord }) {
  const fallbackImg = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80";
  const dateObj = new Date(event.eventDate + "T12:00:00");

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 group hover:bg-gray-50 -mx-4 px-4 transition-colors">
      {/* Date badge */}
      <div className="shrink-0 w-14 text-center">
        <div
          className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#c0392b] px-1 py-0.5"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {dateObj.toLocaleDateString("en-US", { month: "short" })}
        </div>
        <div
          className="text-2xl font-black text-[#1a1a2e] leading-none py-1"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {dateObj.getDate()}
        </div>
        <div
          className="text-[10px] text-gray-400 uppercase"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
        </div>
      </div>

      {/* Event image */}
      <div className="shrink-0 w-20 h-16 overflow-hidden hidden sm:block">
        <img src={event.imageUrl || fallbackImg} alt={event.title} className="w-full h-full object-cover" />
      </div>

      {/* Event details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider text-[#c0392b]"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {event.category || "Event"}
            </span>
            <h3
              className="text-base font-bold text-[#1a1a2e] leading-snug group-hover:text-[#c0392b] transition-colors"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {event.title}
            </h3>
          </div>
          {event.price && (
            <span
              className="shrink-0 text-xs font-bold text-[#1a1a2e] bg-gray-100 px-2 py-0.5 hidden sm:block"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              {event.price}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
          {event.eventTime && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {event.eventTime}
            </span>
          )}
          {(event.venue || event.location) && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {[event.venue, event.location].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 self-center">
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#c0392b] transition-colors" />
      </div>
    </div>
  );
}

// ── Submit Event Modal ────────────────────────────────────────────────────────

function SubmitEventModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    title: "", date: "", time: "", venue: "", location: "",
    category: "", description: "", price: "", contactName: "", contactEmail: "", url: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.events.submit.useMutation({
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date || !form.venue || !form.contactEmail) {
      toast.error("Please fill in all required fields.");
      return;
    }
    submitMutation.mutate({
      title: form.title,
      eventDate: form.date,
      eventTime: form.time || undefined,
      venue: form.venue,
      location: form.location || undefined,
      category: form.category || undefined,
      description: form.description || undefined,
      price: form.price || undefined,
      externalUrl: form.url || undefined,
      contactName: form.contactName || undefined,
      contactEmail: form.contactEmail,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-black uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Submit an Event
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#1a1a2e] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Event Submitted!
            </h3>
            <p className="text-gray-600 mb-6">
              Thanks for submitting your event. Our team will review it within 24 hours and publish it if it meets our guidelines.
            </p>
            <button onClick={onClose} className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-gray-600 border-l-4 border-[#c0392b] pl-3">
              Submit your event to the CityRizz calendar. Events are reviewed and typically published within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Event Title <span className="text-[#c0392b]">*</span>
                </label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Live Music at The Warehouse"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Date <span className="text-[#c0392b]">*</span>
                </label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Time</label>
                <input name="time" value={form.time} onChange={handleChange} placeholder="e.g. 7:00 PM – 10:00 PM"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Venue <span className="text-[#c0392b]">*</span>
                </label>
                <input name="venue" value={form.venue} onChange={handleChange} required placeholder="e.g. The Warehouse"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>City</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Starkville, MS"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors bg-white">
                  <option value="">Select a category</option>
                  {EVENT_CATEGORIES.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Admission Price</label>
                <input name="price" value={form.price} onChange={handleChange} placeholder="e.g. Free, $10, $15–$25"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Event Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Describe your event in 1–3 sentences..."
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Event Website / Tickets URL</label>
                <input name="url" value={form.url} onChange={handleChange} type="url" placeholder="https://..."
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div className="sm:col-span-2 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>Your Contact Info</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Your Name</label>
                <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Your name"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  Your Email <span className="text-[#c0392b]">*</span>
                </label>
                <input name="contactEmail" value={form.contactEmail} onChange={handleChange} type="email" required placeholder="your@email.com"
                  className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={submitMutation.isPending}
                className="w-full py-3 bg-[#c0392b] text-white text-sm font-bold tracking-wider uppercase hover:bg-[#a93226] transition-colors disabled:opacity-60"
                style={{ fontFamily: "'Oswald', sans-serif" }}>
                {submitMutation.isPending ? "Submitting..." : "Submit Event for Review"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">By submitting, you agree to our event listing guidelines.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Events Page ──────────────────────────────────────────────────────────

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { data: featuredData, isLoading: featuredLoading } = trpc.events.featured.useQuery({ limit: 3 });
  const { data: listData, isLoading: listLoading } = trpc.events.list.useQuery({
    page,
    limit: 20,
    category: activeCategory === "All" ? undefined : activeCategory,
    upcoming: true,
  });

  const featuredEvents = featuredData ?? [];
  const allEvents = listData?.events ?? [];
  const totalPages = listData ? Math.ceil(listData.total / 20) : 1;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page header */}
      <div className="bg-[#1a1a2e] text-white py-10">
        <div className="max-w-[1200px] mx-auto px-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-[#c0392b] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Northeast Mississippi
            </p>
            <h1 className="text-4xl font-black" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.02em", textTransform: "uppercase" }}>
              Events Calendar
            </h1>
          </div>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-[#c0392b] text-white text-xs font-bold hover:bg-[#a93226] transition-colors"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            <Plus size={14} />
            Submit an Event
          </button>
        </div>
      </div>

      {/* Featured events */}
      {(featuredLoading || featuredEvents.length > 0) && (
        <div className="py-8 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-[#c0392b]" />
              <h2 className="text-lg font-bold text-[#1a1a2e] uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Featured Events
              </h2>
            </div>
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 animate-pulse" style={{ height: "320px" }} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredEvents.map(event => (
                  <FeaturedEventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Events list */}
      <div className="py-8">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main list */}
            <div className="lg:col-span-2">
              {/* Category filter tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {EVENT_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                    className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeCategory === cat
                        ? "bg-[#c0392b] text-white"
                        : "border border-gray-200 text-gray-600 hover:border-[#c0392b] hover:text-[#c0392b]"
                    }`}
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Events list */}
              {listLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin text-[#c0392b]" />
                </div>
              ) : allEvents.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Calendar size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No upcoming events in this category.</p>
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="mt-4 px-4 py-2 text-xs font-bold text-[#c0392b] border border-[#c0392b] hover:bg-[#c0392b] hover:text-white transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Submit an Event
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    {allEvents.map(event => (
                      <EventListItem key={event.id} event={event} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Page {page} of {totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          ← Previous
                        </button>
                        <button
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-4 py-2 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Submit event CTA */}
              <div className="bg-[#1a1a2e] text-white p-6 mb-6">
                <h3 className="text-lg font-black uppercase mb-2" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em" }}>
                  Have an Event?
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Submit your event to the CityRizz calendar. It's free and reaches thousands of local readers.
                </p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  <Plus size={14} />
                  Submit an Event
                </button>
              </div>

              {/* Newsletter signup */}
              <div className="border border-gray-200 p-5">
                <h3 className="text-base font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Get Events in Your Inbox
                </h3>
                <p className="text-gray-500 text-xs mb-4 leading-relaxed">
                  Subscribe to the Things To Do newsletter — your weekly guide to events in Northeast Mississippi.
                </p>
                <Link
                  href="/newsletter"
                  className="block text-center py-2.5 bg-[#c0392b] text-white text-xs font-bold no-underline hover:bg-[#a93226] transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  Subscribe Free
                </Link>
              </div>

              {/* Upcoming sidebar list */}
              {allEvents.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-5 bg-[#c0392b]" />
                    <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                      Coming Up
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {allEvents.slice(0, 5).map(event => {
                      const d = new Date(event.eventDate + "T12:00:00");
                      return (
                        <div key={event.id} className="flex gap-3 group cursor-pointer">
                          <div className="shrink-0 w-10 text-center">
                            <div className="text-[9px] font-bold uppercase bg-[#c0392b] text-white px-1 py-0.5" style={{ fontFamily: "'Oswald', sans-serif" }}>
                              {d.toLocaleDateString("en-US", { month: "short" })}
                            </div>
                            <div className="text-xl font-black text-[#1a1a2e] leading-none py-0.5" style={{ fontFamily: "'Oswald', sans-serif" }}>
                              {d.getDate()}
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a1a2e] leading-snug group-hover:text-[#c0392b] transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500">{event.venue}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSubmitModal && <SubmitEventModal onClose={() => setShowSubmitModal(false)} />}

      <Footer />
    </div>
  );
}
