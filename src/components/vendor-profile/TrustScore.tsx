import { BadgeCheck, LayoutGrid, Star, User, Users } from "lucide-react";
import type { TrustScoreBreakdown } from "./utils";
import { cardClassName } from "./ui";

type Props = {
  score: number;
  homeowners: number;
  breakdown?: TrustScoreBreakdown;
};

const breakdownRows: {
  key: keyof Pick<TrustScoreBreakdown, "verification" | "projects" | "experience" | "reviews" | "rating">;
  label: string;
  Icon: typeof BadgeCheck;
}[] = [
  { key: "verification", label: "Verification", Icon: BadgeCheck },
  { key: "projects", label: "Projects", Icon: LayoutGrid },
  { key: "experience", label: "Experience", Icon: User },
  { key: "reviews", label: "Reviews", Icon: Users },
  { key: "rating", label: "Ratings", Icon: Star }
];

export function TrustScore({ score, homeowners, breakdown }: Props) {
  const trustLevel = score >= 80 ? "High" : score >= 60 ? "Moderate" : "Developing";
  const trustTone =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 60
        ? "bg-orange-100 text-orange-800"
        : "bg-slate-100 text-slate-700";

  return (
    <section className={cardClassName}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-4xl font-bold leading-none tracking-tight text-slate-900">
          {score}
          <span className="text-2xl font-semibold text-slate-500">/100</span>
        </p>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${trustTone}`}>{trustLevel}</span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Trusted by <span className="font-semibold text-slate-900">{homeowners}+</span> homeowners
      </p>
      {breakdown ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Score breakdown</p>
          <ul className="mt-3 space-y-3">
            {breakdownRows.map(({ key, label, Icon }) => (
              <li key={key} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-slate-600">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate">{label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                  {breakdown[key]}/20
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
