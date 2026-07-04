import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";
import Card from "../common/Card";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  chart?: number[];
  accent?: "violet" | "indigo" | "purple" | "blue";
}

const accents = {
  violet: "from-violet-500 to-fuchsia-500 text-violet-200 shadow-violet-950/30",
  indigo: "from-indigo-500 to-violet-500 text-indigo-200 shadow-indigo-950/30",
  purple: "from-purple-500 to-violet-500 text-purple-200 shadow-purple-950/30",
  blue: "from-sky-500 to-indigo-500 text-sky-200 shadow-sky-950/30",
};

export default function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  chart = [20, 36, 28, 54, 44, 68, 78],
  accent = "violet",
}: MetricCardProps) {
  const points = chart
    .map((point, index) => `${(index / (chart.length - 1)) * 100},${100 - point}`)
    .join(" ");

  return (
    <Card
      interactive
      className="group relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-black/20"
    >
      <div
        className={clsx(
          "absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition group-hover:opacity-35",
          accents[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-400 light:text-slate-500">{title}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white light:text-slate-950">
            {value}
          </p>
        </div>
        <div className={clsx("rounded-2xl bg-gradient-to-br p-3 shadow-lg", accents[accent])}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      <div className="relative mt-5 flex items-end justify-between gap-4">
        <p className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-200 light:text-emerald-700">
          {trend}
        </p>
        <svg viewBox="0 0 100 100" className="h-12 w-28 overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="url(#metric-line)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="metric-line" x1="0" x2="1" y1="0" y2="0">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
}
