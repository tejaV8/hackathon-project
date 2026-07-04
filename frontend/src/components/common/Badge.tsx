import { clsx } from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "violet" | "green" | "amber" | "red" | "slate" | "blue";

const toneClasses: Record<BadgeTone, string> = {
  violet: "border-violet-400/30 bg-violet-500/15 text-violet-200 light:text-violet-700",
  green: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200 light:text-emerald-700",
  amber: "border-amber-400/30 bg-amber-500/15 text-amber-200 light:text-amber-700",
  red: "border-rose-400/30 bg-rose-500/15 text-rose-200 light:text-rose-700",
  slate: "border-slate-400/30 bg-slate-500/15 text-slate-200 light:text-slate-700",
  blue: "border-sky-400/30 bg-sky-500/15 text-sky-200 light:text-sky-700",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export default function Badge({ children, tone = "slate", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
