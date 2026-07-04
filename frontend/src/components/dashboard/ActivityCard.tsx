import type { LucideIcon } from "lucide-react";

interface ActivityCardProps {
  title: string;
  description: string;
  time?: string;
  icon?: LucideIcon;
}

export default function ActivityCard({
  title,
  description,
  time,
  icon: Icon,
}: ActivityCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200 light:text-violet-700">
            <Icon size={17} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-white light:text-slate-950">
              {title}
            </h3>
            {time && (
              <span className="shrink-0 text-xs text-zinc-500 light:text-slate-500">
                {time}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-400 light:text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
