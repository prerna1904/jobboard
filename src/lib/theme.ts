import { JobType } from "./types";

export const typeStyles: Record<
  JobType,
  { text: string; bg: string; bar: string }
> = {
  "Full-time": { text: "text-[var(--full-time)]", bg: "bg-[var(--full-time-soft)]", bar: "bg-[var(--full-time)]" },
  "Part-time": { text: "text-[var(--part-time)]", bg: "bg-[var(--part-time-soft)]", bar: "bg-[var(--part-time)]" },
  Contract: { text: "text-[var(--contract)]", bg: "bg-[var(--contract-soft)]", bar: "bg-[var(--contract)]" },
  Internship: { text: "text-[var(--internship)]", bg: "bg-[var(--internship-soft)]", bar: "bg-[var(--internship)]" },
};
