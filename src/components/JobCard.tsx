"use client";

import { Job } from "@/lib/types";
import { typeStyles } from "@/lib/theme";
import { useState } from "react";
import { MapPin, Wifi, Calendar, X, ChevronDown } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function JobCard({
  job,
  index,
  onDelete,
}: {
  job: Job;
  index: number;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const styles = typeStyles[job.type];

  return (
    <article
      className="animate-in group relative flex gap-0 overflow-hidden rounded-2xl bg-paper-raised shadow-[0_1px_2px_rgba(32,29,26,0.06)] ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-8px_rgba(32,29,26,0.18)]"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <span className={`w-1.5 shrink-0 ${styles.bar}`} aria-hidden />

      <div className="min-w-0 flex-1 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wide ${styles.bg} ${styles.text}`}
            >
              {job.type}
            </span>
            <button
              onClick={() => setOpen((o) => !o)}
              className="mt-2 block text-left font-display text-xl sm:text-2xl font-semibold leading-snug hover:text-stamp transition-colors cursor-pointer"
            >
              {job.title}
            </button>
            <p className="text-sm font-medium text-ink-soft mt-0.5">{job.company}</p>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono text-sm font-medium text-ink whitespace-nowrap">
              {job.salary}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} strokeWidth={2} />
            {job.location}
          </span>
          {job.remote && (
            <span className="inline-flex items-center gap-1 font-medium text-stamp">
              <Wifi size={13} strokeWidth={2} />
              Remote OK
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} strokeWidth={2} />
            Posted {formatDate(job.postedAt)}
          </span>
        </div>

        {job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-paper px-2.5 py-0.5 text-xs text-ink-soft ring-1 ring-rule"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink-soft hover:text-stamp transition-colors"
        >
          {open ? "Hide details" : "View details"}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="mt-3 space-y-3 border-t border-rule pt-3">
            <p className="text-sm leading-relaxed text-ink-soft max-w-2xl">
              {job.description || "No further details were provided for this listing."}
            </p>
            <button
              onClick={() => {
                setDeleting(true);
                onDelete(job.id);
              }}
              disabled={deleting}
              className="inline-flex items-center gap-1 text-xs text-ink-soft hover:text-red-700 transition-colors disabled:opacity-50"
            >
              <X size={13} />
              {deleting ? "Removing…" : "Withdraw listing"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
