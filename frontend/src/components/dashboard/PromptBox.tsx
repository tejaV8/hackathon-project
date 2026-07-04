import { ArrowUp, Bot, ChevronDown, Mic, Paperclip, Sparkles } from "lucide-react";
import Button from "../common/Button";

interface PromptBoxProps {
  placeholder?: string;
  suggestions?: string[];
  onSubmit?: (value: string) => void;
}

export default function PromptBox({
  placeholder = "Ask your company brain anything...",
  suggestions = [],
  onSubmit,
}: PromptBoxProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111118]/90 p-3 shadow-2xl shadow-violet-950/20 backdrop-blur-xl light:border-slate-200 light:bg-white">
      <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4 light:border-slate-200 light:bg-slate-50">
        <div className="flex items-start gap-3">
          <div className="mt-1 rounded-2xl bg-violet-500/15 p-2 text-violet-200 light:text-violet-700">
            <Sparkles size={18} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSubmit?.(event.currentTarget.value);
              }
            }}
            className="min-h-12 flex-1 bg-transparent text-lg font-medium text-white outline-none placeholder:text-zinc-500 light:text-slate-950"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" className="rounded-2xl">
              <Paperclip size={16} />
              Upload Document
            </Button>
            <Button variant="secondary" className="rounded-2xl">
              <Mic size={16} />
              Voice Input
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400/50 light:border-slate-200 light:bg-white light:text-slate-700"
            >
              <Bot size={16} />
              General Agent
              <ChevronDown size={15} />
            </button>
          </div>
          <Button className="rounded-2xl px-5">
            Ask AI
            <ArrowUp size={18} />
          </Button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 px-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSubmit?.(suggestion)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-zinc-300 transition hover:-translate-y-0.5 hover:border-violet-400/60 hover:text-white light:border-slate-200 light:bg-slate-50 light:text-slate-700"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
