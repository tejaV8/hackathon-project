import {
  BarChart3,
  Bot,
  FileSearch,
  Headphones,
  Plus,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import AgentCard from "../components/dashboard/AgentCard";
import InsightCard from "../components/dashboard/InsightCard";
import MetricCard from "../components/dashboard/MetricCard";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

const agents = [
  {
    name: "Research Agent",
    description: "Scans company memory, extracts decision context, and creates cited briefs.",
    icon: FileSearch,
    status: "Live" as const,
    completed: "328",
    successRate: "97%",
    lastRun: "8m ago",
  },
  {
    name: "Support Agent",
    description: "Clusters customer escalations, detects recurring issues, and drafts playbooks.",
    icon: Headphones,
    status: "Live" as const,
    completed: "1.2K",
    successRate: "94%",
    lastRun: "12m ago",
  },
  {
    name: "Document Agent",
    description: "Indexes uploads, flags stale policy content, and checks citation quality.",
    icon: Bot,
    status: "Training" as const,
    completed: "842",
    successRate: "99%",
    lastRun: "31m ago",
  },
  {
    name: "Analytics Agent",
    description: "Surfaces adoption trends, anomalies, and executive-ready operating insights.",
    icon: BarChart3,
    status: "Idle" as const,
    completed: "214",
    successRate: "92%",
    lastRun: "2h ago",
  },
];

const workflowRuns = [
  ["Revenue anomaly review", "Research Agent", "Running", "4 sources analyzed"],
  ["Policy contradiction scan", "Document Agent", "Completed", "2 conflicts found"],
  ["Support escalation digest", "Support Agent", "Completed", "18 themes clustered"],
  ["Weekly AI adoption brief", "Analytics Agent", "Scheduled", "Runs Monday"],
];

export default function Tasks() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl shadow-violet-950/20 light:border-slate-200 light:bg-white">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 light:text-violet-700">
              <Workflow size={16} />
              AI operating layer
            </div>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight">AI Workflows</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400 light:text-slate-600">
              Deploy specialized agents that research, analyze, summarize, and
              monitor company work with enterprise guardrails.
            </p>
          </div>
          <Button className="rounded-2xl px-5">
            <Plus size={18} />
            Create Agent
          </Button>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          title="Workflow Runs"
          value="2.4K"
          trend="+18% this week"
          icon={RefreshCw}
          accent="violet"
        />
        <MetricCard
          title="Success Rate"
          value="96%"
          trend="+3.2 pts"
          icon={ShieldCheck}
          accent="indigo"
        />
        <MetricCard
          title="Hours Saved"
          value="418"
          trend="estimated"
          icon={Workflow}
          accent="purple"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        {agents.map((agent) => (
          <AgentCard key={agent.name} {...agent} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Live Workflow Runs</h2>
            <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
              Current and scheduled automations across the company brain.
            </p>
          </div>
          <div className="space-y-3">
            {workflowRuns.map(([name, agent, status, detail]) => (
              <div
                key={name}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 light:border-slate-200 light:bg-slate-50"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="mt-1 text-sm text-zinc-400 light:text-slate-600">
                      {agent} • {detail}
                    </p>
                  </div>
                  <Badge tone={status === "Running" ? "blue" : status === "Completed" ? "green" : "amber"}>
                    {status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold">Suggested Agents</h2>
            <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
              New automations based on recent usage.
            </p>
          </div>
          <div className="space-y-3">
            <InsightCard
              icon={FileSearch}
              title="Renewal Risk Agent"
              description="Monitor support sentiment and CRM movement before account reviews."
            />
            <InsightCard
              icon={Bot}
              title="Policy QA Agent"
              description="Flag contradictions across HR, security, and legal guidance."
            />
            <InsightCard
              icon={BarChart3}
              title="Board Metrics Agent"
              description="Create a weekly executive narrative from operating dashboards."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
