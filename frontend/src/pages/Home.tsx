import {
  BarChart3,
  Bot,
  BrainCircuit,
  FileStack,
  Lightbulb,
  LineChart,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import ConversationCard from "../components/dashboard/ConversationCard";
import InsightCard from "../components/dashboard/InsightCard";
import MetricCard from "../components/dashboard/MetricCard";
import PromptBox from "../components/dashboard/PromptBox";

const suggestions = [
  "What changed this week?",
  "Show Q3 revenue risks",
  "Summarize support escalations",
  "Create onboarding guide",
];

const conversations = [
  {
    title: "Q3 revenue risk synthesis",
    summary: "Compared finance plan, CRM notes, and support escalations for executive risks.",
    time: "18 min ago",
    sources: 12,
  },
  {
    title: "Security policy changes",
    summary: "Highlighted access review changes and new device posture requirements.",
    time: "1 hr ago",
    sources: 7,
  },
  {
    title: "Customer renewal briefing",
    summary: "Generated talking points for enterprise accounts with open support themes.",
    time: "Yesterday",
    sources: 18,
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl shadow-violet-950/20 light:border-slate-200 light:bg-white md:p-10 xl:p-12">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="relative grid gap-10 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 light:text-violet-700">
              <Sparkles size={16} />
              Synced 4 minutes ago
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white light:text-slate-950 xl:text-6xl">
              Welcome back, Priya.
            </h1>
            <p className="mt-4 max-w-3xl text-2xl font-medium text-zinc-200 light:text-slate-700">
              Your Company Brain is synchronized and ready.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 light:text-slate-500">
              Ask questions, discover knowledge, and automate work across every
              team, document, decision, and customer signal.
            </p>
          </div>

          <Card className="relative bg-gradient-to-br from-violet-500/15 to-indigo-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-500 p-4 shadow-xl shadow-violet-950/30">
                <BrainCircuit size={30} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-zinc-400 light:text-slate-500">
                  Enterprise readiness
                </p>
                <p className="mt-1 text-3xl font-semibold">92%</p>
              </div>
            </div>
            <div className="mt-6 h-3 rounded-full bg-white/10 light:bg-slate-200">
              <div className="h-3 w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              {[
                ["184", "Sources"],
                ["2.1M", "Chunks"],
                ["99.9%", "Uptime"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-black/20 p-3 light:bg-white">
                  <p className="font-semibold">{value}</p>
                  <p className="mt-1 text-xs text-zinc-500 light:text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <PromptBox
        placeholder="Ask, search, or launch an AI workflow..."
        suggestions={suggestions}
        onSubmit={() => navigate("/askbrain")}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Knowledge Sources"
          value="34"
          trend="+7 connected"
          icon={FileStack}
          accent="violet"
          chart={[24, 28, 42, 48, 55, 66, 78]}
        />
        <MetricCard
          title="Documents Indexed"
          value="184"
          trend="+21 this week"
          icon={ShieldCheck}
          accent="indigo"
          chart={[35, 38, 44, 52, 58, 70, 88]}
        />
        <MetricCard
          title="AI Queries Today"
          value="1.8K"
          trend="+24% vs avg"
          icon={BarChart3}
          accent="purple"
          chart={[22, 48, 36, 58, 46, 76, 84]}
        />
        <MetricCard
          title="Active Agents"
          value="12"
          trend="4 running now"
          icon={Bot}
          accent="blue"
          chart={[18, 30, 44, 42, 62, 74, 80]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Recent AI Conversations</h2>
              <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
                High-signal work your team returned to recently.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/askbrain")}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:border-violet-400/60 light:border-slate-200 light:text-violet-700"
            >
              Open Brain
            </button>
          </div>
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <ConversationCard key={conversation.title} {...conversation} />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">AI Recommendations</h2>
            <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
              Proactive workflows based on company signals.
            </p>
          </div>
          <div className="space-y-3">
            <InsightCard
              icon={Workflow}
              title="Review unresolved Jira tickets"
              description="Cluster launch blockers and create a weekly readiness brief."
            />
            <InsightCard
              icon={LineChart}
              title="Analyze revenue anomalies"
              description="Compare CRM movement against Q3 operating assumptions."
            />
            <InsightCard
              icon={Rocket}
              title="Generate onboarding packet"
              description="Create a role-aware starter brief from HR, IT, and product docs."
            />
            <InsightCard
              icon={Lightbulb}
              title="Resolve policy contradictions"
              description="Two remote work documents have conflicting approval language."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
