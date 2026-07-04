import { Activity, Bot, Database, HardDrive, PlugZap, Sparkles, UploadCloud } from "lucide-react";
import { useLocation } from "react-router-dom";
import Badge from "../common/Badge";
import Card from "../common/Card";
import ActivityCard from "../dashboard/ActivityCard";
import SourceCard from "../dashboard/SourceCard";

const sourceList = ["Google Drive", "Slack", "Notion", "Jira"];

function PanelSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-semibold text-white light:text-slate-950">{title}</h3>
      {children}
    </Card>
  );
}

export default function InsightPanel() {
  const { pathname } = useLocation();
  const page = pathname.replace("/", "") || "home";

  const isAsk = page === "askbrain";
  const isDocs = page === "documents";
  const isAgents = page === "tasks";
  const isKnowledge = page === "knowledge";
  const isAnalytics = page === "analytics";
  const isAdmin = page === "admin";

  return (
    <aside className="sticky top-0 hidden h-screen w-[min(20vw,320px)] max-w-80 shrink-0 overflow-y-auto border-l border-white/10 bg-[#0B0B12] p-4 light:border-slate-200 light:bg-white/80 2xl:block">
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white light:text-slate-950">
            {isAsk ? "Sources" : isAgents ? "Agent Insights" : isAdmin ? "System Health" : "Insights"}
          </h2>
          <p className="mt-1 text-xs leading-5 text-zinc-500 light:text-slate-500">
            Context for the current workspace.
          </p>
        </div>

        {isAsk && (
          <>
            <PanelSection title="Sources">
              <div className="space-y-3">
                <SourceCard title="Q3 Revenue Plan.pdf" description="Referenced launch risk and revenue dependencies." meta="96%" />
                <SourceCard title="Security Playbook.docx" description="Covers access review and device posture changes." meta="91%" />
              </div>
            </PanelSection>
            <PanelSection title="Recent Uploads">
              <ActivityCard title="Support Escalations.csv" description="Indexed with 18 themes." icon={UploadCloud} />
            </PanelSection>
            <PanelSection title="Knowledge Health">
              <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[84%] rounded-full bg-violet-500" /></div>
              <p className="mt-2 text-xs text-zinc-500">84% coverage across priority teams.</p>
            </PanelSection>
          </>
        )}

        {isDocs && (
          <>
            <PanelSection title="Recent Uploads">
              <div className="space-y-3">
                <SourceCard title="Q3 Operating Plan.pdf" description="Indexed today at 9:42 AM." />
                <SourceCard title="Support Escalations.csv" description="Processing semantic chunks." />
              </div>
            </PanelSection>
            <PanelSection title="Storage Usage">
              <div className="flex items-center gap-2 text-sm"><HardDrive size={17} className="text-violet-300" /> 1.8 TB of 2.4 TB</div>
              <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-[74%] rounded-full bg-violet-500" /></div>
            </PanelSection>
          </>
        )}

        {isAgents && (
          <>
            <PanelSection title="Running Agents">
              <div className="space-y-3">
                <ActivityCard title="Research Agent" description="Revenue risk review running." icon={Bot} time="Now" />
                <ActivityCard title="Support Agent" description="Escalation digest completed." icon={Bot} time="12m" />
              </div>
            </PanelSection>
            <PanelSection title="Agent Health">
              <div className="flex items-center justify-between text-sm"><span>Success rate</span><Badge tone="green">96%</Badge></div>
            </PanelSection>
          </>
        )}

        {isKnowledge && (
          <>
            <PanelSection title="Top Entities">
              <div className="space-y-2 text-sm text-zinc-300 light:text-slate-700">
                {["Product Roadmap", "Revenue Plan", "Support Themes"].map((item) => <div key={item}>{item}</div>)}
              </div>
            </PanelSection>
            <PanelSection title="Most Referenced Docs">
              <div className="space-y-3">
                <SourceCard title="Roadmap FY27" description="Referenced 42 times." />
                <SourceCard title="Security Playbook" description="Referenced 31 times." />
              </div>
            </PanelSection>
          </>
        )}

        {isAnalytics && (
          <>
            <PanelSection title="Insights">
              <ActivityCard title="Usage spike" description="Sales queries increased 24% today." icon={Sparkles} />
            </PanelSection>
            <PanelSection title="Recommendations">
              <ActivityCard title="Enable Finance agent" description="Finance has high repeated query volume." icon={Activity} />
            </PanelSection>
          </>
        )}

        {isAdmin && (
          <>
            <PanelSection title="Health">
              <div className="flex items-center justify-between text-sm"><span>AI Gateway</span><Badge tone="green">OK</Badge></div>
            </PanelSection>
            <PanelSection title="Storage">
              <div className="flex items-center gap-2 text-sm"><Database size={17} className="text-violet-300" /> 74% used</div>
            </PanelSection>
            <PanelSection title="Connected Services">
              <div className="space-y-2">
                {sourceList.map((source) => <div key={source} className="flex items-center justify-between text-sm"><span>{source}</span><Badge tone="green">On</Badge></div>)}
              </div>
            </PanelSection>
          </>
        )}

        {!isAsk && !isDocs && !isAgents && !isKnowledge && !isAnalytics && !isAdmin && (
          <>
            <PanelSection title="Quick Actions">
              <div className="space-y-2">
                {["Upload Document", "Ask Brain", "Create Agent"].map((item) => (
                  <button key={item} type="button" className="w-full rounded-2xl bg-white/[0.05] px-3 py-2 text-left text-sm text-zinc-300 hover:bg-white/[0.08] light:bg-slate-50 light:text-slate-700">
                    {item}
                  </button>
                ))}
              </div>
            </PanelSection>
            <PanelSection title="Knowledge Sources">
              <div className="space-y-2">
                {sourceList.map((source) => <div key={source} className="flex items-center justify-between text-sm"><span>{source}</span><Badge tone="green">Synced</Badge></div>)}
              </div>
            </PanelSection>
            <PanelSection title="Activity Feed">
              <div className="space-y-3">
                <ActivityCard title="Policy indexed" description="Security playbook synced." icon={PlugZap} time="8m" />
                <ActivityCard title="Answer generated" description="Q2 sales analysis completed." icon={Activity} time="22m" />
              </div>
            </PanelSection>
          </>
        )}
      </div>
    </aside>
  );
}
