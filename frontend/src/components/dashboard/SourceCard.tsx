import { FileText } from "lucide-react";
import Badge from "../common/Badge";

interface SourceCardProps {
  title: string;
  description: string;
  meta?: string;
}

export default function SourceCard({ title, description, meta }: SourceCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200 light:text-violet-700">
          <FileText size={17} />
        </div>
        <div>
          {meta && <Badge tone="violet">{meta}</Badge>}
          <h3 className="mt-2 text-sm font-semibold text-white light:text-slate-950">
            {title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-zinc-400 light:text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
