/*
 * CityRizz Unsubscribe Page
 * Handles unsubscribe links from emails: /unsubscribe?token=xxx
 */

import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function UnsubscribePage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

  const { data: status, isLoading: statusLoading } = trpc.newsletter.getStatus.useQuery(
    { token },
    { enabled: !!token }
  );

  const unsubscribe = trpc.newsletter.unsubscribe.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setDone(true);
        setEmail(data.email || "");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong.");
    },
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-8">This unsubscribe link is invalid or has expired.</p>
          <Link href="/newsletter" className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold no-underline hover:bg-[#a93226] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Manage Subscriptions
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="py-24 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!status?.found) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Link Not Found
          </h1>
          <p className="text-gray-600 mb-8">We couldn't find a subscription matching this link.</p>
          <Link href="/" className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold no-underline hover:bg-[#a93226] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        {done || status.status === "unsubscribed" ? (
          <>
            <div className="text-5xl mb-6">✓</div>
            <h1
              className="text-3xl font-bold text-[#1a1a2e] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              You've been unsubscribed
            </h1>
            <p className="text-gray-600 mb-2">
              <strong>{email || status.email}</strong> has been removed from all CityRizz newsletters.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              We're sorry to see you go. You can re-subscribe anytime.
            </p>
            <Link
              href="/newsletter"
              className="inline-block px-6 py-3 border-2 border-[#1a1a2e] text-[#1a1a2e] text-sm font-bold no-underline hover:bg-[#1a1a2e] hover:text-white transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              Re-subscribe
            </Link>
          </>
        ) : (
          <>
            <h1
              className="text-3xl font-bold text-[#1a1a2e] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Unsubscribe from CityRizz
            </h1>
            <p className="text-gray-600 mb-2">
              Are you sure you want to unsubscribe <strong>{status.email}</strong> from all CityRizz newsletters?
            </p>
            <p className="text-gray-500 text-sm mb-8">You won't receive any more emails from us.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => unsubscribe.mutate({ token })}
                disabled={unsubscribe.isPending}
                className="px-8 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors disabled:opacity-60"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                {unsubscribe.isPending ? "Processing..." : "Yes, Unsubscribe Me"}
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#1a1a2e] text-[#1a1a2e] text-sm font-bold no-underline hover:bg-[#1a1a2e] hover:text-white transition-colors"
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >
                Cancel
              </Link>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
