import { Bot, BrainCircuit, Clock, Search, Send, User } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import PageHeader from "../components/dashboard/PageHeader";
import { askBrain, mockMessages } from "../services/api";
import type { Message } from "../types";

const history = [
  "Q3 launch readiness risks",
  "Security policy deltas",
  "Renewal account briefing",
  "Support escalation summary",
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
      createdAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);
    const response = await askBrain(prompt);
    setMessages((current) => [...current, response]);
    setIsLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-112px)] min-h-[680px] flex-col gap-6">
      <PageHeader
        eyebrow="Ask Brain"
        title="Ask your company knowledge"
        subtitle="Chat with source-backed answers from documents, tools, and team knowledge."
        icon={BrainCircuit}
      />

      <Card className="grid min-h-0 flex-1 overflow-hidden p-0 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 border-r border-white/10 light:border-slate-200 lg:flex lg:flex-col">
          <div className="border-b border-white/10 p-4 light:border-slate-200">
            <div className="flex items-center gap-2">
              <Clock size={17} className="text-violet-300" />
              <h2 className="font-semibold">Conversation History</h2>
            </div>
            <div className="relative mt-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input className="w-full rounded-2xl border border-white/10 bg-white/[0.05] py-2 pl-9 pr-3 text-sm outline-none light:border-slate-200 light:bg-slate-50" placeholder="Search" />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {history.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`mb-2 w-full rounded-2xl p-3 text-left text-sm transition ${
                  index === 0 ? "bg-violet-600 text-white" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white light:text-slate-600"
                }`}
              >
                {item}
                <span className="mt-1 block text-xs opacity-60">{index + 1} hr ago</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="mx-auto max-w-4xl space-y-5">
              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div key={message.id} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200">
                        <Bot size={18} />
                      </div>
                    )}
                    <div className={`max-w-[78%] rounded-3xl px-5 py-4 ${isUser ? "bg-violet-600 text-white" : "bg-[#111118] light:bg-slate-50"}`}>
                      <p className="text-sm leading-7">{message.content}</p>
                      {message.sources && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.sources.map((source) => <Badge key={source} tone="violet">{source}</Badge>)}
                        </div>
                      )}
                      <p className="mt-2 text-xs opacity-60">{message.createdAt}</p>
                    </div>
                    {isUser && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                        <User size={18} />
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Bot size={18} className="text-violet-300" />
                  Brain is typing
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:240ms]" />
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0B0B12] p-4 light:border-slate-200 light:bg-white">
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl gap-3 rounded-3xl border border-white/10 bg-white/[0.05] p-2 light:border-slate-200 light:bg-slate-50">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-zinc-500"
                placeholder="Ask a question..."
              />
              <Button type="submit" disabled={isLoading} className="rounded-2xl">
                <Send size={17} />
              </Button>
            </form>
          </div>
        </section>
      </Card>
    </div>
  );
}
