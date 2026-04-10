import type { TrustScoreBreakdown } from "./utils";
import { cardClassName } from "./ui";

type Props = {
  score: number;
  homeowners: number;
  breakdown?: TrustScoreBreakdown;
};

export function TrustScore({ score, homeowners, breakdown }: Props) {
  const trustLevel = score >= 80 ? "High" : score >= 60 ? "Moderate" : "Developing";
  const trustTone =
    score >= 80 ? "bg-emerald-100 text-emerald-700" : score >= 60 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700";

  return (
    <section className={cardClassName}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">Tatva Trust Score</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${trustTone}`}>{trustLevel}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-4xl font-bold text-slate-900">{score}</p>
        <p className="pb-1 text-sm text-slate-500">/100</p>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Trusted by <span className="font-semibold text-slate-900">{homeowners}+</span> homeowners
      </p>
      {breakdown ? (
        <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <p className="mb-1 font-semibold text-slate-700">Score breakdown</p>
          <p>Verification: {breakdown.verification}/20</p>
          <p>Projects: {breakdown.projects}/20</p>
          <p>Experience: {breakdown.experience}/20</p>
          <p>Reviews: {breakdown.reviews}/20</p>
          <p>Rating: {breakdown.rating}/20</p>
        </div>
      ) : null}
    </section>
  );
}
