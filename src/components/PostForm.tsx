"use client";

import { useState } from "react";
import { Job, JobType } from "@/lib/types";

const TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Internship"];

export default function PostForm({
  onCreated,
  onClose,
}: {
  onCreated: (job: Job) => void;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      company: form.get("company"),
      location: form.get("location"),
      remote: form.get("remote") === "on",
      type: form.get("type"),
      salary: form.get("salary"),
      tags: form.get("tags"),
      description: form.get("description"),
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Could not post the listing.");
      }
      const job: Job = await res.json();
      onCreated(job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-rule bg-paper px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-stamp/40 focus:border-stamp transition-all";
  const labelClass =
    "block font-mono text-xs uppercase tracking-wide text-ink-soft mb-1.5";

  return (
    <div className="animate-in rounded-2xl bg-paper-raised ring-1 ring-black/5 shadow-[0_12px_24px_-12px_rgba(32,29,26,0.2)] p-5 sm:p-7 mb-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl italic">New listing</h2>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs text-ink-soft hover:text-stamp"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input name="title" required className={inputClass} placeholder="Data Analyst" />
          </div>
          <div>
            <label className={labelClass}>Company *</label>
            <input name="company" required className={inputClass} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input name="location" required className={inputClass} placeholder="Delhi NCR" />
          </div>
          <div>
            <label className={labelClass}>Salary</label>
            <input name="salary" className={inputClass} placeholder="₹10L – ₹15L" />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select name="type" className={inputClass}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tags</label>
            <input name="tags" className={inputClass} placeholder="SQL, Python, Power BI" />
          </div>
        </div>

        <label className="flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-wide text-ink-soft">
          <input type="checkbox" name="remote" className="accent-[var(--stamp)]" />
          Remote OK
        </label>

        <div className="mt-4">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={3}
            className={inputClass}
            placeholder="What the role actually involves, day to day."
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 rounded-full bg-stamp text-white font-mono text-xs uppercase tracking-wide px-6 py-2.5 shadow-md shadow-stamp/20 hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? "Posting…" : "Post listing"}
        </button>
      </form>
    </div>
  );
}
