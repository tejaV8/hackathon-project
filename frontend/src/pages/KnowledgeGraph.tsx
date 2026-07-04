import { Database, GitBranch, Network, Radar, Share2, Sparkles } from "lucide-react";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import InsightCard from "../components/dashboard/InsightCard";
import MetricCard from "../components/dashboard/MetricCard";
import PageHeader from "../components/dashboard/PageHeader";

const nodes = [
  { name: "Revenue Plan", type: "Finance", x: "18%", y: "42%" },
  { name: "Roadmap", type: "Product", x: "42%", y: "22%" },
  { name: "Security", type: "Policy", x: "68%", y: "38%" },
  { name: "Support", type: "CX", x: "48%", y: "68%" },
  { name: "HR Policy", type: "People", x: "76%", y: "72%" },
];

const relationships = [
  "Roadmap depends on Q3 launch staffing",
  "Security playbook references HR device policy",
  "Support themes influence product roadmap",
  "Revenue risks connect to renewal health",
];

export default function KnowledgeGraph() {
  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Company memory map"
        title="Knowledge Graph"
        subtitle="Explore semantic relationships between documents, decisions, owners, systems, and AI-generated insights."
        icon={Network}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard title="Entities" value="2.8K" trend="+312 linked" icon={Radar} />
        <MetricCard title="Relationships" value="9.6K" trend="+18% density" icon={GitBranch} accent="indigo" />
        <MetricCard title="Conflicts" value="7" trend="3 high priority" icon={Sparkles} accent="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card className="min-h-[620px] overflow-hidden p-0">
          <div className="border-b border-white/10 p-6 light:border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Semantic Map</h2>
                <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
                  Interactive preview of connected knowledge domains.
                </p>
              </div>
              <Badge tone="violet">Live preview</Badge>
            </div>
          </div>
          <div className="relative h-[540px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_62%)]">
            <svg className="absolute inset-0 h-full w-full opacity-70">
              <line x1="18%" y1="42%" x2="42%" y2="22%" stroke="#8b5cf6" strokeWidth="2" />
              <line x1="42%" y1="22%" x2="68%" y2="38%" stroke="#6366f1" strokeWidth="2" />
              <line x1="68%" y1="38%" x2="76%" y2="72%" stroke="#38bdf8" strokeWidth="2" />
              <line x1="42%" y1="22%" x2="48%" y2="68%" stroke="#8b5cf6" strokeWidth="2" />
              <line x1="18%" y1="42%" x2="48%" y2="68%" stroke="#22c55e" strokeWidth="2" />
            </svg>
            {nodes.map((node) => (
              <button
                key={node.name}
                type="button"
                style={{ left: node.x, top: node.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-violet-300/30 bg-[#12121c]/90 px-5 py-4 text-left shadow-2xl shadow-violet-950/30 backdrop-blur transition hover:scale-105 hover:border-violet-300 light:bg-white/90"
              >
                <p className="font-semibold">{node.name}</p>
                <p className="mt-1 text-xs text-zinc-500 light:text-slate-500">{node.type}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <GitBranch size={20} className="text-violet-300" />
              <h2 className="text-2xl font-semibold">Relationships</h2>
            </div>
            <div className="mt-5 space-y-3">
              {relationships.map((relationship) => (
                <div
                  key={relationship}
                  className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-sm light:border-slate-200 light:bg-slate-50"
                >
                  {relationship}
                </div>
              ))}
            </div>
          </Card>

          <InsightCard
            icon={Database}
            title="Top connected topic"
            description="Product launch readiness connects roadmap, revenue risk, support escalation, and security review content."
            action="Inspect cluster"
          />
          <InsightCard
            icon={Share2}
            title="Suggested graph expansion"
            description="Connect customer health scorecards to support and renewal planning sources."
            action="Queue sync"
          />
        </div>
      </div>
    </div>
  );
}
