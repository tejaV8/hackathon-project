import { Database, GitBranch, Network, Share2 } from "lucide-react";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Knowledge Graph</h1>
        <p className="mt-2 text-zinc-400 light:text-slate-500">
          Explore how documents, decisions, people, and systems relate.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Card className="min-h-[560px] overflow-hidden p-0">
          <div className="border-b border-white/10 p-5 light:border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network size={20} className="text-violet-300" />
                <h2 className="text-lg font-semibold">Semantic Map</h2>
              </div>
              <Badge tone="violet">Preview</Badge>
            </div>
          </div>
          <div className="relative h-[500px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_62%)]">
            <svg className="absolute inset-0 h-full w-full opacity-60">
              <line x1="18%" y1="42%" x2="42%" y2="22%" stroke="#8b5cf6" strokeWidth="1.5" />
              <line x1="42%" y1="22%" x2="68%" y2="38%" stroke="#6366f1" strokeWidth="1.5" />
              <line x1="68%" y1="38%" x2="76%" y2="72%" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="42%" y1="22%" x2="48%" y2="68%" stroke="#8b5cf6" strokeWidth="1.5" />
              <line x1="18%" y1="42%" x2="48%" y2="68%" stroke="#22c55e" strokeWidth="1.5" />
            </svg>
            {nodes.map((node) => (
              <button
                key={node.name}
                type="button"
                style={{ left: node.x, top: node.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-violet-300/30 bg-[#12121c]/90 px-4 py-3 text-left shadow-xl shadow-violet-950/30 backdrop-blur transition hover:scale-105 hover:border-violet-300 light:bg-white/90"
              >
                <p className="font-semibold">{node.name}</p>
                <p className="text-xs text-zinc-500 light:text-slate-500">{node.type}</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2">
              <GitBranch size={18} className="text-violet-300" />
              <h2 className="font-semibold">Relationships</h2>
            </div>
            <div className="mt-4 space-y-3">
              {relationships.map((relationship) => (
                <div
                  key={relationship}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm light:border-slate-200 light:bg-slate-50"
                >
                  {relationship}
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Database size={18} className="text-sky-300" />
              <h2 className="font-semibold">Source Summary</h2>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                ["Documents", "184"],
                ["Entities", "2.8K"],
                ["Relationships", "9.6K"],
                ["Conflicts", "7"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-white/[0.04] p-3 light:bg-slate-50">
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-zinc-500 light:text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-emerald-300" />
              <h2 className="font-semibold">Top Connected Topic</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-400 light:text-slate-600">
              Product launch readiness connects roadmap, revenue risk, support
              escalation, and security review content.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
