import { Job } from "./types";

// In-memory store. Resets on cold start / redeploy — fine for a demo/assessment.
// A real production board would swap this for a database (Postgres/Prisma, etc).

const seedJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Northwind Labs",
    location: "Bengaluru",
    remote: true,
    type: "Full-time",
    salary: "₹28L – ₹38L",
    tags: ["React", "TypeScript", "Next.js"],
    description:
      "Own the component architecture for our design system and lead frontend performance initiatives across three product lines.",
    postedAt: "2026-07-01",
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "Harborview Analytics",
    location: "Gurugram",
    remote: false,
    type: "Full-time",
    salary: "₹9L – ₹14L",
    tags: ["SQL", "Power BI", "Python"],
    description:
      "Turn raw transactional data into dashboards and recommendations for the merchandising team. Daily standups with product and ops.",
    postedAt: "2026-06-29",
  },
  {
    id: "3",
    title: "Backend Engineer (Node.js)",
    company: "Ferro Systems",
    location: "Remote",
    remote: true,
    type: "Contract",
    salary: "$45/hr",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    description:
      "6-month contract building out payment reconciliation services. Strong ownership of API design and test coverage expected.",
    postedAt: "2026-06-25",
  },
  {
    id: "4",
    title: "Software Engineering Intern",
    company: "Kestrel & Vine",
    location: "Hyderabad",
    remote: false,
    type: "Internship",
    salary: "₹25,000/mo",
    tags: ["JavaScript", "Git", "REST APIs"],
    description:
      "6-month internship pairing you with a senior engineer on internal tooling. Strong mentorship, real production commits.",
    postedAt: "2026-06-20",
  },
];

// Use a global to survive Next.js hot-reload in dev without duplicating seed data.
const globalForJobs = globalThis as unknown as { __jobs?: Job[] };
export const jobs: Job[] = globalForJobs.__jobs ?? (globalForJobs.__jobs = [...seedJobs]);

export function listJobs(): Job[] {
  return [...jobs].sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
}

export function getJob(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function createJob(input: Omit<Job, "id" | "postedAt">): Job {
  const job: Job = {
    ...input,
    id: crypto.randomUUID(),
    postedAt: new Date().toISOString().slice(0, 10),
  };
  jobs.unshift(job);
  return job;
}

export function deleteJob(id: string): boolean {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return false;
  jobs.splice(idx, 1);
  return true;
}
