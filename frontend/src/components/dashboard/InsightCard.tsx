import type { LucideIcon } from "lucide-react";

interface InsightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: string;
}

export default function InsightCard({
  title,
  description,
  icon: Icon,
  action = "Open insight",
}: InsightCardProps) {
  return (
    <button
      type="button"
      className="group w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-400/60 hover:shadow-2xl hover:shadow-violet-950/20 light:border-slate-200 light:from-white light:to-slate-50"
    >
      <div className="flex gap-4">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-200 light:text-violet-700">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-white light:text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400 light:text-slate-600">
            {description}
          </p>
          <p className="mt-3 text-sm font-semibold text-violet-300 light:text-violet-700">
            {action}
          </p>
        </div>
      </div>
    </button>
  );
}
