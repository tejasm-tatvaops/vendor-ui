import { Briefcase } from "lucide-react";
import { cardClassName } from "./ui";

type Props = {
  totalProjects: number;
  projectsCompleted: number;
  projectsAssigned: number;
  projectsOngoing: number;
  avgCompletionTime: string;
};

export function AvailabilitySection({
  totalProjects,
  projectsCompleted,
  projectsAssigned,
  projectsOngoing,
  avgCompletionTime
}: Props) {
  return (
    <section className={cardClassName}>
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <Briefcase className="h-5 w-5" strokeWidth={2} aria-hidden />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">Availability & Timeline</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">{totalProjects}</p>
          <p className="mt-2 text-sm text-slate-600">Total Projects</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">{projectsCompleted}</p>
          <p className="mt-2 text-sm text-slate-600">Completed Projects</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">{projectsAssigned}</p>
          <p className="mt-2 text-sm text-slate-600">Projects Assigned</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center shadow-sm">
          <p className="text-3xl font-bold tabular-nums tracking-tight text-slate-900">{projectsOngoing}</p>
          <p className="mt-2 text-sm text-slate-600">Ongoing Projects</p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-center shadow-sm">
          <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{avgCompletionTime}</p>
          <p className="mt-2 text-sm text-slate-600">Average completion time</p>
        </div>
      </div>
    </section>
  );
}
