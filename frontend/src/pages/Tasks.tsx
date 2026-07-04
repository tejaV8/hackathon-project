import { BarChart3, Bot, FileSearch, Headphones, Plus } from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import AgentCard from "../components/dashboard/AgentCard";
import PageHeader from "../components/dashboard/PageHeader";

const agents = [
  {
    name: "Research Agent",
    description: "Scans company memory and creates cited research briefs.",
    icon: FileSearch,
    status: "Live" as const,
    completed: "328",
    successRate: "97%",
    lastRun: "8m ago",
  },
  {
    name: "Support Agent",
    description: "Clusters support escalations and drafts team playbooks.",
    icon: Headphones,
    status: "Live" as const,
    completed: "1.2K",
    successRate: "94%",
    lastRun: "12m ago",
  },
  {
    name: "Analytics Agent",
    description: "Surfaces trends, anomalies, and executive operating insights.",
    icon: BarChart3,
    status: "Idle" as const,
    completed: "214",
    successRate: "92%",
    lastRun: "2h ago",
  },
  {
    name: "Document Agent",
    description: "Indexes uploads, flags stale content, and checks citation quality.",
    icon: Bot,
    status: "Training" as const,
    completed: "842",
    successRate: "99%",
    lastRun: "31m ago",
  },
];

export default function Tasks() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Agents"
        title="AI Agents"
        subtitle="Manage specialized agents that research, analyze, summarize, and monitor company work."
        icon={Bot}
        action={
          <Button className="rounded-2xl">
            <Plus size={17} />
            Create Agent
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {agents.map((agent) => <AgentCard key={agent.name} {...agent} />)}
      </section>

      <Card className="p-5">
        <h2 className="text-xl font-semibold">Recent Executions</h2>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {[
            ["Revenue anomaly review", "Research Agent", "Running"],
            ["Policy contradiction scan", "Document Agent", "Completed"],
            ["Support escalation digest", "Support Agent", "Completed"],
            ["Weekly adoption brief", "Analytics Agent", "Scheduled"],
          ].map(([name, agent, status]) => (
            <div key={name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="mt-1 text-sm text-zinc-400 light:text-slate-600">{agent}</p>
                </div>
                <span className="text-sm text-violet-300 light:text-violet-700">{status}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
