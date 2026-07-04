import { Activity, Database, FileText, PlugZap, Sparkles } from "lucide-react";
import Badge from "../common/Badge";
import Card from "../common/Card";

export default function RightPanel() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[min(20vw,320px)] max-w-80 shrink-0 overflow-y-auto border-l border-white/10 bg-[#0b0b13]/75 p-4 backdrop-blur-xl light:border-slate-200 light:bg-white/70 2xl:block">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white light:text-slate-950">
            Insights
          </h2>
          <p className="mt-1 text-xs leading-5 text-zinc-500 light:text-slate-500">
            Live intelligence from connected workspaces.
          </p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-emerald-300" />
              <span className="text-sm font-semibold">System</span>
            </div>
            <Badge tone="green">Healthy</Badge>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400 light:text-slate-500">
              <span>Answer latency</span>
              <span className="text-white light:text-slate-900">1.2s</span>
            </div>
            <div className="flex justify-between text-zinc-400 light:text-slate-500">
              <span>Vector index</span>
              <span className="text-white light:text-slate-900">99.98%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <FileText size={18} className="text-violet-300" />
            <h3 className="text-sm font-semibold">Recent Uploads</h3>
          </div>
          {["Q3 Operating Plan.pdf", "Support Escalations.csv", "Security Playbook.docx"].map(
            (file) => (
              <div
                key={file}
                className="border-t border-white/10 py-3 text-sm first:border-0 first:pt-0 light:border-slate-200"
              >
                <p className="font-medium text-white light:text-slate-950">{file}</p>
                <p className="text-xs text-zinc-500 light:text-slate-500">
                  Indexed with citations
                </p>
              </div>
            ),
          )}
        </Card>

        <Card className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <PlugZap size={18} className="text-sky-300" />
            <h3 className="text-sm font-semibold">Sources</h3>
          </div>
          <div className="space-y-3">
            {["Google Drive", "Slack", "Notion", "Jira"].map((source) => (
              <div key={source} className="flex items-center justify-between text-sm">
                <span className="text-zinc-300 light:text-slate-700">{source}</span>
                <Badge tone="green">Synced</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Database size={18} className="text-violet-300" />
            <h3 className="text-sm font-semibold">Knowledge Health</h3>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/10">
            <div className="h-2 w-[84%] rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" />
          </div>
          <p className="mt-2 text-xs text-zinc-500 light:text-slate-500">
            84% coverage across priority departments.
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/15 to-indigo-500/5 p-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-violet-200" />
            <h3 className="text-sm font-semibold">Recommendation</h3>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-400 light:text-slate-600">
            Review unresolved Jira tickets before the Q3 launch readiness sync.
          </p>
        </Card>
      </div>
    </aside>
  );
}
