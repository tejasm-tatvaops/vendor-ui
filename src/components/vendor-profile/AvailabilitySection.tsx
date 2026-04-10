import { SectionTitle, cardClassName } from "./ui";

type Props = {
  nextAvailableDate: string;
  projectsOngoing: number;
  avgCompletionTime: string;
};

export function AvailabilitySection({ nextAvailableDate, projectsOngoing, avgCompletionTime }: Props) {
  const formattedDate = new Date(nextAvailableDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <section className={cardClassName}>
      <SectionTitle icon="📅" title="Availability & Timeline" />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <p className="text-xs text-slate-500">Next available start date</p>
          <p className="mt-1 font-semibold text-slate-900">{formattedDate}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <p className="text-xs text-slate-500">Current workload</p>
          <p className="mt-1 font-semibold text-slate-900">{projectsOngoing} projects ongoing</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100">
          <p className="text-xs text-slate-500">Avg completion time</p>
          <p className="mt-1 font-semibold text-slate-900">{avgCompletionTime}</p>
        </div>
      </div>
    </section>
  );
}
