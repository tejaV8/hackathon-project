import { Bot, Clock, CornerDownLeft, Send, User } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { askBrain, mockMessages } from "../services/api";
import type { Message } from "../types";

const prompts = [
  "Summarize customer churn risks",
  "What changed in HR policy?",
  "Find Q3 launch blockers",
  "Draft exec update from roadmap notes",
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
    <div className="grid min-h-[calc(100vh-128px)] gap-6 lg:grid-cols-[280px_1fr]">
      <Card className="hidden lg:block">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-violet-300" />
          <h2 className="font-semibold">History</h2>
        </div>
        <div className="mt-5 space-y-3">
          {[
            "Security playbook updates",
            "Q3 revenue operating plan",
            "Onboarding checklist gaps",
            "Support escalation themes",
          ].map((item, index) => (
            <button
              key={item}
              type="button"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-zinc-300 transition hover:border-violet-400/60 light:border-slate-200 light:bg-slate-50 light:text-slate-700"
            >
              <span className="block font-medium">{item}</span>
              <span className="mt-1 block text-xs text-zinc-500">
                {index + 1} hr ago
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex min-h-[680px] flex-col p-0">
        <div className="border-b border-white/10 p-5 light:border-slate-200">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">Ask Brain</h1>
              <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
                Chat with company knowledge. Responses are mocked but API-ready.
              </p>
            </div>
            <Badge tone="green">Flask-ready</Badge>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                    <Bot size={18} />
                  </div>
                )}
                <div
                  className={`max-w-2xl rounded-lg p-4 ${
                    isUser
                      ? "bg-violet-600 text-white"
                      : "border border-white/10 bg-white/[0.055] light:border-slate-200 light:bg-slate-50"
                  }`}
                >
                  <p className="text-sm leading-6">{message.content}</p>
                  {message.sources && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.sources.map((source) => (
                        <Badge key={source} tone="violet">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-xs opacity-60">{message.createdAt}</p>
                </div>
                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-zinc-200">
                    <User size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-200">
                <Bot size={18} />
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 light:border-slate-200 light:bg-slate-50">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-violet-300 [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 p-5 light:border-slate-200">
          <div className="mb-3 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:border-violet-400/60 light:border-slate-200 light:text-slate-700"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your company brain..."
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400 light:border-slate-200 light:bg-white light:text-slate-950"
            />
            <Button type="submit" disabled={isLoading}>
              <Send size={16} />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
            <CornerDownLeft size={13} />
            Press Enter to send
          </p>
        </div>
      </Card>
    </div>
  );
}
