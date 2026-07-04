import { NextRequest, NextResponse } from "next/server";
import { listJobs, createJob } from "@/lib/store";
import { JobType } from "@/lib/types";

export async function GET() {
  return NextResponse.json(listJobs());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = String(body.title ?? "").trim();
  const company = String(body.company ?? "").trim();
  const location = String(body.location ?? "").trim();

  if (!title || !company || !location) {
    return NextResponse.json(
      { error: "title, company, and location are required." },
      { status: 400 }
    );
  }

  const job = createJob({
    title,
    company,
    location,
    remote: Boolean(body.remote),
    type: (body.type as JobType) ?? "Full-time",
    salary: String(body.salary ?? "").trim() || "Not disclosed",
    tags: Array.isArray(body.tags)
      ? body.tags.map(String).filter(Boolean)
      : String(body.tags ?? "")
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
    description: String(body.description ?? "").trim(),
  });

  return NextResponse.json(job, { status: 201 });
}
