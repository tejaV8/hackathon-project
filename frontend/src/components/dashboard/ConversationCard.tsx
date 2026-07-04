import { MessageSquare, MoreHorizontal } from "lucide-react";

interface ConversationCardProps {
  title: string;
  summary: string;
  time: string;
  sources: number;
}

export default function ConversationCard({
  title,
  summary,
  time,
  sources,
}: ConversationCardProps) {
  return (
    <button
      type="button"
      className="group w-full rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-left transition hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-white/[0.07] light:border-slate-200 light:bg-slate-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-2 text-violet-200 light:text-violet-700">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-white light:text-slate-950">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-400 light:text-slate-600">
              {summary}
            </p>
          </div>
        </div>
        <MoreHorizontal size={18} className="text-zinc-500 opacity-0 transition group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 light:text-slate-500">
        <span>{time}</span>
        <span>{sources} sources</span>
      </div>
    </button>
  );
}
