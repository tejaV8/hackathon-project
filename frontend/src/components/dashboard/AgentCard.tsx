import type { LucideIcon } from "lucide-react";
import Badge from "../common/Badge";
import Card from "../common/Card";

interface AgentCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  status: "Live" | "Idle" | "Training";
  completed: string;
  successRate: string;
  lastRun: string;
}

export default function AgentCard({
  name,
  description,
  icon: Icon,
  status,
  completed,
  successRate,
  lastRun,
}: AgentCardProps) {
  return (
    <Card interactive className="group rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-500 p-4 shadow-xl shadow-violet-950/30 transition group-hover:scale-105">
          <Icon size={28} className="text-white" />
        </div>
        <Badge tone={status === "Live" ? "green" : status === "Training" ? "amber" : "slate"}>
          {status}
        </Badge>
      </div>
      <h2 className="mt-5 text-xl font-semibold">{name}</h2>
      <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400 light:text-slate-600">
        {description}
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          ["Completed", completed],
          ["Success", successRate],
          ["Last run", lastRun],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-black/20 p-3 light:bg-slate-50">
            <p className="text-sm font-semibold text-white light:text-slate-950">{value}</p>
            <p className="mt-1 text-[11px] text-zinc-500 light:text-slate-500">{label}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
