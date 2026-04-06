/*
 * CityRizz Admin — Subscriber, Campaign & Events Dashboard
 * Route: /admin/subscribers (protected: admin only)
 * Tabs:
 *   1. Subscribers — list, search, filter, export CSV, stats
 *   2. Send Campaign — compose, preview, test email, send to all active subscribers
 *   3. Campaign History — list of sent campaigns with stats
 *   4. Events — approve/reject pending community-submitted events
 */

import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Download, Search, Users, UserCheck, UserX, RefreshCw,
  ArrowLeft, Send, History, Mail, Eye, X, CheckCircle, AlertCircle,
  Calendar, Check, XCircle, Clock, MapPin, ExternalLink,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// ── Shared stat card ──────────────────────────────────────────────────────────

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

// ── Tab: Subscribers ──────────────────────────────────────────────────────────

function SubscribersTab() {
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

  const exportQuery = trpc.newsletter.adminExport.useQuery(undefined, { enabled: false });

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

  const totalPages = listData ? Math.ceil(listData.total / 50) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#1a1a2e]" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Newsletter Subscribers
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={() => { refetch(); refetchStats(); }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-[#1a1a2e] transition-colors" title="Refresh">
            <RefreshCw size={14} />
            Refresh
          </button>
          <button onClick={handleExport} disabled={exportQuery.isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white text-sm font-bold hover:bg-black transition-colors disabled:opacity-60"
            style={{ fontFamily: "'Oswald', sans-serif" }}>
            <Download size={14} />
            {exportQuery.isFetching ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users size={20} className="text-white" />} label="Total Subscribers" value={stats?.total ?? "—"} color="bg-[#1a1a2e]" />
        <StatCard icon={<UserCheck size={20} className="text-white" />} label="Active" value={stats?.active ?? "—"} color="bg-[#27ae60]" />
        <StatCard icon={<UserX size={20} className="text-white" />} label="Unsubscribed" value={stats?.unsubscribed ?? "—"} color="bg-[#c0392b]" />
      </div>

      <div className="bg-white border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1 flex items-center border border-gray-200 px-3">
            <Search size={14} className="text-gray-400 mr-2 shrink-0" />
            <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by email or name..." className="flex-1 py-2 text-sm outline-none" />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#1a1a2e] text-white text-sm font-bold" style={{ fontFamily: "'Oswald', sans-serif" }}>
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-3 py-2 border border-gray-200 text-sm text-gray-500 hover:text-[#c0392b]">
              Clear
            </button>
          )}
        </form>
        <div className="flex gap-1">
          {(["all", "active", "unsubscribed"] as const).map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s ? "bg-[#c0392b] text-white" : "border border-gray-200 text-gray-600 hover:border-[#c0392b] hover:text-[#c0392b]"
              }`} style={{ fontFamily: "'Oswald', sans-serif" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

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
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase rounded-sm ${sub.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          style={{ fontFamily: "'Oswald', sans-serif" }}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{sub.source || "—"}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                        {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, listData.total)} of {listData.total}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed">
                    ← Prev
                  </button>
                  <span className="px-3 py-1.5 text-xs text-gray-600">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1.5 border border-gray-200 text-xs text-gray-600 hover:border-[#1a1a2e] disabled:opacity-40 disabled:cursor-not-allowed">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Preview Modal ─────────────────────────────────────────────────────────────

function PreviewModal({ subject, bodyHtml, onClose }: { subject: string; bodyHtml: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5" style={{ fontFamily: "'Oswald', sans-serif" }}>Preview</p>
            <h2 className="text-base font-bold">{subject}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="border border-gray-200 p-4 bg-gray-50 text-xs text-gray-500 mb-4">
            <strong>From:</strong> CityRizz &lt;hello@cityrizz.com&gt;<br />
            <strong>Subject:</strong> {subject}
          </div>
          <div
            className="prose max-w-none text-sm"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Tab: Send Campaign ────────────────────────────────────────────────────────

function SendCampaignTab() {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    subject: "",
    previewText: "",
    bodyHtml: "",
    bodyText: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; failed: number; message: string } | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [showTestInput, setShowTestInput] = useState(false);
  const [savedCampaignId, setSavedCampaignId] = useState<number | null>(null);

  const { data: stats } = trpc.newsletter.adminStats.useQuery();

  const createMutation = trpc.campaigns.create.useMutation({
    onSuccess: (data) => {
      setSavedCampaignId(data.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save campaign");
    },
  });

  const createAndSendMutation = trpc.campaigns.create.useMutation({
    onSuccess: async (data) => {
      sendMutation.mutate({ campaignId: data.id });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create campaign");
    },
  });

  const sendMutation = trpc.campaigns.send.useMutation({
    onSuccess: (data) => {
      setSendResult({ sent: data.sent ?? 0, failed: data.failed ?? 0, message: data.message ?? "" });
      utils.campaigns.list.invalidate();
      toast.success(data.message ?? "Campaign sent!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send campaign");
    },
  });

  const sendTestMutation = trpc.campaigns.sendTest.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setShowTestInput(false);
      } else {
        toast.error(data.message);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send test email");
    },
  });

  const isSending = createAndSendMutation.isPending || sendMutation.isPending;
  const isSendingTest = createMutation.isPending || sendTestMutation.isPending;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset saved campaign ID when form changes (need to re-save)
    setSavedCampaignId(null);
  }

  async function handleSendTest() {
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    if (!form.bodyHtml.trim()) { toast.error("Email body is required"); return; }
    if (!testEmail.trim()) { toast.error("Test email address is required"); return; }

    // Save the campaign first if not already saved
    if (savedCampaignId) {
      sendTestMutation.mutate({ campaignId: savedCampaignId, testEmail });
    } else {
      createMutation.mutate(
        { subject: form.subject, previewText: form.previewText || undefined, bodyHtml: form.bodyHtml, bodyText: form.bodyText || undefined },
        {
          onSuccess: (data) => {
            setSavedCampaignId(data.id);
            sendTestMutation.mutate({ campaignId: data.id, testEmail });
          },
        }
      );
    }
  }

  function handleSend() {
    if (!form.subject.trim()) { toast.error("Subject is required"); return; }
    if (!form.bodyHtml.trim()) { toast.error("Email body is required"); return; }
    createAndSendMutation.mutate({
      subject: form.subject,
      previewText: form.previewText || undefined,
      bodyHtml: form.bodyHtml,
      bodyText: form.bodyText || undefined,
    });
  }

  if (sendResult) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${sendResult.failed === 0 ? "bg-green-100" : "bg-yellow-100"}`}>
          {sendResult.failed === 0
            ? <CheckCircle size={32} className="text-green-600" />
            : <AlertCircle size={32} className="text-yellow-600" />}
        </div>
        <h2 className="text-2xl font-black text-[#1a1a2e] mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>
          Campaign Sent!
        </h2>
        <p className="text-gray-600 mb-2">{sendResult.message}</p>
        {sendResult.failed > 0 && (
          <p className="text-sm text-yellow-600">{sendResult.failed} delivery failures — check SendGrid logs for details.</p>
        )}
        <button
          onClick={() => { setSendResult(null); setForm({ subject: "", previewText: "", bodyHtml: "", bodyText: "" }); setSavedCampaignId(null); }}
          className="mt-6 px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          Send Another Campaign
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#1a1a2e]" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Send Email Campaign
        </h2>
        {stats && (
          <div className="text-sm text-gray-500">
            Sending to <strong className="text-[#1a1a2e]">{stats.active}</strong> active subscriber{stats.active !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Subject Line <span className="text-[#c0392b]">*</span>
              </label>
              <input name="subject" value={form.subject} onChange={handleChange}
                placeholder="e.g. This Week in Northeast Mississippi 🎶"
                className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Preview Text
                <span className="text-gray-400 font-normal normal-case ml-1">(shown in inbox preview)</span>
              </label>
              <input name="previewText" value={form.previewText} onChange={handleChange}
                placeholder="Short teaser shown after the subject line in most email clients..."
                className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Email Body (HTML) <span className="text-[#c0392b]">*</span>
              </label>
              <textarea name="bodyHtml" value={form.bodyHtml} onChange={handleChange} rows={16}
                placeholder={`<h1>Hello from CityRizz!</h1>\n<p>Here's what's happening in Northeast Mississippi this week...</p>\n<p>Check out our <a href="https://cityrizz.com/events">Events Calendar</a> for more.</p>`}
                className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors font-mono resize-y" />
              <p className="text-xs text-gray-400 mt-1">Enter valid HTML. Use inline styles for best email client compatibility.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Plain Text Version
                <span className="text-gray-400 font-normal normal-case ml-1">(optional fallback)</span>
              </label>
              <textarea name="bodyText" value={form.bodyText} onChange={handleChange} rows={4}
                placeholder="Plain text version for email clients that don't support HTML..."
                className="w-full border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#c0392b] transition-colors resize-y" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreview(true)}
              disabled={!form.subject || !form.bodyHtml}
              className="flex items-center gap-2 px-5 py-3 border border-[#1a1a2e] text-[#1a1a2e] text-sm font-bold hover:bg-[#1a1a2e] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              <Eye size={14} />
              Preview
            </button>

            {/* Send Test Email */}
            <div className="relative">
              {showTestInput ? (
                <div className="flex items-center gap-2 bg-white border border-[#c0392b] px-3 py-2">
                  <Mail size={14} className="text-[#c0392b] shrink-0" />
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="text-sm outline-none w-44"
                    onKeyDown={(e) => e.key === "Enter" && handleSendTest()}
                    autoFocus
                  />
                  <button
                    onClick={handleSendTest}
                    disabled={isSendingTest || !testEmail}
                    className="px-3 py-1 bg-[#c0392b] text-white text-xs font-bold disabled:opacity-60"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    {isSendingTest ? "Sending..." : "Send"}
                  </button>
                  <button onClick={() => setShowTestInput(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTestInput(true)}
                  disabled={!form.subject || !form.bodyHtml}
                  className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-600 text-sm font-bold hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  <Mail size={14} />
                  Send Test Email
                </button>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={isSending || !form.subject || !form.bodyHtml}
              className="flex items-center gap-2 px-6 py-3 bg-[#c0392b] text-white text-sm font-bold hover:bg-[#a93226] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              <Send size={14} />
              {isSending ? "Sending..." : `Send to ${stats?.active ?? "..."} Subscribers`}
            </button>
          </div>
        </div>

        {/* Tips sidebar */}
        <div className="space-y-4">
          <div className="bg-[#1a1a2e] text-white p-5">
            <h3 className="text-sm font-black uppercase mb-3" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Before You Send
            </h3>
            <ul className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <li>✓ Preview the email to check formatting</li>
              <li>✓ Send a test to your own inbox first</li>
              <li>✓ Subject line is compelling (40–60 chars)</li>
              <li>✓ Preview text adds context</li>
              <li>✓ Unsubscribe link is included in your HTML</li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Unsubscribe Link Template
            </h3>
            <p className="text-xs text-gray-500 mb-2">Add this to your HTML footer:</p>
            <code className="block text-xs bg-gray-50 border border-gray-200 p-2 text-gray-600 break-all leading-relaxed">
              {`<a href="https://cityrizz.com/unsubscribe?token={{token}}">Unsubscribe</a>`}
            </code>
            <p className="text-xs text-gray-400 mt-2">Note: Dynamic unsubscribe tokens require per-recipient personalization via SendGrid templates.</p>
          </div>

          <div className="bg-white border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-[#1a1a2e] mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Sending Limits
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              SendGrid Free tier: 100 emails/day. Upgrade your SendGrid plan for higher volume sends.
            </p>
          </div>
        </div>
      </div>

      {showPreview && form.bodyHtml && (
        <PreviewModal subject={form.subject} bodyHtml={form.bodyHtml} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// ── Tab: Campaign History ─────────────────────────────────────────────────────

function CampaignHistoryTab() {
  const { data: campaigns, isLoading } = trpc.campaigns.list.useQuery();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#1a1a2e]" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          Campaign History
        </h2>
        <span className="text-sm text-gray-500">{campaigns?.length ?? 0} campaign{campaigns?.length !== 1 ? "s" : ""}</span>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !campaigns?.length ? (
        <div className="py-16 text-center text-gray-400">
          <History size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No campaigns sent yet.</p>
          <p className="text-xs mt-1">Use the "Send Campaign" tab to send your first email.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell" style={{ fontFamily: "'Oswald', sans-serif" }}>Recipients</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell" style={{ fontFamily: "'Oswald', sans-serif" }}>Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#1a1a2e]">{c.subject}</div>
                      {c.previewText && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{c.previewText}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase rounded-sm ${c.status === "sent" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                      {c.status === "sent" ? (
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-gray-400" />
                          {c.recipientCount?.toLocaleString() ?? 0}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">
                      {c.sentAt ? new Date(c.sentAt).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Events Approval ──────────────────────────────────────────────────────

function EventsApprovalTab() {
  const utils = trpc.useUtils();
  const [statusFilter, setStatusFilter] = useState<"pending" | "published" | "rejected" | "all">("pending");

  const { data: eventsData, isLoading, refetch } = trpc.events.adminList.useQuery({
    page: 1,
    limit: 100,
    status: statusFilter,
  });

  const [pendingAction, setPendingAction] = useState<{ id: number; title: string; status: string } | null>(null);

  const updateStatusMutation = trpc.events.adminUpdateStatus.useMutation({
    onSuccess: () => {
      utils.events.adminList.invalidate();
      refetch();
      if (pendingAction) {
        if (pendingAction.status === "published") {
          toast.success(`"${pendingAction.title}" approved and published`);
        } else if (pendingAction.status === "rejected") {
          toast.success(`"${pendingAction.title}" unpublished/rejected`);
        }
        setPendingAction(null);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update event status");
      setPendingAction(null);
    },
  });

  function handleApprove(id: number, title: string) {
    setPendingAction({ id, title, status: "published" });
    updateStatusMutation.mutate({ id, status: "published" });
  }

  function handleReject(id: number, title: string) {
    setPendingAction({ id, title, status: "rejected" });
    updateStatusMutation.mutate({ id, status: "rejected" });
  }

  const pendingCount = eventsData?.events.filter(e => e.status === "pending").length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-[#1a1a2e]" style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Events
          </h2>
          {statusFilter === "pending" && pendingCount > 0 && (
            <span className="px-2 py-0.5 bg-[#c0392b] text-white text-xs font-bold rounded-full">
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 text-sm hover:border-[#1a1a2e] transition-colors">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["pending", "published", "rejected", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-4 border text-left transition-colors ${
              statusFilter === s
                ? s === "pending" ? "border-[#c0392b] bg-red-50"
                  : s === "published" ? "border-[#27ae60] bg-green-50"
                  : s === "rejected" ? "border-gray-400 bg-gray-50"
                  : "border-[#1a1a2e] bg-[#1a1a2e]/5"
                : "border-gray-200 bg-white hover:border-gray-400"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {s === "pending" && <Clock size={14} className={statusFilter === s ? "text-[#c0392b]" : "text-gray-400"} />}
              {s === "published" && <Check size={14} className={statusFilter === s ? "text-[#27ae60]" : "text-gray-400"} />}
              {s === "rejected" && <XCircle size={14} className={statusFilter === s ? "text-gray-600" : "text-gray-400"} />}
              {s === "all" && <Calendar size={14} className={statusFilter === s ? "text-[#1a1a2e]" : "text-gray-400"} />}
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500" style={{ fontFamily: "'Oswald', sans-serif" }}>
                {s}
              </span>
            </div>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !eventsData?.events.length ? (
        <div className="py-16 text-center text-gray-400">
          <Calendar size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {statusFilter === "all" ? "" : statusFilter} events found.</p>
          {statusFilter === "pending" && (
            <p className="text-xs mt-1">Community-submitted events will appear here for review.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {eventsData.events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-bold uppercase rounded-sm ${
                      event.status === "published" ? "bg-green-100 text-green-700"
                      : event.status === "pending" ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                    }`} style={{ fontFamily: "'Oswald', sans-serif" }}>
                      {event.status}
                    </span>
                    {event.category && (
                      <span className="text-xs text-gray-400 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {event.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-[#1a1a2e] text-base mb-1">{event.title}</h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {event.eventDate}{event.eventTime ? ` · ${event.eventTime}` : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {event.venue}{event.location ? `, ${event.location}` : ""}
                    </span>
                    {event.price && <span>{event.price}</span>}
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                    {event.contactName && <span>Contact: {event.contactName}</span>}
                    {event.contactEmail && <span>{event.contactEmail}</span>}
                    {event.externalUrl && (
                      <a href={event.externalUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#c0392b] hover:underline">
                        <ExternalLink size={10} />
                        Event URL
                      </a>
                    )}
                  </div>
                </div>

                {/* Action buttons — only show for pending events */}
                {event.status === "pending" && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(event.id, event.title)}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#27ae60] text-white text-xs font-bold hover:bg-[#219a52] transition-colors disabled:opacity-60"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <Check size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(event.id, event.title)}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 text-xs font-bold hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-60"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                )}

                {/* Re-publish rejected events */}
                {event.status === "rejected" && (
                  <button
                    onClick={() => handleApprove(event.id, event.title)}
                    disabled={updateStatusMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#27ae60] text-[#27ae60] text-xs font-bold hover:bg-[#27ae60] hover:text-white transition-colors disabled:opacity-60 shrink-0"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    <Check size={12} />
                    Publish
                  </button>
                )}

                {/* Un-publish published events */}
                {event.status === "published" && (
                  <button
                    onClick={() => handleReject(event.id, event.title)}
                    disabled={updateStatusMutation.isPending}
                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-500 text-xs font-bold hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-60 shrink-0"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    <XCircle size={12} />
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

type AdminTab = "subscribers" | "send-campaign" | "history" | "events";

export default function AdminSubscribersPage() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("subscribers");

  // Check for pending events to show badge
  const { data: pendingEvents } = trpc.events.adminList.useQuery(
    { page: 1, limit: 100, status: "pending" },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const pendingCount = pendingEvents?.events.length ?? 0;

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

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "subscribers", label: "Subscribers", icon: <Users size={14} /> },
    { id: "send-campaign", label: "Send Campaign", icon: <Send size={14} /> },
    { id: "history", label: "Campaign History", icon: <History size={14} /> },
    { id: "events", label: "Events", icon: <Calendar size={14} />, badge: pendingCount },
  ];

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

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#c0392b] text-[#c0392b]"
                    : "border-transparent text-gray-500 hover:text-[#1a1a2e] hover:border-gray-300"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                {tab.icon}
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-[#c0392b] text-white text-xs font-bold rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "subscribers" && <SubscribersTab />}
        {activeTab === "send-campaign" && <SendCampaignTab />}
        {activeTab === "history" && <CampaignHistoryTab />}
        {activeTab === "events" && <EventsApprovalTab />}
      </div>
    </div>
  );
}
