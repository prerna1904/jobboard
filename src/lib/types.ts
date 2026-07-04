export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: JobType;
  salary: string;
  tags: string[];
  description: string;
  postedAt: string; // ISO date
}
