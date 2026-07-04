import {
  Bot,
  BrainCircuit,
  FileText,
  Lightbulb,
  PanelRight,
  Search,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { askBrain, mockMessages } from "../services/api";
import type { Message } from "../types";

const history = [
  "Q3 launch readiness risks",
  "Security policy deltas",
  "Renewal account briefing",
  "Support escalation summary",
  "Onboarding plan for PMs",
];

const sourceCards = [
  {
    title: "Q3 Revenue Operating Plan.pdf",
    detail: "Mentions dependency drift in enterprise launch motion.",
    confidence: "96%",
  },
  {
    title: "Product Roadmap FY27.pptx",
    detail: "Connects roadmap dates with support readiness.",
    confidence: "91%",
  },
  {
    title: "Support Escalations.csv",
    detail: "Shows repeated launch enablement gaps.",
    confidence: "88%",
  },
];

const followUps = [
  "Which owners are blocking launch?",
  "Draft an executive summary",
  "Show the source excerpts",
];

export default function AskBrain() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: prompt,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await askBrain(prompt);
    setMessages((current) => [...current, response]);
    setIsLoading(false);
  }

  return (
    <div className="grid h-[calc(100vh-112px)] min-h-[720px] gap-5 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
      <Card className="hidden min-h-0 flex-col overflow-hidden p-0 xl:flex">
        <div className="border-b border-white/10 p-4 light:border-slate-200">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <div className="relative mt-4">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              placeholder="Search history"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-violet-400 light:border-slate-200 light:bg-slate-50"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {history.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`w-full rounded-2xl p-3 text-left text-sm transition ${
                index === 0
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-950/25"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-white light:text-slate-600"
              }`}
            >
              <span className="block font-medium">{item}</span>
              <span className="mt-1 block text-xs opacity-65">{index + 1} hr ago</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex min-h-0 flex-col overflow-hidden p-0">
        <div className="border-b border-white/10 p-5 light:border-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-500 p-3 shadow-xl shadow-violet-950/30">
                <BrainCircuit size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Ask Brain</h1>
                <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
                  Enterprise answers with citations, sources, and follow-ups.
                </p>
              </div>
            </div>
            <Badge tone="green">Streaming ready</Badge>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <div className="mx-auto max-w-4xl space-y-7">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                      <Bot size={20} />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-3xl px-5 py-4 shadow-xl ${
                      isUser
                        ? "bg-violet-600 text-white shadow-violet-950/25"
                        : "border border-white/10 bg-[#111118] text-zinc-100 light:border-slate-200 light:bg-white light:text-slate-900"
                    }`}
                  >
                    <p className="text-sm leading-7">{message.content}</p>
                    {message.sources && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.sources.map((source, index) => (
                          <Badge key={source} tone="violet">
                            [{index + 1}] {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-xs opacity-55">{message.createdAt}</p>
                  </div>
                  {isUser && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-zinc-200">
                      <User size={20} />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                  <Bot size={20} />
                </div>
                <div className="rounded-3xl border border-white/10 bg-[#111118] px-5 py-4 light:border-slate-200 light:bg-white">
                  <div className="mb-3 flex items-center gap-2 text-sm text-zinc-400">
                    <Sparkles size={16} className="text-violet-300" />
                    Searching company memory
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-white/10 bg-[#0b0b13]/95 p-5 backdrop-blur-xl light:border-slate-200 light:bg-white/95">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex flex-wrap gap-2">
              {followUps.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-400/60 light:border-slate-200 light:text-slate-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.06] p-2 light:border-slate-200 light:bg-slate-50">
              <div className="flex items-center gap-3">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask a question, request analysis, or create a workflow..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-zinc-500 light:text-slate-950"
                />
                <Button type="submit" disabled={isLoading} className="rounded-2xl px-4">
                  <Send size={17} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>

      <Card className="hidden min-h-0 flex-col overflow-hidden p-0 xl:flex">
        <div className="border-b border-white/10 p-4 light:border-slate-200">
          <div className="flex items-center gap-2">
            <PanelRight size={18} className="text-violet-300" />
            <h2 className="text-lg font-semibold">Sources</h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-zinc-500 light:text-slate-500">
            Citations and related knowledge used in this thread.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {sourceCards.map((source, index) => (
            <div
              key={source.title}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 light:border-slate-200 light:bg-slate-50"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-violet-500/15 p-2 text-violet-200">
                  <FileText size={18} />
                </div>
                <div>
                  <Badge tone="violet">Citation {index + 1}</Badge>
                  <h3 className="mt-3 text-sm font-semibold">{source.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-400 light:text-slate-600">
                    {source.detail}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-emerald-300 light:text-emerald-700">
                    {source.confidence} confidence
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-3xl border border-violet-400/20 bg-violet-500/10 p-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-violet-200" />
              <h3 className="text-sm font-semibold">Related documents</h3>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-zinc-400 light:text-slate-600">
              <li>Enterprise Launch Plan</li>
              <li>Customer Health Scorecard</li>
              <li>Product Readiness Review</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
