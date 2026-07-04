"use client";

import { useEffect, useMemo, useState } from "react";
import { Job, JobType } from "@/lib/types";
import JobCard from "@/components/JobCard";
import PostForm from "@/components/PostForm";
import { Search, Plus, X } from "lucide-react";

const FILTERS: Array<JobType | "All"> = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const FILTER_ACCENT: Record<(typeof FILTERS)[number], string> = {
  All: "bg-ink text-white border-ink",
  "Full-time": "bg-[var(--full-time)] text-white border-[var(--full-time)]",
  "Part-time": "bg-[var(--part-time)] text-white border-[var(--part-time)]",
  Contract: "bg-[var(--contract)] text-white border-[var(--contract)]",
  Internship: "bg-[var(--internship)] text-white border-[var(--internship)]",
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (filter !== "All" && job.type !== filter) return false;
      if (remoteOnly && !job.remote) return false;
      if (!q) return true;
      const haystack = [job.title, job.company, job.location, ...job.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [jobs, query, filter, remoteOnly]);

  function handleCreated(job: Job) {
    setJobs((prev) => [job, ...prev]);
    setShowForm(false);
  }

  function handleDelete(id: string) {
    fetch(`/api/jobs/${id}`, { method: "DELETE" }).then((res) => {
      if (res.ok) setJobs((prev) => prev.filter((j) => j.id !== id));
    });
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="flex-1 mx-auto w-full max-w-3xl px-5 sm:px-6 py-10 sm:py-14">
      {/* Masthead */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--stamp)] via-[#3A5AA0] to-[#5B4B96] px-6 py-9 sm:py-12 mb-8 text-center shadow-[0_20px_40px_-16px_rgba(47,75,140,0.45)]">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
        <div className="relative flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wide text-white/70 mb-2">
          <span>Est. 2026</span>
          <span>{today}</span>
        </div>
        <h1 className="relative font-display italic font-semibold text-4xl sm:text-6xl text-white drop-shadow-sm">
          The Ledger
        </h1>
        <p className="relative font-mono text-[11px] uppercase tracking-widest text-white/80 mt-3">
          Positions Available &mdash; Read Closely, Apply Directly
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, company, or skill…"
            className="w-full rounded-full bg-paper-raised border border-rule pl-9 pr-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-stamp/40 focus:border-stamp transition-all"
          />
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-full font-mono text-xs uppercase tracking-wide bg-stamp text-white px-5 py-2.5 shadow-md shadow-stamp/20 hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? "Close" : "Post a listing"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full font-mono text-xs uppercase tracking-wide px-3.5 py-1.5 border transition-all ${
              filter === f
                ? `${FILTER_ACCENT[f]} shadow-sm`
                : "bg-paper-raised border-rule text-ink-soft hover:border-stamp hover:text-stamp"
            }`}
          >
            {f}
          </button>
        ))}
        <label className="flex items-center gap-1.5 rounded-full bg-paper-raised border border-rule px-3.5 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft cursor-pointer hover:border-stamp transition-colors ml-1">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
            className="accent-[var(--stamp)]"
          />
          Remote only
        </label>
      </div>

      {showForm && (
        <PostForm onCreated={handleCreated} onClose={() => setShowForm(false)} />
      )}

      {/* Listings */}
      {loading ? (
        <p className="font-mono text-sm text-ink-soft">Loading listings…</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rule bg-paper-raised/50 py-16 text-center">
          <p className="font-display italic text-lg text-ink-soft">
            No listings match that search.
          </p>
          <p className="font-mono text-xs text-ink-soft mt-1">
            Try clearing filters, or be the first to post one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <footer className="mt-10 pt-5 font-mono text-[11px] uppercase tracking-wide text-ink-soft text-center">
        {visible.length} of {jobs.length} listing{jobs.length === 1 ? "" : "s"} shown
      </footer>
    </main>
  );
}
