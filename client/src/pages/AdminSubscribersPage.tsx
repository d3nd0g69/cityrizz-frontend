/*
 * CityRizz Admin — Subscriber Dashboard
 * Route: /admin/subscribers (protected: admin only)
 * Features: list, search, filter, export CSV, stats
 */

import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Download, Search, Users, UserCheck, UserX, RefreshCw, ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <div className="text-2xl font-black text-[#1a1a2e]" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {value}
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function AdminSubscribersPage() {
  const { user, isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");

  const { data: stats, refetch: refetchStats } = trpc.newsletter.adminStats.useQuery();
  const { data: listData, isLoading, refetch } = trpc.newsletter.adminList.useQuery({
    page,
    limit: 50,
    search: search || undefined,
    status: statusFilter,
  });

  const exportQuery = trpc.newsletter.adminExport.useQuery(undefined, {
    enabled: false,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleExport() {
    exportQuery.refetch().then(({ data }) => {
      if (!data) return;
      const blob = new Blob([data.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cityrizz-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${data.count} subscribers`);
    });
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need admin access to view this page.</p>
          <Link href="/" className="px-6 py-3 bg-[#c0392b] text-white text-sm font-bold no-underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = listData ? Math.ceil(listData.total / 50) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-[#1a1a2e] text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white no-underline flex items-center gap-2 text-sm">
            <ArrowLeft size={16} />
            Back to Site
          </Link>
          <span className="text-gray-600">|</span>
          <div className="flex items-baseline gap-1">
            <span className="font-black text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>City</span>
            <span className="font-black text-xl text-[#c0392b]" style={{ fontFamily: "'Playfair Display', serif" }}>Rizz</span>
            <span className="text-gray-400 text-sm ml-2">Admin</span>
          </div>
        </div>
        <span className="text-xs text-gray-400">{user?.name}</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-black text-[#1a1a2e]"
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Newsletter Subscribers
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { refetch(); refetchStats(); }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-[#1a1a2e] transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exportQuery.isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white text-sm font-bold hover:bg-black transition-colors disabled:opacity-60"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              <Download size={14} />
              {exportQuery.isFetching ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users size={20} className="text-white" />}
            label="Total Subscribers"
            value={stats?.total ?? "—"}
            color="bg-[#1a1a2e]"
          />
          <StatCard
            icon={<UserCheck size={20} className="text-white" />}
            label="Active"
            value={stats?.active ?? "—"}
            color="bg-[#27ae60]"
          />
          <StatCard
            icon={<UserX size={20} className="text-white" />}
            label="Unsubscribed"
            value={stats?.unsubscribed ?? "—"}
            color="bg-[#c0392b]"
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center border border-gray-200 px-3">
              <Search size={14} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by email or name..."
                className="flex-1 py-2 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1a1a2e] text-white text-sm font-bold"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                className="px-3 py-2 border border-gray-200 text-sm text-gray-500 hover:text-[#c0392b]"
              >
                Clear
              </button>
            )}
          </form>

          <div className="flex gap-1">
            {(["all", "active", "unsubscribed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === s
                    ? "bg-[#c0392b] text-white"
                    : "border border-gray-200 text-gray-600 hover:border-[#c0392b] hover:text-[#c0392b]"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !listData?.subscribers.length ? (
            <div className="py-16 text-center text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No subscribers found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Email</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell" style={{ fontFamily: "'Oswald', sans-serif" }}>Name</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Status</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: "'Oswald', sans-serif" }}>Source</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell" style={{ fontFamily: "'Oswald', sans-serif" }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listData.subscribers.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-[#1a1a2e] font-medium">{sub.email}</td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{sub.name || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase rounded-sm ${
                              sub.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{sub.source || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                          {sub.createdAt
                            ? new Date(sub.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, listData.total)} of {listData.total}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <span className="px-3 py-1.5 text-xs text-gray-600">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
