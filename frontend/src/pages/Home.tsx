import {
  ArrowRight,
  BarChart3,
  Bot,
  FileText,
  MessageSquare,
  Mic,
  Paperclip,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const stats = [
  { label: "Indexed documents", value: "184", change: "+21 this week" },
  { label: "AI conversations", value: "12.8K", change: "+24% usage" },
  { label: "Knowledge sources", value: "34", change: "7 connected apps" },
  { label: "Automation runs", value: "892", change: "98.4% success" },
];

const recentConversations = [
  "Summarize Q3 revenue risks for leadership",
  "Find contradictions in remote work policies",
  "Draft customer renewal talking points",
  "Explain SOC2 evidence gaps by owner",
];

const recentUploads = [
  "Q3 Revenue Operating Plan.pdf",
  "Enterprise Security Playbook.docx",
  "Customer Support Escalations.csv",
];

const suggestions = [
  "Which customers are at renewal risk this month?",
  "Create an onboarding brief for a new product manager.",
  "What changed in security policy since last quarter?",
];

export default function Home() {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Ask Brain",
      description: "Get source-backed answers from company knowledge.",
      icon: MessageSquare,
      path: "/askbrain",
    },
    {
      title: "Upload Docs",
      description: "Add files and sync them into the vector index.",
      icon: UploadCloud,
      path: "/documents",
    },
    {
      title: "View Analytics",
      description: "Track adoption, sources, and AI activity.",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      title: "Create Task",
      description: "Turn repeated AI work into monitored workflows.",
      icon: Zap,
      path: "/tasks",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-violet-600/25 via-white/[0.055] to-indigo-500/10 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl light:border-slate-200 light:from-violet-100 light:via-white light:to-indigo-100 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-3 py-1 text-sm text-violet-200 light:text-violet-700">
              <Sparkles size={16} />
              Company intelligence, ready for work
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white light:text-slate-950 md:text-5xl">
              Welcome back, Priya. Your AI Company Brain is synced and listening.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 light:text-slate-600">
              Ask questions, upload new knowledge, and launch AI workflows across
              sales, product, finance, support, HR, and security.
            </p>
          </div>

          <Card className="bg-black/20 light:bg-white/80">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-500/20 p-3 text-violet-200">
                <Bot size={24} />
              </div>
              <div>
                <p className="font-semibold">Brain Readiness</p>
                <p className="text-sm text-zinc-400 light:text-slate-500">
                  184 sources, 2.1M chunks indexed
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/10 light:bg-slate-200">
              <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
            </div>
            <p className="mt-3 text-sm text-zinc-400 light:text-slate-500">
              Answer quality score: 92%
            </p>
          </Card>
        </div>
      </section>

      <Card>
        <textarea
          placeholder="Ask anything about your company..."
          rows={3}
          className="w-full resize-none bg-transparent text-lg text-white outline-none placeholder:text-zinc-500 light:text-slate-950"
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/documents")}>
              <Paperclip size={16} />
              Attach
            </Button>
            <Button variant="secondary">
              <Mic size={16} />
              Voice
            </Button>
          </div>
          <Button onClick={() => navigate("/askbrain")}>
            Ask AI
            <ArrowRight size={16} />
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="text-left"
            >
              <Card interactive className="h-full">
                <Icon size={24} className="text-violet-300" />
                <h3 className="mt-4 text-lg font-semibold">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400 light:text-slate-500">
                  {action.description}
                </p>
              </Card>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-zinc-400 light:text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-sm text-emerald-300 light:text-emerald-700">
              {stat.change}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Conversations</h2>
            <button
              type="button"
              onClick={() => navigate("/askbrain")}
              className="text-sm font-semibold text-violet-300 light:text-violet-700"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentConversations.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm transition hover:border-violet-400/50 light:border-slate-200 light:bg-slate-50"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Recent Uploads</h2>
          <div className="mt-4 space-y-3">
            {recentUploads.map((file) => (
              <div key={file} className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-500/15 p-2 text-violet-300">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{file}</p>
                  <p className="text-xs text-zinc-500 light:text-slate-500">
                    Indexed and searchable
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">AI Suggestions</h2>
          <div className="mt-4 space-y-3">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => navigate("/askbrain")}
                className="block w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left text-sm text-zinc-300 transition hover:border-violet-400/60 hover:text-white light:border-slate-200 light:bg-slate-50 light:text-slate-700"
              >
                {item}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
